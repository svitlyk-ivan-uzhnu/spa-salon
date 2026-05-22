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

export default Service;