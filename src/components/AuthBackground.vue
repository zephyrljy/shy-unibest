<script lang="ts" setup>
defineOptions({
  name: 'AuthBackground',
})
</script>

<template>
  <view class="relative h-full overflow-hidden">
    <!-- 背景渐变层 -->
    <view class="absolute inset-0 from-[#10b981] via-[#059669] to-[#34d399] bg-gradient-to-br op-90" />

    <!-- 装饰圆圈 -->
    <view class="floating-circle absolute h-[300rpx] w-[300rpx] rounded-full bg-white/10 backdrop-blur-[10px] -right-[100rpx] -top-[100rpx]" style="animation-delay: 0s" />
    <view class="floating-circle absolute bottom-[100rpx] h-[200rpx] w-[200rpx] rounded-full bg-white/10 backdrop-blur-[10px] -left-[50rpx]" style="animation-delay: 2s" />
    <view class="floating-circle absolute right-[50rpx] top-1/2 h-[150rpx] w-[150rpx] rounded-full bg-white/10 backdrop-blur-[10px]" style="animation-delay: 4s" />

    <!-- 内容插槽 -->
    <slot />
  </view>
</template>

<style>
/* 浮动动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30rpx) rotate(180deg);
  }
}

.floating-circle {
  animation: float 6s ease-in-out infinite;
}
</style>
