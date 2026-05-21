'use client'
import { useFavorites } from '@/contexts/FavoritesContext' 

export default function FavoriteButton({ serviceId }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const liked = isFavorite(serviceId)

  return (
    <button
      onClick={() => toggleFavorite(serviceId)}
      className="text-xl transition hover:scale-120 cursor-pointer active:scale-95 focus:outline-none select-none"
      title={liked ? 'Видалити з обраного' : 'Додати до обраного'}
    >
      {liked ? '❤️' : '🤍'}
    </button>
  )
}