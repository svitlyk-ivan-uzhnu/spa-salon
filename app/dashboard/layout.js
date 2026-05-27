// app/layout.js
import { Toaster } from "sonner"; // ✨ Імпорт бібліотеки сповіщень sonner
import AuthProvider from "@/components/AuthProvider";
import FavoritesProvider from "@/components/FavoritesProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css"; // Твої глобальні стилі CSS (може відрізнятися шлях)

export const metadata = {
  title: "Spa Oasis — Твій простір релаксу",
  description: "Найкращі спа-процедури, масажі та оздоровчі комплекси для вашого тіла та душі.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <FavoritesProvider>
            {/* Навігаційна шапка сайту */}
            <Header />
            
            {/* Головний контент сторінок */}
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            
            {/* Футер */}
            <Footer />
          </FavoritesProvider>
        </AuthProvider>

        {/* 🔔 Глобальний Toaster для гарних та спливаючих повідомлень */}
        <Toaster 
          richColors 
          position="top-right" 
          closeButton
          toastOptions={{
            style: { padding: '12px 16px', borderRadius: '12px' },
          }}
        />
      </body>
    </html>
  );
}