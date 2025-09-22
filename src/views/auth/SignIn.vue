<template>
  <DefaultHeader />
  <section class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
        <!-- 로고 -->
        <AuthLogo />
        <!-- 로그인 입력 폼 -->
        <div class="p-6">
          <form @submit.prevent="handleSignin" class="space-y-4">
            <!-- 이메일 입력 -->
            <InputField
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요."
              v-model="signInForm.email"
              :error="errors.email"
            />

            <!-- 비밀번호 입력 -->
            <InputField
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요."
              v-model="signInForm.password"
              :error="errors.password"
            />

            <!-- 글로벌 에러 메시지 -->
            <div
              v-if="globalErrors.length > 0"
              class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
            >
              <p v-for="error in globalErrors" :key="error">{{ error }}</p>
            </div>

            <!-- 로그인 버튼 -->
            <LoadingButton
              type="submit"
              text="로그인"
              loadingText="처리 중..."
              :loading="loading"
              :disabled="!isFormValid"
            >
            </LoadingButton>

            <!-- 회원가입 링크 -->
            <div class="text-center text-sm text-gray-600">
              아직 회원이 아니신가요?
              <router-link to="/signup" class="text-blue-500 hover:text-blue-600">
                회원가입
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>

<script>
import { signIn } from '../../api/auth.js'
import { useAuthStore } from '../../stores/auth.js'
import AuthLogo from '../../components/auth/AuthLogo.vue'
import InputField from '../../components/common/DefaultInputField.vue'
import DefaultHeader from '../../components/common/BasicHeader.vue'
import DefaultFooter from '../../components/common/BasicFooter.vue'
import LoadingButton from '../../components/common/LoadingButton.vue'

export default {
  name: 'SignIn',
  components: {
    AuthLogo,
    DefaultHeader,
    DefaultFooter,
    InputField,
    LoadingButton,
  },

  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },

  data() {
    return {
      signInForm: {
        email: '',
        password: '',
      },
      errors: {},
      globalErrors: [],
      loading: false,
    }
  },

  computed: {
    isFormValid() {
      return (
        this.signInForm.email && this.signInForm.password && Object.keys(this.errors).length === 0
      )
    },
  },

  watch: {
    'signInForm.email'() {
      this.validateEmail()
    },
  },

  methods: {
    async handleSignin() {
      if (!this.validateAll()) return

      this.loading = true
      this.globalErrors = []

      try {
        const result = await signIn({
          email: this.signInForm.email,
          password: this.signInForm.password,
        })

        if (result.success) {
          await this.authStore.signIn(result.data)
          await this.$router.push('/communities')
        } else {
          this.globalErrors = [result.message]
        }
      } catch (error) {
        this.globalErrors = [error.message || '로그인 중 오류가 발생했습니다.']
      } finally {
        this.loading = false
      }
    },

    validateAll() {
      this.errors = {}
      this.validateEmail()
      return Object.keys(this.errors).length === 0
    },

    validateEmail() {
      if (!this.signInForm.email) {
        this.errors.email = '이메일을 입력해주세요.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signInForm.email)) {
        this.errors.email = '올바른 이메일 형식을 입력해주세요.'
      } else {
        delete this.errors.email
      }
    },
  },
}
</script>
