import axios from 'axios'

const API_BASE = 'http://localhost:8080'
axios.default.withCredentials = true

// 회원가입
export async function signUp(userData) {
  const response = await axios.post(`${API_BASE}/api/auth/signUp`, userData)

  if (response.data.code === 'DUPLICATE_EMAIL') {
    return { success: false, message: '이미 존재하는 이메일입니다.' }
  }

  if (response.data.code === 'DUPLICATE_NICKNAME') {
    return { success: false, message: '이미 존재하는 닉네임입니다.' }
  }

  return { success: true, data: response.data }
}

// 로그인
export async function signIn(userData) {
  const response = await axios.post(`${API_BASE}/api/auth/signIn`, userData, {
    withCredentials: true,
  })

  if (response.data.code === 'USER_NOT_FOUND') {
    return { success: false, message: '등록되지 않은 이메일입니다.' }
  }

  if (response.data.code === 'INVALID_PASSWORD') {
    return { success: false, message: '비밀번호가 올바르지 않습니다.' }
  }

  return { success: true, data: response.data }
}
