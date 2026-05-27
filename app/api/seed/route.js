// Тиждень 9: Seed endpoint — наповнює базу початковими даними
// GET /api/seed — видаляє всі документи та створює нові для Spa Oasis
// Тиждень 11: seed спа-візитів через Order (Booking) + OrderItem (BookingItem) (many-to-many)

import dbConnect from "@/lib/db";
import Service from "@/lib/models/Drink";     // Твоя модель Drink, що виконує роль спа-послуги
import User from "@/lib/models/User";
import Booking from "@/lib/models/Booking";
import BookingItem from "@/lib/models/BookingItem";
import bcrypt from "bcryptjs";

// Початковий каталог спа-процедур салону Spa Oasis
const initialServices = [
  { name: "Тайський масаж", description: "Глибокий традиційний масаж для відновлення енергії.",
    price: 1200, emoji: "💆‍♂️", category: "Масаж", available: true },
  { name: "Аромамасаж", description: "Розслабляючий масаж з використанням натуральних ефірних олій.",
    price: 1400, emoji: "🌸", category: "Масаж", available: true },
  { name: "Стоун-терапія", description: "Масаж гарячим вулканічним камінням для зняття спазмів.",
    price: 1600, emoji: "🪨", category: "Масаж", available: true },
  { name: "Прес-терапія", description: "Лімфодренажний апаратний масаж для детоксикації.",
    price: 800, emoji: "🌬️", category: "Апаратна", available: true },
  { name: "Ультразвукова чистка", description: "Глибоке та делікатне очищення шкіри обличчя.",
    price: 950, emoji: "✨", category: "Обличчя", available: false },
  { name: "Обгортання ламінарією", description: "Потужний детокс та моделювання контурів тіла.",
    price: 1500, emoji: "🌿", category: "Тіло", available: true },
  { name: "Шоколадний спа-догляд", description: "Ніжний пілінг та маска-обгортання для м'якості шкіри.",
    price: 1800, emoji: "🍫", category: "Тіло", available: true },
  { name: "Кисневий догляд", description: "Інтенсивне зволоження та насичення клітин обличчя киснем.",
    price: 1100, emoji: "💧", category: "Обличчя", available: true },
  { name: "Спа-манікюр", description: "Комплексний догляд за шкірою рук з парафінотерапією.",
    price: 600, emoji: "💅", category: "Догляд", available: true },
  { name: "Трав'яна сауна", description: "Прогрівання в кедровій бочці з екстрактами карпатських трав.",
    price: 500, emoji: "🪵", category: "Інше", available: true },
];

// Хелпер: створити Спа-візит + його позиції одним транзакційним блоком
async function seedBooking({ user, items, status, notes = "" }) {
  const totalPrice = items.reduce(
    (sum, it) => sum + it.service.price * it.quantity,
    0
  );

  const booking = await Booking.create({
    user: user._id,
    totalPrice,
    status,
    notes,
  });

  // Записуємо проміжні лінки для зв'язку many-to-many
  await BookingItem.insertMany(
    items.map((it) => ({
      order: booking._id,        // поле в схемі за замовчуванням
      drink: it.service._id,     // поле в схемі за замовчуванням (або service)
      quantity: it.quantity,
      priceAtOrder: it.service.price, // Фіксуємо snapshot ціни
    }))
  );

  return booking;
}

export async function GET() {
  try {
    await dbConnect();

    // 1. Очищення та наповнення спа-послуг
    await Service.deleteMany({});
    const services = await Service.create(initialServices);

    // 2. Очищення та створення акаунтів персоналу й гостей
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      { name: "Головний Адміністратор", email: "admin@test.com",
        password: hashedPassword, role: "admin" },
      { name: "Іван Петренко", email: "user@test.com",
        password: hashedPassword, role: "user" },
      { name: "Олена Ковальчук", email: "olena@test.com",
        password: hashedPassword, role: "user" },
    ]);

    // 3. Очищення старих таблиць зв'язків
    await Booking.deleteMany({});
    await BookingItem.deleteMany({});

    const [admin, userOne, userTwo] = users;
    const [thai, aroma, stone, press, , wrap, chocolate, oxygen, manicure, sauna] = services;

    // Створюємо 6 реалістичних замовлень з різною кількістю послуг (від 1 до 3)
    const bookingsData = [
      // Візит 1: 2 позиції (many-to-many)
      { 
        user: userOne,
        items: [
          { service: aroma, quantity: 2 },    // Масаж для пари
          { service: wrap, quantity: 1 },
        ],
        status: "pending", 
        notes: "Потрібні два майстри-жінки, кабінет Relax" 
      },
      // Візит 2: 1 позиція
      { 
        user: userOne,
        items: [{ service: stone, quantity: 1 }],
        status: "completed" 
      },
      // Візит 3: 3 позиції (інтенсивний спа-день)
      { 
        user: userTwo,
        items: [
          { service: thai, quantity: 1 },
          { service: oxygen, quantity: 1 },
          { service: sauna, quantity: 2 },   // Сауна на двох
        ],
        status: "preparing", 
        notes: "Алергія на цитрусові аромаолії" 
      },
      // Візит 4: 1 позиція
      { 
        user: userTwo,
        items: [{ service: chocolate, quantity: 1 }],
        status: "ready" 
      },
      // Візит 5: 2 позиції
      { 
        user: userTwo,
        items: [
          { service: sauna, quantity: 3 },
          { service: manicure, quantity: 2 },
        ],
        status: "pending" 
      },
      // Візит 6: Оформлення від імені адміна
      { 
        user: admin,
        items: [{ service: press, quantity: 1 }],
        status: "completed" 
      },
    ];

    const bookings = [];
    for (const data of bookingsData) {
      bookings.push(await seedBooking(data));
    }

    const itemsCount = await BookingItem.countDocuments({});

    return Response.json({
      message: `Seed системи Spa Oasis виконано успішно: ${services.length} спа-процедур, ${users.length} акаунтів, ${bookings.length} візитів, ${itemsCount} заброньованих позицій у чеках`,
      services: services.length,
      users: users.length,
      bookings: bookings.length,
      bookingItems: itemsCount,
      testAccounts: [
        { email: "admin@test.com", password: "password123", role: "admin" },
        { email: "user@test.com",  password: "password123", role: "user" },
        { email: "olena@test.com", password: "password123", role: "user" },
      ],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}