import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Введіть email та пароль')
        }

        // Підключаємося до бази даних MongoDB
        await dbConnect()

        // Знаходимо користувача і явно запитуємо пароль, який за замовчуванням прихований (select: false)
        const user = await User.findOne({
          email: credentials.email
        }).select('+password')

        if (!user) {
          throw new Error('Невірний email або пароль')
        }

        // Порівнюємо введений пароль із захешованим у базі даних
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error('Невірний email або пароль')
        }

        // Повертаємо об'єкт користувача (без пароля) для формування сесії
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt', // Використовуємо JSON Web Tokens для збереження сесії
  },

  callbacks: {
    async jwt({ token, user }) {
      // При першому вході додаємо унікальні дані (id та роль) в токен
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      // Переносимо роль та id користувача з JWT-токена в об'єкт сесії, щоб читати їх на фронтенді
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/login', // Вказуємо кастомну сторінку авторизації
  },

  secret: process.env.NEXTAUTH_SECRET, // Наш згенерований раніше секретний ключ
}