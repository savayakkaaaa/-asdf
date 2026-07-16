import { useMemo, useState } from 'react'
import Sheet from './Sheet.jsx'
import Icon from './Icon.jsx'
import { fmt, fmtSigned, fmtDate } from '../utils.js'
import { budgetCategories, catMeta } from '../data.js'

function KaspiCard({ acc, onManage }) {
  return (
    <div className={'kcard ' + acc.variant} onClick={() => onManage(acc)}>
      <div className="kc-top">
        <span className="kc-brand">{acc.name}</span>
        <span className="kc-sys">{acc.system}</span>
      </div>
      <div>
        <div className="kc-balance">{fmt(acc.balance)} ₸</div>
        <div className="kc-number">•••• {acc.number}</div>
      </div>
      {acc.blocked && (
        <div className="kc-blocked"><Icon name="lock" size={18} /> Заблокирована</div>
      )}
    </div>
  )
}

function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let acc = 0
  const R = 42, C = 2 * Math.PI * R
  return (
    <svg width="112" height="112" viewBox="0 0 112 112">
      <circle cx="56" cy="56" r={R} fill="none" stroke="#EEF0F2" strokeWidth="13" />
      {data.map((d, i) => {
        const frac = d.value / total
        const dash = frac * C
        const el = (
          <circle key={i} cx="56" cy="56" r={R} fill="none" stroke={d.color} strokeWidth="13"
            strokeLinecap="round" strokeDasharray={`${Math.max(dash - 2, 0)} ${C - dash + 2}`}
            strokeDashoffset={-acc * C} transform="rotate(-90 56 56)" />
        )
        acc += frac
        return el
      })}
      <text x="56" y="52" textAnchor="middle" fontSize="10" fill="#9A9DA3">Траты</text>
      <text x="56" y="69" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1F2124">{fmt(total / 1000)}к ₸</text>
    </svg>
  )
}

export default function Bank({ accounts, transactions, updateAccount }) {
  const [manage, setManage] = useState(null)
  const [showAllTx, setShowAllTx] = useState(false)
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)

  const spendByCat = useMemo(() => {
    const map = {}
    transactions.filter((t) => t.amount < 0).forEach((t) => {
      const cat = budgetCategories.find((c) => c.key === t.category) ? t.category : 'Прочее'
      map[cat] = (map[cat] || 0) + Math.abs(t.amount)
    })
    return map
  }, [transactions])

  const donutData = budgetCategories
    .map((c) => ({ color: c.color, value: spendByCat[c.key] || 0, key: c.key }))
    .filter((d) => d.value > 0)

  const txList = showAllTx ? transactions : transactions.slice(0, 6)
  const actions = [
    { icon: 'transfer', label: 'Перевести' },
    { icon: 'qr', label: 'Оплатить' },
    { icon: 'topup', label: 'Пополнить' },
    { icon: 'doc', label: 'Счета' },
  ]

  return (
    <div>
      <div className="section-title small">Всего на счетах</div>
      <div className="hero-balance">{fmt(totalBalance)} ₸</div>

      <div className="cards-scroll">
        {accounts.map((a) => <KaspiCard key={a.id} acc={a} onManage={setManage} />)}
      </div>

      <div className="quick">
        {actions.map((a) => (
          <button key={a.label}><span className="qi"><Icon name={a.icon} /></span>{a.label}</button>
        ))}
      </div>

      <div className="section-title">Анализ расходов</div>
      <div className="card">
        <div className="donut-wrap">
          <Donut data={donutData} />
          <div className="legend">
            {donutData.length === 0 && <div className="muted">Пока нет трат за период</div>}
            {donutData.map((d) => (
              <div className="lg" key={d.key}>
                <span className="dot" style={{ background: d.color }} />
                <span style={{ flex: 1 }}>{d.key}</span>
                <b>{fmt(d.value)} ₸</b>
              </div>
            ))}
          </div>
        </div>
        <div className="mt16">
          {budgetCategories.map((c) => {
            const spent = spendByCat[c.key] || 0
            const pct = Math.min(100, Math.round((spent / c.limit) * 100))
            const over = spent > c.limit
            return (
              <div className="budget-row" key={c.key}>
                <div className="br-top">
                  <span className="cat"><span className="dot" style={{ background: c.color }} />{c.key}</span>
                  <span style={{ color: over ? 'var(--red)' : 'var(--muted)' }}>{fmt(spent)} / {fmt(c.limit)} ₸</span>
                </div>
                <div className="bar"><span style={{ width: pct + '%', background: over ? 'var(--red)' : c.color }} /></div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section-title">История операций</div>
      <div className="rows pad">
        {txList.map((t) => {
          const m = catMeta(t.category)
          return (
            <div className="rowi" key={t.id}>
              <span className="ic" style={{ background: m.tint, color: m.color }}>
                <Icon name={t.amount > 0 ? 'arrowDown' : m.icon} size={20} />
              </span>
              <div className="meta">
                <div className="l1">{t.title}</div>
                <div className="l2">{t.category} · {fmtDate(t.date)}</div>
              </div>
              <div className={'amt' + (t.amount > 0 ? ' pos' : '')}>{fmtSigned(t.amount)}</div>
            </div>
          )
        })}
      </div>
      {transactions.length > 6 && (
        <button className="btn ghost mt12" onClick={() => setShowAllTx((v) => !v)}>
          {showAllTx ? 'Свернуть' : `Показать все операции (${transactions.length})`}
        </button>
      )}

      {manage && (
        <CardManage acc={manage} onClose={() => setManage(null)}
          onSave={(patch) => { updateAccount(manage.id, patch); setManage((m) => ({ ...m, ...patch })) }} />
      )}
    </div>
  )
}

function CardManage({ acc, onClose, onSave }) {
  const [limit, setLimit] = useState(acc.limitPerDay)
  return (
    <Sheet title={acc.name} onClose={onClose}>
      <div className={'kcard ' + acc.variant} style={{ marginBottom: 18 }}>
        <div className="kc-top"><span className="kc-brand">{acc.name}</span><span className="kc-sys">{acc.system}</span></div>
        <div>
          <div className="kc-balance">{fmt(acc.balance)} ₸</div>
          <div className="kc-number">•••• {acc.number}</div>
        </div>
      </div>

      <div className="row-between" style={{ padding: '8px 0' }}>
        <div>
          <div style={{ fontWeight: 600 }}>Блокировка карты</div>
          <div className="muted" style={{ fontSize: 12.5 }}>Мгновенно заморозить операции</div>
        </div>
        <button className={'toggle' + (acc.blocked ? ' on' : '')} onClick={() => onSave({ blocked: !acc.blocked })} aria-label="Блокировка" />
      </div>

      <div className="field mt12">
        <label>Дневной лимит операций, ₸</label>
        <input inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))} />
      </div>
      <button className="btn" onClick={() => { onSave({ limitPerDay: Number(limit) || 0 }); onClose() }}>Сохранить лимит</button>
      <div className="hint mt12">Демо: изменения хранятся только в вашем браузере</div>
    </Sheet>
  )
}
