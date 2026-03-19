import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { signup } from '../lib/api'

export function SignUp() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await signup({ username, email, password })
      nav('/signin')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="card p-6">
        <div className="text-xl font-semibold">Create account</div>
        <div className="mt-1 text-sm text-[color:var(--color-muted)]">Create a user for your password manager.</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="mt-1 text-xs text-[color:var(--color-muted)]">
              Must include upper, lower, number; min 8 chars (per backend validation).
            </div>
          </div>

          {err ? <div className="text-sm text-red-300">{err}</div> : null}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-[color:var(--color-muted)]">
          Already have an account? <Link className="underline" to="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

