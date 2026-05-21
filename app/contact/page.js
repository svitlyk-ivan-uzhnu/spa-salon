export const metadata = {
  title: "Контакти | Spa Oasis",
  description: "Зв’яжіться зі спа-салоном «Spa Oasis» для запису на процедури",
};

export default function ContactPage() {
  return (
    <div>
      {/* Шапка сторінки контактів */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Контакти</h1>
          <p className="text-lg opacity-90">Ми завжди раді допомогти вам відновити сили та релаксувати</p>
        </div>
      </section>

      {/* Основний контент */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Блок з контактною інформацією */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-950 border-b-2 border-emerald-500 pb-2 inline-block">
                Наші контакти
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Адреса салону</p>
                    <p className="text-gray-600">вул. Тімірязева, 12, м. Ужгород</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold text-gray-900">Телефон для запису</p>
                    <p className="text-gray-600">+380 96 628-72-53</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p className="font-semibold text-gray-900">Графік роботи</p>
                    <p className="text-gray-600">Пн-Пт: 9:00 - 21:00</p>
                    <p className="text-gray-600">Сб-Нд: 10:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок майбутньої форми зворотного зв'язку */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-950 border-b-2 border-emerald-500 pb-2 inline-block">
                Напишіть нам
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-600 leading-relaxed">
                  Форма онлайн-бронювання процедур та зворотного зв’язку буде додана пізніше (тиждень 12).
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}