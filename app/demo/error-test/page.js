// Примусово робимо сторінку динамічною, щоб перевірка відбувалася при кожному запиті
export const dynamic = 'force-dynamic'


function checkForSystemFailure() {
  return Math.random() > 0.5
}

export default async function ErrorTestPage() {
  /
  const shouldFail = checkForSystemFailure()

  if (shouldFail) {
    throw new Error('Упс! Роботу гідромасажних систем тимчасово призупинено для тестування error.js')
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl shadow-sm text-center">
        <span className="text-5xl block mb-4">🌿</span>
        <h1 className="text-3xl font-extrabold text-emerald-900 mb-2">
          Успіх! Помилки не сталося
        </h1>
        <p className="text-emerald-700 font-medium">
          Все працює ідеально. Оновіть сторінку (F5) — є 50% шанс спровокувати збій системи.
        </p>
      </div>
    </div>
  )
}