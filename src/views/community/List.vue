<template>
  <UserHeader />
  <div>
    <!-- 게시판 배너 -->
    <BoardBanner
      :image-src="communityBannerImage"
      alt-text=""
      title=""
      description=""
      variant="primary"
    />

    <!-- 게시판 페이지 본문 -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2">
          <!-- 빈 게시판 -->
          <EmptyBoard
            v-if="posts.length === 0"
            create-url="/community/create"
            title="아직 게시글이 없어요"
            message="첫 번째 이야기를 들려주세요!"
            button-text="글 작성하기"
            icon="📝"
          />

          <!-- 글 작성 버튼 -->
          <CreateButton
            v-if="posts.length > 0"
            create-url="/community/create"
            button-text="게시글 작성하기"
          />

          <!-- 게시글 리스트 -->
          <PostList :posts="posts" base-url="/community" layout="default" />

          <!-- 페이지네이션 -->
          <Pagination :pagination="pagination" type="input" @page-change="updatePage" />
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <!-- 검색 위젯 -->
          <SearchWidget :search-form="searchForm" @search="handleSearch" />

          <!-- 정렬 위젯 -->
          <SortWidget :sort-type="sortType" @sort-change="handleSortChange" />

          <!-- 카테고리 위젯 -->
          <CategoryWidget
            :categories="categories"
            :selected-category="selectedCategory"
            @category-filter="handleCategoryFilter"
          />

          <!-- 인기 게시글 위젯 -->
          <SideWidget title="인기 게시글">
            <div class="space-y-2">
              <div v-for="post in popularPosts" :key="post.id" class="border-b pb-2 last:border-0">
                <router-link
                  :to="`/community/${post.id}`"
                  class="text-sm text-blue-600 hover:underline"
                >
                  {{ post.title }}
                </router-link>
                <div class="text-xs text-gray-500 mt-1">
                  👁️ {{ post.views }} · 💬 {{ post.answerCount }}
                </div>
              </div>
            </div>
          </SideWidget>
        </div>
      </div>
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBoard } from '@/composables/useBoard'

// 이미지 경로
const communityBannerImage = '/images/community-banner.svg'

// 컴포넌트 imports
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import BoardBanner from '@/components/board/BoardBanner.vue'
import EmptyBoard from '@/components/board/EmptyBoard.vue'
import CreateButton from '@/components/board/CreateButton.vue'
import PostList from '@/components/board/PostList.vue'
import Pagination from '@/components/common/BasicPagination.vue'
import SearchWidget from '@/components/board/SearchWidget.vue'
import SortWidget from '@/components/board/SortWidget.vue'
import CategoryWidget from '@/components/board/CategoryWidget.vue'
import SideWidget from '@/components/board/SideWidget.vue'

const route = useRoute()

// useBoard composable 사용
const {
  posts,
  categories,
  pagination,
  searchForm,
  sortType,
  selectedCategory,
  popularPosts,
  isLoading,
  error,
  loadData,
  updatePage,
  handleSearch,
  handleSortChange,
  handleCategoryFilter,
} = useBoard('/communities')

// 컴포넌트 마운트 시 데이터 로드
onMounted(loadData)

// URL 쿼리 변경 감지하여 데이터 재로드
watch(() => route.query, loadData, { deep: true })
</script>

<style scoped>
/* 컴포넌트별 커스텀 스타일 */
</style>
