import { services } from './services'

export function getServiceStats() {
  const total = services.length
  const available = services.filter(s => s.available).length
  const unavailable = total - available
  const categories = [...new Set(services.map(s => s.category))]
  const avgPrice = Math.round(services.reduce((sum, s) => sum + s.price, 0) / total)

  return { 
    total, 
    available, 
    unavailable, 
    categoriesCount: categories.length, 
    avgPrice 
  }
}