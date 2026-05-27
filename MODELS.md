# Проєктування сутностей "Бронювання" для Spa Oasis

## 1. Модель Booking (Верхній рівень)
- `user`: ObjectId, ref: 'User' (індексоване)
- `totalPrice`: Number, required (загальна сума)
- `status`: String, enum: ['pending', 'in-progress', 'done', 'cancelled'], default: 'pending'
- `notes`: String, optional (коментар клієнта)
- `createdAt` / `updatedAt`: Timestamps
- **Індекси:** `{ user: 1, createdAt: -1 }`

## 2. Модель BookingItem (Pivot-колекція зв'язку Many-to-Many)
- `booking`: ObjectId, ref: 'Booking' (індексоване)
- `service`: ObjectId, ref: 'Service' (індексоване)
- `quantity`: Number, required, min: 1 (кількість осіб)
- `priceAtBooking`: Number, required (фіксація ціни на момент замовлення)