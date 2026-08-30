import React from 'react'
import {
  GaugeIcon,
  CoinsIcon,
  TagsIcon,
  BalanceScaleIcon,
  CashRegisterIcon,
  ExchangeIcon,
  BarcodeIcon,
  BoxArrowDownIcon,
  BoxArrowUpIcon,
  ClipboardCheckIcon,
  FileInvoiceDollarIcon,
  FileSignatureIcon,
  FileExportIcon,
  ChartBarIcon,
  ChartPieIcon,
  ClockRotateLeftIcon,
  UsersIcon,
  SackDollarIcon,
  GearIcon
} from '@renderer/assets'

export interface SidebarProps {
  open?: boolean
  activeTab?: string
  onTabChange?: (tab: string) => void
  onLogout?: () => void
  onClose?: () => void
}

interface MenuItem {
  id: string
  label: string
  badge?: string
  badgeTone?: 'success' | 'danger'
  icon: React.ReactNode
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

function Sidebar({
  open = true,
  activeTab = 'dashboard',
  onTabChange,
  onClose
}: SidebarProps): React.JSX.Element {
  const dashboardItem: MenuItem = {
    id: 'dashboard',
    label: 'Bảng điều khiển',
    icon: <GaugeIcon className="size-4.5" />
  }

  const menuGroups: MenuGroup[] = [
    {
      label: 'Quản trị hệ thống',
      items: [
        {
          id: 'gold-price',
          label: 'Bảng giá vàng',
          icon: <CoinsIcon className="size-4.5" />
        },
        {
          id: 'item-category',
          label: 'Nhóm hàng',
          icon: <TagsIcon className="size-4.5" />
        },
        {
          id: 'unit',
          label: 'Đơn vị tính & TT22',
          icon: <BalanceScaleIcon className="size-4.5" />
        }
      ]
    },
    {
      label: 'Bán hàng',
      items: [
        {
          id: 'pos-sale',
          label: 'Bán lẻ POS',
          icon: <CashRegisterIcon className="size-4.5" />
        },
        {
          id: 'buy-back',
          label: 'Thu đổi vàng',
          icon: <ExchangeIcon className="size-4.5" />
        },
        {
          id: 'bartender',
          label: 'BarTender',
          badge: 'Sẵn sàng',
          badgeTone: 'success',
          icon: <BarcodeIcon className="size-4.5" />
        }
      ]
    },
    {
      label: 'Kho',
      items: [
        {
          id: 'stock-in',
          label: 'Nhập kho',
          icon: <BoxArrowDownIcon className="size-4.5" />
        },
        {
          id: 'stock-out',
          label: 'Xuất & điều chuyển',
          icon: <BoxArrowUpIcon className="size-4.5" />
        },
        {
          id: 'stock-check',
          label: 'Kiểm kê',
          icon: <ClipboardCheckIcon className="size-4.5" />
        }
      ]
    },
    {
      label: 'Hóa đơn',
      items: [
        {
          id: 'vat',
          label: 'Hóa đơn VAT',
          badge: '3',
          badgeTone: 'danger',
          icon: <FileInvoiceDollarIcon className="size-4.5" />
        },
        {
          id: 'einvoice',
          label: 'Cấu hình HĐĐT',
          icon: <FileSignatureIcon className="size-4.5" />
        },
        {
          id: 'invoice-issue',
          label: 'Xuất HĐ & bảo hành',
          icon: <FileExportIcon className="size-4.5" />
        }
      ]
    },
    {
      label: 'Báo cáo',
      items: [
        {
          id: 'branch-report',
          label: 'Báo cáo chi nhánh',
          icon: <ChartBarIcon className="size-4.5" />
        },
        {
          id: 'consolidated',
          label: 'Hợp nhất',
          icon: <ChartPieIcon className="size-4.5" />
        },
        {
          id: 'history',
          label: 'Lịch sử hoạt động',
          icon: <ClockRotateLeftIcon className="size-4.5" />
        }
      ]
    },
    {
      label: 'Cấu hình',
      items: [
        {
          id: 'staff',
          label: 'Nhân sự & phân quyền',
          icon: <UsersIcon className="size-4.5" />
        },
        {
          id: 'fund',
          label: 'Sổ quỹ',
          icon: <SackDollarIcon className="size-4.5" />
        },
        {
          id: 'settings',
          label: 'Cấu hình hệ thống',
          icon: <GearIcon className="size-4.5" />
        }
      ]
    }
  ]

  const handleTabChange = (id: string): void => {
    onTabChange?.(id)
    onClose?.()
  }

  const renderItem = (item: MenuItem, indent = true): React.JSX.Element => {
    const isActive = activeTab === item.id
    return (
      <button
        key={item.id}
        onClick={() => handleTabChange(item.id)}
        className={`group/item relative w-full flex items-center justify-between gap-6 ${
          indent ? 'pl-4' : 'pl-2.5'
        } p-2 rounded-md text-sm transition-colors duration-150 cursor-pointer ${
          isActive
            ? 'bg-surface-secondary text-white'
            : 'text-content/75 hover:bg-surface-hover hover:text-white'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-accent"></span>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`flex items-center justify-center ${
              isActive ? 'text-accent' : 'text-icon/70 group-hover/item:text-icon'
            }`}
          >
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </div>
      </button>
    )
  }

  const renderGroup = (group: MenuGroup): React.JSX.Element => {
    return (
      <div key={group.label} className="py-3">
        <div className="w-full flex items-center justify-between gap-2 px-1.5 pb-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-content/45">
          <span className="truncate">{group.label}</span>
        </div>

        <div className="mt-0.5 space-y-1">
          <div className="space-y-1">{group.items.map((it) => renderItem(it, true))}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {open && (
        <div className="absolute inset-0 z-30 bg-black/40" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`absolute inset-y-0 left-0 z-40 w-60 flex flex-col border-r border-line select-none backdrop-blur-md transition-transform duration-200 ease-out ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 py-2 px-2 divide-y divide-line/35 overflow-y-auto pmv-scroll">
          {renderItem(dashboardItem, false)}
          {menuGroups.map(renderGroup)}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
