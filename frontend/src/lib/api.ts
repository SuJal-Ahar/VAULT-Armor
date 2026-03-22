import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pm_token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export type SignupRequest = {
  username: string
  email: string
  password: string
}

export type SigninRequest = {
  username: string
  password: string
}

export type VaultSummary = {
  _id: string
  vaultName: string
  keySalt: string
  saltRounds: number
}

export type VaultItem = {
  id: string
  title: string
  link: string
  description: string
  password: string
}

export async function signup(body: SignupRequest) {
  const res = await api.post('/api/v1/signup', body)
  return res.data as { message: string }
}

export async function signin(body: SigninRequest) {
  const res = await api.post('/api/v1/signin', body)
  return res.data as { message: string; token?: string }
}

export async function listVaults() {
  const res = await api.get('/api/v1/vaults')
  return res.data as { vaults: VaultSummary[] }
}

export async function createVault(body: {
  vaultName: string
  passkey: string
}) {
  const res = await api.post('/api/v1/vault', body)
  return res.data as { message: string; vault: VaultSummary }
}

export async function openVault(body: { vaultId: string; passkey: string }) {
  const res = await api.post('/api/v1/vault/open', body)
  return res.data as { success: boolean; items: VaultItem[] }
}

export async function addItem(body: {
  vaultId: string
  passkey: string
  title: string
  password: string
  link?: string
  description?: string
}) {
  const res = await api.post('/api/v1/vault/add-item', body)
  return res.data as { message: string }
}

export async function deleteVault(vaultId: string) {
  const res = await api.delete(`/api/v1/vault/${vaultId}`)
  return res.data as { message: string }
}

export async function deleteItem(body: { vaultId: string; itemId: string; passkey: string }) {
  const res = await api.delete(`/api/v1/vault/${body.vaultId}/item/${body.itemId}`, {
    data: { passkey: body.passkey },
  })
  return res.data as { message: string }
}


