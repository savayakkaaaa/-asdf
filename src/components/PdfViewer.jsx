import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import pdfjs from '../pdf.js'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const DOUBLE_TAP_ZOOM = 2.5
// Рисуем с запасом разрешения, чтобы при увеличении не мылило.
// Зум после этого — чистый CSS, без перерисовки canvas.
const QUALITY = 2

const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
const touchDist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
const pageScroller = () => document.scrollingElement || document.documentElement

/** Рендер PDF в canvas — работает на iOS/Android, в отличие от iframe.
 *  Масштабирование: щипок двумя пальцами, двойной тап, Ctrl+колесо. */
export default function PdfViewer({ url }) {
  const hostRef = useRef(null)
  const pagesRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  // «Зафиксированный» зум: держим его шириной страниц (width: zoom*100%), чтобы
  // область прокрутки была правильной, когда жеста нет. Во время самого щипка
  // ширину не трогаем — накладываем поверх transform: scale (его считает GPU,
  // без пересчёта раскладки и перерисовки React), а по окончании фиксируем.
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const zoomRef = useRef(MIN_ZOOM)
  zoomRef.current = zoom

  // Точка, вокруг которой удерживаем документ при дискретном зуме (колесо, двойной тап)
  const anchorRef = useRef(null)

  const zoomTo = useCallback((next, clientX, clientY) => {
    const target = clampZoom(next)
    if (target === zoomRef.current) return
    anchorRef.current = { clientX, clientY, from: zoomRef.current, to: target }
    setZoom(target)
  }, [])

  // Пересчёт прокрутки для дискретного зума — до отрисовки кадра, чтобы не дёргалось.
  useLayoutEffect(() => {
    const host = hostRef.current
    const a = anchorRef.current
    anchorRef.current = null
    if (!host || !a) return
    const rect = host.getBoundingClientRect()
    const offsetX = a.clientX - rect.left
    const offsetY = a.clientY - rect.top
    const k = a.to / a.from
    // по горизонтали прокрутка внутренняя, по вертикали листается вся страница
    host.scrollLeft = (host.scrollLeft + offsetX) * k - offsetX
    pageScroller().scrollTop += offsetY * (k - 1)
  }, [zoom])

  // Жесты. Слушатели вешаем вручную: touchmove и wheel нужны неpassive,
  // иначе preventDefault не сработает и страницу утащит браузерный зум.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let pinch = null   // данные текущего щипка (все — на момент его начала)
    let ratio = 1      // множитель поверх зафиксированного зума
    let raf = 0
    let lastTap = 0

    // Одно применение кадра щипка. Тяжёлого тут нет: transform композитится GPU,
    // а прокрутку двигаем сами (двумя пальцами страница браузером не листается).
    const applyPinch = () => {
      raf = 0
      if (!pinch) return
      const pages = pagesRef.current
      ratio = clampZoom(pinch.committed * (pinch.dist / pinch.startDist)) / pinch.committed
      pages.style.transform = `scale(${ratio})`
      host.scrollLeft = (pinch.sl0 + pinch.ox) * ratio - pinch.ox
      pageScroller().scrollTop = pinch.ps0 + (pinch.fy - pinch.pt0) * (ratio - 1)
    }

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]]
        const hostRect = host.getBoundingClientRect()
        const pagesRect = pagesRef.current.getBoundingClientRect()
        const fx = (a.clientX + b.clientX) / 2
        const fy = (a.clientY + b.clientY) / 2
        pinch = {
          committed: zoomRef.current,
          startDist: touchDist(a, b) || 1,
          dist: touchDist(a, b) || 1,
          ox: fx - hostRect.left,          // фокус относительно левого края области
          fy,                              // фокус по экрану (для вертикали)
          pt0: pagesRect.top,              // верх страниц на старте
          sl0: host.scrollLeft,            // внутренняя гор. прокрутка на старте
          ps0: pageScroller().scrollTop,   // прокрутка страницы на старте
        }
        ratio = 1
        pagesRef.current.style.willChange = 'transform'
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
      pinch.dist = touchDist(e.touches[0], e.touches[1]) || pinch.dist
      if (!raf) raf = requestAnimationFrame(applyPinch)
    }

    const endPinch = () => {
      if (!pinch) return
      const pages = pagesRef.current
      if (raf) { cancelAnimationFrame(raf); raf = 0 }
      const newZoom = clampZoom(pinch.committed * ratio)
      pinch = null
      // Ширину применяем синхронно и в том же кадре снимаем transform: визуальный
      // размер до и после совпадает (ширина·1 == committed·ratio), прокрутку в
      // applyPinch мы уже выставили под этот размер — поэтому шва не видно.
      flushSync(() => setZoom(newZoom))
      pages.style.transform = ''
      pages.style.willChange = ''
    }

    const onTouchEnd = (e) => {
      if (pinch && e.touches.length < 2) endPinch()
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
      if (raf) cancelAnimationFrame(raf)
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
          // Следим только за шириной. Высота просмотрщика задаётся документом,
          // поэтому на неё реагировать нельзя: отрисовка меняла бы высоту,
          // наблюдатель дёргал бы отрисовку заново.
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
