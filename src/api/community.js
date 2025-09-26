import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS, RESPONSE_CODES } from '@/utils/constants'

axios.defaults.withCredentials = true

// 북마크 포스트 조회
export async function getBookmarkedPosts(params) {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.POST.BOOKMARK.LIST}?bookmarkPage=${params.page || 1}`
    const response = await axios.get(url)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 내가 작성한 게시글 조회
export async function getUserPosts(params) {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.POST.WROTE}?userPostPage=${params.page || 1}`
    const response = await axios.get(url)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 내가 댓글단 글 조회
export async function getRepliedPosts(params) {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.POST.REPLIED}?repliedPostPage=${params.page || 1}`
    const response = await axios.get(url)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 삭제
export async function deleteCommunityPost(postId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.POST.DELETE}/${postId}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 북마크 여부 확인
export async function hasBookmarked(postId) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.POST.BOOKMARK.STATUS(postId)}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 북마크 등록
export async function bookmarkPost(postId) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.POST.BOOKMARK.ADD(postId)}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 북마크 취소
export async function removeBookmark(postId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.POST.BOOKMARK.REMOVE(postId)}`,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 등록
export async function createCommunityPost(postData) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.POST.CREATE}`, postData)

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 상세 조회
export async function getCommunityPostDetail(postId) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.POST.DETAIL}/${postId}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 수정
export async function updateCommunityPost(postId, updateForm) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.POST.DETAIL}/${postId}`,
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
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.POST.CATEGORIES}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 게시글 좋아요
export async function likeCommunityPost(postId) {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.POST.LIKE.ADD(postId)}`)

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
      `${API_BASE_URL}${API_ENDPOINTS.POST.ANSWER.CREATE}`,
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
      `${API_BASE_URL}${API_ENDPOINTS.POST.ANSWER.DELETE(answerId)}`,
      answerId,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 대댓글 달기
export async function createComment(formData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.POST.COMMENT.CREATE(formData.postId, formData.answerId)}`,
      formData,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 대댓글 삭제
export async function deleteComment(commentId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.POST.COMMENT.DELETE(commentId)}`,
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { suceess: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}

// 답변 목록 조회
export async function getAnswerList(postId) {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.POST.ANSWER.LIST(postId)}`)

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: '잠시후 다시 시도해 주세요. (' + error.message + ')' }
  }
}
