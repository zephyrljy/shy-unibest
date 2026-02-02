<script lang="ts" setup>
// windsurf- 附件列表组件
import { http } from '@/http/http'
import { downloadFile } from '@/utils/download'

defineOptions({
  name: 'FileList',
})

const props = defineProps<{
  // windsurf- 文件ID列表，逗号分隔的字符串
  ids?: string
}>()

// windsurf- 文件信息类型
interface IFileInfo {
  id: number
  configId: number
  name: string
  path: string
  url: string
  type: string
  size: number
  createTime: number
}

// windsurf- 文件列表
const fileList = ref<IFileInfo[]>([])
const loading = ref(false)

// windsurf- 获取文件列表
async function fetchFileList() {
  if (!props.ids) {
    fileList.value = []
    return
  }

  loading.value = true
  try {
    const res = await http.get<IFileInfo[]>('/infra/file/urlList', { ids: props.ids })
    fileList.value = res || []
  }
  catch (error) {
    console.error('获取文件列表失败:', error)
    fileList.value = []
  }
  finally {
    loading.value = false
  }
}

// windsurf- 格式化文件大小
function formatFileSize(size: number): string {
  if (size < 1024)
    return `${size} B`
  if (size < 1024 * 1024)
    return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

// windsurf- 监听 ids 变化
watch(() => props.ids, () => {
  fetchFileList()
}, { immediate: true })
</script>

<template>
  <view class="file-list">
    <view v-if="loading" class="py-2 text-sm text-gray-400">
      加载中...
    </view>

    <view v-else-if="fileList.length === 0" class="py-2 text-sm text-gray-400">
      暂无附件
    </view>

    <view v-else class="space-y-1">
      <view
        v-for="file in fileList"
        :key="file.id"
        class="text-sm text-blue-500"
        @click="downloadFile(file.url)"
      >
        {{ file.name }}
      </view>
    </view>
  </view>
</template>
