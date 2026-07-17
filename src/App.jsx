import { useEffect, useState } from 'react'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Bank from './components/Bank.jsx'
import Gov from './components/Gov.jsx'
import Requisites from './components/Requisites.jsx'
import Sheet from './components/Sheet.jsx'
import Icon from './components/Icon.jsx'
import { load, save, makeQR } from './utils.js'
import {
  demoUser, initialAccounts, initialTransactions, initialDocuments, initialRequisites, homeGrid,
} from './data.js'

const BOTTOM = [
  { key: 'home', label: 'Главная', icon: 'home' },
  { key: 'qr', label: 'Kaspi QR', icon: 'qr' },
  { key: 'messages', label: 'Сообщения', icon: 'chat' },
  { key: 'services', label: 'Сервисы', icon: 'menu' },
]
const TITLES = {
  bank: 'Мой Банк', gov: 'Госуслуги', payments: 'Платежи', transfers: 'Переводы',
  shop: 'Магазин', travel: 'Kaspi Travel', ads: 'Объявления', magnum: 'Magnum', jobs: 'Работа',
}

export default function App() {
  const [authed, setAuthed] = useState(() => load('authed', false))
  const [view, setView] = useState('home')

  const [accounts, setAccounts] = useState(() => load('accounts', initialAccounts))
  const [transactions] = useState(() => load('transactions', initialTransactions))
  const [documents, setDocuments] = useState(() => load('documents', initialDocuments))
  const [requisites, setRequisites] = useState(() => load('requisites', initialRequisites))

  useEffect(() => save('authed', authed), [authed])
  useEffect(() => save('accounts', accounts), [accounts])
  useEffect(() => save('documents', documents), [documents])
  useEffect(() => save('requisites', requisites), [requisites])

  const updateAccount = (id, patch) => setAccounts((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const addDocument = (doc) => setDocuments((p) => [doc, ...p])
  const updateDocument = (id, patch) => setDocuments((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const isBottom = BOTTOM.some((b) => b.key === view)
  const showBack = !isBottom
  const initials = demoUser.name.split(' ').map((s) => s[0]).slice(0, 2).join('')

  return (
    <div className="app">
      <div className="shell">
        <div className="demo-banner">Демо-прототип по ТЗ · не связан с Kaspi Bank · данные вымышленные</div>

        <div className="with-sidebar">
          {/* Desktop sidebar */}
          <nav className="sidebar">
            <div className="s-logo">Kaspi.kz</div>
            <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}><Icon name="home" size={20} /> Главная</button>
            {homeGrid.map((g) => (
              <button key={g.key} className={view === g.key ? 'active' : ''} onClick={() => setView(g.key)}><Icon name={g.icon} size={20} /> {g.label}</button>
            ))}
            <button className={view === 'services' ? 'active' : ''} onClick={() => setView('services')}><Icon name="menu" size={20} /> Сервисы</button>
          </nav>

          <div>
            {/* Top bar */}
            <header className="topbar">
              {showBack ? (
                <button className="back-btn" onClick={() => setView('home')} aria-label="Назад">
                  <Icon name="chevron" size={22} style={{ transform: 'scaleX(-1)' }} />
                </button>
              ) : (
                <div className="brand"><span className="kaspi-logo"><Icon name="user" size={20} stroke={2} /></span></div>
              )}
              <div className="topbar-title">{showBack ? TITLES[view] || '' : ''}</div>
              <div className="topbar-actions">
                {!showBack && <button className="icon-btn" aria-label="Уведомления"><Icon name="bell" size={20} /></button>}
                <div className="avatar" onClick={() => setView('services')}>{initials}</div>
              </div>
            </header>

            <main className="content">
              {view === 'home' && <Home onNavigate={setView} />}
              {view === 'bank' && <Bank accounts={accounts} transactions={transactions} updateAccount={updateAccount} />}
              {view === 'gov' && <Gov documents={documents} addDocument={addDocument} updateDocument={updateDocument} />}
              {view === 'transfers' && <Transfers requisites={requisites} setRequisites={setRequisites} />}
              {view === 'payments' && <Payments onQR={() => setView('qr')} />}
              {view === 'qr' && <QRScreen />}
              {view === 'messages' && <Stub icon="chat" title="Сообщения" text="Здесь появятся чаты с продавцами и поддержкой Kaspi." />}
              {view === 'services' && <Services onLogout={() => { setAuthed(false); setView('home') }} onNavigate={setView} />}
              {view === 'shop' && <Stub icon="cart" title="Магазин" text="Каталог товаров в рассрочку 0-0-24 (демо)." />}
              {view === 'travel' && <Stub icon="plane" title="Kaspi Travel" text="Авиабилеты, ЖД и отели (демо)." />}
              {view === 'ads' && <Stub icon="ads" title="Объявления" text="Частные объявления Kaspi (демо)." />}
              {view === 'magnum' && <Stub icon="cart" title="Magnum" text="Продукты питания со скидками до −48% и бесплатной доставкой (демо)." />}
              {view === 'jobs' && <Stub icon="work" title="Работа" text="Поиск вакансий рядом с вами (демо)." />}
            </main>
          </div>
        </div>

        <nav className="bottom-nav">
          {BOTTOM.map((n) => {
            const active = view === n.key || (n.key === 'home' && showBack)
            return (
              <button key={n.key} className={active ? 'active' : ''} onClick={() => setView(n.key)}>
                <Icon name={n.icon} size={26} stroke={active ? 2.1 : 1.8} /> {n.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function Transfers({ requisites, setRequisites }) {
  const quick = [
    { icon: 'transfer', label: 'По номеру телефона' },
    { icon: 'card', label: 'На карту' },
    { icon: 'atm', label: 'По реквизитам' },
    { icon: 'qr', label: 'По QR' },
  ]
  return (
    <div>
      <div className="quick" style={{ marginTop: 8 }}>
        {quick.map((q) => (<button key={q.label}><span className="qi"><Icon name={q.icon} /></span>{q.label}</button>))}
      </div>
      <Requisites requisites={requisites} setRequisites={setRequisites} />
    </div>
  )
}

function Payments({ onQR }) {
  const items = [
    { icon: 'phone', label: 'Мобильная связь' }, { icon: 'home', label: 'Коммунальные услуги' },
    { icon: 'atm', label: 'Интернет и ТВ' }, { icon: 'car', label: 'Штрафы и налоги' },
    { icon: 'qr', label: 'Оплата по QR', qr: true }, { icon: 'briefcase', label: 'Кредиты' },
  ]
  return (
    <div>
      <div className="rows pad" style={{ marginTop: 8 }}>
        {items.map((i) => (
          <div className="rowi" key={i.label} onClick={i.qr ? onQR : undefined}>
            <span className="ic" style={{ background: '#FDECEA', color: 'var(--red)' }}><Icon name={i.icon} size={20} /></span>
            <div className="meta"><div className="l1">{i.label}</div></div>
            <span className="chev"><Icon name="chevron" size={18} /></span>
          </div>
        ))}
      </div>
      <div className="hint mt16">Демо: реальные платежи не выполняются.</div>
    </div>
  )
}

function QRScreen() {
  const [qr, setQr] = useState('')
  useEffect(() => { makeQR('kaspi-demo://pay/merchant/42').then(setQr) }, [])
  return (
    <div className="qr-screen">
      <div className="qr-frame">{qr ? <img src={qr} alt="Kaspi QR" /> : null}</div>
      <div className="qr-cap">Наведите камеру на Kaspi QR продавца</div>
      <button className="btn mt16">Открыть камеру</button>
      <div className="hint mt12">Демо: доступ к камере и оплата не выполняются.</div>
    </div>
  )
}

function Services({ onLogout, onNavigate }) {
  const rows = [
    { icon: 'user', label: 'Профиль', k: null }, { icon: 'gov', label: 'Госуслуги', k: 'gov' },
    { icon: 'plane', label: 'Kaspi Travel', k: 'travel' }, { icon: 'ads', label: 'Объявления', k: 'ads' },
    { icon: 'shield', label: 'Безопасность', k: null }, { icon: 'bell', label: 'Уведомления', k: null },
  ]
  return (
    <div>
      <div className="card" style={{ marginTop: 8 }}>
        <div className="req-line"><span className="k">Имя</span><span className="v">{demoUser.name}</span></div>
        <div className="req-line"><span className="k">Телефон</span><span className="v">{demoUser.phone}</span></div>
        <div className="req-line"><span className="k">ИИН</span><span className="v">{demoUser.iin}</span></div>
      </div>
      <div className="rows pad mt12">
        {rows.map((r) => (
          <div className="rowi" key={r.label} onClick={() => r.k && onNavigate(r.k)}>
            <span className="ic" style={{ background: '#F4F5F7', color: 'var(--ink)' }}><Icon name={r.icon} size={20} /></span>
            <div className="meta"><div className="l1">{r.label}</div></div>
            <span className="chev"><Icon name="chevron" size={18} /></span>
          </div>
        ))}
      </div>
      <button className="btn ghost mt16" style={{ color: 'var(--red)' }} onClick={onLogout}>Выйти</button>
      <div className="hint mt16">Учебный демо-прототип · Версия 1.0</div>
    </div>
  )
}

function Stub({ icon, title, text }) {
  return (
    <div className="stub">
      <span className="stub-ic"><Icon name={icon} size={34} stroke={1.6} /></span>
      <div className="stub-title">{title}</div>
      <div className="muted" style={{ textAlign: 'center', maxWidth: 260 }}>{text}</div>
    </div>
  )
}
