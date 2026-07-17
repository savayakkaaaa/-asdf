import { useState, useEffect } from 'react'
import Sheet from './Sheet.jsx'
import Icon from './Icon.jsx'
import { fmt, makeQR } from '../utils.js'
import { govServices } from '../data.js'

/* Заставка eGov + Kaspi: показывается при загрузке документа и исчезает сама */
function EgovSplash({ onClose }) {
  return (
    <div className="egov-splash">
      <div className="egov-top">
        <button className="egov-x" onClick={onClose} aria-label="Закрыть">×</button>
      </div>
      <div className="egov-center">
        <div>
          <div className="egov-logos">
            <span className="egov-logo">e<b>Gov</b></span>
            <span className="egov-plus">+</span>
            <span className="kaspi-mark"><Icon name="user" size={30} stroke={2} /></span>
          </div>
          <div className="spinner" />
          <div className="egov-loadcap">Загружаем документ…</div>
        </div>
      </div>
      <div className="egov-foot">При поддержке Министерства<br />цифрового развития</div>
    </div>
  )
}

/* Документ: вкладки Документ / Реквизиты (как в видео) */
const REQ_FIELDS = [
  { k: 'fio', label: 'ФИО', kind: 'text' },
  { k: 'iin', label: 'ИИН', kind: 'text', numeric: true },
  { k: 'birth', label: 'Дата рождения', kind: 'date' },
  { k: 'num', label: 'Номер документа', kind: 'text' },
  { k: 'issued', label: 'Дата выдачи', kind: 'date' },
  { k: 'expires', label: 'Срок действия', kind: 'date' },
]

function DocDetail({ doc, onClose, onSave }) {
  const [tab, setTab] = useState('req')
  const [file, setFile] = useState(doc.file || '')
  const [f, setF] = useState(doc.req || { fio: '', iin: '', birth: '', num: '', issued: '', expires: '' })
  const hasData = Object.values(doc.req || {}).some((v) => v)
  const [editing, setEditing] = useState(!hasData)
  const [copied, setCopied] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const save = () => {
    onSave({ file, req: f, status: 'На проверке' })
    setEditing(false)
  }

  const copy = (k, v) => {
    navigator.clipboard?.writeText(v).then(() => {
      setCopied(k)
      setTimeout(() => setCopied(''), 1200)
    }).catch(() => {})
  }

  const shareAll = () => {
    const text = REQ_FIELDS.filter(({ k }) => f[k]).map(({ k, label }) => `${label}: ${f[k]}`).join('\n')
    if (navigator.share) navigator.share({ title: doc.title, text }).catch(() => {})
    else { navigator.clipboard?.writeText(text).catch(() => {}); alert('Реквизиты скопированы (демо)') }
  }

  return (
    <div className="doc-screen">
      <div className="doc-head">
        <button className="doc-back" onClick={onClose} aria-label="Назад"><Icon name="chevron" size={22} style={{ transform: 'scaleX(-1)' }} /></button>
        <div className="doc-title">{doc.title}</div>
        <span style={{ width: 22 }} />
      </div>

      <div className="segmented">
        <button className={tab === 'doc' ? 'on' : ''} onClick={() => setTab('doc')}>Документ</button>
        <button className={tab === 'req' ? 'on' : ''} onClick={() => setTab('req')}>Реквизиты</button>
      </div>

      {tab === 'doc' ? (
        <div className="doc-body">
          <label className="filepick">
            <span className="choose">Choose File</span>
            <span className="fname">{file || 'no file selected'}</span>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0]?.name || '')} />
          </label>
          <div className="hint mt16">Демо: файл не загружается на сервер.</div>
          <button className="btn-black mt16" onClick={save}>Сохранить <Icon name="check" size={16} /></button>
        </div>
      ) : editing ? (
        <div className="doc-body">
          {REQ_FIELDS.map(({ k, label, kind, numeric }) =>
            kind === 'date' ? (
              <div className="dateline" key={k}>
                <label>{label}</label>
                <input value={f[k]} onChange={set(k)} placeholder="dd/mm/yyyy" inputMode="numeric" />
              </div>
            ) : (
              <div className="outl" key={k}>
                <label>{label}</label>
                <input value={f[k]} onChange={set(k)} inputMode={numeric ? 'numeric' : undefined} />
              </div>
            )
          )}
          <button className="btn-black mt16" onClick={save}>Сохранить <span style={{ fontSize: 17 }}>→</span></button>
        </div>
      ) : (
        <div className="doc-body">
          {REQ_FIELDS.map(({ k, label }) => (
            <div className="req-view-row" key={k}>
              <div className="rv-meta">
                <div className="rv-k">{label}</div>
                <div className="rv-v">{f[k] || '—'}</div>
              </div>
              <button
                className={'rv-copy' + (copied === k ? ' done' : '')}
                onClick={() => copy(k, f[k])}
                aria-label={'Копировать: ' + label}
              >
                <Icon name={copied === k ? 'check' : 'copy'} size={19} />
              </button>
            </div>
          ))}
          <button className="btn ghost small mt12" onClick={() => setEditing(true)}>Изменить</button>
          <div className="doc-foot">
            <button className="btn-blue" onClick={shareAll}>
              <Icon name="share" size={18} /> Отправить реквизиты
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DocQR({ doc, onClose }) {
  const [qr, setQr] = useState('')
  useEffect(() => { makeQR(`kaspi-demo://document/${doc.id}`).then(setQr) }, [doc])
  return (
    <Sheet title={doc.title} onClose={onClose}>
      <div className="qr-box">{qr ? <img src={qr} alt="QR" /> : <div className="muted">Генерация…</div>}</div>
      <div className="hint">Покажите QR для подтверждения документа</div>
      <div className="hint mt12">Демо-документ. Не является действительным удостоверением.</div>
    </Sheet>
  )
}

export default function Gov({ documents, addDocument, updateDocument }) {
  const [loadingDoc, setLoadingDoc] = useState(null) // id документа, который «грузится» через eGov
  const [detail, setDetail] = useState(null)
  const [qrDoc, setQrDoc] = useState(null)
  const [service, setService] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  // Выбор документа: заставка eGov со спиннером ~1.6с, затем сам документ
  const openDoc = (id) => {
    setLoadingDoc(id)
    setTimeout(() => {
      setLoadingDoc(null)
      setDetail(id)
    }, 1600)
  }

  if (loadingDoc) return <EgovSplash onClose={() => setLoadingDoc(null)} />
  if (detail) {
    const doc = documents.find((d) => d.id === detail) || detail
    return <DocDetail doc={doc} onClose={() => setDetail(null)} onSave={(patch) => updateDocument(doc.id, patch)} />
  }

  const submitDoc = () => {
    if (!newTitle.trim()) return
    const id = 'd' + Date.now()
    addDocument({ id, title: newTitle.trim(), subtitle: 'Загружено пользователем', icon: 'doc', status: 'Нет данных', color: '#7B61FF', added: new Date().toISOString().slice(0, 10) })
    setNewTitle('')
    setAddOpen(false)
    openDoc(id)
  }

  return (
    <div>
      <div className="card row-between" style={{ marginTop: 8 }}>
        <div>
          <span className="egov-badge"><Icon name="shield" size={14} /> eGov + Kaspi</span>
          <div className="muted mt8" style={{ fontSize: 13 }}>Государственные услуги прямо в приложении</div>
        </div>
        <span style={{ color: '#2B7DE9' }}><Icon name="gov" size={30} stroke={1.6} /></span>
      </div>

      <div className="row-between" style={{ marginTop: 22 }}>
        <div className="section-title" style={{ margin: 0 }}>Цифровые документы</div>
        <button className="btn secondary small" onClick={() => setAddOpen(true)}>＋ Добавить</button>
      </div>
      <div className="doc-grid mt12">
        {documents.map((d) => (
          <div className="doc-card" style={{ background: d.color }} key={d.id} onClick={() => openDoc(d.id)}>
            <div className="dc-top">
              <Icon name={d.icon} size={24} stroke={1.7} />
              <span className="dc-status">{d.status}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.25 }}>{d.title}</div>
              <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>{d.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Услуги и пошлины</div>
      <div className="rows pad">
        {govServices.map((s) => (
          <div className="rowi" key={s.id} onClick={() => setService(s)}>
            <span className="ic" style={{ background: '#F4F5F7', color: s.color }}><Icon name={s.icon} size={20} /></span>
            <div className="meta"><div className="l1">{s.title}</div><div className="l2">{s.subtitle}</div></div>
            <span className="fee" style={{ color: s.fee > 0 ? 'var(--ink)' : 'var(--green)' }}>{s.fee > 0 ? fmt(s.fee) + ' ₸' : 'Бесплатно'}</span>
            <span className="chev"><Icon name="chevron" size={18} /></span>
          </div>
        ))}
      </div>

      {qrDoc && <DocQR doc={qrDoc} onClose={() => setQrDoc(null)} />}

      {addOpen && (
        <Sheet title="Новый документ" onClose={() => setAddOpen(false)}>
          <div className="field">
            <label>Название документа</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Напр. Диплом об образовании" />
          </div>
          <button className="btn mt12" onClick={submitDoc}>Продолжить</button>
        </Sheet>
      )}

      {service && (
        <Sheet title={service.title} onClose={() => setService(null)}>
          <div className="rowi" style={{ borderBottom: 'none' }}>
            <span className="ic" style={{ background: '#F4F5F7', color: service.color }}><Icon name={service.icon} size={20} /></span>
            <div className="meta"><div className="l1">{service.title}</div><div className="l2">{service.subtitle}</div></div>
          </div>
          <div className="req-line mt12"><span className="k">{service.fee > 0 ? 'Госпошлина' : 'Стоимость'}</span>
            <span className="v">{service.fee > 0 ? fmt(service.fee) + ' ₸' : 'Бесплатно'}</span></div>
          <button className="btn mt16" onClick={() => { alert('Демо: заявление подано (имитация)'); setService(null) }}>
            {service.fee > 0 ? 'Оплатить и подать' : 'Подать заявление'}
          </button>
          <div className="hint mt12">Демонстрация интерфейса. Реальная оплата не производится.</div>
        </Sheet>
      )}
    </div>
  )
}
