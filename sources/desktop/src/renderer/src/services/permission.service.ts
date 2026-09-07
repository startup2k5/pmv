import { Configs } from '@renderer/lib/config'
import { authService } from './auth'
import type {
  PermissionNode,
  PermissionFormData,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@renderer/types'

export type { PermissionNode, PermissionFormData }

export const permissionService = {
  /**
   * Lấy cây phân quyền đa cấp trực tiếp từ Backend API (PostgreSQL database)
   */
  async getTree(params?: { scope?: string; roleId?: number }): Promise<PermissionNode[]> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const query = new URLSearchParams()
    if (params?.scope) query.append('scope', params.scope)
    if (params?.roleId) query.append('roleId', params.roleId.toString())
    const queryString = query.toString() ? `?${query.toString()}` : ''

    const response = await fetch(`${baseUrl}/api/v1/permissions${queryString}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error(`DATABASE_ERROR`)
    }

    const data = (await response.json()) as ApiSuccessResponse<PermissionNode[]>
    if (data.success && Array.isArray(data.data)) {
      return data.data
    }

    return []
  },

  /**
   * Tạo quyền mới qua Backend API
   */
  async create(form: PermissionFormData): Promise<PermissionNode> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      parentId: form.parentId ?? null,
      scope: form.scope || 'BRANCH',
      action: form.action?.trim().toUpperCase() || null
    }

    const response = await fetch(`${baseUrl}/api/v1/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      const errorData = data as ApiErrorResponse
      const errorCode = errorData?.detail || errorData?.title || 'INVALID_INPUT'
      throw new Error(errorCode)
    }

    const result = data as ApiSuccessResponse<PermissionNode>
    return result.data
  },

  /**
   * Cập nhật thông tin quyền hạn qua Backend API
   */
  async update(code: string, form: PermissionFormData): Promise<PermissionNode> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    const payload = {
      code: code.trim().toUpperCase(),
      name: form.name.trim(),
      parentId: form.parentId ?? null,
      scope: form.scope || 'BRANCH',
      action: form.action?.trim().toUpperCase() || null
    }

    const response = await fetch(`${baseUrl}/api/v1/permissions/${code.trim().toUpperCase()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      const errorData = data as ApiErrorResponse
      const errorCode = errorData?.detail || errorData?.title || 'INVALID_INPUT'
      throw new Error(errorCode)
    }

    const result = data as ApiSuccessResponse<PermissionNode>
    return result.data
  },

  /**
   * Xóa quyền qua Backend API
   */
  async delete(code: string): Promise<void> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/permissions/${code.trim().toUpperCase()}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      const errorData = data as ApiErrorResponse | null
      const errorCode = errorData?.detail || errorData?.title || 'PERMISSION_NOTFOUND'
      throw new Error(errorCode)
    }
  }
}
