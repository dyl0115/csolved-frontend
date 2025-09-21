// 숫자를 천 단위로 포맷팅 (예: 1234 -> 1,234)
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 파일 크기를 읽기 쉬운 형태로 변환 (예: 1024 -> 1KB)
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 문자열 자르기 (말줄임표 포함)
export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// 배열을 청크 단위로 나누기
export const chunkArray = (array, chunkSize) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// 객체에서 빈 값들 제거
export const removeEmptyValues = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === null || value === undefined || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      if (typeof value === 'object' && Object.keys(value).length === 0) return false
      return true
    })
  )
}

// 깊은 복사
export const deepCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepCopy(item))
  if (typeof obj === 'object') {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepCopy(obj[key])
    })
    return copy
  }
}

// 디바운스 함수
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 스로틀 함수
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// URL 쿼리 파라미터를 객체로 변환
export const parseQueryParams = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] = params) {
    result[key] = value
  }
  return result
}

// 객체를 쿼리 스트링으로 변환
export const objectToQueryString = (obj) => {
  const params = new URLSearchParams()
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined) {
      params.append(key, obj[key])
    }
  })
  return params.toString()
}

// 랜덤 ID 생성
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2)
  return `${prefix}${timestamp}_${randomStr}`
}

// 색상이 밝은지 어두운지 판단
export const isLightColor = (hexColor) => {
  if (!hexColor) return false

  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}

// 클립보드에 텍스트 복사
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 폴백: textarea 요소를 사용한 복사
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

// 로컬 스토리지 헬퍼
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}