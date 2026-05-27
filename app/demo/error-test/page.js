// Примусово робимо сторінку динамічною
export const dynamic = 'force-dynamic'

export default async function ErrorTestPage() {
  // Замість непередбачуваного Math.random() використовуємо поточний час на сервері.
  // Якщо поточна секунда парна — сторінка працює, якщо непарна — падає в помилку.
  // З погляду React це чистий рендеринг системних даних.
  const currentSecond = new Date().getSeconds()
  const shouldFail = currentSecond % 2 !== 0

  if (shouldFail) {
    throw new Error('Упс! Роботу гідромасажних систем тимчасово призупинено для тестування помилок.')
  }

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Успіх! Помилку не згенеровано</h1>
        <p className="text-green-700 text-sm">
          Все працює ідеально. Оновіть сторінку (F5) — є 50% шанс спровокувати збій системи (залежно від поточної секунди: {currentSecond}).
        </p>
      </div>
    </div>
  )
}