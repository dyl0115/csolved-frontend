// 이메일 유효성 검사
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 비밀번호 유효성 검사 (최소 8자, 대소문자, 숫자 포함)
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: password.length < minLength,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumbers: !hasNumbers
    }
  }
}

// 닉네임 유효성 검사 (2-20자, 한글, 영문, 숫자만 허용)
export const validateNickname = (nickname) => {
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,20}$/
  return nicknameRegex.test(nickname)
}

// 전화번호 유효성 검사
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
  return phoneRegex.test(phoneNumber)
}

// 게시글 제목 유효성 검사 (1-100자)
export const validatePostTitle = (title) => {
  return title.trim().length >= 1 && title.trim().length <= 100
}

// 게시글 내용 유효성 검사 (1-10000자)
export const validatePostContent = (content) => {
  return content.trim().length >= 1 && content.trim().length <= 10000
}

// URL 유효성 검사
export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 파일 크기 검사 (MB 단위)
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return false
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// 파일 확장자 검사
export const validateFileExtension = (file, allowedExtensions = []) => {
  if (!file) return false
  const fileExtension = file.name.split('.').pop().toLowerCase()
  return allowedExtensions.includes(fileExtension)
}

// 이미지 파일 검사
export const validateImageFile = (file) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  return validateFileExtension(file, allowedExtensions) && validateFileSize(file, 5)
}