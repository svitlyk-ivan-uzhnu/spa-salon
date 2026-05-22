/**
 * Видаляє HTML-теги з рядка для захисту від XSS
 */
export function stripHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Автоматично санітизує всі рядкові поля в об'єкті
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === "string" ? stripHtml(value) : value;
  }
  return sanitized;
}