import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, RESPONSE_CODES } from '@/utils/constants'

axios.defaults.withCredentials = true

export async function updateProfile(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}
