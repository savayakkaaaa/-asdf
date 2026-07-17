import Icon from './Icon.jsx'
import { homeGrid, magnumTiles, productShortcuts, recentItems } from '../data.js'
import { fmt } from '../utils.js'

/* Простые SVG-«фото» товаров (веер, часы) — вместо реальных изображений */
function Art({ kind }) {
  if (kind === 'watch') {
    return (
      <svg viewBox="0 0 48 48" width="52" height="52" fill="none" stroke="#3A3F4A" strokeWidth="2" strokeLinecap="round">
        <rect x="16" y="12" width="16" height="24" rx="5" fill="#20242C" stroke="none" />
        <rect x="18.5" y="15" width="11" height="18" rx="3" fill="#4A90D9" stroke="none" />
        <path d="M20 12v-4h8v4M20 36v4h8v-4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" width="54" height="54" fill="none">
      <g stroke="#B4566E" strokeWidth="1.6">
        <path d="M24 38L10 16a17 17 0 0 1 28 0L24 38z" fill="#E8879F" stroke="none" />
        <path d="M24 38L14 18M24 38l-4-24M24 38l4-24M24 38l10-20" stroke="#C96A82" />
      </g>
      <circle cx="24" cy="39" r="2.6" fill="#8A4A32" />
    </svg>
  )
}

function Stars({ rating, votes }) {
  return (
    <span className="stars">
      <span className="stars-num">{rating.toFixed(1)}</span>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="#F14635">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9 2.9-6z" />
      </svg>
      <span className="stars-votes">({votes})</span>
    </span>
  )
}

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Поиск: лупа слева, камера и корзина справа */}
      <div className="search-bar" role="search">
        <Icon name="search" size={18} />
        <span className="sb-ph">Поиск по Kaspi.kz</span>
        <span className="sb-actions">
          <Icon name="camera" size={20} />
          <Icon name="cart" size={20} />
        </span>
      </div>

      {/* Большой баннер Magnum */}
      <div className="magnum-banner" onClick={() => onNavigate('magnum')}>
        <div className="mb-left">
          <div className="mb-logo">magnum</div>
          <div className="mb-title">СУПЕР СКИДКИ</div>
          <div className="mb-off">до −48%</div>
        </div>
        <div className="mb-tiles">
          {magnumTiles.map((t) => (
            <div className="mb-tile" key={t.cat} style={{ background: t.bg }}>
              <span className="mb-cat">{t.cat}</span>
              <span className="mb-chip">{t.off}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Сетка сервисов */}
      <div className="grid8">
        {homeGrid.map((g) => (
          <button className="grid-tile" key={g.key} onClick={() => onNavigate(g.key)}>
            <span className="gt-icon">
              {g.icon === 'magnum'
                ? <span className="magnum-m">m</span>
                : <Icon name={g.icon} size={30} stroke={1.6} />}
              {g.badge && <span className="gt-badge">{g.badge}</span>}
            </span>
            <span className="gt-label">{g.label}</span>
          </button>
        ))}
      </div>

      {/* Быстрые продукты: 2 колонки */}
      <div className="shortcuts">
        {productShortcuts.map((s) => (
          <button className="shortcut" key={s.id} onClick={() => onNavigate('bank')}>
            <span className="sc-badge" style={{ background: s.badgeBg, color: s.badgeColor }}>{s.badge}</span>
            <span className="sc-meta">
              <span className="sc-name">{s.name}</span>
              {s.sub && <span className="sc-sub">{s.sub}</span>}
            </span>
          </button>
        ))}
      </div>

      {/* Вы недавно смотрели */}
      <div className="section-title">Вы недавно смотрели</div>
      <div className="recent-scroll">
        {recentItems.map((r) => (
          <div className="recent-card" key={r.id} onClick={() => onNavigate('shop')}>
            <div className="rc-photo" style={{ background: r.tint }}>
              <Art kind={r.art} />
              {r.bonus > 0 && <span className="rc-bonus">🔥 {r.bonus} Б</span>}
            </div>
            <div className="rc-price">{fmt(r.price)} ₸</div>
            <div className="rc-name">{r.name}</div>
            <Stars rating={r.rating} votes={r.votes} />
          </div>
        ))}
      </div>
    </div>
  )
}
