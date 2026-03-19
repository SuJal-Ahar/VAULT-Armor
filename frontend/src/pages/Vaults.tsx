import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { createVault, deleteVault, listVaults, openVault, type VaultSummary } from '../lib/api'
import { setVaultSession } from '../lib/vaultSession'

export function VaultsPage() {
  const nav = useNavigate()

  const [vaults, setVaults] = useState<VaultSummary[]>([])
  const [vaultId, setVaultId] = useState<string>('')

  const [openPasskey, setOpenPasskey] = useState('')
  const [openErr, setOpenErr] = useState<string | null>(null)
  const [opening, setOpening] = useState(false)

  const [creating, setCreating] = useState(false)
  const [createVaultName, setCreateVaultName] = useState('')
  const [createPasskey, setCreatePasskey] = useState('')
  const [createErr, setCreateErr] = useState<string | null>(null)

  const selectedVault = useMemo(() => vaults.find((v) => v._id === vaultId) ?? null, [vaultId, vaults])

  const refreshVaults = async () => {
    const res = await listVaults()
    setVaults(res.vaults)
    if (!vaultId && res.vaults[0]?._id) setVaultId(res.vaults[0]._id)
  }

  useEffect(() => {
    refreshVaults().catch(() => {
      // handled on actions
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCreateVault = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateErr(null)
    setCreating(true)
    try {
      const res = await createVault({
        vaultName: createVaultName,
        passkey: createPasskey,
      })
      setCreateVaultName('')
      setCreatePasskey('')
      await refreshVaults()
      setVaultId(res.vault._id)
    } catch (e: any) {
      setCreateErr(e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Create vault failed')
    } finally {
      setCreating(false)
    }
  }

  const onOpen = async (e: React.FormEvent) => {
    e.preventDefault()
    setOpenErr(null)
    setOpening(true)
    try {
      await openVault({ vaultId, passkey: openPasskey })
      setVaultSession({ vaultId })
      nav('/app/save')
    } catch (e: any) {
      setOpenErr(e?.response?.data?.message || e?.message || 'Open vault failed')
    } finally {
      setOpening(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Vaults</div>
        <div className="text-sm text-[color:var(--color-muted)]">Select a vault, open it with a passkey, then save passwords.</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-semibold">All vaults</div>
            <div className="flex items-center gap-2">
              {selectedVault ? (
                <Button
                  type="button"
                  variant="danger"
                  onClick={async () => {
                    if (!selectedVault) return
                    const sure = window.confirm(`Delete vault "${selectedVault.vaultName}"? This removes all passwords in it.`)
                    if (!sure) return
                    await deleteVault(selectedVault._id)
                    setVaultId('')
                    await refreshVaults()
                  }}
                >
                  Delete vault
                </Button>
              ) : null}
              <Button variant="secondary" type="button" onClick={() => refreshVaults()}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Vault</label>
            <select className="input" value={vaultId} onChange={(e) => setVaultId(e.target.value)}>
              <option value="" disabled>
                Select a vault…
              </option>
              {vaults.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vaultName} ({v._id})
                </option>
              ))}
            </select>
            {selectedVault ? (
              <div className="mt-3 text-xs text-[color:var(--color-muted)]">
                keySalt: <span className="font-mono">{selectedVault.keySalt}</span> • rounds:{' '}
                <span className="font-mono">{selectedVault.saltRounds}</span>
              </div>
            ) : null}
          </div>

          <form className="mt-6 space-y-4" onSubmit={onOpen}>
            <div>
              <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Passkey</label>
              <input className="input" type="password" value={openPasskey} onChange={(e) => setOpenPasskey(e.target.value)} />
            </div>
            {openErr ? <div className="text-sm text-red-300">{openErr}</div> : null}
            <Button type="submit" disabled={!vaultId || !openPasskey || opening}>
              {opening ? 'Opening…' : 'Open vault'}
            </Button>
          </form>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="text-lg font-semibold">Create vault</div>
          <div className="mt-1 text-sm text-[color:var(--color-muted)]">
            Salt is generated on the backend; you only set the passkey.
          </div>

          <form className="mt-6 space-y-4" onSubmit={onCreateVault}>
            <div>
              <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Vault name</label>
              <input className="input" value={createVaultName} onChange={(e) => setCreateVaultName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[color:var(--color-muted)]">Passkey</label>
              <input className="input" type="password" value={createPasskey} onChange={(e) => setCreatePasskey(e.target.value)} />
            </div>

            {createErr ? <div className="text-sm text-red-300">{createErr}</div> : null}

            <Button type="submit" disabled={!createVaultName || !createPasskey || creating}>
              {creating ? 'Creating…' : 'Create vault'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

