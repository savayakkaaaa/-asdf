// Демо-данные. Всё вымышленное — никаких настоящих счетов, карт или документов.
// Номера карт/IBAN сгенерированы для примера и не принадлежат реальным лицам.

export const demoUser = {
  name: 'Айдар Демонстратов',
  phone: '+7 (700) 000-00-00',
  iin: '000000000000',
}

export const initialAccounts = [
  {
    id: 'acc-gold',
    name: 'Kaspi Gold',
    type: 'Дебетовая карта',
    system: 'VISA',
    number: '4021',
    balance: 284500,
    variant: 'gold',
    blocked: false,
    limitPerDay: 500000,
  },
  {
    id: 'acc-deposit',
    name: 'Kaspi Депозит',
    type: 'Накопительный счёт',
    system: '14%',
    number: '8830',
    balance: 1250000,
    variant: 'dark',
    blocked: false,
    limitPerDay: 1000000,
  },
  {
    id: 'acc-red',
    name: 'Kaspi Red',
    type: 'Рассрочка 0-0-24',
    system: 'VISA',
    number: '7745',
    balance: 46200,
    variant: 'red',
    blocked: true,
    limitPerDay: 300000,
  },
]

// Категория трат -> иконка, цвет, мягкая подложка
export const categoryMeta = {
  'Продукты': { icon: 'cart', color: '#F14635', tint: '#FDECEA' },
  'Переводы': { icon: 'transfer', color: '#33B36B', tint: '#E7F6EE' },
  'Транспорт': { icon: 'car', color: '#FF8A00', tint: '#FFF1DF' },
  'Покупки': { icon: 'box', color: '#7B61FF', tint: '#EEEBFF' },
  'Связь': { icon: 'phone', color: '#2B7DE9', tint: '#E7F0FE' },
  'Красота': { icon: 'beauty', color: '#E84393', tint: '#FCE9F2' },
  'Депозит': { icon: 'percent', color: '#33B36B', tint: '#E7F6EE' },
  'Прочее': { icon: 'wallet', color: '#8E8E93', tint: '#F0F1F2' },
}
export const catMeta = (c) => categoryMeta[c] || categoryMeta['Прочее']

export const initialTransactions = [
  { id: 't1', accId: 'acc-gold', title: 'Magnum Cash&Carry', category: 'Продукты', amount: -12480, date: '2026-07-16T09:12:00', icon: '🛒' },
  { id: 't2', accId: 'acc-gold', title: 'Пополнение', category: 'Переводы', amount: 150000, date: '2026-07-15T18:40:00', icon: '⬇️' },
  { id: 't3', accId: 'acc-gold', title: 'Яндекс Такси', category: 'Транспорт', amount: -2300, date: '2026-07-15T14:05:00', icon: '🚕' },
  { id: 't4', accId: 'acc-gold', title: 'Wildberries', category: 'Покупки', amount: -34990, date: '2026-07-14T20:15:00', icon: '📦' },
  { id: 't5', accId: 'acc-gold', title: 'Beeline пополнение', category: 'Связь', amount: -5000, date: '2026-07-14T11:00:00', icon: '📱' },
  { id: 't6', accId: 'acc-deposit', title: 'Начисление вознаграждения', category: 'Депозит', amount: 8400, date: '2026-07-13T00:01:00', icon: '💰' },
  { id: 't7', accId: 'acc-gold', title: 'Салон красоты «Айна»', category: 'Красота', amount: -18000, date: '2026-07-12T16:30:00', icon: '💇' },
  { id: 't8', accId: 'acc-red', title: 'Technodom рассрочка 0-0-12', category: 'Покупки', amount: -13800, date: '2026-07-11T13:20:00', icon: '💻' },
]

// Категории для анализа расходов и бюджета
export const budgetCategories = [
  { key: 'Продукты', color: '#F14635', limit: 120000 },
  { key: 'Транспорт', color: '#FF8A00', limit: 30000 },
  { key: 'Покупки', color: '#7B61FF', limit: 100000 },
  { key: 'Связь', color: '#00A96E', limit: 15000 },
  { key: 'Красота', color: '#E84393', limit: 40000 },
  { key: 'Прочее', color: '#8E8E93', limit: 50000 },
]

export const initialDocuments = [
  { id: 'd1', title: 'Удостоверение личности', subtitle: 'ИИН 000000000000', icon: 'id', status: 'Действителен', color: '#F4F5F7', accent: '#1F2124', added: '2026-05-01' },
  { id: 'd2', title: 'Паспорт гражданина РК', subtitle: 'Серия N 0000000', icon: 'passport', status: 'Действителен', color: '#1E4FA3', accent: '#fff', added: '2026-05-01' },
  { id: 'd3', title: 'Социальный кошелёк', subtitle: 'Цифровая карта', icon: 'wallet', status: 'Действителен', color: '#F5C518', accent: '#1F2124', added: '2026-06-10' },
  { id: 'd4', title: 'Водительское удостоверение', subtitle: 'Категория B', icon: 'car', status: 'Действителен', color: '#33B36B', accent: '#fff', added: '2026-05-01' },
]

export const govCategories = [
  { id: 'popular', label: 'Популярные', icon: 'megaphone', color: '#F14635' },
  { id: 'certs', label: 'Справки', icon: 'doccheck', color: '#33B36B' },
  { id: 'auto', label: 'Авто', icon: 'car', color: '#F14635' },
  { id: 'home', label: 'Жилье', icon: 'home', color: '#2B7DE9' },
  { id: 'family', label: 'Семья', icon: 'stroller', color: '#2B7DE9' },
]

export const govServices = [
  { id: 'g1', title: 'Стать самозанятым', subtitle: 'Открыть счет и начать принимать оплату в Kaspi.kz', fee: 0, icon: 'selfemp', color: '#F14635', cat: 'popular' },
  { id: 'g2', title: 'Переоформление автомобиля', subtitle: '', fee: 0, icon: 'car', color: '#F14635', cat: 'popular', cats: ['popular', 'auto'] },
  { id: 'g3', title: 'Проверка прописки', subtitle: '', fee: 0, icon: 'homesearch', color: '#F14635', cat: 'popular', cats: ['popular', 'home'], badge: 'NEW' },
  { id: 'g4', title: 'Прописка', subtitle: '', fee: 0, icon: 'home', color: '#F14635', cat: 'popular', cats: ['popular', 'home'] },
  { id: 'g5', title: 'Справка о несудимости', subtitle: 'Готовность: 15 минут', fee: 0, icon: 'doccheck', color: '#33B36B', cat: 'certs' },
  { id: 'g6', title: 'Адресная справка', subtitle: 'Готовность: мгновенно', fee: 0, icon: 'doc', color: '#33B36B', cat: 'certs' },
  { id: 'g7', title: 'Замена водительского удостоверения', subtitle: 'Госпошлина', fee: 12604, icon: 'car', color: '#F14635', cat: 'auto' },
  { id: 'g8', title: 'Пособие на ребёнка', subtitle: 'Подача заявления', fee: 0, icon: 'baby', color: '#2B7DE9', cat: 'family' },
  { id: 'g9', title: 'Свидетельство о браке', subtitle: 'Цифровая копия', fee: 0, icon: 'marriage', color: '#2B7DE9', cat: 'family' },
]

// Плитки лаунчера на главной (как в приложении Kaspi)
export const homeGrid = [
  { key: 'shop', label: 'Магазин', icon: 'cart', badge: '0·0·24' },
  { key: 'bank', label: 'Мой Банк', icon: 'bank' },
  { key: 'payments', label: 'Платежи', icon: 'atm' },
  { key: 'transfers', label: 'Переводы', icon: 'transfer' },
  { key: 'magnum', label: 'Magnum', icon: 'magnum' },
  { key: 'travel', label: 'Travel', icon: 'travelbag', badge: '0·0·24' },
  { key: 'gov', label: 'Госуслуги', icon: 'gov' },
  { key: 'jobs', label: 'Работа', icon: 'work' },
]

// Мини-плитки внутри баннера Magnum (категория + скидка + цвет фона)
export const magnumTiles = [
  { cat: 'Напитки', off: '−35%', bg: '#CDEB8B' },
  { cat: 'Красота', off: '−52%', bg: '#F6C8DF' },
  { cat: 'Химия', off: '−45%', bg: '#BFE3F2' },
  { cat: 'Сладости', off: '−31%', bg: '#F8E3A0' },
  { cat: 'Соусы', off: '−42%', bg: '#F5C9A8' },
  { cat: 'Детство', off: '−48%', bg: '#CBD8F6' },
]

// Быстрые продукты (2 колонки, как в приложении)
export const productShortcuts = [
  { id: 's1', badge: '0·0·24', badgeBg: '#FFC508', badgeColor: '#1F2124', name: 'Рассрочка 0-0-24', sub: '' },
  { id: 's2', badge: '0·0·12', badgeBg: '#FFC508', badgeColor: '#1F2124', name: 'Рассрочка 0-0-12', sub: '' },
  { id: 's3', badge: 'Red+', badgeBg: '#F14635', badgeColor: '#fff', name: 'Kaspi Red+', sub: 'Рассрочка до 500 000 ₸' },
  { id: 's4', badge: '₸', badgeBg: '#42B657', badgeColor: '#fff', name: 'Кредит', sub: 'до 5 млн ₸' },
]

export const initialRequisites = [
  {
    id: 'r1',
    label: 'Мои реквизиты (Kaspi Gold)',
    fio: 'Демонстратов Айдар',
    iban: 'KZ12 3456 7890 1234 5678',
    bik: 'CASPKZKA',
    bank: 'АО «Kaspi Bank»',
    kbe: '19',
    purpose: '',
  },
]
