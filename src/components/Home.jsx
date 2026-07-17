import Icon from './Icon.jsx'
import { homeGrid, magnumTiles, productShortcuts } from '../data.js'

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Поиск: лупа слева, камера и корзина справа */}
      <div className="search-bar" role="search">
        <Icon name="search" size={19} />
        <span className="sb-ph">Поиск по Kaspi.kz</span>
        <span className="sb-actions">
          <Icon name="camera" size={21} />
          <Icon name="cart" size={21} />
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
                : <Icon name={g.icon} size={40} stroke={1.6} />}
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
            <span className="sc-badge" style={{ background: s.badgeBg, color: s.badgeColor }}>
              {s.badgeIcon ? <Icon name={s.badge} size={28} stroke={2} /> : s.badge}
            </span>
            <span className="sc-meta">
              <span className="sc-name">{s.name}</span>
              {s.sub && <span className="sc-sub">{s.sub}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
