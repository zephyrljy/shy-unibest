<script lang="ts" setup>
import { computed } from 'vue'
import { useTokenStore, useUserStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '我的',
    navigationStyle: 'custom',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()

const userInfo = computed(() => userStore.userInfo)

// windsurf- 版本信息
const version = '1.0.0'

// windsurf- 退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        tokenStore.logout()
        uni.reLaunch({
          url: '/pages/login/index',
        })
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-[#f7f7f7] pb-32">
    <!-- 顶部占位 (状态栏高度) -->
    <view class="h-20 bg-white" />

    <!-- windsurf- 用户信息 Header -->
    <view class="mb-2 bg-white px-6 py-6">
      <view class="flex items-center">
        <!-- windsurf- 头像 -->
        <image
          :src="userInfo.avatar"
          class="mr-4 h-16 w-16 rounded-full bg-gray-200"
          mode="aspectFill"
        />
        <!-- windsurf- 用户名 -->
        <view class="flex-1">
          <view class="text-xl font-bold">
            {{ userInfo.nickname || '用户' }}
          </view>
        </view>
        <view class="i-carbon-chevron-right text-gray-300" />
      </view>
    </view>

    <!-- windsurf- 菜单组 -->
    <view class="mb-2 bg-white">
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 active:bg-gray-50" hover-class="bg-gray-50">
        <view class="flex items-center">
          <view class="i-carbon-settings mr-3 text-xl text-blue-500" />
          <text class="text-base text-[#333]">设置</text>
        </view>
        <view class="i-carbon-chevron-right text-sm text-gray-300" />
      </view>
      <view class="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 active:bg-gray-50" hover-class="bg-gray-50">
        <view class="flex items-center">
          <view class="i-carbon-help mr-3 text-xl text-green-500" />
          <text class="text-base text-[#333]">帮助与反馈</text>
        </view>
        <view class="i-carbon-chevron-right text-sm text-gray-300" />
      </view>
      <!-- windsurf- 版本信息 -->
      <view class="flex items-center justify-between px-4 py-3.5 active:bg-gray-50" hover-class="bg-gray-50">
        <view class="flex items-center">
          <view class="i-carbon-information mr-3 text-xl text-gray-400" />
          <text class="text-base text-[#333]">版本信息</text>
        </view>
        <text class="text-sm text-gray-400">v{{ version }}</text>
      </view>
    </view>

    <!-- windsurf- 退出登录按钮（固定在 tabbar 上方） -->
    <view class="fixed bottom-12 left-0 right-0 bg-white px-4 py-3">
      <sar-button
        type="pale"
        theme="danger"
        round
        block
        @click="handleLogout"
      >
        退出登录
      </sar-button>
    </view>
  </view>
</template>

<style scoped>
/* 移除 scoped 样式，全部使用 UnoCSS */
</style>
