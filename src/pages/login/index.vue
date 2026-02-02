<script lang="ts" setup>
import md5 from "crypto-js/md5";
// i-carbon-user i-carbon-password i-carbon-view i-carbon-view-off i-carbon-checkmark
import { useTokenStore } from "@/store";
import { useDictStore } from "@/store/dict";

defineOptions({
  name: "Login",
});

definePage({
  style: {
    navigationStyle: "custom",
    navigationBarTitleText: "登录",
  },
});

// 表单数据
const formData = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

// 状态管理
const showPassword = ref(false);
const isLoading = ref(false);

// 切换密码可见性
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// 处理登录
async function handleLogin() {
  // 表单验证
  if (!formData.username.trim()) {
    uni.showToast({
      title: "请输入用户名",
      icon: "none",
    });
    return;
  }

  if (!formData.password) {
    uni.showToast({
      title: "请输入密码",
      icon: "none",
    });
    return;
  }

  // 开始加载
  isLoading.value = true;

  try {
    const tokenStore = useTokenStore();
    await tokenStore.login({
      username: formData.username,
      password: md5(formData.password).toString(),
    });
    // windsurf- 登录成功后加载字典数据
    const dictStore = useDictStore();
    await dictStore.setDictMap();
    // 登录成功后跳转到首页
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    }, 500);
  }
  catch (error) {
    // 错误在 tokenStore 或 http 拦截器中已经处理过 toast，这里不需要重复处理
    console.error(error);
  }
  finally {
    isLoading.value = false;
  }
}

// 忘记密码
function handleForgotPassword() {
  uni.showToast({
    title: "请联系管理员重置密码",
    icon: "none",
    duration: 2000,
  });
}

// 注册
function handleRegister() {
  uni.navigateTo({
    url: "/pages/register/register",
  });
}
</script>

<template>
  <AuthBackground>
    <!-- 主内容 -->
    <view class="relative z-1 min-h-screen flex flex-col justify-center px-[60rpx] pb-[60rpx] pt-[100rpx]">
      <!-- Logo 区域 -->
      <view class="fade-in-down mb-[80rpx] text-center">
        <view class="mx-auto mb-[40rpx] h-[160rpx] w-[160rpx] flex items-center justify-center rounded-[40rpx] bg-white/20 shadow-[0_8rpx_32rpx_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-transform duration-300 active:scale-95">
          <image
            src="/static/logo.svg"
            class="h-[100rpx] w-[100rpx]"
            mode="aspectFit"
          />
        </view>
        <text class="mb-[16rpx] block text-[56rpx] text-white font-bold shadow-[0_2rpx_10rpx_rgba(0,0,0,0.1)]">欢迎回来</text>
        <text class="block text-[28rpx] text-white/90">登录您的账户</text>
      </view>

      <!-- 登录表单 -->
      <view class="fade-in-up rounded-[40rpx] bg-white/95 px-[50rpx] py-[60rpx] shadow-[0_20rpx_60rpx_rgba(0,0,0,0.15)] backdrop-blur-[20px]">
        <!-- 用户名输入 -->
        <view class="mb-[32rpx]">
          <sar-input
            v-model="formData.username"
            type="text"
            placeholder="用户名 / 手机号 / 邮箱"
            clearable
            :border="false"
            class="login-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[40rpx] text-[#10b981]">
                <text class="i-carbon-user" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 密码输入 -->
        <view class="mb-[32rpx]">
          <sar-input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            clearable
            :border="false"
            class="login-input"
          >
            <template #prepend>
              <view class="w-[100rpx] flex items-center justify-center text-[40rpx] text-[#10b981]">
                <text class="i-carbon-password" />
              </view>
            </template>
            <template #append>
              <view
                class="w-[100rpx] flex items-center justify-center text-[40rpx] text-[#999] transition-colors duration-300 active:text-[#10b981]"
                @tap="togglePasswordVisibility"
              >
                <text :class="showPassword ? 'i-carbon-view' : 'i-carbon-view-off'" />
              </view>
            </template>
          </sar-input>
        </view>

        <!-- 记住我 & 忘记密码 -->
        <view class="mb-[48rpx] flex items-center justify-between">
          <view class="flex items-center" @tap="formData.rememberMe = !formData.rememberMe">
            <sar-checkbox v-model="formData.rememberMe" class="login-checkbox mr-[12rpx]" />
            <text class="text-[28rpx] text-[#666]">记住我</text>
          </view>
          <text class="text-[28rpx] text-[#10b981] transition-opacity duration-300 active:op-70" @tap="handleForgotPassword">忘记密码？</text>
        </view>

        <!-- 登录按钮 -->
        <sar-button
          theme="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleLogin"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </sar-button>

        <!-- 注册链接 -->
        <view class="mt-32px text-center">
          <text class="mr-[12rpx] text-[28rpx] text-[#666]">还没有账户？</text>
          <text class="text-[28rpx] text-[#10b981] transition-opacity duration-300 active:op-70" @tap="handleRegister">立即注册</text>
        </view>
      </view>
    </view>
  </AuthBackground>
</template>

<style>
/* Sard 输入框自定义样式 */
.login-input {
  --sar-input-background: #f7f8fc;
  --sar-input-border-radius: 24rpx;
  --sar-input-placeholder-color: #999;
  --sar-input-color: #333;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.login-input:focus-within {
  --sar-input-background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 4rpx 16rpx rgba(16, 185, 129, 0.15);
}

/* Sard 复选框自定义样式 */
.login-checkbox {
  --sar-checkbox-color: #10b981;
  --sar-checkbox-size: 36rpx;
  --sar-checkbox-icon-size: 22rpx;
}
</style>
