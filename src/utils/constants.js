// API 상수
export const API_BASE_URL = 'http://localhost:8080'

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/api/auth/signUp',
    SIGN_IN: '/api/auth/signIn',
    SIGN_OUT: '/api/auth/signOut',
    WITHDRAW: '/api/auth/withdraw',
    REFRESH: '/api/auth/refresh',
    CHECK_SESSION: '/api/auth/session',
  },

  NOTICE: {
    CREATE: `/api/notice`,
    UPDATE: (noticeId) => `/api/notice/${noticeId}`,
    DELETE: (noticeId) => `/api/notice/${noticeId}`,
    LIST: `/api/notices`,
    DETAIL: (noticeId) => `/api/notice/${noticeId}`,
  },

  POST: {
    LIST: '/api/posts',
    DETAIL: '/api/post',
    CREATE: '/api/post',
    UPDATE: '/api/post',
    DELETE: '/api/post',
    CATEGORIES: '/api/categories',
    REPLIED: '/api/post/replied',
    WROTE: '/api/posts/wrote',
    LIKE: {
      ADD: (postId) => `/api/post/${postId}/like`,
    },

    ANSWER: {
      LIST: (postId) => `/api/post/${postId}/answers`,
      CREATE: '/api/post/answer',
      DELETE: (answerId) => `/api/post/answer/${answerId}`,
    },

    COMMENT: {
      CREATE: (postId, answerId) => `/api/community/${postId}/answer/${answerId}/comment`,
      DELETE: (commentId) => `/api/community/comment/${commentId}`,
    },

    BOOKMARK: {
      // LIST: '/api/bookmarks',
      ADD: (postId) => `/api/post/${postId}/bookmark`,
      REMOVE: (postId) => `/api/post/${postId}/bookmark`,
      STATUS: (postId) => `/api/post/${postId}/bookmark`,
      LIST: '/api/bookmarks',
    },
  },

  USER: {
    PROFILE: '/api/users/profile',
  },
}

// 응답 코드 상수
export const RESPONSE_CODES = {
  SUCCESS: 'SUCCESS',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  DUPLICATE_NICKNAME: 'DUPLICATE_NICKNAME',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_SESSION: 'INVALID_SESSION',

  ALREADY_LIKED: 'ALREADY_LIKED',
}

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
}

// 정렬 옵션 상수
export const SORT_OPTIONS = {
  RECENT: 'recent',
  POPULAR: 'popular',
  VIEWS: 'views',
  COMMENTS: 'comments',
}

// 게시판 레이아웃 상수
export const LAYOUTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  CARD: 'card',
  TABLE: 'table',
}

// 컴포넌트 크기 상수
export const SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
}

// 컴포넌트 variants 상수
export const VARIANTS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
}
