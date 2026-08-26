import { useEffect, useState } from 'react'
import DocArt from './DocArt.jsx'
import pdfjs from '../pdf.js'
import { loadDocBlob } from '../utils.js'

// Карточка 132px шириной; берём вдвое больше под экраны с dpr 2
const THUMB_W = 264

/** Первая страница PDF -> компактный JPEG-dataURL. */
async function pdfCover(url) {
  const doc = await pdfjs.getDocument({ url, withCredentials: false }).promise
  try {
    const page = await doc.getPage(1)
    const base = page.getViewport({ scale: 1 })
    const viewport = page.getViewport({ scale: THUMB_W / base.width })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    await page.render({
      canvasContext: canvas.getContext('2d', { alpha: false }),
      viewport,
    }).promise
    return canvas.toDataURL('image/jpeg', 0.72)
  } finally {
    try { doc.destroy() } catch { /* ignore */ }
  }
}

/** Карточка документа: реальное превью загруженного файла,
 *  а пока файла нет — схематичная рисованная обложка. */
export default function GovDocCard({ doc, onOpen }) {
  const [thumb, setThumb] = useState('')

  useEffect(() => {
    let alive = true
    let objectUrl = ''

    const revoke = () => {
      if (objectUrl && objectUrl.startsWith('blob:')) URL.revokeObjectURL(objectUrl)
      objectUrl = ''
    }

    setThumb('')
    loadDocBlob(doc.id)
      .then(async (stored) => {
        if (!alive || !stored) return
        objectUrl = stored.url
        if (stored.kind === 'pdf') {
          const cover = await pdfCover(stored.url)
          revoke() // dataURL самодостаточен, blob больше не нужен
          if (alive) setThumb(cover)
          else return
        } else if (alive) {
          setThumb(stored.url) // blob живёт до размонтирования
        }
      })
      .catch(() => { /* нет превью — останется рисованная обложка */ })

    return () => {
      alive = false
      revoke()
    }
  }, [doc.id])

  return (
    <button
      type="button"
      className={'gov-doc-card' + (thumb ? ' has-thumb' : '')}
      onClick={() => onOpen(doc.id)}
    >
      {thumb
        ? <img className="gdc-thumb" src={thumb} alt="" />
        : <DocArt icon={doc.icon} color={doc.color} />}
      <span className="gdc-title">{doc.title}</span>
    </button>
  )
}
