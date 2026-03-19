import { Link, Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from './lib/auth'
import { decodeJwtPayload } from './lib/jwt'
import { Sidebar } from './components/Sidebar'

export default function App() {
  const { token, logout } = useAuth()
  const loc = useLocation()
  const inApp = loc.pathname.startsWith('/app')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const username = useMemo(() => {
    if (!token) return null
    const payload = decodeJwtPayload(token)
    return (payload?.username as string | undefined) || null
  }, [token])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            {token && inApp ? (
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-black/20 md:hidden"
                onClick={() => setSidebarOpen(true)}
                type="button"
                aria-label="Open sidebar"
              >
                <span className="sr-only">Open menu</span>
                <span className="block h-0.5 w-4 bg-[color:var(--color-text)]" />
                <span className="mt-1 block h-0.5 w-4 bg-[color:var(--color-text)]" />
                <span className="mt-1 block h-0.5 w-4 bg-[color:var(--color-text)]" />
              </button>
            ) : null}
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-[color:var(--color-border)] bg-black/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    stroke="hsl(262 83% 70%)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide text-[color:var(--color-muted)]">
                  VAULT Armor
                </span>
                <span className="text-lg font-semibold">Dashboard</span>
              </div>
            </div>
          </div>

          {!token || !inApp ? (
            <div className="flex items-center gap-2">
              <Link className="btn btn-secondary" to="/signin">
                Sign in
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-sm text-[color:var(--color-muted)]">
                {username ? `Hi, ${username}` : 'Hi'}
              </div>
            </div>
          )}
        </div>
      </header>

      {token && inApp ? (
        <div className="flex flex-1">
          <div className="flex w-full">
            <Sidebar
              username={username}
              onLogout={logout}
              collapsed={sidebarCollapsed}
              onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
              onNavigate={() => {
                setSidebarOpen(false)
              }}
            />

            {sidebarOpen ? (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setSidebarOpen(false)}
                  role="button"
                  aria-label="Close sidebar overlay"
                />
                <div className="absolute inset-y-0 left-0">
                  <Sidebar
                    username={username}
                    onLogout={() => {
                      setSidebarOpen(false)
                      logout()
                    }}
                    onNavigate={() => setSidebarOpen(false)}
                    collapsed={sidebarCollapsed}
                    onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
                  />
                </div>
              </div>
            ) : null}

            <div className="mx-auto w-full max-w-6xl">
              <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      ) : (
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <Outlet />
        </main>
      )}
    </div>
  )
}
