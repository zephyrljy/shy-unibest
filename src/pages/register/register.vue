<script lang="ts" setup>
defineOptions({
  name: 'Register',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '注册',
  },
})

// 表单数据
const formData = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// 状态管理
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// 切换密码可见性
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 处理注册
async function handleRegister() {
  // 表单验证
  if (!formData.username.trim()) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none',
    })
    return
  }

  if (!formData.phone.trim()) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }

  // 简单的手机号验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  if (!formData.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
    })
    return
  }

  if (formData.password.length < 6) {
    uni.showToast({
      title: '密码长度至少6位',
      icon: 'none',
    })
    return
  }

  if (formData.password !== formData.confirmPassword) {
    uni.showToast({
      title: '两次密码不一致',
      icon: 'none',
    })
    return
  }

  if (!formData.agreeTerms) {
    uni.showToast({
      title: '请阅读并同意用户协议',
      icon: 'none',
    })
    return
  }

  // 开始加载
  isLoading.value = true

  // 模拟注册请求
  setTimeout(() => {
    isLoading.value = false
    uni.showToast({
      title: '注册成功',
      icon: 'success',
    })

    // 注册成功后跳转到登录页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1500)
}

// 返回登录
function handleBackToLogin() {
  uni.redirectTo({
    url: '/pages/login/index',
  })
}

// 查看用户协议
function handleViewTerms() {
  uni.showToast({
    title: '查看用户协议',
    icon: 'none',
  })
  // 可以跳转到用户协议页面
  // uni.navigateTo({ url: '/pages/terms/terms' })
}
</script>

<template>
  <AuthBackground>
    <!-- 主内容 -->
    <view class="relative z-1 min-h-screen flex flex-col justify-center px-[60rpx] pb-[60rpx] pt-[100rpx]">
      <!-- Logo 区域 -->
      <view class="fade-in-down mb-[60rpx] text-center">
        <view class="mx-auto mb-[30rpx] h-[140rpx] w-[140rpx] flex items-center justify-center rounded-[35rpx] bg-white/20 shadow-[0_8rpx_32rpx_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-transform duration-300 active:scale-95">
          <image
            src="/static/logo.svg"
            class="h-[90rpx] w-[90rpx]"
            mode="aspectFit"
          />
        </view>
        <text class="mb-[12rpx] block text-[52rpx] text-white font-700 tracking-[2rpx] shadow-[0_2rpx_10rpx_rgba(0,0,0,0.1)]">创建账户</text>
        <text class="block text-[28rpx] text-white/90 tracking-[1rpx]">加入我们，开启精彩旅程</text>
      </view>

      <!-- 注册表单 -->
      <view class="fade-in-up rounded-[40rpx] bg-white/98 px-[50rpx] py-[60rpx] shadow-[0_20rpx_60rpx_rgba(0,0,0,0.15)] backdrop-blur-[20px]">
        <!-- 用户名输入 -->
        <view class="mb-[32rpx] transition-transform duration-200">
          <sar-input
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名"
            clearable
            :border="false"
            class="register-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#10b981] transition-colors duration-300">
                <text class="i-carbon-user" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 手机号输入 -->
        <view class="mb-[32rpx] transition-transform duration-200">
          <sar-input
            v-model="formData.phone"
            type="number"
            placeholder="请输入手机号"
            clearable
            :border="false"
            class="register-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#10b981] transition-colors duration-300">
                <text class="i-carbon-phone" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 密码输入 -->
        <view class="mb-[32rpx] transition-transform duration-200">
          <sar-input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码（至少6位）"
            clearable
            :border="false"
            class="register-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#10b981] transition-colors duration-300">
                <text class="i-carbon-password" />
              </view>
            </template>
            <template #append>
              <view
                class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#b0b8c8] transition-all duration-300 active:scale-110 active:text-[#10b981]"
                @tap="togglePasswordVisibility"
              >
                <text :class="showPassword ? 'i-carbon-view' : 'i-carbon-view-off'" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 确认密码输入 -->
        <view class="mb-[32rpx] transition-transform duration-200">
          <sar-input
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
            clearable
            :border="false"
            class="register-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#10b981] transition-colors duration-300">
                <text class="i-carbon-password" />
              </view>
            </template>
            <template #append>
              <view
                class="w-[100rpx] flex items-center justify-center text-[36rpx] text-[#b0b8c8] transition-all duration-300 active:scale-110 active:text-[#10b981]"
                @tap="toggleConfirmPasswordVisibility"
              >
                <text :class="showConfirmPassword ? 'i-carbon-view' : 'i-carbon-view-off'" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 用户协议 -->
        <view class="mb-[44rpx] flex items-start px-[4rpx]">
          <sar-checkbox v-model="formData.agreeTerms" class="register-checkbox mt-[4rpx] shrink-0" />
          <view class="ml-[16rpx] flex-1 leading-[1.6]">
            <text class="text-[26rpx] text-[#5a6c7d]">我已阅读并同意</text>
            <text class="text-[26rpx] text-[#10b981] font-500 transition-opacity duration-200 active:op-70" @tap="handleViewTerms">《用户协议》</text>
            <text class="text-[26rpx] text-[#5a6c7d]">和</text>
            <text class="text-[26rpx] text-[#10b981] font-500 transition-opacity duration-200 active:op-70" @tap="handleViewTerms">《隐私政策》</text>
          </view>
        </view>

        <!-- 注册按钮 -->
        <sar-button
          theme="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleRegister"
        >
          {{ isLoading ? '注册中...' : '立即注册' }}
        </sar-button>

        <!-- 返回登录 -->
        <view class="mt-32px px-0 py-[8rpx] text-center">
          <text class="mr-[8rpx] text-[28rpx] text-[#5a6c7d]">已有账户？</text>
          <text class="text-[28rpx] text-[#10b981] font-600 transition-opacity duration-300 active:op-70" @tap="handleBackToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </AuthBackground>
</template>

<style>
/* Sard 输入框自定义样式 */
.register-input {
  --sar-input-background: #f7f8fc;
  --sar-input-border-radius: 24rpx;
  --sar-input-placeholder-color: #999;
  --sar-input-color: #333;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.register-input:focus-within {
  --sar-input-background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.15);
}

/* Sard 复选框自定义样式 */
.register-checkbox {
  --sar-checkbox-color: #10b981;
  --sar-checkbox-size: 36rpx;
  --sar-checkbox-icon-size: 22rpx;
}
</style>
