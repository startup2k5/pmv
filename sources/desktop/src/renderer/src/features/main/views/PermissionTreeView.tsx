import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { permissionService } from '@renderer/services/permission.service'
import type { PermissionNode, PermissionFormData } from '@renderer/types'

function filterNodes(nodes: PermissionNode[], query: string): PermissionNode[] {
  if (!query.trim()) return nodes
  const q = query.toLowerCase()

  return nodes.reduce<PermissionNode[]>((acc, node) => {
    const matchSelf =
      node.code.toLowerCase().includes(q) ||
      node.name.toLowerCase().includes(q)

    const filteredChildren = node.children ? filterNodes(node.children, q) : []

    if (matchSelf || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren
      })
    }
    return acc
  }, [])
}

export function PermissionTreeView(): React.JSX.Element {
  const [treeData, setTreeData] = useState<PermissionNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNode, setSelectedNode] = useState<PermissionNode | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [formData, setFormData] = useState<PermissionFormData>({
    code: '',
    name: '',
    parentId: null,
    scope: 'BRANCH',
    action: 'VIEW'
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load Tree
  const loadTree = useCallback(async (): Promise<PermissionNode[]> => {
    setIsLoading(true)
    try {
      const data = await permissionService.getTree()
      setTreeData(data)
      // Mặc định mở rộng các node tầng đầu
      const initialExpanded: Record<string, boolean> = {}
      const expandAll = (nodes: PermissionNode[]): void => {
        for (const n of nodes) {
          initialExpanded[n.code] = true
          if (n.children && n.children.length > 0) {
            expandAll(n.children)
          }
        }
      }
      expandAll(data)
      setExpandedNodes(initialExpanded)

      setSelectedNode((prev) => (!prev && data.length > 0 ? data[0] : prev))
      return data
    } catch (e) {
      console.error('Failed to load permission tree:', e)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    permissionService
      .getTree()
      .then((data) => {
        if (ignore) return
        setTreeData(data)
        const initialExpanded: Record<string, boolean> = {}
        const expandAll = (nodes: PermissionNode[]): void => {
          for (const n of nodes) {
            initialExpanded[n.code] = true
            if (n.children && n.children.length > 0) {
              expandAll(n.children)
            }
          }
        }
        expandAll(data)
        setExpandedNodes(initialExpanded)
        setSelectedNode((prev) => (!prev && data.length > 0 ? data[0] : prev))
        setIsLoading(false)
      })
      .catch((e) => {
        console.error('Failed to load permission tree:', e)
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // Flat list of all permissions for parent selection dropdown
  const flatPermissions = useMemo(() => {
    const list: { id: number; code: string; name: string }[] = []
    const flatten = (nodes: PermissionNode[]): void => {
      for (const n of nodes) {
        list.push({ id: n.id, code: n.code, name: n.name })
        if (n.children && n.children.length > 0) {
          flatten(n.children)
        }
      }
    }
    flatten(treeData)
    return list
  }, [treeData])

  // Tránh việc chọn chính nó hoặc con cháu của nó làm cha khi cập nhật
  const availableParents = useMemo(() => {
    if (modalMode !== 'edit' || !formData.code) {
      return flatPermissions
    }

    const blockedIds = new Set<number>()

    const findAndCollect = (list: PermissionNode[]): boolean => {
      for (const item of list) {
        if (item.code === formData.code) {
          blockedIds.add(item.id)
          const collectDescendants = (children: PermissionNode[]): void => {
            for (const child of children) {
              blockedIds.add(child.id)
              if (child.children && child.children.length > 0) {
                collectDescendants(child.children)
              }
            }
          }
          if (item.children) collectDescendants(item.children)
          return true
        }
        if (item.children && findAndCollect(item.children)) return true
      }
      return false
    }

    findAndCollect(treeData)
    return flatPermissions.filter((p) => !blockedIds.has(p.id))
  }, [treeData, flatPermissions, modalMode, formData.code])

  const toggleExpand = (code: string): void => {
    setExpandedNodes((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  const expandAll = (): void => {
    const next: Record<string, boolean> = {}
    const rec = (nodes: PermissionNode[]): void => {
      for (const n of nodes) {
        next[n.code] = true
        if (n.children) rec(n.children)
      }
    }
    rec(treeData)
    setExpandedNodes(next)
  }

  const collapseAll = (): void => {
    setExpandedNodes({})
  }

  const handleOpenCreateModal = (parentId: number | null = null): void => {
    const findNodeById = (nodes: PermissionNode[], id: number): PermissionNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n
        if (n.children) {
          const found = findNodeById(n.children, id)
          if (found) return found
        }
      }
      return null
    }

    const parentNode = parentId != null ? findNodeById(treeData, parentId) : null

    setModalMode('create')
    setFormData({
      code: '',
      name: '',
      parentId: parentId,
      scope: parentNode?.scope || selectedNode?.scope || 'BRANCH',
      action: parentId != null ? 'VIEW' : ''
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (node: PermissionNode): void => {
    setModalMode('edit')
    setFormData({
      code: node.code,
      name: node.name,
      parentId: node.parentId ?? null,
      scope: node.scope || 'BRANCH',
      action: node.action || ''
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSavePermission = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)

    if (!formData.code.trim()) {
      setFormError('Vui lòng nhập mã quyền (Code).')
      return
    }

    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên hiển thị của quyền.')
      return
    }

    const payload: PermissionFormData = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      parentId: formData.parentId ?? null,
      scope: formData.scope || 'BRANCH',
      action: formData.action?.trim().toUpperCase() || undefined
    }

    setIsSubmitting(true)
    try {
      if (modalMode === 'edit') {
        const updated = await permissionService.update(payload.code, payload)
        setIsModalOpen(false)
        const reloadedTree = await loadTree()
        // Tìm lại node mới cập nhật từ cây để hiển thị đầy đủ children
        const findNode = (nodes: PermissionNode[]): PermissionNode | null => {
          for (const n of nodes) {
            if (n.code === updated.code) return n
            if (n.children) {
              const f = findNode(n.children)
              if (f) return f
            }
          }
          return null
        }
        const freshNode = findNode(reloadedTree)
        setSelectedNode(freshNode || updated)
      } else {
        const created = await permissionService.create(payload)
        setIsModalOpen(false)
        await loadTree()
        setSelectedNode(created)
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Có lỗi khi lưu quyền.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePermission = async (code: string): Promise<void> => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa quyền "${code}" và các nhánh con của nó?`)) {
      return
    }
    try {
      await permissionService.delete(code)
      if (selectedNode?.code === code) {
        setSelectedNode(null)
      }
      await loadTree()
    } catch (err) {
      alert('Không thể xóa quyền: ' + (err instanceof Error ? err.message : ''))
    }
  }

  const filteredTree = useMemo(() => filterNodes(treeData, searchQuery), [treeData, searchQuery])

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: PermissionNode, depth = 0): React.JSX.Element => {
    const hasChildren = Boolean(node.children && node.children.length > 0)
    const isExpanded = expandedNodes[node.code] ?? true
    const isSelected = selectedNode?.code === node.code

    return (
      <div key={node.code} className="flex flex-col select-none">
        <div
          onClick={() => setSelectedNode(node)}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          className={`group flex items-center justify-between py-2 pr-3 rounded-lg cursor-pointer transition-all duration-150 border ${
            isSelected
              ? 'bg-accent/15 border-accent/40 text-white shadow-sm'
              : 'hover:bg-surface-hover/60 border-transparent text-content/85'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(node.code)
                }}
                className="size-5 flex items-center justify-center text-content/50 hover:text-content transition-transform"
              >
                <svg
                  className={`size-3.5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span className="size-5 flex items-center justify-center text-content/30 text-xs">
                •
              </span>
            )}

            {/* Folder / Key Icon */}
            <div
              className={`size-6 rounded flex items-center justify-center text-xs shrink-0 ${
                hasChildren
                  ? isExpanded
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-amber-300 bg-amber-300/10'
                  : 'text-blue-400 bg-blue-400/10'
              }`}
            >
              {hasChildren ? (
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              ) : (
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate leading-tight">{node.name}</span>
              <span className="text-[10px] font-mono text-content/40 truncate">{node.code}</span>
            </div>
          </div>

          {/* Badges & Inline Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {node.action && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {node.action}
              </span>
            )}
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                node.scope === 'SYSTEM'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : node.scope === 'ALL' || node.scope === 'BOTH'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
              }`}
            >
              {node.scope || 'BRANCH'}
            </span>

            {/* Quick actions on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenEditModal(node)
                }}
                title="Chỉnh sửa quyền này"
                className="p-1 rounded hover:bg-surface-hover hover:text-accent text-content/50 transition-colors"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenCreateModal(node.id)
                }}
                title="Thêm quyền con cho nhánh này"
                className="p-1 rounded hover:bg-accent hover:text-white text-content/50 transition-colors"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePermission(node.code)
                }}
                title="Xóa quyền này"
                className="p-1 rounded hover:bg-rose-500 hover:text-white text-content/50 transition-colors"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Child nodes */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-0.5 mt-0.5 border-l border-line/40 ml-4.5">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-secondary/40 p-6 gap-5">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <svg
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-content tracking-tight">
                Cấu hình cây phân quyền (Permission Hierarchy)
              </h1>
              <p className="text-xs text-content/50">
                Xây dựng và tổ chức cây quyền hạn đa cấp cho các phân hệ, tài nguyên và hành động
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={expandAll}
            className="px-2.5 py-1.5 rounded-lg border border-line bg-surface text-xs font-medium text-content/70 hover:bg-surface-hover hover:text-white transition-colors cursor-pointer"
          >
            Mở rộng tất cả
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1.5 rounded-lg border border-line bg-surface text-xs font-medium text-content/70 hover:bg-surface-hover hover:text-white transition-colors cursor-pointer"
          >
            Thu gọn tất cả
          </button>
          <button
            onClick={loadTree}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-medium text-content/80 hover:bg-surface-hover hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg
              className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleOpenCreateModal(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-xs font-semibold text-white hover:bg-accent-hover shadow-lg shadow-accent/25 transition-colors cursor-pointer"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tạo nhánh quyền gốc
          </button>
        </div>
      </div>

      {/* 2 Columns: Tree on Left, Details on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden min-h-0">
        {/* Left Column: Tree Browser */}
        <div className="lg:col-span-7 flex flex-col bg-surface rounded-xl border border-line shadow-sm overflow-hidden min-h-0">
          {/* Search bar */}
          <div className="p-3 border-b border-line flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm mã quyền, tên quyền, tài nguyên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-line bg-surface-secondary text-xs text-content placeholder:text-content/30 focus:outline-none focus:border-accent focus:bg-surface transition-colors"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-content/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-content/50 hover:text-content px-2 py-1"
              >
                Xóa lọc
              </button>
            )}
          </div>

          {/* Tree Scroll List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 pmv-scroll">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2 text-content/40">
                <div className="size-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                <span className="text-xs">Đang tải cấu trúc cây...</span>
              </div>
            ) : filteredTree.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-content/40 p-4">
                <p className="text-sm font-medium">Chưa có quyền nào phù hợp</p>
                <button
                  onClick={() => handleOpenCreateModal(null)}
                  className="mt-3 text-xs text-accent hover:underline cursor-pointer"
                >
                  + Bấm vào đây để tạo nhánh quyền đầu tiên
                </button>
              </div>
            ) : (
              filteredTree.map((rootNode) => renderTreeNode(rootNode, 0))
            )}
          </div>
        </div>

        {/* Right Column: Selected Node Details & Inspector */}
        <div className="lg:col-span-5 flex flex-col bg-surface rounded-xl border border-line shadow-sm overflow-hidden min-h-0">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <h2 className="text-xs font-bold text-content uppercase tracking-wider">
              Chi tiết quyền hạn
            </h2>
            {selectedNode && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(selectedNode)}
                  className="flex items-center gap-1 text-xs text-content/70 hover:text-accent font-semibold cursor-pointer transition-colors"
                  title="Chỉnh sửa thông tin quyền này"
                >
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
                <span className="text-content/30">•</span>
                <button
                  onClick={() => handleOpenCreateModal(selectedNode.id)}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-semibold cursor-pointer"
                >
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm quyền con
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 pmv-scroll">
            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-lg bg-surface-secondary border border-line flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-content/40 tracking-wider">
                    Tên quyền
                  </span>
                  <span className="text-sm font-bold text-content">{selectedNode.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-secondary border border-line">
                    <span className="text-[10px] uppercase font-bold text-content/40">Mã Code</span>
                    <p className="mt-1 font-mono font-bold text-accent">{selectedNode.code}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-secondary border border-line">
                    <span className="text-[10px] uppercase font-bold text-content/40">
                      Quyền cha (Parent)
                    </span>
                    <p className="mt-1 font-mono text-content/80">
                      {selectedNode.parentId
                        ? (flatPermissions.find((p) => p.id === selectedNode.parentId)?.name || `#${selectedNode.parentId}`)
                        : '(Nhánh gốc Root)'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-surface-secondary border border-line">
                    <span className="text-[10px] uppercase font-bold text-content/40">
                      Phạm vi (Scope)
                    </span>
                    <p className="mt-1 font-semibold text-content">
                      {selectedNode.scope || 'BRANCH'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-secondary border border-line">
                    <span className="text-[10px] uppercase font-bold text-content/40">
                      Hành động (Action)
                    </span>
                    <p className="mt-1 font-semibold text-emerald-300">
                      {selectedNode.action || '(Không có)'}
                    </p>
                  </div>
                </div>

                {/* Sub-children summary */}
                <div className="p-3.5 rounded-lg bg-surface-secondary border border-line">
                  <span className="text-[10px] uppercase font-bold text-content/40">
                    Nhánh con trực thuộc ({selectedNode.children?.length || 0})
                  </span>
                  {selectedNode.children && selectedNode.children.length > 0 ? (
                    <ul className="mt-2 space-y-1.5">
                      {selectedNode.children.map((child) => (
                        <li
                          key={child.code}
                          onClick={() => setSelectedNode(child)}
                          className="flex items-center justify-between p-1.5 rounded bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
                        >
                          <span className="font-semibold text-content/90 truncate">
                            {child.name}
                          </span>
                          <span className="font-mono text-[10px] text-content/40">
                            {child.code}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-content/40 text-[11px]">
                      Chưa có quyền con nào. Bấm &quot;+ Thêm quyền con&quot; để phân cấp chi tiết.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDeletePermission(selectedNode.code)}
                    className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
                    title="Xóa quyền này và các nhánh con"
                  >
                    Xóa nhánh này
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedNode)}
                    className="px-3.5 py-2 rounded-lg bg-surface border border-line hover:bg-surface-hover text-content text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <svg
                      className="size-3.5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Chỉnh sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(selectedNode.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow transition-colors cursor-pointer text-center"
                  >
                    + Tạo nhánh con mới
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-content/40 text-center py-12">
                <svg
                  className="size-10 mb-2 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <p className="text-xs">
                  Chọn một quyền trên cây bên trái để xem và quản lý cấu trúc
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Thêm quyền mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-line flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-content">
                  {modalMode === 'edit'
                    ? `Chỉnh sửa quyền: [${formData.code}]`
                    : formData.parentId != null
                      ? 'Thêm quyền con'
                      : 'Thêm nhánh quyền mới'}
                </h3>
                <p className="text-[11px] text-content/50 mt-0.5">
                  {modalMode === 'edit'
                    ? 'Cập nhật tên hiển thị, nhóm cha trực thuộc, phạm vi hoặc hành động'
                    : 'Khai báo thông tin quyền hạn mới trong cây phân quyền'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-content/50 hover:text-content p-1 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSavePermission} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-content/80 flex items-center justify-between">
                    <span>
                      Mã quyền (Code) <span className="text-accent">*</span>
                    </span>
                    {modalMode === 'edit' && (
                      <span className="text-[10px] text-content/40 font-normal">Cố định</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'edit'}
                    placeholder="VD: PRODUCT_CREATE"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase().replace(/\s+/g, '_')
                      })
                    }
                    className={`px-3 py-2 rounded-lg border border-line font-mono uppercase text-content placeholder:text-content/30 focus:outline-none ${
                      modalMode === 'edit'
                        ? 'bg-surface-secondary/70 text-content/60 cursor-not-allowed border-line/60'
                        : 'bg-surface focus:border-accent'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-content/80">
                    Tên quyền hiển thị <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Tạo mới sản phẩm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-line bg-surface text-content placeholder:text-content/30 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-content/80 flex items-center justify-between">
                  <span>Quyền cha (Thuộc nhánh)</span>
                  {modalMode === 'edit' && (
                    <span className="text-[10px] text-content/40 font-normal">
                      Đã loại trừ nhánh hiện tại & các nhánh con
                    </span>
                  )}
                </label>
                <select
                  value={formData.parentId ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentId: e.target.value ? Number(e.target.value) : null
                    })
                  }
                  className="px-3 py-2 rounded-lg border border-line bg-surface text-content focus:outline-none focus:border-accent"
                >
                  <option value="">(Không có - Đây là nhánh gốc Root)</option>
                  {availableParents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-content/80">Phạm vi (Scope)</label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-line bg-surface text-content focus:outline-none focus:border-accent"
                  >
                    <option value="BRANCH">BRANCH (Chi nhánh)</option>
                    <option value="SYSTEM">SYSTEM (Hệ thống)</option>
                    <option value="ALL">ALL (Dùng cho cả hai)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-content/80">Hành động (Action)</label>
                  <select
                    value={formData.action || ''}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-line bg-surface text-content focus:outline-none focus:border-accent"
                  >
                    <option value="">(Không có - Danh mục)</option>
                    <option value="VIEW">VIEW (Xem)</option>
                    <option value="CREATE">CREATE (Tạo)</option>
                    <option value="UPDATE">UPDATE (Sửa)</option>
                    <option value="DELETE">DELETE (Xóa)</option>
                    <option value="EXPORT">EXPORT (Xuất)</option>
                    <option value="APPROVE">APPROVE (Duyệt)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-line text-content/70 hover:bg-surface cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting
                    ? modalMode === 'edit'
                      ? 'Đang cập nhật...'
                      : 'Đang lưu...'
                    : modalMode === 'edit'
                      ? 'Cập nhật thay đổi'
                      : 'Lưu quyền vào cây'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
