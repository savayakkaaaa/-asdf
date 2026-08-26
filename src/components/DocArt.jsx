/* Схематичные обложки документов для карточек в Госуслугах.
   Намеренно условные: узнаваемая геометрия без воспроизведения
   настоящих бланков, гербов и данных. */

const SHEET = { x: 14, y: 22, w: 104, h: 74, r: 8 }

/** Общая подложка: скруглённый «бланк» на мягкой заливке цвета документа. */
function Sheet({ color, children }) {
  return (
    <>
      <rect x="0" y="0" width="132" height="148" fill={color} opacity="0.10" />
      <rect
        x={SHEET.x} y={SHEET.y} width={SHEET.w} height={SHEET.h} rx={SHEET.r}
        fill="#fff" stroke={color} strokeOpacity="0.35" strokeWidth="1.5"
      />
      {children}
    </>
  )
}

const lines = (color, x, ys, w) =>
  ys.map((y, i) => (
    <rect
      key={i} x={x} y={y} width={Array.isArray(w) ? w[i] : w} height="4" rx="2"
      fill={color} opacity={i === 0 ? 0.55 : 0.28}
    />
  ))

const ART = {
  // Удостоверение: фото слева, строки справа, чип снизу
  id: (c) => (
    <Sheet color={c}>
      <rect x="24" y="34" width="26" height="32" rx="4" fill={c} opacity="0.30" />
      <circle cx="37" cy="45" r="6" fill={c} opacity="0.55" />
      <path d="M28 62c1.8-4.6 5.4-6.4 9-6.4s7.2 1.8 9 6.4z" fill={c} opacity="0.55" />
      {lines(c, 58, [36, 46, 56], [44, 36, 40])}
      <rect x="24" y="74" width="18" height="13" rx="3" fill={c} opacity="0.45" />
      {lines(c, 48, [78], 56)}
    </Sheet>
  ),
  // Паспорт: обложка книжкой с круглой эмблемой
  passport: (c) => (
    <Sheet color={c}>
      <rect x="24" y="30" width="84" height="58" rx="5" fill={c} opacity="0.22" />
      <circle cx="66" cy="52" r="13" fill="none" stroke={c} strokeWidth="2" opacity="0.65" />
      <circle cx="66" cy="52" r="5" fill={c} opacity="0.55" />
      {lines(c, 44, [74], 44)}
    </Sheet>
  ),
  // Соцкошелёк: платёжная карта с чипом и полосой
  wallet: (c) => (
    <Sheet color={c}>
      <rect x="24" y="32" width="84" height="54" rx="6" fill={c} opacity="0.22" />
      <rect x="32" y="42" width="20" height="15" rx="3" fill={c} opacity="0.55" />
      <path d="M32 47h20M42 42v15" stroke="#fff" strokeWidth="1.2" opacity="0.8" />
      {lines(c, 32, [68, 78], [68, 40])}
    </Sheet>
  ),
  // Права: карточка с силуэтом автомобиля
  car: (c) => (
    <Sheet color={c}>
      <path
        d="M32 62l3.4-10a5 5 0 0 1 4.7-3.4h18.8a5 5 0 0 1 4.7 3.4L67 62"
        fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" opacity="0.6"
      />
      <rect x="28" y="62" width="43" height="9" rx="3.5" fill={c} opacity="0.45" />
      {lines(c, 80, [44, 54, 64], [24, 20, 22])}
      {lines(c, 28, [80], 76)}
    </Sheet>
  ),
  // Запасной вариант: лист с загнутым углом
  doc: (c) => (
    <Sheet color={c}>
      <path
        d="M40 34h30l14 14v38H40z" fill={c} opacity="0.22"
      />
      <path d="M70 34v14h14" fill="none" stroke={c} strokeWidth="2" opacity="0.5" />
      {lines(c, 48, [58, 68, 78], [40, 34, 38])}
    </Sheet>
  ),
}

export default function DocArt({ icon, color = '#8E8E93' }) {
  const draw = ART[icon] || ART.doc
  return (
    <svg
      className="gdc-art"
      viewBox="0 0 132 148"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {draw(color)}
    </svg>
  )
}
