import Icon from './Icon.jsx'
import { homeGrid, promoBanners, productCards } from '../data.js'

export default function Home({ onNavigate }) {
  return (
    <div className="home">
      {/* Промо-баннеры (рассрочка) */}
      <div className="promo-scroll">
        {promoBanners.map((b) => (
          <div className="promo" key={b.id} style={{ background: b.bg }}>
            <div className="promo-terms">{b.terms}</div>
            <div className="promo-title">{b.title}</div>
            <div className="promo-sub">{b.sub}</div>
          </div>
        ))}
      </div>

      {/* Сетка сервисов */}
      <div className="grid8">
        {homeGrid.map((g) => (
          <button className="grid-tile" key={g.key} onClick={() => onNavigate(g.key)}>
            <span className="gt-icon"><Icon name={g.icon} size={26} stroke={1.7} /></span>
            <span className="gt-label">{g.label}</span>
          </button>
        ))}
      </div>

      {/* Мерчант-промо */}
      <div className="merchant" onClick={() => onNavigate('shop')}>
        <span className="merchant-logo">M</span>
        <div className="meta">
          <div className="l1">Magnum</div>
          <div className="l2">Продукты питания с бесплатной доставкой</div>
        </div>
        <span className="chev"><Icon name="chevron" size={18} /></span>
      </div>

      {/* Продуктовые карточки */}
      <div className="section-title">Мои продукты</div>
      <div className="product-scroll">
        {productCards.map((p) => (
          <div className={'product-card ' + p.variant} key={p.id} onClick={() => onNavigate('bank')}>
            {p.badge
              ? <span className="prod-badge">{p.badge}</span>
              : <span className="prod-logo">Ⓚ</span>}
            <div className="prod-name">{p.name}</div>
            <div className="prod-sub">{p.sub}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Вас могут заинтересовать</div>
      <div className="suggest">
        {['Кредит наличными', 'Депозит 14%', 'Kaspi Travel', 'Страхование'].map((s) => (
          <div className="suggest-item" key={s}>
            <span className="si-dot" />
            <span>{s}</span>
            <span className="chev"><Icon name="chevron" size={16} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}
