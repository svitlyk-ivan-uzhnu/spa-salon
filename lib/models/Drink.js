import mongoose from 'mongoose'

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Назва процедури обов\'язкова'],
    trim: true,
    maxlength: [100, 'Назва послуги не може бути довшою за 100 символів'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Вартість процедури обов\'язкова'],
    min: [0, 'Ціна послуги не може бути від\'ємною'],
  },
  category: {
    type: String,
    required: [true, 'Категорія послуги обов\'язкова'],
    enum: {
      values: ['Масаж', 'Догляд', 'Водні', 'Інше'],
      message: 'Категорія має бути одна з: Масаж, Догляд, Водні або Інше',
    },
    default: 'Масаж',
  },
  emoji: {
    type: String,
    default: '🌿', // За замовчуванням ніжне спа-емодзі
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  // Автоматично додає поля createdAt та updatedAt (час створення та оновлення картки)
  timestamps: true,
})

// Захист від помилки OverwriteModelError при Hot Reload у Next.js
export default mongoose.models.Drink || mongoose.model('Drink', drinkSchema)