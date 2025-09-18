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
export async function signIn(credentials) {
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, credentials)
    return { success: true, data: response.data }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { success: false, message: '로그인 실패' }
  }
}
