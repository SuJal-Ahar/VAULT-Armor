export type VaultSession = {
  vaultId: string
}

const KEY = 'pm_vault_session'

export function getVaultSession(): VaultSession | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as VaultSession
  } catch {
    return null
  }
}

export function setVaultSession(s: VaultSession | null) {
  if (!s) {
    sessionStorage.removeItem(KEY)
    return
  }
  sessionStorage.setItem(KEY, JSON.stringify(s))
}

