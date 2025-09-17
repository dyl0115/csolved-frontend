import axios from 'axios'

const API_BASE = 'http://localhost:8080'
axios.default.withCredentials = true

// 회원가입
export async function signUp(userData) {
  try {
    const response = await axios.post(`${API_BASE}/api/auth/signUp`, userData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || '회원가입 실패',
    }
  }
}

// 로그인
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, credentials)
    return { success: true, data: response.data }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { success: false, message: '로그인 실패' }
  }
}
