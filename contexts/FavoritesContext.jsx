'use client'
import { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  // Лінива ініціалізація стейту: завантажуємо з localStorage ОДРАЗУ при створенні, 
  // безпечно перевіряючи, чи ми вже в браузері (typeof window !== 'undefined')
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spa_favorites')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
      localStorage.setItem('spa_favorites', JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (id) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}