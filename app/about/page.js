// Сторінка "Про проект"
// Тема: Спа-салон (Spa Oasis)

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Головний заголовок */}
        <h1 className="text-4xl font-bold mb-6 text-gray-900 border-b-4 border-emerald-500 pb-2 inline-block">
          Про Спа-салон 🌿
        </h1>
        
        {/* Основний опис */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 mt-6">
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            <strong>«Spa Oasis»</strong> — це сучасна вебплатформа, розроблена для повної автоматизації та оптимізації процесів в сфері бюті-індустрії та спа-послуг. Система створена як для клієнтів, які бажають швидко та зручно отримати послуги релаксу, так і для адміністрації салону, що прагне ефективно керувати бізнесом.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            <strong>Для кого цей застосунок?</strong> Він орієнтований на відвідувачів спа-салонів, масажистів, косметологів та менеджерів. Застосунок повністю вирішує проблему «живої черги», тривалих телефонних дзвінків для запису та складного ручного ведення графіків роботи персоналу.
          </p>
        </div>

        {/* Блок з технологіями та розробником */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Технологічний стек */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
              🚀 Технології проєкту
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Next.js (React)</strong> — архітектура та швидкий рендеринг сторінок.</li>
              <li><strong>Tailwind CSS</strong> — сучасний та адаптивний дизайн компонентів.</li>
              <li><strong>JavaScript (ES6+)</strong> — логіка роботи застосунку.</li>
            </ul>
          </div>

          {/* Інформація про команду */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
              👤 Розробка та підтримка
            </h2>
            <p className="text-gray-600 mb-2">
              Проєкт розроблено в рамках навчальної дисципліни.
            </p>
            <p className="text-gray-700 font-semibold">
              Автор курсового проєкту: <span className="text-emerald-600">Іван</span>
            </p>
           <p className="text-sm text-gray-500 mt-2">
               Курс «Основи обробки та передачі інформації»
</p>
          </div>
        </div>
      </div>
    </div>
  )
}