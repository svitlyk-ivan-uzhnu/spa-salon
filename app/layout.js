import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: {
    default: "Спа-салон «Spa Oasis»",
    template: "%s | Spa Oasis",
  },
  description: "Найкращий простір релаксу, масажу та краси у місті.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <FavoritesProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}