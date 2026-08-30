// features/auth/page.tsx
import { useTitlebar } from '@renderer/lib/titlebar-context'
import { useEffect, useState } from 'react'

interface LoginPageProps {
  onLoginSuccess: () => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps): React.JSX.Element {
  const { setTitlebar } = useTitlebar()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setTitlebar(<h1 className="text-lg font-bold text-content">Login</h1>)
    return () => setTitlebar(null)
  }, [setTitlebar])

  return (
    <main className="flex flex-1 items-center justify-center relative z-10">
      <div className="flex w-full max-w-md flex-col gap-5 p-8 rounded-2xl glass-panel">
        <h2 className="text-2xl font-bold text-content text-center">Đăng nhập hệ thống</h2>
        <input
          id="username"
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-content placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
        />

        <input
          id="password"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-content placeholder:text-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
        />

        <button
          onClick={() => onLoginSuccess()}
          className="rounded-lg bg-accent hover:bg-accent-hover transition-colors duration-200 py-2.5 font-medium text-white shadow-md cursor-pointer"
        >
          Đăng nhập
        </button>
      </div>
    </main>
  )
}

export default LoginPage
