// Компактный набор линейных иконок (24×24, currentColor) — вместо эмодзи,
// чтобы интерфейс выглядел ближе к реальному приложению Kaspi.
const P = {
  bank: <><rect x="3" y="10" width="18" height="10" rx="1.5"/><path d="M3 10l9-6 9 6"/><path d="M7 14v3M12 14v3M17 14v3"/></>,
  payments: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></>,
  gov: <><path d="M4 21h16"/><path d="M5 21V10M19 21V10M9 21V10M15 21V10"/><path d="M3 10h18l-9-6-9 6z"/></>,
  more: <><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></>,
  scan: <><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M4 12h16"/></>,
  transfer: <><path d="M7 17V7M7 7l-3 3M7 7l3 3"/><path d="M17 7v10M17 17l3-3M17 17l-3-3"/></>,
  topup: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3M20 14v6M14 20h3"/></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></>,
  cart: <><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 12h10L20 8H6.5"/></>,
  car: <><path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.6h7.2A2 2 0 0 1 17.5 11L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><path d="M6.5 18h.01M17.5 18h.01"/></>,
  box: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></>,
  percent: <><circle cx="12" cy="12" r="9"/><path d="M8.5 9a.6.6 0 1 0 0-.01M15.5 15a.6.6 0 1 0 0-.01M15 9l-6 6"/></>,
  beauty: <><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8 8l12 12M8 16L20 4"/></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/></>,
  arrowDown: <><path d="M12 5v14M12 19l5-5M12 19l-5-5"/></>,
  chevron: <><path d="M9 6l6 6-6 6"/></>,
  bell: <><path d="M18 15V10a6 6 0 1 0-12 0v5l-2 3h16l-2-3z"/><path d="M10 21h4"/></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></>,
  id: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M13 9h5M13 13h5M5.5 15.5c.6-1.4 2-1.9 3-1.9s2.4.5 3 1.9"/></>,
  doc: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></>,
  baby: <><circle cx="12" cy="8" r="3"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.4"/><path d="M9.5 15h5"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/></>,
  home: <><path d="M4 11l8-6 8 6"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/></>,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></>,
  user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1.2"/></>,
  check: <><path d="M5 12l5 5L20 6"/></>,
  marriage: <><circle cx="8" cy="14" r="4"/><circle cx="16" cy="14" r="4"/></>,
  plane: <><path d="M10.5 13.5L3 12l0-2 7.5 1.5L14 4c.4-.9 1-1 1.4-1 .5 0 1 .4 1 1.2L14.5 12l5.5 1.2c.5.1 1 .5 1 1.1 0 .5-.4 1-1 1L14.5 15l-1.2 5c-.1.5-.5.8-.9.8s-.8-.3-.9-.8L10.5 13.5z"/></>,
  ads: <><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  chat: <><path d="M20 12a7 7 0 0 1-9.5 6.5L4 20l1.5-5A7 7 0 1 1 20 12z"/><path d="M9 11h6M9 14h4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  card: <><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></>,
  share: <><path d="M12 15V4M12 4l-4 4M12 4l4 4"/><path d="M5 12v7a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7"/></>,
  atm: <><rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7" y="6" width="10" height="5" rx="1"/><path d="M8 15h3M8 18h3M15 15h1M15 18h1"/></>,
}

export default function Icon({ name, size = 22, stroke = 1.8, className = '', style }) {
  const path = P[name] || P.doc
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
      {path}
    </svg>
  )
}
