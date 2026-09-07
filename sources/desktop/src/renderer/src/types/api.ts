export interface ApiSuccessResponse<T> {
  success: boolean
  msg: string
  data: T
}

export interface ApiErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  errors?: unknown
}
