import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, RESPONSE_CODES } from '@/utils/constants'

axios.defaults.withCredentials = true

// import {
//   getBookmarkedPosts,
//   getUserPosts,
//   getRepliedPosts,
//   deleteCommunityPost,
//   bookmarkPost,
// } from '@/api/community'

// 북마크 포스트 조회
export async function getBookmarkedPosts(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function getUserPosts(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function getRepliedPosts(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function deleteCommunityPost(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function bookmarkPost(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function createCommunityPost(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function getCategories(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}
