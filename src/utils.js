import QRCode from 'qrcode'

export const fmt = (n) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.abs(n))

export const fmtSigned = (n) => (n < 0 ? '−' : '+') + ' ' + fmt(n) + ' ₸'

export const fmtDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' }) +
    ', ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// localStorage helpers with a namespace + fallback
const NS = 'kaspi_demo_'
export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
export const save = (key, value) => {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    /* ignore quota / private mode */
  }
}

export const makeQR = async (text) => {
  try {
    return await QRCode.toDataURL(text, { margin: 1, width: 240, color: { dark: '#1A1A1A', light: '#FFFFFF' } })
  } catch {
    return ''
  }
}
