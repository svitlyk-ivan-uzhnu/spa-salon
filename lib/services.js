// Спільні дані меню спа-салону Spa Oasis
// Тиждень 6: додано CRUD функції для API через In-memory сховище

let drinks = [
  { id: 1, name: "Класичний масаж", description: "Загальний масаж тіла для зняття напруги та покращення тонусу м'язів.", price: 800, emoji: "💆‍♂️", category: "Масаж", available: true },
  { id: 2, name: "Стоун-терапія", description: "Масаж гарячим вулканічним камінням для глибокого релаксу та прогрівання.", price: 1200, emoji: "🪨", category: "Масаж", available: true },
  { id: 3, name: "Плілінг обличчя", description: "Ніжне очищення шкіри за допомогою натуральних фруктових кислот.", price: 600, emoji: "✨", category: "Догляд", available: true },
  { id: 4, name: "Гідромасажна ванна", description: "Розслаблююча процедура у ванні з морською сіллю та ефірними оліями.", price: 700, emoji: "🛁", category: "Водні", available: true },
  { id: 5, name: "Шоколадне обгортання", description: "Живильна маска для всього тіла на основі натурального какао.", price: 1100, emoji: "🍫", category: "Догляд", available: false },
  { id: 6, name: "Аромамасаж", description: "Масаж з використанням індивідуально підібраних ефірних олій.", price: 900, emoji: "🌿", category: "Масаж", available: true },
  { id: 7, name: "Киснева маска", description: "Експрес-процедура для миттєвого зволоження та сяяння шкіри.", price: 500, emoji: "🌬️", category: "Догляд", available: true },
  { id: 8, name: "Хамам", description: "Традиційна турецька лазня з розпарюванням та пінним масажем.", price: 1500, emoji: "💨", category: "Водні", available: true },
  { id: 9, name: "Детокс-обгортання", description: "Процедура виведення токсинів за допомогою лікувальних морських водоростей.", price: 1300, emoji: "🌱", category: "Догляд", available: true },
  { id: 10, name: "Масаж обличчя", description: "Скульптуруючий масаж для покращення овалу обличчя та лімфодренажу.", price: 550, emoji: "💆‍♀️", category: "Масаж", available: true },
]

// Наступний вільний ID для нових процедур
let nextId = 11

export { drinks }

// READ: Отримати одну процедуру за ID
export function getDrinkById(id) {
  return drinks.find((drink) => drink.id === Number(id))
}

// Отримати унікальний список категорій
export function getCategories() {
  return ["Всі", ...new Set(drinks.map((item) => item.category))]
}

// CREATE: Додати нову процедуру
export function addDrink(data) {
  const newDrink = {
    id: nextId++,
    name: data.name,
    description: data.description || '',
    price: Number(data.price),
    emoji: data.emoji || '🌿',
    category: data.category || 'Інше',
    available: data.available !== undefined ? data.available : true
  }
  drinks.push(newDrink)
  return newDrink
}

// UPDATE: Оновити існуючу процедуру за ID
export function updateDrink(id, data) {
  const index = drinks.findIndex((drink) => drink.id === Number(id))
  if (index === -1) return null

  // Оновлюємо дані об'єкта, зберігаючи оригінальний ID
  drinks[index] = {
    ...drinks[index],
    ...data,
    id: drinks[index].id
  }
  return drinks[index]
}

// DELETE: Видалити процедуру з масиву
export function deleteDrink(id) {
  const index = drinks.findIndex((drink) => drink.id === Number(id))
  if (index === -1) return null

  const deleted = drinks[index]
  drinks.splice(index, 1) // Вирізаємо 1 елемент з масиву
  return deleted
}