// Допоміжні функції для обчислення статистики спа-салону
// Використовує Mongoose для отримання актуальних даних з хмари Atlas

import dbConnect from "./db";
import Drink from "./models/Drink";

export async function getDrinkStats() {
  // 1. Обов'язково ініціюємо підключення до бази даних
  await dbConnect();

  // 2. Завантажуємо всі процедури з бази даних
  const drinks = await Drink.find();
  
  const total = drinks.length;
  const available = drinks.filter((d) => d.available).length;
  const unavailable = total - available;
  
  // Збираємо унікальні категорії спа-послуг (Масаж, Догляд тощо)
  const categories = [...new Set(drinks.map((d) => d.category))];
  
  // Обчислюємо середню вартість спа-процедури
  const avgPrice =
    total > 0
      ? Math.round(drinks.reduce((sum, d) => sum + d.price, 0) / total)
      : 0;

  return {
    total,
    available,
    unavailable,
    categoriesCount: categories.length,
    avgPrice,
  };
}