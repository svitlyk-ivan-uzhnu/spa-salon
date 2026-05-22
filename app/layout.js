import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import { FavoritesProvider } from '@/contexts/FavoritesContext' 
// ✅ Повертаємо імпорт хедера та футера з папки components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'Spa Oasis | Панель керування',
  description: 'Найкращий спа-салон у місті',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <AuthProvider>
          <FavoritesProvider>
            {/* ✅ Виводимо Header вгорі кожної сторінки сайту */}
            <Header />
            
            {/* Основний контент сторінок */}
            {children}
            
            {/* ✅ Виводимо Footer в самому низу сайту */}
            <Footer />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}