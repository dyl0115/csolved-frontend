<template>
  <BoardBanner :imageSrc="bannerImage" altText="커뮤니티 게시판" />
  <EmptyBoard
    v-if="post == null || posts.length === 0"
    create-url="/community/create"
    title="아직 게시글이 없어요"
    message="첫 번째 이야기를 들려주세요!"
    button-text="글 작성하기"
    variant="default"
    icon="📝"
  />
</template>

<script>
import BoardBanner from '@/components/board/BoardBanner.vue'
import bannerImage from '../assets/images/community-banner.svg'
import EmptyBoard from '@/components/board/EmptyBoard.vue'

export default {
  components: { BoardBanner, EmptyBoard },

  data() {
    return { bannerImage }
  },
}
</script>
