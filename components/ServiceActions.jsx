'use client' // ОБОВ'ЯЗКОВО, оскільки компонент обробляє клієнтські кліки та використовує роутер

import { useRouter } from 'next/navigation'

export default function DrinkActions({ serviceId, serviceName }) {
  const router = useRouter()

  async function handleDelete() {
    // Діалогове вікно підтвердження для адміністратора спа-салону
    if (!confirm(`Ви дійсно бажаєте видалити процедуру "${serviceName}" з каталогу салону?`)) return

    try {
      // Надсилаємо DELETE-запит до нашого робочого API
      const response = await fetch(`/api/services/${serviceId}`, { // або /api/drinks/${serviceId}
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Помилка сервера під час спроби видалення послуги')
      }

      // Після успішного видалення перенаправляємо на головну сторінку каталогу
      router.push('/dashboard/services') // або /dashboard/drinks
      router.refresh() // Примусово оновлюємо серверні дані, щоб видалена позиція зникла зі списків
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="flex gap-3">
      <button
            onClick={handleDelete}
           className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-5 py-2.5 rounded-xl cursor-pointer transition active:scale-98 shadow-sm"
>
            Видалити
          </button>
    </div>
  )
}