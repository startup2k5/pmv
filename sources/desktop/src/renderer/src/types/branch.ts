export interface BranchItem {
  id: number
  uuid?: string
  companyId?: number
  companyName?: string
  name: string
  address?: string
  taxCode: string
  isHeadquarter?: boolean
  createById?: number
  createByUsername?: string
  createAt?: string
  updateAt?: string
}

export interface BranchFormData {
  companyId?: number
  name: string
  address?: string
  taxCode: string
  isHeadquarter?: boolean
}
