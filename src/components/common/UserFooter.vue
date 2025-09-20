<template>
  <footer class="py-3 bg-dark">
    <div class="container px-3 px-lg-4">
      <div class="row">
        <div class="col-md-4 text-center text-white">
          <h5>CSolved Platform</h5>
          <p style="font-size: 0.9rem">
            신입 백엔드 개발자들이 함께 성장하고 경험을 공유할 수 있는 플랫폼입니다.
          </p>
        </div>
        <div class="col-md-4 text-center text-white">
          <h5>게시판</h5>
          <div style="font-size: 0.9rem">
            <router-link to="/communities?page=1" class="footer-link"> 커뮤니티 </router-link><br />
            <router-link to="/questions?page=1" class="footer-link"> 면접질문 </router-link><br />
            <router-link to="/code-reviews?page=1" class="footer-link"> 코드리뷰 </router-link
            ><br />
          </div>
        </div>
        <div class="col-md-4 text-center text-white">
          <h5>고객지원</h5>
          <p style="font-size: 0.9rem">
            <i class="bi bi-envelope"></i>
            Email: dyl0115@naver.com<br />
          </p>
        </div>
      </div>
      <div class="text-center text-white mt-3">
        <p class="m-0" style="font-size: 0.8rem">Copyright &copy; CSolved {{ currentYear }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'UserFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
.footer-link {
  text-decoration: none;
  font-size: 0.9rem;
  color: inherit;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #adb5bd;
  text-decoration: underline;
}

footer {
  margin-top: auto;
}

h5 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.bi-envelope {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .col-md-4 {
    margin-bottom: 2rem;
  }

  .col-md-4:last-child {
    margin-bottom: 0;
  }
}
</style>
