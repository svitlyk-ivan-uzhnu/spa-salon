import Link from 'next/link';
import MenuCard from "@/components/MenuCard";

// Дані для популярних спа-процедур салону «Spa Oasis»
const popularItems = [
  { 
    id: 1, 
    name: "Масаж «Гаряче каміння»", 
    description: "Глибоке розслаблення м'язів за допомогою розігрітих вулканічних каменів та аромаолій.", 
    price: 1200, 
    emoji: "🌋", 
    category: "Масаж",
    available: true 
  },
  { 
    id: 2, 
    name: "Шоколадне обгортання", 
    description: "Поживне маскування всього тіла натуральним шоколадом для гладкості та пружності шкіри.", 
    price: 1500, 
    emoji: "🍫", 
    category: "Догляд за тілом",
    available: true 
  },
  { 
    id: 3, 
    name: "Пакет «Повне відновлення»", 
    description: "Комплексна програма: розпарювання у фітобочці, скрабування та заспокійливий масаж.", 
    price: 2400, 
    emoji: "🌿", 
    category: "СПА-пакети",
    available: false 
  },
];

export default function Home() {
  return (
    <>
      {/* Hero секція */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Spa Oasis 🌿
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Сучасна система автоматизації спа-салону: від онлайн-запису на процедури до керування розкладом майстрів та програмами релаксації.
          </p>
          
          {/* Блок з двома кнопками */}
          <div className="flex justify-center gap-4">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition">
              Записатися на сеанс
            </button>
            <Link href="/about" className="bg-emerald-700 bg-opacity-50 text-white border border-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-100 transition">
              Про проєкт ➡️
            </Link>
          </div>
        </div>
      </section>

      {/* Популярні процедури (Динамічний рендеринг через .map) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Популярні процедури
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularItems.map((item) => (
              <MenuCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}