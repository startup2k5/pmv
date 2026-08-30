import React, { useState } from 'react'

export function DashboardView(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const stats = [
    {
      title: 'Lệnh in hôm nay',
      value: '1,428',
      unit: 'tem',
      change: '+14.2%',
      icon:
        'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
    },
    {
      title: 'Hóa đơn VAT đã phát hành',
      value: '386',
      unit: 'hóa đơn',
      change: '+8.5%',
      icon:
        'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      title: 'Doanh thu trong ngày',
      value: '48.25M',
      unit: 'VNĐ',
      change: '+5.4%',
      icon:
        'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Máy in hoạt động',
      value: '4/4',
      unit: 'Online',
      change: '100% Sẵn sàng',
      icon:
        'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
    }
  ]

  const recentJobs = [
    {
      id: 'JOB-8842',
      template: 'Tem nhãn mã vạch EAN-13 (40x30mm)',
      user: 'Nguyễn Văn A',
      qty: 120,
      time: '10:45:12',
      status: 'success'
    },
    {
      id: 'JOB-8841',
      template: 'Phiếu giao hàng vận chuyển Kerry',
      user: 'Trần Thị B',
      qty: 45,
      time: '10:42:30',
      status: 'success'
    },
    {
      id: 'JOB-8840',
      template: 'Tem QR Code bảo hành điện tử',
      user: 'Lê Hoàng C',
      qty: 300,
      time: '10:38:15',
      status: 'printing'
    },
    {
      id: 'JOB-8839',
      template: 'Hóa đơn VAT GTGT điện tử #9928',
      user: 'Phạm Minh D',
      qty: 1,
      time: '10:30:00',
      status: 'success'
    },
    {
      id: 'JOB-8838',
      template: 'Tem phụ sản phẩm nhập khẩu',
      user: 'Vũ Quốc E',
      qty: 80,
      time: '10:15:22',
      status: 'pending'
    }
  ]

  const statusBadge: Record<string, { label: string; cls: string }> = {
    success: {
      label: 'Thành công',
      cls: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
    },
    printing: {
      label: 'Đang in',
      cls: 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
    },
    pending: {
      label: 'Chờ duyệt',
      cls: 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
    }
  }

  const iconTone = ['text-accent', 'text-blue-400', 'text-emerald-400', 'text-purple-400']

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-8 space-y-8 gap-3">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-content">Bảng điều khiển trung tâm</h1>
          <p className="text-xs text-content/50 mt-1">
            Tổng quan tình trạng in ấn tem nhãn BarTender và phát hành hóa đơn VAT thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-line text-xs font-semibold text-content/80 hover:bg-surface-hover cursor-pointer transition-colors">
            <svg
              className="size-3.5 text-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>

          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-xs font-semibold text-white hover:bg-accent-hover shadow-sm cursor-pointer transition-colors">
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tạo lệnh in mới
          </button>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-black/45 border border-line-secondary/20 shadow-lg shadow-black/25 flex flex-col justify-between hover:border-line-secondary/40 hover:bg-black/55 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-content/50">{stat.title}</span>
              <div className="size-8 rounded-lg bg-surface-hover border border-line flex items-center justify-center">
                <svg
                  className={`size-5 ${iconTone[idx]}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={stat.icon}
                  />
                </svg>
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-content font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs text-content/40 font-medium">{stat.unit}</span>
            </div>

            <div className="mt-2 pt-2 border-t border-line flex items-center text-[11px]">
              <span className="text-emerald-300 font-semibold">{stat.change}</span>
              <span className="text-content/40 ml-1.5">so với hôm qua</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Table & Right Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table: Recent Print Jobs (2 Columns) */}
        <div className="lg:col-span-2 bg-black/40 rounded-xl border border-line shadow-lg shadow-black/20 flex flex-col gap-2">
          <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-content">Lệnh in gần đây</h2>
              <span className="text-xs text-content/40">
                Danh sách các tác vụ in ấn tự động qua BarTender
              </span>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm mã lệnh, mẫu tem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-line text-xs bg-surface-secondary placeholder:text-content/30 text-content focus:outline-none focus:border-accent focus:bg-surface transition-colors"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-line text-xs bg-surface-secondary text-content/70 focus:outline-none focus:border-accent"
              >
                <option value="all">Tất cả</option>
                <option value="success">Thành công</option>
                <option value="printing">Đang in</option>
                <option value="pending">Chờ xử lý</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs text-content/70">
              <thead className="bg-surface-hover border-b border-line text-[11px] font-semibold text-content/40 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Mã lệnh</th>
                  <th className="py-2.5 px-4">Mẫu tem</th>
                  <th className="py-2.5 px-4 text-right">Số lượng</th>
                  <th className="py-2.5 px-4">Người thực hiện</th>
                  <th className="py-2.5 px-4">Thời gian</th>
                  <th className="py-2.5 px-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-medium">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-content">{job.id}</td>
                    <td className="py-3 px-4 text-content/80">{job.template}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-content">
                      {job.qty}
                    </td>
                    <td className="py-3 px-4">{job.user}</td>
                    <td className="py-3 px-4 text-content/40 font-mono">{job.time}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge[job.status]?.cls}`}
                      >
                        {statusBadge[job.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Widget: Quick Print & Engine Health */}
        <div className="space-y-8">
          {/* Quick Print Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-line shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-content">In nhanh mẫu thử</h3>
            <p className="text-xs text-content/40 mt-0.5">
              Chọn mẫu tem để kiểm tra máy in BarTender
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-content/70 mb-1">
                  Mẫu tem nhãn
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-line text-xs bg-surface-secondary text-content/70 focus:outline-none focus:border-accent">
                  <option>Tem mã vạch 35x22mm (Chuẩn kho)</option>
                  <option>Tem phụ sản phẩm 50x30mm</option>
                  <option>Tem địa chỉ giao hàng A6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content/70 mb-1">
                  Máy in đích
                </label>
                <select className="w-full px-3 py-2 rounded-lg border border-line text-xs bg-surface-secondary text-content/70 focus:outline-none focus:border-accent">
                  <option>Zebra ZD230 (USB001) - Online</option>
                  <option>TSC TE200 (LAN 192.168.1.120)</option>
                  <option>Xprinter XP-350B</option>
                </select>
              </div>

              <button className="w-full mt-2 py-2 rounded-lg bg-content hover:bg-content/90 text-black text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Gửi lệnh in thử nghiệm
              </button>
            </div>
          </div>

          {/* Engine Health Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-line shadow-lg shadow-black/20">
            <h3 className="text-sm font-bold text-content">Trạng thái dịch vụ</h3>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary border border-line">
                <span className="font-medium text-content/80">BarTender Suite Engine</span>
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold text-[11px]">
                  <span className="size-1.5 rounded-full bg-emerald-400"></span>
                  Hoạt động tốt
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary border border-line">
                <span className="font-medium text-content/80">Cổng phát hành VAT (8387)</span>
                <span className="text-emerald-300 font-semibold text-[11px]">Sẵn sàng</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary border border-line">
                <span className="font-medium text-content/80">Cơ sở dữ liệu cục bộ</span>
                <span className="text-content/50 font-mono text-[11px]">SQLite (32MB)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
