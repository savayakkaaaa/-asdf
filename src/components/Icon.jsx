import DS_ICONS from '../ds-icons.js'
import APP_ICONS from '../app-icons.js'

// Смысловое имя в интерфейсе → иконка Kaspi из src/ds-icons.js (дизайн-система)
// или src/app-icons.js (остальное из res/drawable приложения kz.kaspi.mobile).
// Второй элемент — поворот в градусах, если в наборе есть только зеркальный вариант.
// Ключ набора можно указывать и напрямую: <Icon name="scan_qr_500" />.
const ALIAS = {
  ads: ['announcements_500'],
  arrowDown: ['arrow_up_500', 180],
  atm: ['payments'],
  baby: ['child_500'],
  bank: ['safe_500'],
  beauty: ['spa_500'],
  bell: ['bell_500'],
  box: ['market_500'],
  briefcase: ['briefcase_500'],
  camera: ['camera_500'],
  car: ['car_500'],
  card: ['card_500'],
  cart: ['cart_500'],
  chat: ['chat_400'],
  check: ['check_500'],
  chevron: ['chevron_right_400'],
  copy: ['copy_500'],
  doc: ['document_500'],
  doccheck: ['certificate_500'],
  gov: ['public_services_500'],
  home: ['nav_tab_1'],
  homesearch: ['registration_500'],
  id: ['id_card_500'],
  image: ['gallery_500'],
  lock: ['lock_500'],
  marriage: ['rings_500'],
  megaphone: ['megaphone_500'],
  menu: ['nav_tab_4'],
  more: ['more_500'],
  passport: ['passport_500'],
  pdf: ['file_pdf_700'],
  percent: ['percent_500'],
  phone: ['mobile_500'],
  plane: ['plane_500'],
  qr: ['scan_qr_500'],
  scan: ['scan_code_500'],
  search: ['search_500'],
  selfemp: ['self_employed_500'],
  shield: ['shield_500'],
  share: ['share_android_500'],
  stroller: ['baby_carriage_500'],
  topup: ['plus_400'],
  transfer: ['transfers_logo_500'],
  travelbag: ['ticket_500'],
  user: ['user_500'],
  wallet: ['wallet_500'],
}

// Единственная оставшаяся самоделка: портфель с лупой для «Работы». Портфель
// без лупы в наборе есть (briefcase_500), но он уже занят «Кредитами», а
// отдельной иконки поиска работы у Kaspi не нашлось.
// Штрих 2 — не на глаз: у иконок дизайн-системы он ровно 2 единицы на сетке 24.
const WORK = <><rect x="3" y="6.5" width="18" height="14.5" rx="2.5"/><path d="M8.5 6.5V5A1.5 1.5 0 0 1 10 3.5h4A1.5 1.5 0 0 1 15.5 5v1.5"/><circle cx="13.5" cy="13.5" r="3.2"/><path d="M15.9 15.9l2.6 2.6"/></>

export default function Icon({ name, size = 22, stroke = 2, className = '', style }) {
  const [dsName, rotate = 0] = ALIAS[name] || [name]
  const ds = name === 'work' ? null : (DS_ICONS[dsName] || APP_ICONS[dsName] || DS_ICONS.document_500)

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
        stroke={p.s}
        strokeWidth={p.sw}
        strokeLinecap={p.sc}
        strokeLinejoin={p.sj}
        strokeOpacity={p.so}
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
      {WORK}
    </svg>
  )
}
