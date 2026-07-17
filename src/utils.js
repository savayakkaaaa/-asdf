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
    // PDF/фото не кладём в localStorage — они в IndexedDB через stashDocPreview
    if (key === 'documents' && Array.isArray(value)) {
      const slim = value.map(({ fileData, ...rest }) => rest)
      localStorage.setItem(NS + key, JSON.stringify(slim))
      return
    }
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

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i
const PDF_EXT = /\.pdf$/i

export const isImageFile = (file) => {
  if (!file) return false
  if (file.type && file.type.startsWith('image/')) return true
  return IMAGE_EXT.test(file.name || '')
}

export const isPdfFile = (file) => {
  if (!file) return false
  if (file.type === 'application/pdf') return true
  return PDF_EXT.test(file.name || '')
}

export const isPdfData = (src = '', name = '') =>
  /^data:application\/pdf/i.test(src) || /\.pdf$/i.test(name || '')

/** dataURL → blob URL (лучше открывается в iframe на iOS/Safari) */
export const dataUrlToObjectUrl = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl || ''
  try {
    const [meta, b64] = dataUrl.split(',')
    const mime = /data:([^;]+)/.exec(meta)?.[1] || 'application/pdf'
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return URL.createObjectURL(new Blob([bytes], { type: mime }))
  } catch {
    return dataUrl
  }
}

export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(file)
  })

/** Сжимает фото в JPEG dataURL, чтобы влезало в localStorage и стабильно показывалось. */
export const compressImageFile = (file, maxW = 1000, quality = 0.72) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, maxW / (img.naturalWidth || img.width || maxW))
        const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale))
        const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const data = canvas.toDataURL('image/jpeg', quality)
        URL.revokeObjectURL(url)
        resolve(data)
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      readFileAsDataURL(file).then(resolve).catch(reject)
    }
    img.src = url
  })

const IDB_NAME = 'kaspi_demo_files'
const IDB_STORE = 'files'

const openIdb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

/** Надёжное хранение PDF/фото (IndexedDB + sessionStorage fallback) */
export const stashDocPreview = async (id, dataUrl) => {
  if (!id || !dataUrl) return
  try { sessionStorage.setItem(NS + 'preview_' + id, dataUrl) } catch { /* ignore */ }
  try {
    const db = await openIdb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite')
      tx.objectStore(IDB_STORE).put(dataUrl, id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch { /* ignore */ }
}

export const loadDocPreview = (id) => {
  if (!id) return ''
  try { return sessionStorage.getItem(NS + 'preview_' + id) || '' } catch { return '' }
}

export const loadDocPreviewAsync = async (id) => {
  if (!id) return ''
  const fromSession = loadDocPreview(id)
  if (fromSession) return fromSession
  try {
    const db = await openIdb()
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly')
      const req = tx.objectStore(IDB_STORE).get(id)
      req.onsuccess = () => resolve(req.result || '')
      req.onerror = () => resolve('')
    })
  } catch {
    return ''
  }
}
