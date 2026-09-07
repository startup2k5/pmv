export interface RoleInfo {
  id: number
  uuid?: string
  code: string
  name: string
  scope?: string
}

export interface BranchInfo {
  id: number
  uuid?: string
  name: string
  address?: string
  taxCode?: string
  isHeadquarter?: boolean
}

export interface CompanyInfo {
  id: number
  uuid?: string
  name: string
  address?: string
}

export interface User {
  id: number
  uuid?: string
  username: string
  isActive?: boolean
  createAt?: string
  updateAt?: string
  role?: RoleInfo
  roleCode?: string
  roleName?: string
  scope?: string
  branch?: BranchInfo
  branchId?: number | null
  branchName?: string
  company?: CompanyInfo
  companyId?: number | null
  companyName?: string
  permissions?: string[]
}

export interface LoginResponseData {
  token: string
}

export interface MeResponseData extends User {}
export interface AccountResponseData extends User {}
