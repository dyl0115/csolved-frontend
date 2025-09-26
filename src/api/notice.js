import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'

axios.defaults.withCredentials = true

// 공지사항 리스트 조회
export async function getNotices(params = {}) {
  try {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.searchType) queryParams.append('searchType', params.searchType)
    if (params.searchKeyword) queryParams.append('searchKeyword', params.searchKeyword)

    const url = `${API_BASE_URL}/api/notices${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await axios.get(url)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 공지사항 상세 조회
export async function getNoticeDetail(noticeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notice/${noticeId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 공지사항 작성
export async function createNotice(noticeData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/notice`, noticeData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 공지사항 수정
export async function updateNotice(noticeId, noticeData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/notice/${noticeId}`, noticeData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 공지사항 삭제
export async function deleteNotice(noticeId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/notice/${noticeId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}