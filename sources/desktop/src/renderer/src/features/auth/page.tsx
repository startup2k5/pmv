// features/auth/page.tsx
import { useTitlebar } from '@renderer/lib/titlebar-context'
import { useEffect, useState, type FormEvent } from 'react'
import { authService } from '@renderer/services/auth'
import type { User } from '@renderer/types'
import { useI18n } from '@renderer/lib/i18n'

interface LoginPageProps {
  onLoginSuccess: (user: User) => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps): React.JSX.Element {
  const { setTitlebar } = useTitlebar()
  const { t, tError } = useI18n()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setTitlebar(
      <div className="flex items-center px-4">
        <span className="text-xs font-semibold text-content/60 uppercase tracking-wider">
          PMV System — {t('auth.title', 'Đăng nhập')}
        </span>
      </div>
    )
    return () => setTitlebar(null)
  }, [setTitlebar, t])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedUsername = username.trim()
    if (!trimmedUsername && !password) {
      setErrorMessage(
        t('auth.credentials_required', 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.')
      )
      return
    }

    if (!trimmedUsername) {
      setErrorMessage(t('auth.username_required', 'Vui lòng nhập tên đăng nhập.'))
      return
    }

    if (!password) {
      setErrorMessage(t('auth.password_required', 'Vui lòng nhập mật khẩu.'))
      return
    }

    setIsLoading(true)
    try {
      // 1. Đăng nhập API: máy chủ chỉ trả về token
      const { token } = await authService.login(trimmedUsername, password)
      // 2. Nạp mọi thông tin tài khoản qua token vào dashboard
      const user = await authService.loadUserFromToken(token)
      if (user) {
        onLoginSuccess(user)
      } else {
        throw new Error('INVALID_CREDENTIALS')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'INVALID_CREDENTIALS'
      // Tu dong phien dich ma loi backend (code error) sang vi hoac en
      setErrorMessage(tError(msg, msg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center relative z-10 px-4">
      <div className="flex w-full max-w-md flex-col gap-6 p-8 rounded-2xl bg-surface/90 border border-line shadow-xl backdrop-blur-xl">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="size-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-1 shadow-inner">
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-content tracking-tight">
            {t('auth.title', 'Đăng nhập hệ thống')}
          </h2>
          <p className="text-xs text-content/50">
            {t('auth.subtitle', 'Hệ thống quản lý bán hàng & in tem nhãn PMV')}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs animate-in fade-in duration-200">
            <svg
              className="size-4 shrink-0 mt-0.5 text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="flex-1 leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-content/80">
              {t('auth.username', 'Tên đăng nhập')}
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                autoComplete="username"
                disabled={isLoading}
                placeholder={t('auth.username_placeholder', 'Nhập username')}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (errorMessage) setErrorMessage(null)
                }}
                className="w-full rounded-lg border border-line bg-surface-secondary px-3.5 py-2.5 text-sm text-content placeholder:text-content/30 focus:outline-none focus:border-accent focus:bg-surface transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-content/80">
                {t('auth.password', 'Mật khẩu')}
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isLoading}
                placeholder={t('auth.password_placeholder', 'Nhập mật khẩu')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errorMessage) setErrorMessage(null)
                }}
                className="w-full rounded-lg border border-line bg-surface-secondary px-3.5 py-2.5 pr-10 text-sm text-content placeholder:text-content/30 focus:outline-none focus:border-accent focus:bg-surface transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-content/40 hover:text-content transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-accent hover:bg-accent-hover active:scale-[0.99] transition-all duration-200 py-2.5 font-semibold text-sm text-white shadow-lg shadow-accent/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                <span>{t('btn.logging_in', 'Đang xác thực...')}</span>
              </>
            ) : (
              <span>{t('btn.login', 'Đăng nhập')}</span>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-line text-center">
          <span className="text-[11px] text-content/40">
            {t('auth.default_account_hint', 'Tài khoản mặc định hệ thống: admin')}
          </span>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
