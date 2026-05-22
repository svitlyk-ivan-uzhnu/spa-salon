import dbConnect from '@/lib/db'
import Drink from '@/lib/models/Drink'

// Початкові дані для каталогу спа-салону «Spa Oasis»
const initialServices = [
  {
    name: 'Класичний масаж',
    description: 'Загальний масаж тіла для зняття напруги та покращення тонусу м\'язів.',
    price: 800,
    category: 'Масаж',
    emoji: '💆',
    available: true,
  },
  {
    name: 'Стоун-терапія',
    description: 'Масаж гарячим вулканічним камінням для глибокого релаксу та прогрівання.',
    price: 1200,
    category: 'Масаж',
    emoji: '💆',
    available: true,
  },
  {
    name: 'Пілінг обличчя',
    description: 'Ніжне очищення шкіри за допомогою натуральних фруктових кислот.',
    price: 600,
    category: 'Догляд',
    emoji: '✨',
    available: true,
  },
  {
    name: 'Гідромасажна ванна',
    description: 'Розслаблююча процедура у ванні з морською сіллю та ефірними оліями.',
    price: 700,
    category: 'Водні',
    emoji: '🛁',
    available: true,
  },
  {
    name: 'Шоколадне обгортання',
    description: 'Живильна маска для всього тіла на основі натурального какао.',
    price: 1100,
    category: 'Догляд',
    emoji: '🍫',
    available: true,
  },
  {
    name: 'Аромамасаж',
    description: 'Масаж з використанням індивідуально підібраних ефірних олій.',
    price: 900,
    category: 'Масаж',
    emoji: '🌿',
    available: true,
  },
  {
    name: 'Киснева маска',
    description: 'Експрес-процедура для миттєвого зволоження та сяяння шкіри.',
    price: 500,
    category: 'Догляд',
    emoji: '🧬',
    available: true,
  },
  {
    name: 'Хамам',
    description: 'Традиційна турецька лазня з розпарюванням та пінним масажем.',
    price: 1500,
    category: 'Водні',
    emoji: '💨',
    available: true,
  },
  {
    name: 'Детокс-обгортання',
    description: 'Процедура виведення токсинів за допомогою лікувальних морських водоростей.',
    price: 1300,
    category: 'Догляд',
    emoji: '🌱',
    available: true,
  },
  {
    name: 'Масаж обличчя',
    description: 'Скульптуруючий масаж для покращення овалу обличчя та лімфодренажу.',
    price: 550,
    category: 'Масаж',
    emoji: '💆',
    available: true,
  }
]

export async function GET() {
  try {
    // 1. Підключаємося до MongoDB Atlas
    await dbConnect()

    // 2. Очищаємо стару колекцію, щоб уникнути дублікатів при повторних викликах
    await Drink.deleteMany({})

    // 3. Записуємо наш масив спа-процедур у хмару
    const services = await Drink.create(initialServices)

    // Повертаємо красиву JSON-відповідь про успіх
    return Response.json({
      message: `Базу даних Spa Oasis успішно наповнено! Створено послуг: ${services.length}`,
      services,
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}