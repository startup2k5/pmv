import { Configs } from '@renderer/lib/config'
import type {
  User,
  LoginResponseData,
  AccountResponseData,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@renderer/types'

export type { User, LoginResponseData, AccountResponseData, ApiSuccessResponse, ApiErrorResponse }

const TOKEN_STORAGE_KEY = 'pmv_access_token'
const USER_STORAGE_KEY = 'pmv_current_user'

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as Record<string, unknown>
  } catch {
    return null
  }
}

export function getUserFromToken(token: string): User | null {
  const payload = parseJwtPayload(token)
  if (!payload) return null

  const id = Number(payload.id ?? payload.sub ?? 0)
  const username = (payload.username as string) || ''
  const roleCode = (payload.role_code as string) || (payload.roleCode as string) || undefined
  const roleName = (payload.role_name as string) || (payload.roleName as string) || undefined
  const scope = (payload.scope as string) || undefined
  const branchId =
    payload.branch_id != null
      ? Number(payload.branch_id)
      : payload.branchId != null
        ? Number(payload.branchId)
        : null
  const uuid = (payload.uuid as string) || undefined
  const permissions = Array.isArray(payload.permissions) ? (payload.permissions as string[]) : []

  return {
    id,
    uuid,
    username,
    roleCode,
    roleName,
    scope,
    branchId,
    permissions
  }
}

export const authService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
      return null
    }
  },

  getCurrentUser(): User | null {
    try {
      const token = this.getToken()
      if (token) {
        const user = getUserFromToken(token)
        if (user) {
          return user
        }
      }
      const raw = localStorage.getItem(USER_STORAGE_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },

  saveAuth(token: string, user?: User): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      }
    } catch (e) {
      console.error('Failed to save auth state:', e)
    }
  },

  clearAuth(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear auth state:', e)
    }
  },

  /**
   * Đăng nhập: API CHỈ trả về token.
   * Lưu token và trả về { token }.
   */
  async login(username: string, password: string): Promise<{ token: string }> {
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    let response: Response
    try {
      response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
    } catch {
      throw new Error(
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc backend service.'
      )
    }

    const data = await response.json()

    if (!response.ok || !data.success) {
      const errorData = data as ApiErrorResponse
      const msg = errorData?.detail || errorData?.title || 'Đăng nhập thất bại. Vui lòng thử lại.'
      throw new Error(msg)
    }

    const result = data as ApiSuccessResponse<LoginResponseData>
    const token = result.data?.token

    if (!token) {
      throw new Error('Máy chủ không phản hồi mã xác thực (token).')
    }

    // Chỉ lưu token
    localStorage.setItem(TOKEN_STORAGE_KEY, token)

    return { token }
  },

  /**
   * Nạp mọi thông tin tài khoản qua token vào dashboard.
   * Kết hợp giải mã token JWT và gọi API /api/v1/me với Bearer token.
   */
  async loadUserFromToken(targetToken?: string): Promise<User | null> {
    const token = targetToken || this.getToken()
    if (!token) return null

    // 1. Giải mã tức thì thông tin từ token (claims)
    const userFromJwt = getUserFromToken(token)

    // 2. Gọi API /api/v1/me để cập nhật dữ liệu chính xác từ database
    const baseUrl = Configs.API_BASE_URL.replace(/\/+$/, '')
    try {
      const response = await fetch(`${baseUrl}/api/v1/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = (await response.json()) as ApiSuccessResponse<AccountResponseData>
        if (data.success && data.data) {
          const user: User = {
            ...userFromJwt,
            ...data.data,
            id: data.data.id ?? userFromJwt?.id ?? 0,
            username: data.data.username || userFromJwt?.username || '',
            permissions: data.data.permissions || userFromJwt?.permissions || []
          }
          this.saveAuth(token, user)
          return user
        }
      } else if (response.status === 401 || response.status === 403) {
        // Token không còn hợp lệ hoặc hết hạn
        this.clearAuth()
        return null
      }
    } catch {
      // Lỗi kết nối mạng: vẫn dùng dữ liệu đã giải mã từ token
      if (userFromJwt) {
        this.saveAuth(token, userFromJwt)
        return userFromJwt
      }
    }

    if (userFromJwt) {
      this.saveAuth(token, userFromJwt)
      return userFromJwt
    }

    return null
  },

  async getMe(): Promise<User | null> {
    return this.loadUserFromToken()
  }
}
