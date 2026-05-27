// Тиждень 11: Сторінка створення нового спа-бронювання
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BookingForm from '@/components/BookingForm'

export default function NewBookingPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const body = await res.json().catch(() => ({}))
      setSubmitting(false)

      if (!res.ok) {
        setError(body.errors?.join(', ') || body.error || 'Помилка створення запису')
        return
      }

      // Після успішного створення перенаправляємо на сторінку деталей цього бронювання
      router.push(`/dashboard/bookings/${body._id}`)
      router.refresh()
    } catch (err) {
      setError('Не вдалося з’єднатися з сервером')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
        💆‍♂️ Оформлення нового спа-візиту
      </h1>
      
      <BookingForm 
        onSubmit={handleSubmit} 
        isSubmitting={submitting} 
        error={error} 
      />
    </div>
  )
}