import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

// 🚨 НАДВАЖЛИВО: Перевіряємо існування моделі, і ОБОВ'ЯЗКОВО експортуємо через export default
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
// Стратегія: прибираємо BookingItem з цією послугою + видаляємо порожні Booking
ServiceSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    
    if (doc) {
      const BookingItem = mongoose.model("BookingItem");
      const Booking = mongoose.model("Booking");

      // 1) Знаходимо всі замовлення, які зачепить видалення цієї послуги
      const affectedBookings = await BookingItem
        .find({ service: doc._id })
        .distinct("booking");

      // 2) Прибираємо позиції з цією послугою
      await BookingItem.deleteMany({ service: doc._id });

      // 3) Якщо замовлення лишилося без жодної позиції — видаляємо його повністю
      for (const bookingId of affectedBookings) {
        const left = await BookingItem.countDocuments({ booking: bookingId });
        if (left === 0) {
          await Booking.deleteOne({ _id: bookingId });
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
