export interface RoleItem {
  id: number
  uuid?: string
  code: string
  name: string
  scope: string
  createAt?: string
  updateAt?: string
  permissionCount?: number
  permissions?: string[]
}

export interface RoleFormData {
  code: string
  name: string
  scope: 'SYSTEM' | 'BRANCH'
  permissionCodes?: string[]
}

export interface AssignPermissionsData {
  permissionCodes?: string[]
  permissionIds?: number[]
}
