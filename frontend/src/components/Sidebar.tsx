import { Link, useLocation } from 'react-router-dom'
import { Button } from './Button'

export function Sidebar({
  username,
  onLogout,
  onNavigate,
  collapsed,
  onToggleCollapsed,
}: {
  username?: string | null
  onLogout: () => void
  onNavigate?: () => void
  collapsed: boolean
  onToggleCollapsed: () => void
}) {
  const loc = useLocation()
  const isActive = (path: string) => loc.pathname === path

  const initials = username?.trim().slice(0, 2).toUpperCase() || 'U'

  const navLink = (to: string, label: string, icon: string) => (
    <Link
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={[
        collapsed
          ? 'group flex items-center justify-center rounded-[18px] border p-3'
          : 'flex items-center gap-3 rounded-[var(--radius-control)] border px-3 py-2 text-sm font-semibold',
        isActive(to)
          ? 'border-transparent bg-[color:var(--color-primary)] text-black'
          : 'border-[color:var(--color-border)] bg-black/10 text-[color:var(--color-text)] hover:bg-black/20',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'grid place-items-center text-base',
          collapsed ? 'h-10 w-10 rounded-[14px] bg-black/15' : 'h-6 w-6 rounded-md bg-black/15 text-sm',
        ].join(' ')}
      >
        {icon}
      </span>
      <span className={collapsed ? 'sr-only' : 'truncate'}>{label}</span>
    </Link>
  )

  return (
    <aside
      className={[
        'relative h-full shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/70',
        collapsed ? 'w-[88px]' : 'w-[280px]',
      ].join(' ')}
    >
      <button
        type="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggleCollapsed}
        className="absolute right-[-16px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow"
      >
        <span className={collapsed ? '' : 'rotate-180'} aria-hidden>
          ›
        </span>
      </button>

      <div className={collapsed ? 'flex h-full flex-col items-center p-3' : 'flex h-full flex-col p-3 md:p-4'}>
        <div className={collapsed ? 'card grid w-full place-items-center p-3' : 'card flex items-center gap-3 p-3'}>
          <div className={collapsed ? 'grid place-items-center gap-2' : 'flex items-center gap-3'}>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--color-primary)] font-bold text-black">
              {initials}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{username || 'User'}</div>
                <div className="text-xs text-[color:var(--color-muted)]">Signed in</div>
              </div>
            ) : null}
          </div>
        </div>

        <nav className={collapsed ? 'mt-4 grid w-full place-items-center gap-2' : 'mt-4 space-y-2'}>
          {navLink('/app/vaults', 'Vaults', '🔐')}
          {navLink('/app/save', 'Save password', '➕')}
        </nav>

        <div className="mt-auto pt-4">
          <Button
            title={collapsed ? 'Logout' : undefined}
            className={collapsed ? 'w-full justify-center rounded-[18px] px-0 py-3' : 'w-full'}
            variant="danger"
            onClick={onLogout}
          >
            {collapsed ? '⎋' : 'Logout'}
          </Button>
        </div>
      </div>
    </aside>
  )
}

