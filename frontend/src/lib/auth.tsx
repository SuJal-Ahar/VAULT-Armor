import { createContext, useContext, useMemo, useState } from 'react'
import { setVaultSession } from './vaultSession'

type AuthCtx = {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('pm_token'))

  const setToken = (next: string | null) => {
    setTokenState(next)
    if (next) localStorage.setItem('pm_token', next)
    else localStorage.removeItem('pm_token')
  }

  const logout = () => {
    setToken(null)
    setVaultSession(null)
  }

  const value = useMemo<AuthCtx>(() => ({ token, setToken, logout }), [token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

