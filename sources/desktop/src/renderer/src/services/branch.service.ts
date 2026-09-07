import { Configs } from '@renderer/lib/config'
import { authService } from './auth'
import type {
  BranchItem,
  BranchFormData,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@renderer/types'

export const branchService = {
  /**
   * Lấy danh sách tất cả các chi nhánh
   */
  async getAll(companyId?: number): Promise<BranchItem[]> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    const url = companyId ? `${baseUrl}/api/v1/branches?companyId=${companyId}` : `${baseUrl}/api/v1/branches`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error('Không thể tải danh sách chi nhánh')
    }

    const data = (await response.json()) as ApiSuccessResponse<BranchItem[]>
    return data.success && Array.isArray(data.data) ? data.data : []
  },

  /**
   * Lấy thông tin chi tiết một chi nhánh theo ID
   */
  async getById(id: number): Promise<BranchItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/branches/${id}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    const data = (await response.json()) as ApiSuccessResponse<BranchItem>
    if (!response.ok || !data.success) {
      throw new Error('Không tìm thấy chi nhánh')
    }

    return data.data
  },

  /**
   * Tạo chi nhánh mới
   */
  async create(form: BranchFormData): Promise<BranchItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/branches`, {
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
      throw new Error(err.detail || err.title || 'Tạo chi nhánh thất bại')
    }

    return (data as ApiSuccessResponse<BranchItem>).data
  },

  /**
   * Cập nhật thông tin chi nhánh
   */
  async update(id: number, form: BranchFormData): Promise<BranchItem> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/branches/${id}`, {
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
      throw new Error(err.detail || err.title || 'Cập nhật chi nhánh thất bại')
    }

    return (data as ApiSuccessResponse<BranchItem>).data
  },

  /**
   * Xóa chi nhánh
   */
  async delete(id: number): Promise<void> {
    const token = authService.getToken()
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')

    const response = await fetch(`${baseUrl}/api/v1/branches/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      const data = await response.json()
      const err = data as ApiErrorResponse
      throw new Error(err.detail || err.title || 'Không thể xóa chi nhánh này')
    }
  }
}
