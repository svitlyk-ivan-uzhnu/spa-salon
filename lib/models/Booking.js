import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Посилання на користувача (Клієнта)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Користувач обов'язковий"],
      index: true,
    },
    // Загальна сума бронювання
    totalPrice: { 
      type: Number, 
      required: true, 
      min: [0, "Ціна не може бути меншою за 0"] 
    },
    // Статус візиту в спа-салон
    status: {
      type: String,
      enum: ["pending", "in-progress", "done", "cancelled"],
      default: "pending",
      index: true,
    },
    // Коментарі чи побажання клієнта
    notes: { 
      type: String, 
      maxlength: 300, 
      default: "", 
      trim: true 
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Композитний індекс для швидкого завантаження історії візитів конкретного юзера
bookingSchema.index({ user: 1, createdAt: -1 });

// 🔄 Virtual populate: підтягуємо вибрані спа-послуги з проміжної колекції BookingItem
bookingSchema.virtual("items", {
  ref: "BookingItem",      // З якою моделлю пов'язуємо
  localField: "_id",        // Поле з цієї схеми (Booking ID)
  foreignField: "booking",  // Поле в схемі BookingItem, яке вказує на цей Booking
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

bookingSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    
    if (doc) {
      await mongoose.model("BookingItem").deleteMany({ booking: doc._id });
    }
    next();
  } catch (error) {
    next(error);
  }
});