import React, { useState, useEffect } from 'react'

function Bottombar(): React.JSX.Element {
  const [time, setTime] = useState(new Date().toLocaleTimeString('vi-VN'))
  const [metrics, setMetrics] = useState({
    cpu: 0,
    appRamMB: 0,
    systemRamPercent: 0,
    systemRamUsedGB: '0',
    totalMemGB: '0'
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('vi-VN'))
    }, 1000)

    const fetchMetrics = async (): Promise<void> => {
      try {
        if (window.api?.system?.getMetrics) {
          const data = await window.api.system.getMetrics()
          setMetrics(data)
        }
      } catch {
        // Fallback gracefully
      }
    }

    fetchMetrics()
    const metricTimer = setInterval(fetchMetrics, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(metricTimer)
    }
  }, [])

  const cpuTone =
    metrics.cpu > 75 ? 'bg-rose-500' : metrics.cpu > 40 ? 'bg-amber-400' : 'bg-emerald-400'
  const ramTone =
    metrics.systemRamPercent > 80
      ? 'bg-rose-500'
      : metrics.systemRamPercent > 60
        ? 'bg-amber-400'
        : 'bg-accent'

  return (
    <footer className="h-8 w-full shrink-0 flex items-center justify-between px-3 border-t border-line text-[11px] text-content/60 select-none z-30 bg-surface">
      {/* Left Status Indicators */}
      <div className="flex items-center gap-4 text-content/60"></div>

      {/* Right Stats */}
      <div className="flex items-center gap-3 font-medium text-content/60">
        {/* CPU */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-content/40">CPU</span>
          <div className="w-10 h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${cpuTone}`}
              style={{ width: `${Math.max(8, metrics.cpu)}%` }}
            ></div>
          </div>
          <span className="font-mono text-content/70 text-[10px]">{metrics.cpu}%</span>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-content/40">RAM</span>
          <div className="w-10 h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${ramTone}`}
              style={{ width: `${metrics.systemRamPercent}%` }}
            ></div>
          </div>
          <span className="font-mono text-content/70 text-[10px]">{metrics.appRamMB} MB</span>
        </div>

        <div className="h-3 w-px bg-line"></div>

        {/* Digital Clock */}
        <span className="font-mono text-content/70">{time}</span>
      </div>
    </footer>
  )
}

export default Bottombar
