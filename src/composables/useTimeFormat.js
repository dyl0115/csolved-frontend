// import { computed } from 'vue'

export function useTimeFormat() {
  // 시간 차이 계산 함수
  const getTimeDifference = (date) => {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInMs = now.getTime() - targetDate.getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    return {
      seconds: diffInSeconds,
      minutes: diffInMinutes,
      hours: diffInHours,
      days: diffInDays,
      months: diffInMonths,
      years: diffInYears,
    }
  }

  // 상대 시간 포맷팅 (예: "방금 전", "3분 전", "2시간 전")
  const formatTimeAgo = (date) => {
    if (!date) return ''

    try {
      const diff = getTimeDifference(date)

      if (diff.seconds < 60) {
        return '방금 전'
      } else if (diff.minutes < 60) {
        return `${diff.minutes}분 전`
      } else if (diff.hours < 24) {
        return `${diff.hours}시간 전`
      } else if (diff.days < 7) {
        return `${diff.days}일 전`
      } else if (diff.days < 30) {
        const weeks = Math.floor(diff.days / 7)
        return `${weeks}주 전`
      } else if (diff.months < 12) {
        return `${diff.months}개월 전`
      } else {
        return `${diff.years}년 전`
      }
    } catch (error) {
      console.error('시간 포맷팅 오류:', error)
      return ''
    }
  }

  // 절대 시간 포맷팅 (예: "2023-12-01 14:30")
  const formatDateTime = (date, options = {}) => {
    if (!date) return ''

    try {
      const targetDate = new Date(date)
      const {
        showTime = true,
        showSeconds = false,
        dateFormat = 'YYYY-MM-DD',
        timeFormat = '24h',
      } = options

      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const day = String(targetDate.getDate()).padStart(2, '0')
      const hours = targetDate.getHours()
      const minutes = String(targetDate.getMinutes()).padStart(2, '0')
      const seconds = String(targetDate.getSeconds()).padStart(2, '0')

      let dateString = ''
      if (dateFormat === 'YYYY-MM-DD') {
        dateString = `${year}-${month}-${day}`
      } else if (dateFormat === 'MM/DD/YYYY') {
        dateString = `${month}/${day}/${year}`
      } else if (dateFormat === 'DD.MM.YYYY') {
        dateString = `${day}.${month}.${year}`
      } else if (dateFormat === 'korean') {
        dateString = `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
      }

      if (!showTime) return dateString

      let timeString = ''
      if (timeFormat === '12h') {
        const period = hours >= 12 ? '오후' : '오전'
        const displayHours = hours % 12 || 12
        timeString = `${period} ${displayHours}:${minutes}`
      } else {
        timeString = `${String(hours).padStart(2, '0')}:${minutes}`
      }

      if (showSeconds) {
        timeString += `:${seconds}`
      }

      return `${dateString} ${timeString}`
    } catch (error) {
      console.error('날짜 시간 포맷팅 오류:', error)
      return ''
    }
  }

  // 날짜만 포맷팅 (예: "2023-12-01")
  const formatDate = (date, format = 'YYYY-MM-DD') => {
    return formatDateTime(date, { showTime: false, dateFormat: format })
  }

  // 시간만 포맷팅 (예: "14:30")
  const formatTime = (date, format = '24h', showSeconds = false) => {
    if (!date) return ''

    try {
      const targetDate = new Date(date)
      const hours = targetDate.getHours()
      const minutes = String(targetDate.getMinutes()).padStart(2, '0')
      const seconds = String(targetDate.getSeconds()).padStart(2, '0')

      if (format === '12h') {
        const period = hours >= 12 ? '오후' : '오전'
        const displayHours = hours % 12 || 12
        return showSeconds
          ? `${period} ${displayHours}:${minutes}:${seconds}`
          : `${period} ${displayHours}:${minutes}`
      } else {
        const displayHours = String(hours).padStart(2, '0')
        return showSeconds ? `${displayHours}:${minutes}:${seconds}` : `${displayHours}:${minutes}`
      }
    } catch (error) {
      console.error('시간 포맷팅 오류:', error)
      return ''
    }
  }

  // 한국어 요일 포맷팅
  const formatDayOfWeek = (date, format = 'long') => {
    if (!date) return ''

    try {
      const targetDate = new Date(date)
      const days = {
        long: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        short: ['일', '월', '화', '수', '목', '금', '토'],
      }

      return days[format][targetDate.getDay()]
    } catch (error) {
      console.error('요일 포맷팅 오류:', error)
      return ''
    }
  }

  // D-Day 계산
  const formatDDay = (targetDate) => {
    if (!targetDate) return ''

    try {
      const today = new Date()
      const target = new Date(targetDate)

      // 시간 정보 제거 (날짜만 비교)
      today.setHours(0, 0, 0, 0)
      target.setHours(0, 0, 0, 0)

      const diffTime = target.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return 'D-Day'
      } else if (diffDays > 0) {
        return `D-${diffDays}`
      } else {
        return `D+${Math.abs(diffDays)}`
      }
    } catch (error) {
      console.error('D-Day 계산 오류:', error)
      return ''
    }
  }

  // 유효한 날짜인지 확인
  const isValidDate = (date) => {
    const dateObj = new Date(date)
    return dateObj instanceof Date && !isNaN(dateObj)
  }

  return {
    formatTimeAgo,
    formatDateTime,
    formatDate,
    formatTime,
    formatDayOfWeek,
    formatDDay,
    isValidDate,
    getTimeDifference,
  }
}
