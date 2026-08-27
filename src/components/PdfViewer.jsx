import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import pdfjs from '../pdf.js'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const DOUBLE_TAP_ZOOM = 2.5
// Рисуем с запасом разрешения, чтобы при увеличении не мылило.
// Зум после этого — чистый CSS, без перерисовки canvas.
const QUALITY = 2

const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
const touchDist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

/** Рендер PDF в canvas — работает на iOS/Android, в отличие от iframe.
 *  Масштабирование: щипок двумя пальцами, двойной тап, Ctrl+колесо. */
export default function PdfViewer({ url }) {
  const hostRef = useRef(null)
  const pagesRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [zoom, setZoom] = useState(MIN_ZOOM)

  // Точка, вокруг которой нужно удержать содержимое после смены зума
  const anchorRef = useRef(null)
  const zoomRef = useRef(MIN_ZOOM)
  zoomRef.current = zoom

  /** Меняет зум, удерживая под пальцем ту же точку документа. */
  const zoomTo = useCallback((next, clientX, clientY) => {
    const host = hostRef.current
    const target = clampZoom(next)
    if (!host || target === zoomRef.current) return
    anchorRef.current = { clientX, clientY, from: zoomRef.current, to: target }
    setZoom(target)
  }, [])

  // Пересчёт прокрутки выполняем до отрисовки кадра, иначе картинка дёргается
  useLayoutEffect(() => {
    const host = hostRef.current
    const a = anchorRef.current
    anchorRef.current = null
    if (!host || !a) return
    const rect = host.getBoundingClientRect()
    const offsetX = a.clientX - rect.left
    const offsetY = a.clientY - rect.top
    const k = a.to / a.from
    host.scrollLeft = (host.scrollLeft + offsetX) * k - offsetX
    // По вертикали просмотрщик не прокручивается — он растёт вместе с листом,
    // листается вся страница. Верх просмотрщика от зума не двигается, поэтому
    // точка под пальцем уезжает ровно на offsetY * (k - 1): на столько и
    // подкручиваем страницу, чтобы она осталась на месте.
    const scroller = document.scrollingElement || document.documentElement
    scroller.scrollTop += offsetY * (k - 1)
  }, [zoom])

  // Жесты. Слушатели вешаем вручную: touchmove и wheel нужны неpassive,
  // иначе preventDefault не сработает и страницу утащит браузерный зум.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let pinch = null // { dist, zoom }
    let lastTap = 0

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinch = { dist: touchDist(e.touches[0], e.touches[1]), zoom: zoomRef.current }
        return
      }
      if (e.touches.length !== 1) return
      const now = Date.now()
      if (now - lastTap < 300) {
        const t = e.touches[0]
        zoomTo(zoomRef.current > MIN_ZOOM ? MIN_ZOOM : DOUBLE_TAP_ZOOM, t.clientX, t.clientY)
        lastTap = 0
      } else {
        lastTap = now
      }
    }

    const onTouchMove = (e) => {
      if (!pinch || e.touches.length !== 2) return
      e.preventDefault()
      const [a, b] = [e.touches[0], e.touches[1]]
      const dist = touchDist(a, b)
      if (!pinch.dist) return
      zoomTo(
        pinch.zoom * (dist / pinch.dist),
        (a.clientX + b.clientX) / 2,
        (a.clientY + b.clientY) / 2,
      )
    }

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinch = null
    }

    const onWheel = (e) => {
      if (!e.ctrlKey) return // обычная прокрутка колесом не трогается
      e.preventDefault()
      zoomTo(zoomRef.current * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY)
    }

    host.addEventListener('touchstart', onTouchStart, { passive: true })
    host.addEventListener('touchmove', onTouchMove, { passive: false })
    host.addEventListener('touchend', onTouchEnd, { passive: true })
    host.addEventListener('touchcancel', onTouchEnd, { passive: true })
    host.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      host.removeEventListener('touchstart', onTouchStart)
      host.removeEventListener('touchmove', onTouchMove)
      host.removeEventListener('touchend', onTouchEnd)
      host.removeEventListener('touchcancel', onTouchEnd)
      host.removeEventListener('wheel', onWheel)
    }
  }, [zoomTo])

  useEffect(() => {
    if (!url) return undefined
    let cancelled = false
    let pdfDoc = null
    let ro = null

    const clearPages = () => {
      const box = pagesRef.current
      if (box) box.replaceChildren()
    }

    const draw = async (doc, width) => {
      clearPages()
      const box = pagesRef.current
      if (!box || !width) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      for (let i = 1; i <= doc.numPages; i += 1) {
        if (cancelled) return
        const page = await doc.getPage(i)
        const base = page.getViewport({ scale: 1 })
        const scale = (width / base.width) * dpr * QUALITY
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.className = 'pdf-page'
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        box.appendChild(canvas)
        await page.render({
          canvasContext: canvas.getContext('2d', { alpha: false }),
          viewport,
        }).promise
      }
    }

    const start = async () => {
      setStatus('loading')
      setZoom(MIN_ZOOM)
      clearPages()
      try {
        pdfDoc = await pdfjs.getDocument({ url, withCredentials: false }).promise
        if (cancelled) return

        const paint = async () => {
          const w = hostRef.current?.clientWidth || 0
          if (!w) return
          setStatus('loading')
          try {
            await draw(pdfDoc, w)
            if (!cancelled) setStatus('ready')
          } catch {
            if (!cancelled) setStatus('error')
          }
        }

        await paint()

        if (typeof ResizeObserver !== 'undefined' && hostRef.current) {
          let t = 0
          // Следим только за шириной. Высота просмотрщика теперь задаётся самим
          // документом, поэтому на неё реагировать нельзя: отрисовка меняла бы
          // высоту, та дёргала бы наблюдателя, и он запускал бы отрисовку заново.
          let lastWidth = hostRef.current.clientWidth
          ro = new ResizeObserver(() => {
            const w = hostRef.current?.clientWidth || 0
            if (!w || w === lastWidth) return
            lastWidth = w
            clearTimeout(t)
            t = setTimeout(() => { if (!cancelled) paint() }, 180)
          })
          ro.observe(hostRef.current)
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    start()

    return () => {
      cancelled = true
      ro?.disconnect()
      clearPages()
      try { pdfDoc?.destroy() } catch { /* ignore */ }
    }
  }, [url])

  return (
    <div className="pdf-viewer" ref={hostRef}>
      {status === 'loading' && (
        <div className="pdf-viewer-status">
          <div className="spinner" style={{ margin: 0 }} />
          <div>Открываем документ…</div>
        </div>
      )}
      {status === 'error' && (
        <div className="pdf-viewer-status muted">Не удалось открыть PDF</div>
      )}
      <div
        className="pdf-viewer-pages"
        ref={pagesRef}
        hidden={status !== 'ready'}
        style={{ width: `${zoom * 100}%` }}
      />
    </div>
  )
}
