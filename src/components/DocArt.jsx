/* Обложки документов для карточек в Госуслугах.
   Рисованные, намеренно условные: узнаваемая композиция бланка
   (гильош, полоса фото, чип, эмблема), но без воспроизведения
   настоящего герба, шрифтов и каких-либо данных. */

// Карточка 132x148. Бланк занимает верх, низ отдан заголовку.
const PAPER = { x: 10, y: 12, w: 112, h: 88, r: 7 }

/** Гильоширные волны — фон настоящих бланков. Обрезаются по краю бумаги. */
function Guilloche({ id, color }) {
  const rows = [26, 40, 54, 68, 82]
  return (
    <g clipPath={`url(#${id})`}>
      {rows.map((y, i) => (
        <path
          key={y}
          d={`M${PAPER.x} ${y} q 14 ${i % 2 ? -9 : 9} 28 0 t 28 0 t 28 0 t 28 0`}
          fill="none" stroke={color} strokeWidth="1" opacity="0.3"
        />
      ))}
    </g>
  )
}

/** Условная эмблема: солнце с лучами — мотив, а не реальный герб. */
function Emblem({ color, cx, cy, r = 6 }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * (r + 1.4)} y1={cy + Math.sin(a) * (r + 1.4)}
        x2={cx + Math.cos(a) * (r + 3.4)} y2={cy + Math.sin(a) * (r + 3.4)}
        stroke={color} strokeWidth="1.1" strokeLinecap="round" opacity="0.75"
      />
    )
  })
  return (
    <>
      {rays}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.4" opacity="0.85" />
      <circle cx={cx} cy={cy} r={r - 2.6} fill={color} opacity="0.6" />
    </>
  )
}

/** Портрет: скруглённый прямоугольник с силуэтом головы и плеч. */
function Portrait({ color, x, y, w, h }) {
  const cx = x + w / 2
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={color} opacity="0.22" />
      <circle cx={cx} cy={y + h * 0.34} r={w * 0.24} fill={color} opacity="0.7" />
      <path
        d={`M${x + w * 0.16} ${y + h - 2} a ${w * 0.34} ${h * 0.3} 0 0 1 ${w * 0.68} 0 z`}
        fill={color} opacity="0.7"
      />
    </>
  )
}

/** Чип платёжной/идентификационной карты. */
function Chip({ color, x, y, w = 16, h = 12 }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="2.5" fill={color} opacity="0.7" />
      <path
        d={`M${x} ${y + h / 2} h ${w} M${x + w / 2} ${y} v ${h}`}
        stroke="#fff" strokeWidth="1" opacity="0.75"
      />
    </>
  )
}

/** Строки данных. w — массив длин. */
const bars = (color, x, ys, w, h = 3) =>
  ys.map((y, i) => (
    <rect
      key={y} x={x} y={y} width={w[i]} height={h} rx={h / 2}
      fill={color} opacity={i === 0 ? 0.65 : 0.38}
    />
  ))

/** Машиночитаемая зона: ряды коротких штрихов. */
const mrz = (color, y) =>
  Array.from({ length: 17 }, (_, i) => (
    <rect
      key={i} x={PAPER.x + 5 + i * 5.9} y={y} width="4" height="2.6" rx="1"
      fill={color} opacity="0.45"
    />
  ))

const ART = {
  // Удостоверение: эмблема сверху, портрет слева, поля справа, чип и МЧЗ снизу
  id: (c, id) => (
    <>
      <rect {...rectProps(c, 0.07)} />
      <Paper color={c} tone="#F4FAFD" />
      <Guilloche id={id} color={c} />
      <Emblem color={c} cx={66} cy={24} />
      {bars(c, 44, [35], [44], 2.4)}
      <Portrait color={c} x={18} y={44} w={26} h={32} />
      {bars(c, 50, [46, 55, 64], [58, 44, 50])}
      <Chip color={c} x={50} y={72} />
      {mrz(c, 88)}
    </>
  ),

  // Паспорт: тёмная обложка книжкой, крупная эмблема по центру
  passport: (c, id) => (
    <>
      <rect {...rectProps(c, 0.07)} />
      <Paper color={c} tone={c} solid />
      <Guilloche id={id} color="#fff" />
      <Emblem color="#fff" cx={66} cy={44} r={9} />
      {bars('#fff', 40, [64, 73], [52, 36], 2.6)}
      <path d={`M${PAPER.x + 6} ${PAPER.y + 4} v ${PAPER.h - 8}`} stroke="#fff" strokeWidth="1" opacity="0.35" />
    </>
  ),

  // Соцкошелёк: платёжная карта — чип, полоса, номер
  wallet: (c, id) => (
    <>
      <rect {...rectProps(c, 0.07)} />
      <Paper color={c} tone="#FEF6E4" />
      <Guilloche id={id} color={c} />
      <Chip color={c} x={20} y={28} w={20} h={15} />
      <circle cx={100} cy={35} r="8" fill={c} opacity="0.4" />
      <circle cx={91} cy={35} r="8" fill={c} opacity="0.25" />
      {bars(c, 20, [56, 68, 77], [82, 40, 30], 3.4)}
    </>
  ),

  // Права: карточка с силуэтом автомобиля и категориями
  car: (c, id) => (
    <>
      <rect {...rectProps(c, 0.07)} />
      <Paper color={c} tone="#F1FAF4" />
      <Guilloche id={id} color={c} />
      <Portrait color={c} x={18} y={26} w={24} h={29} />
      {bars(c, 48, [28, 37, 46], [56, 44, 48])}
      <path
        d="M20 78l3.4-9.6a5 5 0 0 1 4.7-3.4h17a5 5 0 0 1 4.7 3.4L53 78"
        fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" opacity="0.75"
      />
      <rect x="16" y="78" width="41" height="8" rx="3" fill={c} opacity="0.6" />
      <circle cx="25" cy="87" r="2.6" fill={c} opacity="0.75" />
      <circle cx="48" cy="87" r="2.6" fill={c} opacity="0.75" />
      {bars(c, 64, [74, 83], [44, 32], 3)}
    </>
  ),

  // Запасной вариант: лист с загнутым углом
  doc: (c, id) => (
    <>
      <rect {...rectProps(c, 0.07)} />
      <Paper color={c} tone="#FFFFFF" />
      <Guilloche id={id} color={c} />
      <path d={`M${PAPER.x + 22} 30 h 40 l 14 14 v 40 h -54 z`} fill={c} opacity="0.14" />
      <path d={`M${PAPER.x + 62} 30 v 14 h 14`} fill="none" stroke={c} strokeWidth="1.6" opacity="0.45" />
      {bars(c, PAPER.x + 30, [54, 63, 72], [34, 28, 32])}
    </>
  ),
}

function rectProps(color, opacity) {
  return { x: 0, y: 0, width: 132, height: 148, fill: color, opacity }
}

/** Сама «бумага» документа: скруглённый бланк со светлой заливкой. */
function Paper({ color, tone, solid = false }) {
  return (
    <rect
      x={PAPER.x} y={PAPER.y} width={PAPER.w} height={PAPER.h} rx={PAPER.r}
      fill={tone}
      stroke={solid ? 'none' : color} strokeOpacity="0.3" strokeWidth="1.2"
    />
  )
}

export default function DocArt({ icon, color = '#8E8E93' }) {
  const key = ART[icon] ? icon : 'doc'
  const clipId = `paper-${key}`
  return (
    <svg
      className="gdc-art"
      viewBox="0 0 132 148"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PAPER.x} y={PAPER.y} width={PAPER.w} height={PAPER.h} rx={PAPER.r} />
        </clipPath>
      </defs>
      {ART[key](color, clipId)}
    </svg>
  )
}
