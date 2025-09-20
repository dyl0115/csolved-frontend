<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/communities?page=1">Csolved</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :class="{ active: $route.path.includes('/communities') }"
              to="/communities?page=1"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/notices?page=1">공지사항</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/communities?page=1">커뮤니티</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/questions?page=1">면접질문</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/code-reviews?page=1">코드리뷰</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user.nickname }}
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
              style="z-index: 1050"
            >
              <li>
                <router-link class="dropdown-item" to="/users/profile">내 프로필</router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  to="/users/activity?bookmarkPage=1&userPostPage=1&repliedPostPage=1"
                >
                  내 활동
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" @click="signOut" href="#">로그아웃</a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#withdrawModal"
                  href="#"
                >
                  회원탈퇴
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 회원탈퇴 경고 모달 -->
  <div
    class="modal fade"
    id="withdrawModal"
    tabindex="-1"
    aria-labelledby="withdrawModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="withdrawModalLabel">회원탈퇴</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-danger" @click="withdraw" data-bs-dismiss="modal">
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeader',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        nickname: '사용자',
      }),
    },
  },
  methods: {
    signOut() {
      // 로그아웃 로직 구현
      if (confirm('로그아웃 하시겠습니까?')) {
        // API 호출 또는 상태 관리를 통한 로그아웃 처리
        this.$emit('sign-out')
        // 또는 직접 처리
        // this.$router.push('/login');
      }
    },
    withdraw() {
      // 회원탈퇴 로직 구현
      this.$emit('withdraw')
    },
  },
}
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}

.nav-link.router-link-active {
  color: #fff !important;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>
