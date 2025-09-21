<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">컴포넌트 테스트 페이지</h1>
        <p class="text-gray-600">다양한 게시판 컴포넌트들을 확인할 수 있습니다</p>
      </div>

      <!-- 기본 커뮤니티 게시판 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">1. 기본 커뮤니티 게시판</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <BoardBanner
            image-src="/src/assets/images/community-banner.svg"
            alt-text="커뮤니티 게시판"
            title="커뮤니티 게시판"
            description="자유롭게 이야기를 나눠보세요"
            variant="primary"
          />

          <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 메인 콘텐츠 -->
            <div class="lg:col-span-2">
              <EmptyBoard
                create-url="/community/create"
                title="아직 게시글이 없어요"
                message="첫 번째 이야기를 들려주세요!"
                button-text="글 작성하기"
                icon="📝"
              />
            </div>

            <!-- 사이드바 -->
            <div class="space-y-6">
              <CategoryWidget :categories="dummyCategories" :selected-category="null" />

              <div class="bg-white rounded-lg shadow-md p-4">
                <h3 class="font-semibold mb-4">인기 게시글</h3>
                <div class="space-y-2">
                  <div
                    v-for="post in dummyPopularPosts"
                    :key="post.id"
                    class="border-b pb-2 last:border-0"
                  >
                    <p class="text-sm text-blue-600">{{ post.title }}</p>
                    <div class="text-xs text-gray-500 mt-1">
                      👁️ {{ post.views }} · 💬 {{ post.comments }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 컴포넌트 조합 예시 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">2. EmptyBoard 다양한 스타일</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyBoard
            create-url="/test"
            title="기본 스타일"
            message="기본적인 빈 게시판입니다"
            icon="📄"
          />

          <EmptyBoard
            create-url="/test"
            title="성공 스타일"
            message="성공적으로 완료되었습니다"
            icon="✅"
            variant="success"
            button-text="새로 시작하기"
          />
        </div>
      </section>

      <!-- 페이지네이션 예시 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">3. Pagination 다양한 스타일</h2>
        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-bold mb-4">입력 방식 페이지네이션</h3>
            <Pagination :pagination="{ currentPage: 1, totalPage: 10 }" type="input" />
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-bold mb-4">번호 방식 페이지네이션</h3>
            <Pagination
              :pagination="{ currentPage: 5, totalPage: 20 }"
              type="numbers"
              :show-first-last="true"
            />
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-bold mb-4">간단한 페이지네이션</h3>
            <Pagination
              :pagination="{ currentPage: 3, totalPage: 7 }"
              type="simple"
              :icon-only="true"
            />
          </div>
        </div>
      </section>

      <!-- 버튼 컴포넌트 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-6">4. 버튼 컴포넌트</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CreateButton create-url="/test" button-text="기본 버튼" variant="primary" />
            <CreateButton create-url="/test" button-text="성공 버튼" variant="success" />
            <CreateButton create-url="/test" button-text="경고 버튼" variant="warning" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 컴포넌트 imports
import BoardBanner from '@/components/board/BoardBanner.vue'
import EmptyBoard from '@/components/board/EmptyBoard.vue'
import CreateButton from '@/components/board/CreateButton.vue'
import Pagination from '@/components/common/BasicPagination.vue'
import CategoryWidget from '@/components/board/CategoryWidget.vue'

// 더미 데이터
const dummyCategories = ref([
  { id: 1, name: '자유 게시판', postCount: 42, icon: 'bi bi-chat' },
  { id: 2, name: '질문/답변', postCount: 28, icon: 'bi bi-question-circle' },
  { id: 3, name: '정보 공유', postCount: 15, icon: 'bi bi-info-circle' },
  { id: 4, name: '프로젝트', postCount: 8, icon: 'bi bi-folder' },
])

const dummyPopularPosts = ref([
  { id: 1, title: 'Vue 3 시작하기', views: 1250, comments: 23 },
  { id: 2, title: 'JavaScript 최신 문법', views: 890, comments: 15 },
  { id: 3, title: 'CSS Grid 활용법', views: 674, comments: 12 },
])
</script>
