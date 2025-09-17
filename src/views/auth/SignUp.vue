<template>
  <section class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
        <!-- 로고 -->
        <AuthLogo />

        <!-- 회원가입 폼 -->
        <div class="p-6">
          <form @submit.prevent="handleSignup">
            <InputField
              label="이메일 주소"
              type="email"
              placeholder="사용할 이메일 주소"
              v-model="form.email"
              :error="errors.email"
            />

            <InputField
              label="닉네임"
              type="text"
              placeholder="커뮤니티에서 사용할 닉네임 (2-8자)"
              v-model="form.nickname"
              :error="errors.nickname"
            />

            <InputField
              label="비밀번호"
              type="password"
              placeholder="8자 이상, 영문/숫자/특수문자 조합"
              v-model="form.password"
              :error="errors.password"
            />

            <InputField
              label="비밀번호 확인"
              type="password"
              placeholder=""
              v-model="form.passwordConfirm"
              :error="errors.passwordConfirm"
            />

            <!-- 약관 동의 -->
            <div class="flex items-center gap-2 my-5">
              <input type="checkbox" class="w-4 h-4" v-model="form.agreeTerms" />
              <label class="text-xs text-gray-600">
                이용약관 및 개인정보처리방침에 동의합니다
              </label>
            </div>

            <AuthButton type="submit" :loading="loading" :disabled="!isFormValid">
              회원가입
            </AuthButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { signUp } from '../../api/auth.js'
import AuthLogo from '../../components/auth/AuthLogo.vue'
import InputField from '../../components/common/DefaultInputField.vue'
import AuthButton from '../../components/auth/AuthButton.vue'

export default {
  name: 'SignUp',
  components: {
    AuthLogo,
    InputField,
    AuthButton,
  },

  data() {
    return {
      form: {
        email: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        agreeTerms: false,
      },
      errors: {},
      loading: false,
    }
  },

  computed: {
    isFormValid() {
      return (
        this.form.email &&
        this.form.nickname &&
        this.form.password &&
        this.form.passwordConfirm &&
        this.form.agreeTerms &&
        Object.keys(this.errors).length === 0
      )
    },
  },

  watch: {
    // 실시간 검증
    'form.email'() {
      this.validateEmail()
    },
    'form.nickname'() {
      this.validateNickname()
    },
    'form.password'() {
      this.validatePassword()
    },
    'form.passwordConfirm'() {
      this.validatePasswordConfirm()
    },
  },

  methods: {
    async handleSignup() {
      if (!this.validateAll()) return

      this.loading = true

      try {
        const result = await signUp({
          email: this.form.email,
          nickname: this.form.nickname,
          password: this.form.password,
        })

        if (result.success) {
          alert('회원가입이 완료되었습니다!')
          this.$router.push('/login')
        } else {
          alert('회원가입 실패: ' + result.message)
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('오류가 발생했습니다.')
      } finally {
        this.loading = false
      }
    },

    validateAll() {
      this.errors = {}
      this.validateEmail()
      this.validateNickname()
      this.validatePassword()
      this.validatePasswordConfirm()
      return Object.keys(this.errors).length === 0
    },

    validateEmail() {
      if (!this.form.email) {
        this.errors.email = '이메일을 입력해주세요.'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = '올바른 이메일 형식이 아닙니다.'
      } else {
        delete this.errors.email
      }
    },

    validateNickname() {
      if (!this.form.nickname) {
        this.errors.nickname = '닉네임을 입력해주세요.'
      } else if (this.form.nickname.length < 2 || this.form.nickname.length > 8) {
        this.errors.nickname = '닉네임은 2-8자 사이여야 합니다.'
      } else {
        delete this.errors.nickname
      }
    },

    validatePassword() {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      if (!this.form.password) {
        this.errors.password = '비밀번호를 입력해주세요.'
      } else if (!regex.test(this.form.password)) {
        this.errors.password = '8자 이상, 영문/숫자/특수문자 조합이어야 합니다.'
      } else {
        delete this.errors.password
      }
    },

    validatePasswordConfirm() {
      if (this.form.password !== this.form.passwordConfirm) {
        this.errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
      } else {
        delete this.errors.passwordConfirm
      }
    },
  },
}
</script>
