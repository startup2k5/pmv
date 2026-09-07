export interface PermissionNode {
  id: number
  uuid?: string
  parentId?: number | null
  code: string
  name: string
  scope: string
  action?: string
  createAt?: string
  children?: PermissionNode[]
}

export interface PermissionFormData {
  code: string
  name: string
  parentId?: number | null
  scope: string
  action?: string
}
