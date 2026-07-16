import { useState, useEffect } from 'react'
import Sheet from './Sheet.jsx'
import Icon from './Icon.jsx'
import { makeQR } from '../utils.js'

const empty = { id: '', label: '', fio: '', iban: '', bik: '', bank: '', kbe: '', purpose: '' }

function ReqForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const valid = f.fio.trim() && f.iban.trim()
  return (
    <>
      <div className="field">
        <label>Название реквизитов</label>
        <input value={f.label} onChange={set('label')} placeholder="Напр. Зарплатная карта" />
      </div>
      <div className="field">
        <label>ФИО получателя *</label>
        <input value={f.fio} onChange={set('fio')} placeholder="Иванов Иван" />
      </div>
      <div className="field">
        <label>IBAN (номер счёта) *</label>
        <input value={f.iban} onChange={set('iban')} placeholder="KZ00 0000 0000 0000 0000" />
      </div>
      <div className="field">
        <label>БИК банка</label>
        <input value={f.bik} onChange={set('bik')} placeholder="CASPKZKA" />
      </div>
      <div className="field">
        <label>Наименование банка</label>
        <input value={f.bank} onChange={set('bank')} placeholder="АО «Kaspi Bank»" />
      </div>
      <div className="field">
        <label>КБе</label>
        <input value={f.kbe} onChange={set('kbe')} placeholder="19" inputMode="numeric" />
      </div>
      <div className="field">
        <label>Назначение платежа</label>
        <textarea rows={2} value={f.purpose} onChange={set('purpose')} placeholder="Необязательно" />
      </div>
      <button className="btn" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}
        onClick={() => onSave(f)}>Сохранить</button>
      <button className="btn ghost mt8" onClick={onCancel}>Отмена</button>
    </>
  )
}

function ReqQR({ req, onClose }) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    const payload = `Получатель: ${req.fio}\nIBAN: ${req.iban}\nБИК: ${req.bik}\nБанк: ${req.bank}`
    makeQR(payload).then(setQr)
  }, [req])
  return (
    <Sheet title="QR с реквизитами" onClose={onClose}>
      <div className="qr-box">{qr ? <img src={qr} alt="QR" /> : <div className="muted">Генерация…</div>}</div>
      <div className="muted" style={{ textAlign: 'center', fontSize: 13 }}>
        Отсканируйте, чтобы получить реквизиты для перевода
      </div>
    </Sheet>
  )
}

export default function Requisites({ requisites, setRequisites }) {
  const [editing, setEditing] = useState(null) // req object or 'new'
  const [qrReq, setQrReq] = useState(null)
  const [copied, setCopied] = useState('')

  const saveReq = (f) => {
    if (f.id) {
      setRequisites(requisites.map((r) => (r.id === f.id ? f : r)))
    } else {
      setRequisites([...requisites, { ...f, id: 'r' + Date.now() }])
    }
    setEditing(null)
  }

  const remove = (id) => setRequisites(requisites.filter((r) => r.id !== id))

  const copyAll = (r) => {
    const text = `Получатель: ${r.fio}\nIBAN: ${r.iban}\nБИК: ${r.bik}\nБанк: ${r.bank}\nКБе: ${r.kbe}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(r.id)
      setTimeout(() => setCopied(''), 1500)
    }).catch(() => {})
  }

  return (
    <div>
      <div className="row-between" style={{ marginTop: 8 }}>
        <div className="section-title" style={{ margin: 0 }}>Реквизиты</div>
        <button className="btn secondary small" onClick={() => setEditing({ ...empty })}>＋ Добавить</button>
      </div>
      <div className="muted" style={{ fontSize: 13, margin: '4px 2px 12px' }}>
        Заполняйте и сохраняйте реквизиты для переводов
      </div>

      {requisites.length === 0 && (
        <div className="card muted" style={{ textAlign: 'center' }}>Пока нет сохранённых реквизитов</div>
      )}

      {requisites.map((r) => (
        <div className="card" key={r.id} style={{ marginBottom: 12 }}>
          <div className="row-between">
            <b>{r.label || 'Без названия'}</b>
            <span className="pill">КБе {r.kbe || '—'}</span>
          </div>
          <div className="mt8">
            <div className="req-line"><span className="k">Получатель</span><span className="v">{r.fio}</span></div>
            <div className="req-line"><span className="k">IBAN</span><span className="v">{r.iban}</span></div>
            <div className="req-line"><span className="k">БИК</span><span className="v">{r.bik || '—'}</span></div>
            <div className="req-line"><span className="k">Банк</span><span className="v">{r.bank || '—'}</span></div>
            {r.purpose && <div className="req-line"><span className="k">Назначение</span><span className="v">{r.purpose}</span></div>}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="btn ghost small" onClick={() => copyAll(r)}>
              {copied === r.id ? <><Icon name="check" size={15} /> Скопировано</> : <><Icon name="copy" size={15} /> Копировать</>}
            </button>
            <button className="btn ghost small" onClick={() => setQrReq(r)}><Icon name="qr" size={15} /> QR</button>
            <button className="btn ghost small" onClick={() => setEditing(r)}>Изменить</button>
            <button className="btn ghost small" style={{ color: 'var(--red)' }} onClick={() => remove(r.id)}>Удалить</button>
          </div>
        </div>
      ))}

      {editing && (
        <Sheet title={editing.id ? 'Изменить реквизиты' : 'Новые реквизиты'} onClose={() => setEditing(null)}>
          <ReqForm initial={editing} onSave={saveReq} onCancel={() => setEditing(null)} />
        </Sheet>
      )}
      {qrReq && <ReqQR req={qrReq} onClose={() => setQrReq(null)} />}
    </div>
  )
}
