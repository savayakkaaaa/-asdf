import { useEffect, useState } from 'react'
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

// Иконки нижней панели берём напрямую из ic_nav_tab_* — это ровно тот набор,
// которым приложение рисует свои вкладки. Подписи — строки bn_*_label оттуда же.
const BOTTOM = [
  { key: 'home', label: 'Главная', icon: 'nav_tab_1' },
  { key: 'qr', label: 'Kaspi QR', icon: 'nav_tab_2' },
  { key: 'messages', label: 'Сообщения', icon: 'nav_tab_3' },
  { key: 'services', label: 'Сервисы', icon: 'nav_tab_4' },
]
const TITLES = {
  bank: 'Мой Банк', gov: 'Госуслуги', payments: 'Платежи', transfers: 'Переводы',
  shop: 'Магазин', travel: 'Kaspi Travel', ads: 'Объявления', magnum: 'Magnum', jobs: 'Работа',
}
// Экраны, которые в приложении лежат на сером Ds.Back.Base, а не на белом:
// у kaspi_services_page_fragment это прямо прописано в лейауте. У Госуслуг
// серый только на самом списке — заставка eGov и экран документа белые,
// а по непустому headerOverride как раз видно, что открыт подэкран.
const greyPages = new Set(['services', 'gov'])
const isGrey = (view, headerOverride) => greyPages.has(view) && !(view === 'gov' && headerOverride)

export default function App() {
  const [view, setView] = useState('home')
  const [headerOverride, setHeaderOverride] = useState(null)

  const [accounts, setAccounts] = useState(() => load('accounts', initialAccounts))
  const [transactions] = useState(() => load('transactions', initialTransactions))
  const [documents, setDocuments] = useState(() => {
    const ver = load('documents_ver', 0)
    if (ver < 2) {
      save('documents_ver', 2)
      return initialDocuments
    }
    return load('documents', initialDocuments)
  })
  const [requisites, setRequisites] = useState(() => load('requisites', initialRequisites))

  useEffect(() => save('accounts', accounts), [accounts])
  useEffect(() => save('documents', documents), [documents])
  useEffect(() => save('requisites', requisites), [requisites])

  const updateAccount = (id, patch) => setAccounts((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const addDocument = (doc) => setDocuments((p) => [doc, ...p])
  const updateDocument = (id, patch) => setDocuments((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  useEffect(() => {
    if (view !== 'gov') setHeaderOverride(null)
  }, [view])

  const isBottom = BOTTOM.some((b) => b.key === view)
  const showBack = !isBottom

  return (
    <div className="app">
      <div className="shell">
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

          <div className={'screen' + (headerOverride?.fill ? ' fill' : '')}>
            {showBack && !headerOverride?.hidden && (
              <header className="topbar">
                <button
                  className="back-btn"
                  onClick={() => (headerOverride?.onBack ? headerOverride.onBack() : setView('home'))}
                  aria-label="Назад"
                >
                  <Icon name="chevron" size={22} style={{ transform: 'scaleX(-1)' }} />
                </button>
                <div className="topbar-title">{headerOverride?.title || TITLES[view] || ''}</div>
                <div className="topbar-actions" />
              </header>
            )}

            <main
              className={'content' + (isBottom ? '' : ' no-nav')
                + (isGrey(view, headerOverride) ? ' grey' : '')
                + (headerOverride?.fill ? ' fill' : '')}
            >
              {view === 'home' && <Home onNavigate={setView} />}
              {view === 'bank' && <Bank accounts={accounts} transactions={transactions} updateAccount={updateAccount} />}
              {view === 'gov' && (
                <Gov
                  documents={documents}
                  addDocument={addDocument}
                  updateDocument={updateDocument}
                  onHeaderOverride={setHeaderOverride}
                />
              )}
              {view === 'transfers' && <Transfers requisites={requisites} setRequisites={setRequisites} />}
              {view === 'payments' && <Payments onQR={() => setView('qr')} />}
              {view === 'qr' && <QRScreen />}
              {view === 'messages' && <Messages />}
              {view === 'services' && <Services onNavigate={setView} />}
              {view === 'shop' && <Stub icon="cart" title="Магазин" text="Каталог товаров в рассрочку 0-0-24 (демо)." />}
              {view === 'travel' && <Stub icon="plane" title="Kaspi Travel" text="Авиабилеты, ЖД и отели (демо)." />}
              {view === 'ads' && <Stub icon="ads" title="Объявления" text="Частные объявления Kaspi (демо)." />}
              {view === 'magnum' && <Stub icon="cart" title="Magnum" text="Продукты питания со скидками до −48% и бесплатной доставкой (демо)." />}
              {view === 'jobs' && <Stub icon="work" title="Работа" text="Поиск вакансий рядом с вами (демо)." />}
            </main>
          </div>
        </div>

        {isBottom && (
          <nav className="bottom-nav">
            {BOTTOM.map((n) => (
              <button key={n.key} className={view === n.key ? 'active' : ''} onClick={() => setView(n.key)}>
                <Icon name={n.icon} size={24} /> {n.label}
              </button>
            ))}
          </nav>
        )}
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
      <div className="quick">
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
      <div className="rows mt8">
        {items.map((i) => (
          <div className="rowi" key={i.label} onClick={i.qr ? onQR : undefined}>
            <span className="ic" style={{ background: 'var(--red-tint)', color: 'var(--red)' }}><Icon name={i.icon} size={20} /></span>
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

// Экран «Сообщения»: закреплённые заказы сверху, ниже — переписки.
// Заголовки взяты из строк приложения: messenger_messages_pins и
// messenger_messages_history. Сами чаты, разумеется, выдуманные.
function Messages() {
  const chats = [
    { id: 'c1', name: 'Kaspi Магазин', brand: true, last: 'Заказ 1024-7788 передан в доставку', time: '14:32', unread: 2 },
    { id: 'c2', name: 'Поддержка Kaspi', brand: true, last: 'Спасибо за обращение — вопрос решён.', time: 'Вчера' },
    { id: 'c3', name: 'Sulpak', last: 'Товар готов к выдаче в Kaspi Postomat', time: '24 авг' },
    { id: 'c4', name: 'Алия К.', last: 'Добрый день! Товар ещё в наличии?', time: '22 авг' },
  ]
  return (
    <div>
      <button className="pin-row">
        <span className="pr-ic"><Icon name="pinned_500" size={24} /></span>
        <span className="pr-meta">
          <span className="pr-title">Активные заказы</span>
          <span className="pr-sub">2 заказа в пути</span>
        </span>
        <span className="chev"><Icon name="chevron" size={16} /></span>
      </button>

      <h2 className="ds-section-title flush">История сообщений</h2>
      <div className="ds-cells">
        {chats.map((c) => (
          <button className="chat-cell" key={c.id}>
            <span className={'cc-avatar' + (c.brand ? ' brand' : '')}>
              {c.brand ? <Icon name="kaspi_logo" size={48} /> : c.name.slice(0, 1)}
            </span>
            <span className="cc-meta">
              <span className="cc-top">
                <span className="cc-name">{c.name}</span>
                <span className="cc-time">{c.time}</span>
              </span>
              <span className="cc-bottom">
                <span className="cc-last">{c.last}</span>
                {c.unread
                  ? <span className="cc-badge">{c.unread}</span>
                  : <span className="cc-read"><Icon name="message_read_400" size={16} /></span>}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className="hint mt16">Демо: переписка не работает.</div>
    </div>
  )
}

// Экран «Сервисы». В приложении он лежит на сером Ds.Back.Base
// (kaspi_services_page_fragment: background=@color/Ds.Back.Base), а пункты
// собраны в белые секции из ячеек дизайн-системы. Названия — строки из apk.
function Services({ onNavigate }) {
  const groups = [
    {
      title: 'Основное',                                        // settings_main
      rows: [
        { icon: 'gov', label: 'Госуслуги', k: 'gov' },           // kaspi_publicservices_menu
        { icon: 'market_500', label: 'Магазин', k: 'shop' },     // kaspi_shop_menu
        { icon: 'plane', label: 'Travel', k: 'travel' },         // kaspi_travel_menu
        { icon: 'ads', label: 'Объявления', k: 'ads' },
        { icon: 'work', label: 'Работа', k: 'jobs' },
        { icon: 'ksp_gift_400', label: 'Акции' },                // kaspi_promo_menu
        { icon: 'kaspi_guide_logo_500', label: 'Гид' },          // kaspi_guide_menu
      ],
    },
    {
      title: 'Настройки',                                       // call_settings
      rows: [
        { icon: 'bell', label: 'Уведомления' },                  // notifications_title
        { icon: 'shield', label: 'Безопасность' },               // settings_securtiy
        { icon: 'login_500', label: 'Вход в приложение' },       // settings_sign_in
        { icon: 'dark_mode_24', label: 'Тема приложения' },      // settings_appearance_title
        { icon: 'oauth_globe', label: 'Язык приложения' },       // application_language
      ],
    },
  ]
  return (
    <div className="page-grey">
      <div className="profile-card">
        <span className="pc-avatar"><Icon name="avatar_placeholder_900" size={56} /></span>
        <span className="pc-meta">
          <span className="pc-name">{demoUser.name}</span>
          <span className="pc-sub">{demoUser.phone}</span>
        </span>
        <span className="chev"><Icon name="chevron" size={16} /></span>
      </div>

      {groups.map((g) => (
        <section className="ds-section" key={g.title}>
          <h2 className="ds-section-title">{g.title}</h2>
          <div className="ds-cells">
            {g.rows.map((r) => (
              <button className="ds-cell" key={r.label} onClick={() => r.k && onNavigate(r.k)}>
                <span className="dc-icon"><Icon name={r.icon} size={24} /></span>
                <span className="dc-title">{r.label}</span>
                <span className="chev"><Icon name="chevron" size={16} /></span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className="ds-cells mt16">
        <button className="ds-cell danger">
          <span className="dc-icon"><Icon name="logout_500" size={24} /></span>
          <span className="dc-title">Выйти</span>
        </button>
      </div>

      <div className="hint mt16">Учебный демо-прототип · Версия 1.0</div>
    </div>
  )
}

function Stub({ icon, title, text }) {
  return (
    <div className="stub">
      <span className="stub-ic"><Icon name={icon} size={34} /></span>
      <div className="stub-title">{title}</div>
      <div className="muted" style={{ textAlign: 'center', maxWidth: 260 }}>{text}</div>
    </div>
  )
}
