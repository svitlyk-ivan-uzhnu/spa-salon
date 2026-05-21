import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
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

      {/* Секція можливостей */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Можливості системи
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Картка 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Онлайн-бронювання</h3>
              <p className="text-gray-600">
                Зручний вибір процедур, масажів чи доглядових програм із можливістю миттєво обрати зручний час та улюбленого майстра.
              </p>
            </div>

            {/* Картка 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💆‍♂️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Управління майстрами</h3>
              <p className="text-gray-600">
                Автоматичний розподіл навантаження на персонал, ведення індивідуальних графіків роботи та контроль зайнятості кабінетів.
              </p>
            </div>

            {/* Картка 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Програми лояльності</h3>
              <p className="text-gray-600">
                Гнучка система обліку абонементів, подарункових сертифікатів та автоматичне нарахування бонусов для постійних клієнтів.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Іван | Курс Основи обробки та передачі інформації
          </p>
        </div>
      </footer>
    </div>
  );
}