<script lang="ts" setup>
import { wechatWorkLogin } from "@/api/login";
import { useTokenStore, useUserStore } from "@/store";
import { useDictStore } from "@/store/dict";
import { getWechatWorkOAuth2Url } from "@/utils/oauth2";

defineOptions({
  name: "Home",
});
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  style: {
    type: "home",
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: "custom",
    navigationBarTitleText: "禾管家",
  },
});

const tokenStore = useTokenStore();
const userStore = useUserStore();
const code = ref("");

// windsurf- 加载状态
const isLoading = ref(false);

// windsurf- 企业微信 code 静默登录（无提示）
async function handleWechatWorkLogin(code: string) {
  isLoading.value = true;
  try {
    const res = await wechatWorkLogin(code);

    // windsurf- 保存 token 信息
    tokenStore.setTokenInfo(res);
    // windsurf- 获取用户信息
    await userStore.fetchUserInfo();

    const dictStore = useDictStore();
    await dictStore.setDictMap();

    // 登录成功后

    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/me/me",
      });
    }, 0);
  } catch (error) {
    console.error("[企业微信登录] 登录失败:", error);
    // windsurf - 登录失败跳转到登录页
    uni.navigateTo({
      url: "/pages/login/index",
    });
  } finally {
    isLoading.value = false;
  }
}

onLoad(() => {
  const params = new URLSearchParams(window.location.search);
  code.value = params.get("code");
  // windsurf- 检查 URL 中是否有 code 参数
  if (code.value) {
    handleWechatWorkLogin(code.value);
  } else {
    const url = getWechatWorkOAuth2Url({});
    window.location.replace(url);
  }
});
</script>

<template>
  <view class="min-h-screen bg-white px-4 pt-safe">
    <!-- windsurf- 加载动画 -->
    <view v-if="isLoading" class="h-screen flex items-center justify-center">
      <view class="flex flex-col items-center">
        <!-- windsurf- GIF 加载图 -->
        <image
          src="@/static/images/641.png"
          class="h-32 w-32"
          mode="aspectFit"
        />

        <!-- windsurf- 加载文字动画 -->
        <view class="mt-6 flex items-center text-lg text-gray-600">
          <text>小禾努力加载中</text>
          <text class="dot-1 dot">.</text>
          <text class="dot-2 dot">.</text>
          <text class="dot-3 dot"> . </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style>
/* windsurf- 三个点的动画 - 依次显示 */
@keyframes dotSequence {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.dot {
  animation: dotSequence 1.5s linear infinite;
  animation-fill-mode: both;
  will-change: opacity;
}

.dot-1 {
  animation-delay: 0s;
}
.dot-2 {
  animation-delay: 0.3s;
}
.dot-3 {
  animation-delay: 0.6s;
}
</style>
