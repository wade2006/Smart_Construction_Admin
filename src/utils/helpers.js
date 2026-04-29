export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

export function getStatusColor(status) {
  const colors = {
    normal: '#52c41a',
    warning: '#faad14',
    danger: '#f5222d',
    online: '#52c41a',
    offline: '#d9d9d9'
  }
  return colors[status] || '#d9d9d9'
}

export function getAirQualityLevel(value) {
  if (value <= 50) return { level: '优', color: '#00e400' }
  if (value <= 100) return { level: '良', color: '#ffff00' }
  if (value <= 150) return { level: '轻度污染', color: '#ff7e00' }
  if (value <= 200) return { level: '中度污染', color: '#ff0000' }
  if (value <= 300) return { level: '重度污染', color: '#99004c' }
  return { level: '严重污染', color: '#7e0023' }
}

export function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}