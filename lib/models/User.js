import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ім'я обов'язкове"],
    trim: true,
    maxlength: [50, "Ім'я не може бути довшим за 50 символів"],
  },
  email: {
    type: String,
    required: [true, 'Email обов\'язковий'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Невалідний формат email'],
  },
  password: {
    type: String,
    required: [true, 'Пароль обов\'язковий'],
    minlength: [6, 'Пароль має містити щонайменше 6 символів'],
    select: false, // Захищає хеш пароля від випадкового витоку в API
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Роль має бути: user або admin',
    },
    default: 'user',
  },
}, {
  timestamps: true, // Автоматично додасть поля createdAt та updatedAt
})

export default mongoose.models.User || mongoose.model('User', userSchema)