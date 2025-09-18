const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

type Options = RequestInit & { auth?: boolean }

export function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('cashpe-token') || ''
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('cashpe-token', token)
}

export async function api(path: string, opts: Options = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  }
  if (opts.auth) {
    const t = getToken()
    if (t) headers['Authorization'] = `Bearer ${t}`
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Request failed')
    throw new Error(msg || `HTTP ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const AuthAPI = {
  register: async (email: string, password: string, name?: string) => {
    const r = await api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) })
    return r as { token: string; user: any }
  },
  login: async (email: string, password: string) => {
    const r = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    return r as { token: string; user: any }
  },
  me: async () => {
    const r = await api('/auth/me', { auth: true })
    return r as { user: any }
  },
}

export const CatalogAPI = {
  categories: () => api('/catalog/categories'),
  brands: (category?: string) => api(`/catalog/brands${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  models: (category: string, brand: string) => api(`/catalog/models?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}`),
  search: (q: string) => api(`/catalog/search?q=${encodeURIComponent(q)}`),
}

export const QuoteAPI = {
  create: (payload: any) => api('/quotes', { method: 'POST', body: JSON.stringify(payload), auth: true }),
}

export const OrdersAPI = {
  createSell: (payload: any) => api('/orders/sell', { method: 'POST', body: JSON.stringify(payload), auth: true }),
  schedule: (payload: any) => api('/orders/schedule', { method: 'POST', body: JSON.stringify(payload), auth: true }),
  my: () => api('/orders/my', { auth: true }),
}

export const PickupAPI = {
  slots: () => api('/pickup/slots'),
}

export const MembershipAPI = {
  status: () => api('/membership/status', { auth: true }),
  enroll: (tier: 'gold') => api('/membership/enroll', { method: 'POST', body: JSON.stringify({ tier }), auth: true }),
}

export const PaymentsAPI = {
  razorpayOrder: (amount: number) => api('/payments/razorpay/order', { method: 'POST', body: JSON.stringify({ amount, currency: 'INR' }), auth: true }),
}
