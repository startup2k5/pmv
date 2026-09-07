/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'vi' | 'en'

// Bảng phiên dịch mã lỗi Backend
const ERROR_DICT: Record<string, Record<Language, string>> = {
  INVALID_INPUT: { vi: 'Dữ liệu đầu vào không hợp lệ', en: 'Invalid input data' },
  INVALID_REQUEST_BODY: {
    vi: 'Dữ liệu gửi lên không đúng định dạng',
    en: 'Invalid request body format'
  },
  MISSING_PARAMETER: { vi: 'Thiếu tham số bắt buộc', en: 'Missing required parameter' },
  UNAUTHORIZED: {
    vi: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
    en: 'Session expired or unauthorized'
  },
  INVALID_CREDENTIALS: {
    vi: 'Tên đăng nhập hoặc mật khẩu không chính xác',
    en: 'Invalid username or password'
  },
  FORBIDDEN: {
    vi: 'Bạn không có quyền thực hiện thao tác này',
    en: 'Access denied. You do not have permission'
  },
  ACCOUNT_LOCKED: {
    vi: 'Tài khoản đã bị khóa hoặc ngừng hoạt động',
    en: 'Account is locked or deactivated'
  },
  ACCOUNT_NOT_ASSIGNED: {
    vi: 'Tài khoản chưa được phân quyền trong hệ thống',
    en: 'Account has not been assigned a role'
  },
  NOT_FOUND: { vi: 'Không tìm thấy tài nguyên', en: 'Resource not found' },
  ACCOUNT_NOTFOUND: { vi: 'Tài khoản không tồn tại', en: 'Account does not exist' },
  PERMISSION_NOTFOUND: { vi: 'Không tìm thấy quyền hạn', en: 'Permission not found' },
  ROLE_NOTFOUND: { vi: 'Không tìm thấy vai trò', en: 'Role not found' },
  ACCOUNT_EXISTS: { vi: 'Tên tài khoản này đã tồn tại', en: 'Account username already exists' },
  PERMISSION_EXISTS: { vi: 'Mã quyền này đã tồn tại', en: 'Permission code already exists' },
  INTERNAL_ERROR: { vi: 'Lỗi hệ thống máy chủ, vui lòng thử lại sau', en: 'Internal server error' },
  DATABASE_ERROR: { vi: 'Lỗi cơ sở dữ liệu', en: 'Database error' },
  NETWORK_ERROR: {
    vi: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.',
    en: 'Cannot connect to server.'
  },
  UNKNOWN_ERROR: { vi: 'Đã có lỗi xảy ra', en: 'An unknown error occurred' }
}

// Bảng nhãn giao diện UI
const UI_DICT: Record<string, Record<Language, string>> = {
  'btn.login': { vi: 'Đăng nhập', en: 'Log In' },
  'btn.logging_in': { vi: 'Đang xác thực...', en: 'Authenticating...' },
  'btn.logout': { vi: 'Đăng xuất', en: 'Log Out' },
  'btn.save': { vi: 'Lưu', en: 'Save' },
  'btn.cancel': { vi: 'Hủy', en: 'Cancel' },
  'btn.delete': { vi: 'Xóa', en: 'Delete' },
  'btn.add_invoice': { vi: 'Thêm mới hóa đơn', en: 'New Invoice' },
  'auth.title': { vi: 'Đăng nhập hệ thống', en: 'System Login' },
  'auth.subtitle': {
    vi: 'Hệ thống quản lý bán hàng & in tem nhãn PMV',
    en: 'PMV Gold & Jewelry Sales System'
  },
  'auth.username': { vi: 'Tên đăng nhập', en: 'Username' },
  'auth.username_placeholder': { vi: 'Nhập username', en: 'Enter username' },
  'auth.password': { vi: 'Mật khẩu', en: 'Password' },
  'auth.password_placeholder': { vi: 'Nhập mật khẩu', en: 'Enter password' },
  'auth.credentials_required': {
    vi: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.',
    en: 'Please enter both username and password.'
  },
  'auth.username_required': {
    vi: 'Vui lòng nhập tên đăng nhập.',
    en: 'Please enter username.'
  },
  'auth.password_required': {
    vi: 'Vui lòng nhập mật khẩu.',
    en: 'Please enter password.'
  },
  'auth.default_account_hint': {
    vi: 'Tài khoản mặc định hệ thống: admin',
    en: 'Default system account: admin'
  },
  'menu.overview': { vi: 'Tổng quan', en: 'Dashboard' },
  'menu.gold_price': { vi: 'Giá vàng', en: 'Gold Price' },
  'menu.group_invoice': { vi: 'Hóa đơn & Chứng từ', en: 'Invoices & Documents' },
  'menu.inv_sales': { vi: 'Hóa đơn bán hàng', en: 'Sales Invoices' },
  'menu.inv_purchase': { vi: 'Hóa đơn mua hàng', en: 'Purchase Invoices' },
  'menu.inv_order': { vi: 'Chứng từ đặt hàng', en: 'Order Documents' },
  'menu.inv_swap': { vi: 'Chứng từ đổi hàng', en: 'Exchange Receipts' },
  'menu.inv_return': { vi: 'Chứng từ trả hàng', en: 'Return Receipts' },
  'menu.product': { vi: 'Sản phẩm', en: 'Products' },
  'menu.category': { vi: 'Danh mục', en: 'Categories' },
  'menu.group_warehouse': { vi: 'Kho hàng', en: 'Warehouse' },
  'menu.stock_balance': { vi: 'Tồn kho', en: 'Stock Balance' },
  'menu.stock_in': { vi: 'Nhập kho', en: 'Stock In' },
  'menu.stock_out': { vi: 'Xuất kho', en: 'Stock Out' },
  'menu.stock_transfer': { vi: 'Điều chuyển', en: 'Stock Transfer' },
  'menu.stock_count': { vi: 'Kiểm kê', en: 'Inventory Audit' },
  'menu.group_service': { vi: 'Dịch vụ', en: 'Services' },
  'menu.svc_repair': { vi: 'Sửa chữa', en: 'Jewelry Repair' },
  'menu.svc_warranty': { vi: 'Bảo hành', en: 'Warranty Service' },
  'menu.svc_manufacture': { vi: 'Gia công', en: 'Manufacturing' },
  'menu.customer': { vi: 'Khách hàng', en: 'Customers' },
  'menu.supplier': { vi: 'Nhà cung cấp', en: 'Suppliers' },
  'menu.group_finance': { vi: 'So sach ke toan', en: 'Accounting' },
  'menu.fin_debt': { vi: 'Công nợ', en: 'Debt Accounts' },
  'menu.fin_income': { vi: 'Pieu Thu', en: 'Receipt Vouchers' },
  'menu.fin_expense': { vi: 'Phieu Chi', en: 'Payment Vouchers' },
  'menu.fin_fund': { vi: 'Sổ quỹ', en: 'Cash Book' },
  'menu.branch': { vi: 'Chi nhánh', en: 'Branches' },
  'menu.group_hr': { vi: 'Nhân sự', en: 'Human Resources' },
  'menu.hr_employee': { vi: 'Nhân viên', en: 'Employees' },
  'menu.hr_user': { vi: 'Người dùng', en: 'User Accounts' },
  'menu.hr_role': { vi: 'Vai trò', en: 'Roles' },
  'menu.hr_permission_tree': { vi: 'Cây phân quyền', en: 'Permission Tree' },
  'menu.group_system_company': { vi: 'Công ty & Chi nhánh', en: 'Company & Branches' },
  'menu.sys_branch': { vi: 'Quản lý chi nhánh', en: 'Branch Management' },
  'menu.sys_company_info': { vi: 'Thông tin công ty', en: 'Company Profile' },
  'menu.group_system_price': { vi: 'Quản lý giá hệ thống', en: 'System Price Management' },
  'menu.sys_price_type': { vi: 'Loại giá hệ thống', en: 'Price Types' },
  'menu.sys_price_formula': { vi: 'Công thức giá', en: 'Price Formulas' },
  'menu.group_system_category': { vi: 'Danh mục hệ thống', en: 'System Categories' },
  'menu.sys_product_group': { vi: 'Nhóm hàng', en: 'Product Groups' },
  'menu.sys_unit': { vi: 'Đơn vị tính', en: 'Units of Measure' },
  'menu.group_system_report': { vi: 'Báo cáo hệ thống', en: 'System Reports' },
  'menu.rpt_stock': { vi: 'Tồn kho toàn chuỗi', en: 'Chain Stock' },
  'menu.rpt_sell': { vi: 'Báo cáo bán hàng', en: 'Sales Report' },
  'menu.rpt_buy': { vi: 'Báo cáo mua hàng', en: 'Purchase Report' },
  'menu.rpt_import_export': { vi: 'Báo cáo xuất nhập kho', en: 'Import/Export Report' },
  'menu.rpt_accounting': { vi: 'Báo cáo tài chính kế toán', en: 'Financial Report' },
  'menu.group_system_manager': { vi: 'Quản trị hệ thống', en: 'System Management' },
  'menu.group_system_setting': { vi: 'Cấu hình hệ thống', en: 'System Configuration' },
  'menu.sys_config': { vi: 'Cấu hình tham số', en: 'Parameter Settings' },
  'menu.sys_log': { vi: 'Nhật ký hệ thống', en: 'System Audit Logs' },
  'menu.inv_delivery': { vi: 'Chứng từ giao hàng', en: 'Delivery Invoices' },
  'menu.group_branch_category': { vi: 'Danh mục chi nhánh', en: 'Branch Categories' },
  'menu.group_branch_report': { vi: 'Báo cáo chi nhánh', en: 'Branch Reports' },
  'menu.br_rpt_sell': { vi: 'Báo cáo bán hàng', en: 'Branch Sales' },
  'menu.br_rpt_buy': { vi: 'Báo cáo mua hàng', en: 'Branch Purchases' },
  'menu.br_rpt_stock': { vi: 'Báo cáo tồn kho', en: 'Branch Inventory' },
  'menu.br_rpt_iae': { vi: 'Báo cáo thu chi', en: 'Receipt/Payment Report' },
  'menu.br_rpt_debt': { vi: 'Báo cáo công nợ', en: 'Branch Debt Report' },
  'menu.group_branch_setting': { vi: 'Cài đặt chi nhánh', en: 'Branch Settings' },
  'menu.branch_info': { vi: 'Thông tin chi nhánh', en: 'Branch Info' },
  'sidebar.system_badge': { vi: 'HỆ THỐNG TRUNG TÂM', en: 'SYSTEM HEADQUARTERS' },
  'sidebar.branch_badge': { vi: 'CHI NHÁNH', en: 'BRANCH' },
  'sidebar.system_role': { vi: 'Quản trị hệ thống', en: 'System Administrator' },
  'sidebar.branch_admin_role': { vi: 'Quản lý chi nhánh', en: 'Branch Manager' },
  'sidebar.branch_staff_role': { vi: 'Nhân viên chi nhánh', en: 'Branch Staff' }
}

export function translateErrorCode(
  code?: string | null,
  lang: Language = 'vi',
  fallback?: string
): string {
  if (!code) return fallback || ERROR_DICT.UNKNOWN_ERROR[lang]
  const clean = code.trim().toUpperCase()
  return ERROR_DICT[clean]?.[lang] || fallback || code
}

export function translateUiKey(key: string, lang: Language = 'vi', fallback?: string): string {
  return UI_DICT[key]?.[lang] || fallback || key
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
  tError: (code?: string | null, fallback?: string) => string
}

const STORAGE_KEY = 'pmv_app_language'
const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' ? 'en' : 'vi'
  })

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  const toggleLanguage = (): void => {
    setLanguage(language === 'vi' ? 'en' : 'vi')
  }

  const t = (key: string, fallback?: string): string => translateUiKey(key, language, fallback)
  const tError = (code?: string | null, fallback?: string): string =>
    translateErrorCode(code, language, fallback)

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage, toggleLanguage, t, tError }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return {
      language: 'vi',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => translateUiKey(key, 'vi', fallback),
      tError: (code?: string | null, fallback?: string) => translateErrorCode(code, 'vi', fallback)
    }
  }
  return ctx
}
