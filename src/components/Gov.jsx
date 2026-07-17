import { useState } from 'react'
import Sheet from './Sheet.jsx'
import Icon from './Icon.jsx'
import { fmt } from '../utils.js'
import { govServices, govCategories } from '../data.js'

/* Заставка eGov + Kaspi: показывается при загрузке документа и исчезает сама */
function EgovSplash() {
  return (
    <div className="egov-splash">
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
  const [tab, setTab] = useState(doc.fileData || doc.file ? 'doc' : 'req')
  const [file, setFile] = useState(doc.file || '')
  const [fileData, setFileData] = useState(doc.fileData || '')
  const [f, setF] = useState(doc.req || { fio: '', iin: '', birth: '', num: '', issued: '', expires: '' })
  const hasData = Object.values(doc.req || {}).some((v) => v)
  const [editing, setEditing] = useState(!hasData)
  const [copied, setCopied] = useState('')
  const [savedOk, setSavedOk] = useState(false)
  const [reading, setReading] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const onPickFile = (e) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked.name)
    setSavedOk(false)
    if (picked.type.startsWith('image/')) {
      setReading(true)
      const reader = new FileReader()
      reader.onload = () => {
        setFileData(String(reader.result || ''))
        setReading(false)
      }
      reader.onerror = () => {
        setFileData('')
        setReading(false)
      }
      reader.readAsDataURL(picked)
    } else {
      setFileData('')
      setReading(false)
    }
  }

  const save = () => {
    onSave({
      file,
      fileData: fileData || undefined,
      req: f,
      status: file || hasData || Object.values(f).some(Boolean) ? 'На проверке' : doc.status,
    })
    setEditing(false)
    setSavedOk(true)
  }

  const copy = (k, v) => {
    if (!v) return
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
        <button type="button" className={tab === 'doc' ? 'on' : ''} onClick={() => setTab('doc')}>Документ</button>
        <button type="button" className={tab === 'req' ? 'on' : ''} onClick={() => setTab('req')}>Реквизиты</button>
      </div>

      {tab === 'doc' ? (
        <div className="doc-body">
          {fileData ? (
            <div className="doc-preview">
              <img src={fileData} alt={file || 'Документ'} />
            </div>
          ) : file ? (
            <div className="doc-file-card">
              <Icon name="doc" size={28} />
              <div>
                <div className="l1">{file}</div>
                <div className="l2">Файл выбран</div>
              </div>
            </div>
          ) : null}

          <label className="filepick">
            <span className="choose">{file ? 'Заменить файл' : 'Выбрать файл'}</span>
            <span className="fname">{file || 'файл не выбран'}</span>
            <input type="file" accept="image/*,.pdf" onChange={onPickFile} />
          </label>
          <div className="hint mt16">Демо: файл хранится только в этом браузере.</div>
          <button type="button" className="btn-black mt16" onClick={save} disabled={reading || (!file && !fileData)}>
            {reading ? 'Загрузка…' : <>Сохранить <Icon name="check" size={16} /></>}
          </button>
          {savedOk && <div className="hint mt12" style={{ color: 'var(--green)' }}>Сохранено</div>}
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
          <button type="button" className="btn-black mt16" onClick={save}>Сохранить <span style={{ fontSize: 17 }}>→</span></button>
          {savedOk && <div className="hint mt12" style={{ color: 'var(--green)' }}>Сохранено</div>}
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
                type="button"
                className={'rv-copy' + (copied === k ? ' done' : '')}
                onClick={() => copy(k, f[k])}
                aria-label={'Копировать: ' + label}
              >
                <Icon name={copied === k ? 'check' : 'copy'} size={19} />
              </button>
            </div>
          ))}
          <button type="button" className="btn ghost small mt12" onClick={() => setEditing(true)}>Изменить</button>
          <div className="doc-foot">
            <button type="button" className="btn-blue" onClick={shareAll}>
              <Icon name="share" size={18} /> Отправить реквизиты
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Gov({ documents, addDocument, updateDocument }) {
  const [loadingDoc, setLoadingDoc] = useState(null)
  const [detail, setDetail] = useState(null)
  const [service, setService] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [mainTab, setMainTab] = useState('all') // all | apps
  const [cat, setCat] = useState('popular')
  const [q, setQ] = useState('')
  const [allDocs, setAllDocs] = useState(false)

  const openDoc = (id) => {
    setLoadingDoc(id)
    setTimeout(() => {
      setLoadingDoc(null)
      setDetail(id)
    }, 1600)
  }

  if (loadingDoc) return <EgovSplash />
  if (detail) {
    const doc = documents.find((d) => d.id === detail)
    if (!doc) return null
    return (
      <DocDetail
        key={doc.id}
        doc={doc}
        onClose={() => setDetail(null)}
        onSave={(patch) => updateDocument(doc.id, patch)}
      />
    )
  }

  if (allDocs) {
    return (
      <div className="gov-page">
        <button type="button" className="gov-linkback" onClick={() => setAllDocs(false)}>
          <Icon name="chevron" size={18} style={{ transform: 'scaleX(-1)' }} /> К госуслугам
        </button>
        <div className="section-title" style={{ marginTop: 8 }}>Все документы</div>
        <div className="rows pad mt12">
          {documents.map((d) => (
            <div className="rowi" key={d.id} onClick={() => openDoc(d.id)}>
              <span className="ic" style={{ background: d.color, color: d.accent || '#fff' }}><Icon name={d.icon} size={20} /></span>
              <div className="meta"><div className="l1">{d.title}</div><div className="l2">{d.subtitle}</div></div>
              <span className="chev"><Icon name="chevron" size={18} /></span>
            </div>
          ))}
        </div>
        <button type="button" className="btn secondary mt16" onClick={() => setAddOpen(true)}>＋ Добавить документ</button>
        {addOpen && (
          <Sheet title="Новый документ" onClose={() => setAddOpen(false)}>
            <div className="field">
              <label>Название документа</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Напр. Диплом об образовании" />
            </div>
            <button className="btn mt12" onClick={() => {
              if (!newTitle.trim()) return
              const id = 'd' + Date.now()
              addDocument({ id, title: newTitle.trim(), subtitle: 'Загружено пользователем', icon: 'doc', status: 'Нет данных', color: '#7B61FF', accent: '#fff', added: new Date().toISOString().slice(0, 10) })
              setNewTitle('')
              setAddOpen(false)
              openDoc(id)
            }}>Продолжить</button>
          </Sheet>
        )}
      </div>
    )
  }

  const filtered = govServices.filter((s) => {
    const inCat = (s.cats || [s.cat]).includes(cat)
    const qq = q.trim().toLowerCase()
    const inQ = !qq || s.title.toLowerCase().includes(qq) || (s.subtitle || '').toLowerCase().includes(qq)
    return inCat && inQ
  })

  const carousel = documents.slice(0, 3)

  return (
    <div className="gov-page">
      <div className="gov-tabs">
        <button type="button" className={mainTab === 'all' ? 'on' : ''} onClick={() => setMainTab('all')}>Все услуги</button>
        <button type="button" className={mainTab === 'apps' ? 'on' : ''} onClick={() => setMainTab('apps')}>Мои заявки</button>
      </div>

      {mainTab === 'apps' ? (
        <div className="gov-empty">
          <span className="gov-empty-ic"><Icon name="doc" size={32} /></span>
          <div className="stub-title" style={{ fontSize: 17 }}>Заявок пока нет</div>
          <div className="muted" style={{ textAlign: 'center' }}>Здесь появятся ваши обращения в госуслуги</div>
        </div>
      ) : (
        <>
          <div className="gov-search" role="search">
            <Icon name="search" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по Госуслугам"
              aria-label="Поиск по Госуслугам"
            />
          </div>

          <div className="gov-docs-scroll">
            {carousel.map((d) => (
              <button type="button" className="gov-doc-card" key={d.id} style={{ background: d.color, color: d.accent || '#fff' }} onClick={() => openDoc(d.id)}>
                <span className="gdc-icon"><Icon name={d.icon} size={34} stroke={1.6} /></span>
                <span className="gdc-title">{d.title}</span>
              </button>
            ))}
          </div>
          <button type="button" className="gov-all-docs" onClick={() => setAllDocs(true)}>
            Все документы <Icon name="chevron" size={16} />
          </button>

          <div className="gov-cats">
            {govCategories.map((c) => (
              <button type="button" key={c.id} className={'gov-cat' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>
                <span className="gc-ic" style={{ color: c.color }}><Icon name={c.icon} size={26} stroke={1.7} /></span>
                <span className="gc-label">{c.label}</span>
              </button>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 18 }}>
            {cat === 'popular' ? 'Популярные и новые' : govCategories.find((c) => c.id === cat)?.label}
          </div>
          <div className="gov-list">
            {filtered.length === 0 && <div className="hint mt16">Ничего не найдено</div>}
            {filtered.map((s) => (
              <button type="button" className="gov-row" key={s.id} onClick={() => setService(s)}>
                <span className="gr-ic" style={{ color: s.color }}><Icon name={s.icon} size={24} stroke={1.7} /></span>
                <span className="gr-meta">
                  <span className="gr-title">
                    {s.title}
                    {s.badge && <span className="gr-new">{s.badge}</span>}
                  </span>
                  {s.subtitle && <span className="gr-sub">{s.subtitle}</span>}
                </span>
                <span className="chev"><Icon name="chevron" size={18} /></span>
              </button>
            ))}
          </div>
        </>
      )}

      {service && (
        <Sheet title={service.title} onClose={() => setService(null)}>
          <div className="rowi" style={{ borderBottom: 'none' }}>
            <span className="ic" style={{ background: '#FDECEA', color: service.color }}><Icon name={service.icon} size={20} /></span>
            <div className="meta"><div className="l1">{service.title}</div>{service.subtitle && <div className="l2">{service.subtitle}</div>}</div>
          </div>
          <div className="req-line mt12">
            <span className="k">{service.fee > 0 ? 'Госпошлина' : 'Стоимость'}</span>
            <span className="v">{service.fee > 0 ? fmt(service.fee) + ' ₸' : 'Бесплатно'}</span>
          </div>
          <button className="btn mt16" onClick={() => { alert('Демо: заявление подано (имитация)'); setService(null) }}>
            {service.fee > 0 ? 'Оплатить и подать' : 'Подать заявление'}
          </button>
          <div className="hint mt12">Демонстрация интерфейса. Реальная оплата не производится.</div>
        </Sheet>
      )}
    </div>
  )
}
