import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { addItem, deleteItem, openVault, type VaultItem } from '../lib/api'
import { getVaultSession, setVaultSession } from '../lib/vaultSession'

export function SavePasswordPage() {
  const nav = useNavigate()
  const [session, setSession] = useState(() => getVaultSession())
  const [passkey, setPasskey] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  const [items, setItems] = useState<VaultItem[] | null>(null)
  const [loadingItems, setLoadingItems] = useState(false)
  const [itemsErr, setItemsErr] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [password, setPassword] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  useEffect(() => {
    if (!session || !unlocked) return
    setLoadingItems(true)
    setItemsErr(null)
    openVault({ vaultId: session.vaultId, passkey })
      .then((res) => setItems(res.items))
      .catch((e: any) => setItemsErr(e?.response?.data?.message || e?.message || 'Failed to load items'))
      .finally(() => setLoadingItems(false))
  }, [session?.vaultId, unlocked, passkey])

  if (!session) {
    return (
      <div className="card p-4 sm:p-6">
        <div className="text-lg font-semibold">No vault opened</div>
        <div className="mt-2 text-sm text-[color:var(--color-muted)]">
          Go to Vaults, open a vault with your passkey, then come back here.
        </div>
        <div className="mt-4">
          <Button onClick={() => nav('/app/vaults')}>Go to Vaults</Button>
        </div>
      </div>
    )
  }

  const refreshItems = async () => {
    if (!unlocked) return
    setLoadingItems(true)
    setItemsErr(null)
    try {
      const res = await openVault({ vaultId: session.vaultId, passkey })
      setItems(res.items)
    } catch (e: any) {
      setItemsErr(e?.response?.data?.message || e?.message || 'Failed to load items')
    } finally {
      setLoadingItems(false)
    }
  }

  const onUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setItemsErr(null)
    setUnlocked(false)
    setItems(null)
    setLoadingItems(true)
    try {
      const res = await openVault({ vaultId: session.vaultId, passkey })
      setItems(res.items)
      setUnlocked(true)
    } catch (e: any) {
      setItemsErr(e?.response?.data?.message || e?.message || 'Incorrect passkey')
    } finally {
      setLoadingItems(false)
    }
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveErr(null)
    setSaving(true)
    try {
      await addItem({
        vaultId: session.vaultId,
        passkey,
        title,
        password,
        link: link || undefined,
        description: description || undefined,
      })
      setTitle('')
      setPassword('')
      setLink('')
      setDescription('')
      await refreshItems()
    } catch (e: any) {
      setSaveErr(e?.response?.data?.message || e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xl font-semibold">Save password</div>
          <div className="text-sm text-[color:var(--color-muted)]">
            Vault: <span className="font-mono">{session.vaultId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => refreshItems()} disabled={loadingItems}>
            {loadingItems ? 'Loading…' : 'Refresh'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setVaultSession(null)
              setSession(null)
              nav('/app/vaults')
            }}
          >
            Change vault
          </Button>
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="text-lg font-semibold">Unlock vault</div>
        <div className="mt-1 text-sm text-[color:var(--color-muted)]">
          Passkey is required and is not stored.
        </div>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onUnlock}>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Passkey</label>
            <input className="input" type="password" value={passkey} onChange={(e) => setPasskey(e.target.value)} />
          </div>
          <Button type="submit" disabled={!passkey || loadingItems}>
            {loadingItems ? 'Checking…' : unlocked ? 'Unlocked' : 'Unlock'}
          </Button>
        </form>
        {itemsErr ? <div className="mt-3 text-sm text-red-300">{itemsErr}</div> : null}
      </div>

      <div className="card p-4 sm:p-6">
        <div className="text-lg font-semibold">Add new password</div>
        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSave}>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Password</label>
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Link (optional)</label>
            <input className="input" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Description (optional)</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            {saveErr ? <div className="mb-2 text-sm text-red-300">{saveErr}</div> : null}
            <Button type="submit" disabled={!unlocked || !title || !password || saving}>
              {saving ? 'Saving…' : 'Save password'}
            </Button>
          </div>
        </form>
      </div>

      <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">Saved passwords</div>
            </div>
        {loadingItems ? (
          <div className="mt-4 text-sm text-[color:var(--color-muted)]">Loading…</div>
        ) : unlocked && items ? (
          items.length ? (
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="space-y-3 rounded-[var(--radius-control)] border border-[color:var(--color-border)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      {it.link ? (
                        <a className="mt-1 block truncate text-sm underline" href={it.link} target="_blank" rel="noreferrer">
                          {it.link}
                        </a>
                      ) : null}
                      {it.description ? (
                        <div className="mt-1 text-sm text-[color:var(--color-muted)]">{it.description}</div>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      disabled={!unlocked}
                      onClick={async () => {
                        const sure = window.confirm(`Delete password "${it.title}"?`)
                        if (!sure) return
                        await deleteItem({ vaultId: session.vaultId, itemId: it.id, passkey })
                        await refreshItems()
                      }}
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="rounded-[10px] bg-black/20 p-3 font-mono text-sm">{it.password}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-[color:var(--color-muted)]">No items yet.</div>
          )
        ) : (
          <div className="mt-4 text-sm text-[color:var(--color-muted)]">Locked.</div>
        )}
      </div>
    </div>
  )
}

