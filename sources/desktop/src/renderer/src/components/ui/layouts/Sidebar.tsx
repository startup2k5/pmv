import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  AddIcon,
  BalanceScaleIcon,
  BoxArrowDownIcon,
  BoxArrowUpIcon,
  CashRegisterIcon,
  ChartBarIcon,
  ChartPieIcon,
  ClipboardCheckIcon,
  ClockRotateLeftIcon,
  CloudArrowUpIcon,
  CoinsIcon,
  ExchangeIcon,
  FileExportIcon,
  FileInvoiceDollarIcon,
  GaugeIcon,
  GearIcon,
  RightFromBracketIcon,
  SackDollarIcon,
  TagsIcon,
  UsersIcon
} from '@renderer/assets'
import type { User } from '@renderer/types'
import { useI18n } from '@renderer/lib/i18n'

export interface SidebarProps {
  open?: boolean
  activeTab?: string
  currentUser?: User | null
  onTabChange?: (tab: string) => void
  onLogout?: () => void
  onClose?: () => void
}

interface MenuItem {
  id: string
  label: string
  labelKey?: string
  icon: React.ReactNode
  requiredPermission?: string
  adminOnly?: boolean
}

interface MenuGroup {
  id: string
  label: string
  labelKey?: string
  icon: React.ReactNode
  adminOnly?: boolean
  items: MenuItem[]
}

interface MenuEntry {
  kind: 'item' | 'group'
  id: string
  label: string
  labelKey?: string
  icon: React.ReactNode
  requiredPermission?: string
  adminOnly?: boolean
  items?: MenuItem[]
}

/* ==========================================================================
   1. CẤU HÌNH SIDEBAR HỆ THỐNG TRUNG TÂM (SYSTEM_MENU_CONFIG)
   Dành cho: Nhân viên System & System Admin (Scope: SYSTEM)
   ========================================================================== */
const SYSTEM_MENU_CONFIG: MenuEntry[] = [
  {
    kind: 'item',
    id: 'overview',
    label: 'Tổng quan hệ thống',
    labelKey: 'menu.overview',
    icon: <GaugeIcon className="size-4.5" />
  },
  {
    kind: 'group',
    id: 'sys_company',
    label: 'Công ty & Chi nhánh',
    labelKey: 'menu.group_system_company',
    icon: <ChartPieIcon className="size-4.5" />,
    items: [
      {
        id: 'branch',
        label: 'Quản lý chi nhánh',
        labelKey: 'menu.sys_branch',
        icon: <ChartPieIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.COMPANY.BRANCH'
      },
      {
        id: 'system_company_info',
        label: 'Thông tin công ty',
        labelKey: 'menu.sys_company_info',
        icon: <ClipboardCheckIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.COMPANY.INFO'
      }
    ]
  },
  {
    kind: 'group',
    id: 'sys_price',
    label: 'Quản lý giá hệ thống',
    labelKey: 'menu.group_system_price',
    icon: <CoinsIcon className="size-4.5" />,
    items: [
      {
        id: 'price_types',
        label: 'Loại giá hệ thống',
        labelKey: 'menu.sys_price_type',
        icon: <CoinsIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.PRICE.TYPE'
      },
      {
        id: 'price_formula',
        label: 'Công thức giá',
        labelKey: 'menu.sys_price_formula',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.PRICE.FORMULA'
      }
    ]
  },
  {
    kind: 'group',
    id: 'sys_category',
    label: 'Danh mục hệ thống',
    labelKey: 'menu.group_system_category',
    icon: <TagsIcon className="size-4.5" />,
    items: [
      {
        id: 'category_product_group',
        label: 'Nhóm hàng',
        labelKey: 'menu.sys_product_group',
        icon: <TagsIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.CATEGORY.PRODUCT_GROUP'
      },
      {
        id: 'category_unit',
        label: 'Đơn vị tính',
        labelKey: 'menu.sys_unit',
        icon: <BalanceScaleIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.CATEGORY.UNIT'
      }
    ]
  },
  {
    kind: 'group',
    id: 'sys_report',
    label: 'Báo cáo hệ thống',
    labelKey: 'menu.group_system_report',
    icon: <ChartBarIcon className="size-4.5" />,
    items: [
      {
        id: 'rpt_stock',
        label: 'Tồn kho toàn chuỗi',
        labelKey: 'menu.rpt_stock',
        icon: <SackDollarIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.REPORT.STOCK'
      },
      {
        id: 'rpt_sell',
        label: 'Báo cáo bán hàng',
        labelKey: 'menu.rpt_sell',
        icon: <CashRegisterIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.REPORT.SELL'
      },
      {
        id: 'rpt_buy',
        label: 'Báo cáo mua hàng',
        labelKey: 'menu.rpt_buy',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.REPORT.BUY'
      },
      {
        id: 'rpt_import_export',
        label: 'Báo cáo xuất nhập kho',
        labelKey: 'menu.rpt_import_export',
        icon: <BoxArrowDownIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.REPORT.IMPORT_EXPORT'
      },
      {
        id: 'rpt_accounting',
        label: 'Báo cáo tài chính kế toán',
        labelKey: 'menu.rpt_accounting',
        icon: <FileInvoiceDollarIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.REPORT.ACCOUNTING'
      }
    ]
  },
  {
    kind: 'group',
    id: 'sys_manager',
    label: 'Quản trị hệ thống',
    labelKey: 'menu.group_system_manager',
    icon: <UsersIcon className="size-4.5" />,
    items: [
      {
        id: 'hr_user',
        label: 'Người dùng',
        labelKey: 'menu.hr_user',
        icon: <UsersIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.MANAGER.USER'
      },
      {
        id: 'hr_role',
        label: 'Vai trò',
        labelKey: 'menu.hr_role',
        icon: <GearIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.MANAGER.ROLE'
      },
      {
        id: 'hr_permission_tree',
        label: 'Cây phân quyền',
        labelKey: 'menu.hr_permission_tree',
        icon: <ClipboardCheckIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.MANAGER.ROLE'
      }
    ]
  },
  {
    kind: 'group',
    id: 'sys_setting',
    label: 'Cấu hình hệ thống',
    labelKey: 'menu.group_system_setting',
    icon: <GearIcon className="size-4.5" />,
    items: [
      {
        id: 'sys_config',
        label: 'Cấu hình tham số',
        labelKey: 'menu.sys_config',
        icon: <GearIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.SETTING.CONFIG'
      },
      {
        id: 'sys_log',
        label: 'Nhật ký hệ thống',
        labelKey: 'menu.sys_log',
        icon: <ClockRotateLeftIcon className="size-4.5" />,
        requiredPermission: 'SYSTEM.SETTING.LOG'
      }
    ]
  }
]

/* ==========================================================================
   2. CẤU HÌNH SIDEBAR CHI NHÁNH (BRANCH_MENU_CONFIG)
   Dành cho: Admin Chi nhánh & Nhân viên Chi nhánh (Scope: BRANCH)
   ========================================================================== */
const BRANCH_MENU_CONFIG: MenuEntry[] = [
  {
    kind: 'item',
    id: 'overview',
    label: 'Tổng quan chi nhánh',
    labelKey: 'menu.overview',
    icon: <GaugeIcon className="size-4.5" />
  },
  {
    kind: 'item',
    id: 'gold_price',
    label: 'Giá vàng',
    labelKey: 'menu.gold_price',
    icon: <CoinsIcon className="size-4.5" />,
    requiredPermission: 'BRANCH.PRICE'
  },
  {
    kind: 'group',
    id: 'invoice',
    label: 'Hóa đơn & Chứng từ',
    labelKey: 'menu.group_invoice',
    icon: <FileInvoiceDollarIcon className="size-4.5" />,
    items: [
      {
        id: 'inv_sales',
        label: 'Hóa đơn bán hàng',
        labelKey: 'menu.inv_sales',
        icon: <FileInvoiceDollarIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.SELL'
      },
      {
        id: 'inv_purchase',
        label: 'Hóa đơn mua hàng',
        labelKey: 'menu.inv_purchase',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.BUY',
        adminOnly: true
      },
      {
        id: 'inv_order',
        label: 'Chứng từ đặt hàng',
        labelKey: 'menu.inv_order',
        icon: <ClipboardCheckIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.ORDER'
      },
      {
        id: 'inv_swap',
        label: 'Chứng từ đổi hàng',
        labelKey: 'menu.inv_swap',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.EXCHANGE'
      },
      {
        id: 'inv_return',
        label: 'Chứng từ trả hàng',
        labelKey: 'menu.inv_return',
        icon: <FileExportIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.RETURN'
      },
      {
        id: 'inv_delivery',
        label: 'Chứng từ giao hàng',
        labelKey: 'menu.inv_delivery',
        icon: <BoxArrowUpIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.DELIVERY'
      }
    ]
  },
  {
    kind: 'item',
    id: 'product',
    label: 'Sản phẩm',
    labelKey: 'menu.product',
    icon: <TagsIcon className="size-4.5" />,
    requiredPermission: 'BRANCH.PRODUCT'
  },
  {
    kind: 'group',
    id: 'warehouse',
    label: 'Kho hàng',
    labelKey: 'menu.group_warehouse',
    icon: <ExchangeIcon className="size-4.5" />,
    items: [
      {
        id: 'stock_balance',
        label: 'Tồn kho',
        labelKey: 'menu.stock_balance',
        icon: <SackDollarIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.STOCK'
      },
      {
        id: 'stock_in',
        label: 'Nhập kho',
        labelKey: 'menu.stock_in',
        icon: <ClipboardCheckIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.WAREHOUSE.IMPORT',
        adminOnly: true
      },
      {
        id: 'stock_out',
        label: 'Xuất kho',
        labelKey: 'menu.stock_out',
        icon: <FileExportIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.WAREHOUSE.EXPORT',
        adminOnly: true
      },
      {
        id: 'stock_transfer',
        label: 'Điều chuyển',
        labelKey: 'menu.stock_transfer',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.WAREHOUSE',
        adminOnly: true
      },
      {
        id: 'stock_count',
        label: 'Kiểm kê',
        labelKey: 'menu.stock_count',
        icon: <ChartPieIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.WAREHOUSE',
        adminOnly: true
      }
    ]
  },
  {
    kind: 'group',
    id: 'service',
    label: 'Dịch vụ',
    labelKey: 'menu.group_service',
    icon: <GearIcon className="size-4.5" />,
    items: [
      {
        id: 'svc_repair',
        label: 'Sửa chữa',
        labelKey: 'menu.svc_repair',
        icon: <GearIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.SERVICE'
      },
      {
        id: 'svc_warranty',
        label: 'Bảo hành',
        labelKey: 'menu.svc_warranty',
        icon: <CloudArrowUpIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.SERVICE'
      },
      {
        id: 'svc_manufacture',
        label: 'Gia công',
        labelKey: 'menu.svc_manufacture',
        icon: <TagsIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.INVOICE.SERVICE',
        adminOnly: true
      }
    ]
  },
  {
    kind: 'group',
    id: 'branch_category',
    label: 'Danh mục chi nhánh',
    labelKey: 'menu.group_branch_category',
    icon: <CoinsIcon className="size-4.5" />,
    items: [
      {
        id: 'customer',
        label: 'Khách hàng',
        labelKey: 'menu.customer',
        icon: <UsersIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.CATEGORY.CUSTOMER'
      },
      {
        id: 'supplier',
        label: 'Nhà cung cấp',
        labelKey: 'menu.supplier',
        icon: <CloudArrowUpIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.CATEGORY.SUPPLIER',
        adminOnly: true
      }
    ]
  },
  {
    kind: 'group',
    id: 'finance',
    label: 'Sổ sách kế toán',
    labelKey: 'menu.group_finance',
    icon: <SackDollarIcon className="size-4.5" />,
    adminOnly: true,
    items: [
      {
        id: 'fin_debt',
        label: 'Công nợ',
        labelKey: 'menu.fin_debt',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.ACCOUNTING.DEBT'
      },
      {
        id: 'fin_income',
        label: 'Phiếu Thu',
        labelKey: 'menu.fin_income',
        icon: <ClipboardCheckIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.ACCOUNTING.IAE'
      },
      {
        id: 'fin_expense',
        label: 'Phiếu Chi',
        labelKey: 'menu.fin_expense',
        icon: <FileExportIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.ACCOUNTING.IAE'
      },
      {
        id: 'fin_fund',
        label: 'Sổ quỹ',
        labelKey: 'menu.fin_fund',
        icon: <SackDollarIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.ACCOUNTING'
      }
    ]
  },
  {
    kind: 'group',
    id: 'branch_report',
    label: 'Báo cáo chi nhánh',
    labelKey: 'menu.group_branch_report',
    icon: <ChartBarIcon className="size-4.5" />,
    adminOnly: true,
    items: [
      {
        id: 'br_rpt_sell',
        label: 'Báo cáo bán hàng',
        labelKey: 'menu.br_rpt_sell',
        icon: <CashRegisterIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.SELL'
      },
      {
        id: 'br_rpt_buy',
        label: 'Báo cáo mua hàng',
        labelKey: 'menu.br_rpt_buy',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.BUY'
      },
      {
        id: 'br_rpt_stock',
        label: 'Báo cáo tồn kho',
        labelKey: 'menu.br_rpt_stock',
        icon: <SackDollarIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.STOCK'
      },
      {
        id: 'br_rpt_iae',
        label: 'Báo cáo thu chi',
        labelKey: 'menu.br_rpt_iae',
        icon: <FileExportIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.ACCOUNTING.IAE'
      },
      {
        id: 'br_rpt_debt',
        label: 'Báo cáo công nợ',
        labelKey: 'menu.br_rpt_debt',
        icon: <ExchangeIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.REPORT.ACCOUNTING.DEBT'
      }
    ]
  },
  {
    kind: 'group',
    id: 'hr',
    label: 'Nhân sự',
    labelKey: 'menu.group_hr',
    icon: <UsersIcon className="size-4.5" />,
    adminOnly: true,
    items: [
      {
        id: 'hr_employee',
        label: 'Nhân viên',
        labelKey: 'menu.hr_employee',
        icon: <UsersIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.EMPLOYEE'
      }
    ]
  },
  {
    kind: 'group',
    id: 'branch_setting',
    label: 'Cài đặt chi nhánh',
    labelKey: 'menu.group_branch_setting',
    icon: <GearIcon className="size-4.5" />,
    adminOnly: true,
    items: [
      {
        id: 'branch_info',
        label: 'Thông tin chi nhánh',
        labelKey: 'menu.branch_info',
        icon: <GearIcon className="size-4.5" />,
        requiredPermission: 'BRANCH.SETTING.INFO'
      }
    ]
  }
]

/* ==========================================================================
   3. MEMOIZED SUB-COMPONENTS
   ========================================================================== */
interface SidebarItemProps {
  item: MenuItem
  depth?: number
  isActive: boolean
  onSelect: (id: string) => void
  t: (key: string, fallback?: string) => string
}

const SidebarItem = React.memo(function SidebarItem({
  item,
  depth = 1,
  isActive,
  onSelect,
  t
}: SidebarItemProps): React.JSX.Element {
  const displayLabel = item.labelKey ? t(item.labelKey, item.label) : item.label

  return (
    <button
      type="button"
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onSelect(item.id)}
      className={`group/item relative w-full flex items-center justify-between gap-6 ${
        depth === 1 ? 'pl-4' : 'pl-8'
      } p-2 rounded-md text-sm transition-colors duration-150 cursor-pointer ${
        isActive
          ? 'bg-accent/10 text-accent font-semibold'
          : 'text-content/80 hover:bg-surface-hover hover:text-content'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-accent" />
      )}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`flex items-center justify-center ${
            isActive ? 'text-accent' : 'text-icon/70 group-hover/item:text-icon'
          }`}
        >
          {item.icon}
        </span>
        <span className="truncate">{displayLabel}</span>
      </div>
    </button>
  )
})

interface SidebarGroupProps {
  group: MenuGroup
  isOpen: boolean
  activeTab?: string
  onToggle: (groupId: string) => void
  onSelect: (id: string) => void
  t: (key: string, fallback?: string) => string
}

const SidebarGroup = React.memo(function SidebarGroup({
  group,
  isOpen,
  activeTab,
  onToggle,
  onSelect,
  t
}: SidebarGroupProps): React.JSX.Element {
  const displayGroupLabel = group.labelKey ? t(group.labelKey, group.label) : group.label
  const groupId = `sidebar-group-${group.id}`
  const buttonId = `sidebar-group-btn-${group.id}`

  return (
    <div className="py-1">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={groupId}
        onClick={() => onToggle(group.id)}
        className="group/parent relative w-full flex items-center justify-between gap-2 p-2 pl-4 rounded-md text-sm transition-colors duration-150 cursor-pointer text-content/80 hover:bg-surface-hover hover:text-content"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center text-icon/70 group-hover/parent:text-icon">
            {group.icon}
          </span>
          <span className="truncate">{displayGroupLabel}</span>
        </div>
        <svg
          className={`size-3.5 shrink-0 text-icon/70 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        id={groupId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-0.5 space-y-0.5">
          {group.items.map((it) => (
            <SidebarItem
              key={it.id}
              item={it}
              depth={2}
              isActive={activeTab === it.id}
              onSelect={onSelect}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

/* ==========================================================================
   4. SIDEBAR MAIN COMPONENT
   ========================================================================== */
function Sidebar({
  open = true,
  activeTab = 'dashboard',
  currentUser,
  onTabChange,
  onLogout,
  onClose
}: SidebarProps): React.JSX.Element {
  const { t } = useI18n()

  // Phân biệt phạm vi và vai trò người dùng (SYSTEM vs BRANCH)
  const userScope = (currentUser?.scope || '').toUpperCase()
  const userRole = (currentUser?.roleCode || '').toUpperCase()

  const isSystemUser =
    userScope === 'SYSTEM' || userRole === 'SYSTEM_ADMIN' || userRole === 'SYS_ADMIN'
  const isSuperAdmin = userRole === 'SYSTEM_ADMIN' || userRole === 'SYS_ADMIN'

  const isBranchAdmin =
    userRole === 'BRANCH_ADMIN' ||
    userRole === 'BRANCH_MANAGER' ||
    userRole === 'MANAGER' ||
    userRole === 'ADMIN'

  // Lựa chọn cấu hình Menu và lọc theo vai trò
  const menu: MenuEntry[] = useMemo(() => {
    const rawConfig = isSystemUser ? SYSTEM_MENU_CONFIG : BRANCH_MENU_CONFIG
    const userPermissions = (currentUser?.permissions || []).map((p) => p.toUpperCase())

    const hasAccess = (item: { requiredPermission?: string; adminOnly?: boolean }): boolean => {
      // 1. System Admin có toàn quyền xem các mục trong System Sidebar
      if (isSystemUser && isSuperAdmin) return true

      // 2. Branch Admin có toàn quyền xem tất cả các mục của Branch
      if (!isSystemUser && isBranchAdmin) return true

      // 3. Nếu là nhân viên chi nhánh thường: loại bỏ các mục dành riêng cho admin (adminOnly)
      if (!isSystemUser && !isBranchAdmin && item.adminOnly) {
        return false
      }

      // 4. Nếu mục yêu cầu permission cụ thể: kiểm tra userPermissions
      if (item.requiredPermission) {
        const req = item.requiredPermission.toUpperCase()
        if (userPermissions.includes('*') || userPermissions.includes(req)) {
          return true
        }
        // Kiểm tra tiền tố phân quyền cha
        return userPermissions.some((up) => req.startsWith(up + '.'))
      }

      return true
    }

    return rawConfig
      .map((entry) => {
        if (entry.kind === 'item') {
          return hasAccess(entry) ? entry : null
        }

        // Nhóm menu: Kiểm tra quyền truy cập của nhóm và lọc các mục con
        if (entry.adminOnly && !isSystemUser && !isBranchAdmin) {
          return null
        }

        const filteredItems = (entry.items || []).filter((it) => hasAccess(it))
        if (filteredItems.length === 0) return null

        return {
          ...entry,
          items: filteredItems
        }
      })
      .filter((it): it is MenuEntry => Boolean(it))
  }, [isSystemUser, isSuperAdmin, isBranchAdmin, currentUser?.permissions])

  // Đồng bộ openGroup với activeTab
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab)
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const parent = menu.find(
      (entry) => entry.kind === 'group' && entry.items?.some((it) => it.id === activeTab)
    )
    return parent ? parent.id : null
  })

  if (prevActiveTab !== activeTab) {
    setPrevActiveTab(activeTab)
    const parentGroup = menu.find(
      (entry) => entry.kind === 'group' && entry.items?.some((it) => it.id === activeTab)
    )
    if (parentGroup && openGroup !== parentGroup.id) {
      setOpenGroup(parentGroup.id)
    }
  }

  // Accessibility: Đóng sidebar bằng phím Escape khi đang mở
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleTabChange = useCallback(
    (id: string): void => {
      onTabChange?.(id)
      onClose?.()
    },
    [onTabChange, onClose]
  )

  const handleToggleGroup = useCallback((groupId: string): void => {
    setOpenGroup((prev) => (prev === groupId ? null : groupId))
  }, [])

  // Nhãn vai trò hiển thị trên hồ sơ
  const roleDisplayLabel = isSystemUser
    ? t('sidebar.system_role', 'Quản trị hệ thống')
    : isBranchAdmin
      ? t('sidebar.branch_admin_role', 'Quản lý chi nhánh')
      : currentUser?.roleName || t('sidebar.branch_staff_role', 'Nhân viên chi nhánh')

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-30 bg-black/40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Thanh điều hướng phân hệ"
        className={`absolute inset-y-0 left-0 w-72 z-40 flex flex-col overflow-hidden bg-surface/95 border-r border-line select-none backdrop-blur-md transition-transform duration-200 ease-out ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header phân biệt phạm vi: System (Tím) vs Branch (Xanh/Accent) */}
        {isSystemUser ? (
          <div className="flex items-center justify-between px-3 py-2.5 bg-purple-500/10 border-b border-purple-500/20 text-purple-400">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2 rounded-full bg-purple-400 shrink-0 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                {t('sidebar.system_badge', 'HỆ THỐNG TRUNG TÂM')}
              </span>
            </div>
            <span className="text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SYS
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-2.5 bg-accent/10 border-b border-accent/20 text-accent">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2 rounded-full bg-accent shrink-0 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                {t('sidebar.branch_badge', 'CHI NHÁNH')}
                {currentUser?.branchId ? ` #${currentUser.branchId}` : ''}
              </span>
            </div>
            <span className="text-[9.5px] px-1.5 py-0.5 rounded font-semibold bg-accent/20 text-accent border border-accent/30">
              {isBranchAdmin ? 'Admin' : 'Nhân viên'}
            </span>
          </div>
        )}

        {/* Nút tác vụ nhanh: Thêm hóa đơn mới (Chỉ hiển thị cho chi nhánh) */}
        {!isSystemUser && (
          <div className="p-3 border-b border-line">
            <button
              type="button"
              onClick={() => handleTabChange('inv_sales')}
              className="flex items-center py-2 px-2 bg-accent hover:bg-accent-hover text-white rounded-md w-full justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <AddIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {t('btn.add_invoice', 'Thêm mới hóa đơn')}
              </span>
            </button>
          </div>
        )}

        {/* Danh sách Menu cuộn tiêu chuẩn */}
        <div className="flex-1 overflow-y-auto py-2 px-2.5 pmv-scroll" role="menu">
          {menu.map((entry) =>
            entry.kind === 'item' ? (
              <div key={entry.id} className="py-1">
                <SidebarItem
                  item={entry as MenuItem}
                  isActive={activeTab === entry.id}
                  onSelect={handleTabChange}
                  t={t}
                />
              </div>
            ) : (
              <SidebarGroup
                key={entry.id}
                group={entry as MenuGroup}
                isOpen={openGroup === entry.id}
                activeTab={activeTab}
                onToggle={handleToggleGroup}
                onSelect={handleTabChange}
                t={t}
              />
            )
          )}
        </div>

        {/* Footer: Thông tin người dùng, vai trò & Đăng xuất */}
        <div className="p-3 border-t border-line bg-surface/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isSystemUser
                  ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                  : 'bg-accent/15 border border-accent/30 text-accent'
              }`}
            >
              {(currentUser?.username || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-content truncate leading-tight">
                {currentUser?.username || 'Chưa đăng nhập'}
              </span>
              <span className="text-[10px] text-content/50 truncate font-medium">
                {roleDisplayLabel}
              </span>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title={t('btn.logout', 'Đăng xuất')}
              className="p-1.5 rounded-md hover:bg-rose-500/10 hover:text-rose-500 text-content/50 transition-colors cursor-pointer shrink-0"
            >
              <RightFromBracketIcon className="size-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
