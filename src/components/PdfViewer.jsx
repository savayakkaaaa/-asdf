import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

/** Рендер PDF в canvas — работает на iOS/Android, в отличие от iframe. */
export default function PdfViewer({ url }) {
  const hostRef = useRef(null)
  const pagesRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    if (!url) return
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
        const scale = (width / base.width) * dpr
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
          ro = new ResizeObserver(() => {
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
      />
    </div>
  )
}
