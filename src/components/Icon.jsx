import DS_ICONS from '../ds-icons.js'
import APP_ICONS from '../app-icons.js'

// Смысловое имя в интерфейсе → иконка Kaspi из src/ds-icons.js (дизайн-система ic_ds_*)
// или src/app-icons.js (остальное из res/drawable приложения kz.kaspi.mobile).
// Второй элемент — поворот в градусах, если в наборе есть только зеркальный вариант.
// Ключ набора можно указывать и напрямую: <Icon name="scan_qr_500" />.
const ALIAS = {
  arrowDown: ['arrow_up_500', 180],
  atm: ['payments'],
  bell: ['bell_500'],
  box: ['market_500'],
  camera: ['camera_500'],
  cart: ['cart_500'],
  chat: ['chat_400'],
  check: ['check_500'],
  card: ['icon_domestic_card'],
  chevron: ['chevron_right_400'],
  copy: ['copy_500'],
  doc: ['document_500'],
  doccheck: ['ksp_conditions_500'],
  home: ['nav_tab_1'],
  id: ['id_card_500'],
  image: ['gallery_500'],
  lock: ['lock_500'],
  menu: ['nav_tab_4'],
  more: ['more_500'],
  pdf: ['file_pdf_700'],
  phone: ['mobile_500'],
  qr: ['scan_qr_500'],
  scan: ['scan_code_500'],
  search: ['search_500'],
  share: ['share_android_500'],
  topup: ['plus_400'],
  transfer: ['transfers_logo_500'],
  user: ['user_500'],
  wallet: ['kaspi_wallet_icon'],
}

// Чего в ресурсах приложения нет вовсе: категории трат, госуслуги, разделы сервисов.
// Рисуем линиями в 24×24, чтобы вес совпадал с иконками дизайн-системы.
const P = {
  bank: <><rect x="5.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M9.5 5.5h3"/><rect x="9" y="10.5" width="12" height="7" rx="1.5" fill="#fff"/><path d="M9 13h12"/></>,
  gov: <><path d="M3.5 21h17"/><path d="M6 21v-8M10 21v-8M14 21v-8M18 21v-8"/><path d="M4 13h16M4.5 13L12 8.5 19.5 13"/><path d="M12 8.5V3"/><path d="M12 3h4l-1.1 1.6L16 6.2h-4"/></>,
  car: <><path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.6h7.2A2 2 0 0 1 17.5 11L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><path d="M6.5 18h.01M17.5 18h.01"/></>,
  percent: <><circle cx="12" cy="12" r="9"/><path d="M8.5 9a.6.6 0 1 0 0-.01M15.5 15a.6.6 0 1 0 0-.01M15 9l-6 6"/></>,
  beauty: <><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8 8l12 12M8 16L20 4"/></>,
  baby: <><circle cx="12" cy="8" r="3"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.4"/><path d="M9.5 15h5"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></>,
  marriage: <><circle cx="8" cy="14" r="4"/><circle cx="16" cy="14" r="4"/></>,
  plane: <><path d="M10.5 13.5L3 12l0-2 7.5 1.5L14 4c.4-.9 1-1 1.4-1 .5 0 1 .4 1 1.2L14.5 12l5.5 1.2c.5.1 1 .5 1 1.1 0 .5-.4 1-1 1L14.5 15l-1.2 5c-.1.5-.5.8-.9.8s-.8-.3-.9-.8L10.5 13.5z"/></>,
  ads: <><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  travelbag: <><rect x="6" y="6.5" width="12" height="12.5" rx="2"/><path d="M9.5 6.5V4.8A1.8 1.8 0 0 1 11.3 3h1.4a1.8 1.8 0 0 1 1.8 1.8v1.7"/><path d="M9.7 6.5V19M14.3 6.5V19"/><circle cx="9" cy="20.8" r="1.1"/><circle cx="15" cy="20.8" r="1.1"/></>,
  work: <><rect x="3" y="6.5" width="18" height="12.5" rx="2"/><path d="M8.5 6.5V5A1.5 1.5 0 0 1 10 3.5h4A1.5 1.5 0 0 1 15.5 5v1.5"/><circle cx="13.5" cy="12" r="3"/><path d="M15.7 14.2l3 3"/></>,
  megaphone: <><path d="M4 14v-4l12-5v14L4 14z"/><path d="M8 14v4.5a1.5 1.5 0 0 0 2.7 0.9"/><path d="M16 9.5v5"/></>,
  stroller: <><circle cx="9" cy="18" r="2"/><circle cx="16" cy="18" r="2"/><path d="M5 8h7l3 7H8.5z"/><path d="M12 8V5.5A2.5 2.5 0 0 1 14.5 3"/><path d="M5 8l-1.5 3"/></>,
  selfemp: <><circle cx="9" cy="8" r="2.8"/><path d="M4.5 18c0-2.8 2-4.5 4.5-4.5"/><rect x="12" y="11" width="8.5" height="7" rx="1.5"/><path d="M12 13.5h8.5"/><circle cx="17.5" cy="16" r="0.9"/></>,
  homesearch: <><path d="M3.5 11l7-5.5 7 5.5"/><path d="M5.5 10v8h5"/><circle cx="15.5" cy="15.5" r="3"/><path d="M17.7 17.7L20.2 20.2"/></>,
}

export default function Icon({ name, size = 22, stroke = 1.8, className = '', style }) {
  const [dsName, rotate = 0] = ALIAS[name] || [name]
  const ds = DS_ICONS[dsName] || APP_ICONS[dsName] || (P[name] ? null : DS_ICONS.document_500)

  if (ds) {
    const [, , vw, vh] = ds.vb.split(' ').map(Number)
    const paths = ds.p.map((p, i) => (
      <path
        key={i}
        d={p.d}
        fill={p.f || 'currentColor'}
        fillRule={p.e ? 'evenodd' : undefined}
        clipRule={p.e ? 'evenodd' : undefined}
        fillOpacity={p.o}
        transform={p.t}
      />
    ))
    return (
      <svg className={className} style={style} width={size} height={Math.round(size * vh / vw)} viewBox={ds.vb} aria-hidden="true">
        {rotate ? <g transform={`rotate(${rotate} ${vw / 2} ${vh / 2})`}>{paths}</g> : paths}
      </svg>
    )
  }

  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  )
}
