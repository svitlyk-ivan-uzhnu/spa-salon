import mongoose from "mongoose";

const bookingItemSchema = new mongoose.Schema(
  {
    // Посилання на головне бронювання
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true, // Дозволяє швидко знайти всі позиції одного бронювання
    },
    // Посилання на конкретну спа-послугу
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Твоя модель спа-послуг
      required: true,
      index: true, // Дозволяє аналізувати, у яких бронюваннях є ця послуга
    },
    // Кількість осіб на процедуру (наприклад, парний масаж або груповий візит)
    quantity: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 20 
    },
    // Фіксація ціни на момент бронювання (Snapshot)
    priceAtBooking: { 
      type: Number, 
      required: true, 
      min: 0 
    },
  },
  { timestamps: true } // Зберігає час додавання послуги
);

export default mongoose.models.BookingItem || 
  mongoose.model("BookingItem", bookingItemSchema);