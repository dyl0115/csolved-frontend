import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, RESPONSE_CODES } from '@/utils/constants'

axios.defaults.withCredentials = true

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

// 게시글 삭제
export async function deleteCommunityPost(postId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.DELETE}/${postId}`,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 북마크 등록
export async function bookmarkPost(postId) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.BOOKMARK.ADD}/${postId}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 북마크 취소
export async function removeBookmark(postId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.BOOKMARK.REMOVE}/${postId}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 등록
export async function createCommunityPost(postData) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.CREATE}`, postData)

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 상세 조회
export async function getCommunityPostDetail(postId) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.DETAIL}/${postId}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 수정
export async function updateCommunityPost(postId, updateForm) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.DETAIL}/${postId}`,
      updateForm,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 카테고리 조회
export async function getCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.CATEGORIES}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 좋아요
export async function likeCommunityPost(postId) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LIKE.ADD}/${postId}`)

    if (response.data.code === RESPONSE_CODES.ALREADY_LIKED) {
      return { suceess: false, message: response.data.message }
    }

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 댓글 등록
export async function createAnswer(answerForm) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.ANSWER.CREATE}`,
      answerForm,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 댓글 삭제
export async function deleteAnswer(answerId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.COMMUNITY.ANSWER.DELETE}/${answerId}`,
      answerId,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function createComment(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

export async function deleteComment(userData) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USER.ACTIVITY}`, userData)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}
