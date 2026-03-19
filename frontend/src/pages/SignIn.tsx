import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { signin } from '../lib/api'
import { useAuth } from '../lib/auth'

export function SignIn() {
  const nav = useNavigate()
  const { setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await signin({ username, password })
      if (!res.token) {
        setErr(res.message || 'Login failed')
        return
      }
      setToken(res.token)
      nav('/app')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6">
        <div className="text-xl font-semibold">Sign in</div>
        <div className="mt-1 text-sm text-[color:var(--color-muted)]">Use your username + password.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {err ? <div className="text-sm text-red-300">{err}</div> : null}

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-[color:var(--color-muted)]">
          No account? <Link className="underline" to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  )
}

