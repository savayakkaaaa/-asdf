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
  { id: 'd1', title: 'Удостоверение личности', subtitle: 'ИИН 000000000000', icon: 'id', status: 'Действителен', color: '#2B7DE9', added: '2026-05-01' },
  { id: 'd2', title: 'Водительское удостоверение', subtitle: 'Категория B', icon: 'car', status: 'Действителен', color: '#33B36B', added: '2026-05-01' },
  { id: 'd3', title: 'Свидетельство о браке', subtitle: '№ AB-1122', icon: 'marriage', status: 'Действителен', color: '#E84393', added: '2026-06-10' },
]

export const govServices = [
  { id: 'g1', title: 'Справка о несудимости', subtitle: 'Готовность: 15 минут', fee: 0, icon: 'doc', color: '#2B7DE9' },
  { id: 'g2', title: 'Адресная справка', subtitle: 'Готовность: мгновенно', fee: 0, icon: 'home', color: '#33B36B' },
  { id: 'g3', title: 'Регистрация ИП', subtitle: 'Госпошлина', fee: 0, icon: 'briefcase', color: '#7B61FF' },
  { id: 'g4', title: 'Замена водительского удостоверения', subtitle: 'Госпошлина', fee: 12604, icon: 'car', color: '#FF8A00' },
  { id: 'g5', title: 'Оформление загранпаспорта', subtitle: 'Госпошлина', fee: 22344, icon: 'passport', color: '#F14635' },
  { id: 'g6', title: 'Пособие на ребёнка', subtitle: 'Подача заявления', fee: 0, icon: 'baby', color: '#E84393' },
]

// Плитки лаунчера на главной (как в приложении Kaspi)
export const homeGrid = [
  { key: 'qr', label: 'Kaspi QR', icon: 'qr' },
  { key: 'bank', label: 'Мой Банк', icon: 'bank' },
  { key: 'payments', label: 'Платежи', icon: 'atm' },
  { key: 'transfers', label: 'Переводы', icon: 'transfer' },
  { key: 'shop', label: 'Магазин', icon: 'cart' },
  { key: 'travel', label: 'Travel', icon: 'plane' },
  { key: 'gov', label: 'Госуслуги', icon: 'gov' },
  { key: 'ads', label: 'Объявления', icon: 'ads' },
]

export const promoBanners = [
  { id: 'p1', title: 'Мебель', terms: '0·0·12', sub: 'до 24 мес на Kaspi Red', bg: '#F4EDE3' },
  { id: 'p2', title: 'Техника', terms: '0·0·24', sub: 'рассрочка без переплаты', bg: '#E7EEF5' },
  { id: 'p3', title: 'Аптеки', terms: '0·0·6', sub: 'на всё для здоровья', bg: '#EAF3EC' },
]

export const productCards = [
  { id: 'pr1', badge: 'RED', name: 'Kaspi Red', sub: 'Рассрочка 0%', variant: 'white' },
  { id: 'pr2', name: 'Kaspi Депозит', sub: 'Эффективная ставка 14%', variant: 'gold' },
  { id: 'pr3', name: 'Kaspi Gold', sub: 'Дебетовая карта', variant: 'gold' },
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
