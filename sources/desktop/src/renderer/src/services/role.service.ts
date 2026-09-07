import { Configs } from '@renderer/lib/config'
import { authService } from './auth'
import type {
  RoleItem,
  RoleFormData,
  AssignPermissionsData,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@renderer/types'

export const roleService = {
  /**
   * Lấy danh sách tất cả các vai trò (có thể lọc theo scope)
   */
  async getAll(scope?: string): Promise<RoleItem[]> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    const url = scope ? `${baseUrl}/api/v1/roles?scope=${scope}` : `${baseUrl}/api/v1/roles`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error('Không thể tải danh sách vai trò')
    }

    const data = (await response.json()) as ApiSuccessResponse<RoleItem[]>
    return data.success && Array.isArray(data.data) ? data.data : []
  },

  /**
   * Lấy thông tin chi tiết một vai trò theo ID
   */
  async getById(id: number): Promise<RoleItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/roles/${id}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    const data = (await response.json()) as ApiSuccessResponse<RoleItem>
    if (!response.ok || !data.success) {
      throw new Error('Không tìm thấy vai trò')
    }

    return data.data
  },

  /**
   * Tạo vai trò mới
   */
  async create(form: RoleFormData): Promise<RoleItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      const err = data as ApiErrorResponse
      throw new Error(err.detail || err.title || 'Tạo vai trò thất bại')
    }

    return (data as ApiSuccessResponse<RoleItem>).data
  },

  /**
   * Cập nhật vai trò
   */
  async update(id: number, form: { name: string; scope?: string }): Promise<RoleItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      const err = data as ApiErrorResponse
      throw new Error(err.detail || err.title || 'Cập nhật vai trò thất bại')
    }

    return (data as ApiSuccessResponse<RoleItem>).data
  },

  /**
   * Xóa vai trò
   */
  async delete(id: number): Promise<void> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/roles/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      const data = await response.json()
      const err = data as ApiErrorResponse
      throw new Error(err.detail || err.title || 'Không thể xóa vai trò này')
    }
  },

  /**
   * Lấy danh sách mã quyền của vai trò
   */
  async getPermissions(id: number): Promise<string[]> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/roles/${id}/permissions`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error('Không thể tải quyền của vai trò')
    }

    const data = (await response.json()) as ApiSuccessResponse<string[]>
    return data.success && Array.isArray(data.data) ? data.data : []
  },

  /**
   * Phân quyền cho vai trò (Gán danh sách mã quyền)
   */
  async assignPermissions(id: number, permissionCodes: string[]): Promise<RoleItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    const payload: AssignPermissionsData = { permissionCodes }

    const response = await fetch(`${baseUrl}/api/v1/roles/${id}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      const err = data as ApiErrorResponse
      throw new Error(err.detail || err.title || 'Phân quyền cho vai trò thất bại')
    }

    return (data as ApiSuccessResponse<RoleItem>).data
  }
}
