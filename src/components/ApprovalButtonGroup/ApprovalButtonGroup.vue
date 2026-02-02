<script lang="ts" setup>
// windsurf- 审批按钮组组件（移植自 PC 端 BasicFlowButtonGroup）
import { approveTask, getFieldsConfigByTaskId, getTaskListByProcessInstanceId, rejectTask, transferTask } from '@/api/approval'
import { getUserApi as getDeptUserListKv } from '@/api/kv'
import useUpload from '@/hooks/useUpload'
import { useUserStore } from '@/store'

defineOptions({
  name: 'ApprovalButtonGroup',
})

const props = withDefaults(defineProps<Props>(), {
  afterApproval: () => () => uni.reLaunch({
    url: '/pages/index/index',
  }),
  schemas: () => [],
  fixedSchemas: () => [],
  variables: () => ({}),
  defaultValues: () => ({}),
  showTransfer: false,
  showReject: true,
  passButtonText: '通过',
  rejectButtonText: '驳回',
  hidden: false,
})

// windsurf- 事件
const emit = defineEmits<{
  (e: 'success', type: 'pass' | 'reject' | 'transfer'): void
  (e: 'error', error: any): void
}>()

// windsurf- Props 定义
interface Props {
  // windsurf- 流程实例ID
  processInstanceId: string
  // windsurf- 审批后回调
  afterApproval?: () => void
  // windsurf- 动态表单配置
  schemas?: any[]
  // windsurf- 固定表单配置（始终显示）
  fixedSchemas?: any[]
  // windsurf- 额外的审批变量
  variables?: Record<string, any> | (() => Promise<any>)
  // windsurf- 默认值
  defaultValues?: Record<string, any> | (() => Promise<any>)
  // windsurf- 是否显示转办按钮
  showTransfer?: boolean
  // windsurf- 是否显示驳回按钮
  showReject?: boolean
  // windsurf- 通过按钮文本
  passButtonText?: string
  // windsurf- 驳回按钮文本
  rejectButtonText?: string
  // windsurf- 是否隐藏按钮组（查看模式）
  hidden?: boolean
}

// windsurf- 弹出框状态
const popoutVisible = ref(false)
// windsurf- 当前操作类型
const currentType = ref<'pass' | 'reject' | 'transfer' | null>(null)
// windsurf- 弹出框标题
const popoutTitle = computed(() => {
  switch (currentType.value) {
    case 'pass':
      return '审批通过'
    case 'reject':
      return '审批驳回'
    case 'transfer':
      return '转办'
    default:
      return '审批'
  }
})

// windsurf- 审批意见
const reason = ref('')
// windsurf- 加载状态
const loading = ref(false)
// windsurf- 当前任务ID
const currentTaskId = ref('')
// windsurf- 动态表单数据
const formData = ref<Record<string, any>>({})
// windsurf- 转办用户列表
const transferUserList = ref<any[]>([])
// windsurf- 选中的转办用户
const assigneeUserId = ref('')
// windsurf- 上传文件的loading状态
const uploadingFields = ref<Record<string, boolean>>({})
// windsurf- 存储已上传的文件列表 { field: [{ id: string, name: string }] }
const uploadedFiles = ref<Record<string, Array<{ id: string, name: string }>>>({})

const equSchemas = ref<any[]>([])

// windsurf- 处理文件上传
function handleUpload(field: string) {
  const { run } = useUpload({
    fileType: 'file',
    maxSize: 10 * 1024 * 1024, // 10MB
    success: (res) => {
      // windsurf- 上传成功后，将文件ID保存到formData
      try {
        let fileId = ''
        let fileName = ''

        // windsurf- 解析返回的文件ID和文件名
        if (typeof res === 'string') {
          const parsed = JSON.parse(res)
          fileId = parsed?.data?.id || parsed?.id
          fileName = parsed?.data?.name || parsed?.name || `文件${Date.now()}`
        }
        else {
          fileId = res?.id || res?.data?.id
          fileName = res?.name || res?.data?.name || `文件${Date.now()}`
        }

        if (fileId) {
          // windsurf- 初始化文件列表
          if (!uploadedFiles.value[field]) {
            uploadedFiles.value[field] = []
          }

          // windsurf- 添加新文件到列表
          uploadedFiles.value[field].push({ id: fileId, name: fileName })

          // windsurf- 更新formData，将所有文件ID用逗号拼接
          const fileIds = uploadedFiles.value[field].map(f => f.id).join(',')
          formData.value[field] = fileIds

          uni.showToast({
            title: '上传成功',
            icon: 'success',
          })
        }
        else {
          uni.showToast({
            title: '上传失败，未获取到文件ID',
            icon: 'none',
          })
        }
      }
      catch (error) {
        console.error('解析上传结果失败:', error)
        uni.showToast({
          title: '上传失败',
          icon: 'none',
        })
      }
      finally {
        uploadingFields.value[field] = false
      }
    },
    error: (err) => {
      console.error('上传失败:', err)
      uni.showToast({
        title: '上传失败',
        icon: 'none',
      })
      uploadingFields.value[field] = false
    },
  })

  // windsurf- 设置上传中状态
  uploadingFields.value[field] = true
  // windsurf- 触发文件选择
  run()
}

// windsurf- 删除已上传的文件
function handleDeleteFile(field: string, index: number) {
  if (!uploadedFiles.value[field])
    return

  // windsurf- 从列表中移除文件
  uploadedFiles.value[field].splice(index, 1)

  // windsurf- 更新formData
  if (uploadedFiles.value[field].length > 0) {
    const fileIds = uploadedFiles.value[field].map(f => f.id).join(',')
    formData.value[field] = fileIds
  }
  else {
    formData.value[field] = ''
  }

  uni.showToast({
    title: '删除成功',
    icon: 'success',
  })
}

async function loadSchemas() {
  const taskId = await getTasks(props.processInstanceId)
  if (taskId) {
    currentTaskId.value = taskId
  }
  if (taskId) {
    try {
      const equSchemasStr = await getFieldsConfigByTaskId({ taskId })
      equSchemas.value = JSON.parse(equSchemasStr as string) || []
      console.log('[ equSchemas ] >', equSchemas.value)
    }
    catch (error) {
      console.error('获取字段配置失败:', error)
      equSchemas.value = []
    }
  }
}

loadSchemas()

// windsurf- 加载转办用户列表
async function loadTransferUsers() {
  try {
    const res = await getDeptUserListKv()

    transferUserList.value = (res as any[]).map((item: any) => {
      return {
        label: item.label,
        value: item.value,
        // 如果有子级用户，展开
        // children: item.childList?.map((child: any) => ({
        //   label: child.label,
        //   value: child.value,
        // })) || [],
      }
    })
  }
  catch (error) {
    console.error('获取转办用户列表失败:', error)
    transferUserList.value = []
  }
}

loadTransferUsers()

const innerSchemas = ref([])
// windsurf- 合并后的schemas
const mergedSchemas: any = computed(() => {
  // windsurf- 根据任务ID获取字段配置

  let dynamicReason: any = null

  return props.schemas
    .map((item) => {
      const equSchema = equSchemas.value.find((ele: any) => ele.field === item.field) || {}
      // windsurf- 如果是reason字段且需要显示，单独处理
      if (item.field === 'reason' && equSchema.show) {
        dynamicReason = item
        return null
      }
      else {
        return {
          ...item,
          ifShow: !!equSchema.show,
          dynamicDisabled: !equSchema.editable,
          colProps: item?.colProps || { span: 24 },
        }
      }
    })
    .filter(Boolean)
})

console.log('[ mergedSchemas ] >', mergedSchemas.value)

// windsurf- 查找用户任务ID
function findUserTaskId(taskList: any[], userId: string | number | undefined): string | null {
  if (!userId)
    return null
  for (const item of taskList) {
    // windsurf- 支持字符串和数字类型的 userId 比较
    if (String(item.userId) === String(userId)) {
      return item.taskId
    }
    if (Array.isArray(item.children)) {
      const childResult = findUserTaskId(item.children, userId)
      if (childResult)
        return childResult
    }
  }
  return null
}

// windsurf- 获取当前用户的任务ID
async function getTasks(instanceId: string) {
  try {
    const data = await getTaskListByProcessInstanceId(instanceId) as any[]
    const userStore = useUserStore()
    // windsurf- userInfo 中实际用户ID存储在 id 字段
    const userId = userStore.userInfo?.id || userStore.userInfo?.userId
    const taskList = data[data.length - 1]?.taskList || []
    const taskId = findUserTaskId(taskList, userId)
    return taskId
  }
  catch (error) {
    console.error('获取任务ID失败:', error)
    return null
  }
}

// windsurf- 点击通过按钮
async function handlePass() {
  currentType.value = 'pass'
  reason.value = ''
  formData.value = {}

  // windsurf- 处理动态变量和默认值
  let variables = props.variables
  let defaultValues = props.defaultValues

  if (typeof variables === 'function') {
    variables = await variables()
  }
  if (typeof defaultValues === 'function') {
    defaultValues = await defaultValues()
  }

  formData.value = { ...defaultValues }
  popoutVisible.value = true
}

// windsurf- 点击驳回按钮
function handleReject() {
  currentType.value = 'reject'
  reason.value = ''
  popoutVisible.value = true
}

// windsurf- 点击转办按钮
async function handleTransfer() {
  currentType.value = 'transfer'
  reason.value = ''

  const taskId = await getTasks(props.processInstanceId)
  if (taskId) {
    currentTaskId.value = taskId
  }

  popoutVisible.value = true
}

// windsurf- 关闭弹出框
function handleClose() {
  popoutVisible.value = false
  currentType.value = null
}

// windsurf- 提交审批
async function handleSubmit() {
  loading.value = true
  uni.showLoading({ title: '提交中...', mask: true })
  try {
    if (currentType.value === 'pass') {
      // windsurf- 校验必填字段（只校验显示的字段）
      if (mergedSchemas.value.length > 0) {
        for (const schema of mergedSchemas.value) {
          // windsurf- 跳过隐藏的字段
          if (schema.ifShow === false) {
            continue
          }

          if (schema.required) {
            const value = formData.value[schema.field]
            if (!value || (Array.isArray(value) && value.length === 0)) {
              uni.hideLoading()
              uni.showToast({
                title: `请输入${schema.label}`,
                icon: 'none',
              })
              loading.value = false
              return
            }
          }
        }
      }

      // windsurf- 处理变量
      let variables = props.variables
      if (typeof variables === 'function') {
        variables = await variables()
      }

      await approveTask({
        processInstanceId: props.processInstanceId,
        reason: reason.value,
        variables: JSON.stringify({ ...variables, ...formData.value }),
      })
      uni.showToast({
        title: '审批通过',
        icon: 'success',
      })
    }
    else if (currentType.value === 'reject') {
      await rejectTask({
        processInstanceId: props.processInstanceId,
        reason: reason.value,
      })
      uni.showToast({
        title: '已驳回',
        icon: 'none',
      })
    }
    else if (currentType.value === 'transfer') {
      if (!assigneeUserId.value) {
        uni.showToast({
          title: '请选择转办用户',
          icon: 'none',
        })
        return
      }

      await transferTask({
        id: currentTaskId.value,
        assigneeUserId: assigneeUserId.value,
      })
      uni.showToast({
        title: '转办成功',
        icon: 'success',
      })
    }
    // windsurf- 关闭弹出框
    handleClose()
    // windsurf- 触发成功事件
    emit('success', currentType.value!)
    uni.reLaunch({
      url: '/pages/index/index',
    })
  }
  catch (error) {
    console.error('审批失败:', error)
    emit('error', error)
    // uni.showToast({
    //   title: '审批失败',
    //   icon: 'none',
    // })
  }
  finally {
    uni.hideLoading()
    loading.value = false
  }
}
</script>

<template>
  <view v-if="!hidden" class="fixed bottom-0 left-0 right-0 bg-white shadow-lg !p-2">
    <!-- windsurf- 审批弹出框 -->
    <sar-popout
      v-model:visible="popoutVisible"
      :title="popoutTitle"
      show-close
      show-confirm
      show-cancel
      :confirm-loading="loading"
      @close="handleClose"
      @cancel="handleClose"
      @confirm="handleSubmit"
    >
      <view class="p-4">
        <sar-form :model="formData" label-width="280rpx">
          <!-- {{ mergedSchemas }} -->
          <!-- windsurf- 动态表单区域（通过时显示） -->
          <template v-if="currentType === 'pass' && mergedSchemas.length > 0">
            <sar-form-item
              v-for="schema in mergedSchemas"
              v-show="schema.ifShow !== false"
              :key="schema.field"
              :label="schema.label"
              :prop="schema.field"
              :required="schema.required"
            >
              <sar-picker-input
                v-if="schema?.component === 'Select'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :disabled="schema.dynamicDisabled"
                clearable
                :columns="schema?.columns || []"
                @change="schema?.onChange($event, { formData }) || (() => {})"
              />

              <sar-datetime-picker-input
                v-else-if="schema?.component === 'DatePicker'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                type="yMd"
                clearable
                :value-format="schema?.valueFormat || 'YYYY-MM-DD'"
              />

              <sar-input
                v-else-if="schema?.component === 'InputNumber'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :readonly="schema?.readonly || schema?.disabled"
                clearable
                inlaid
                type="number"
              />

              <!-- windsurf- Upload上传组件 -->
              <view v-else-if="schema?.component === 'Upload'" class="flex flex-col gap-2">
                <sar-button
                  type="primary"
                  size="small"
                  :loading="uploadingFields[schema.field]"
                  @click="handleUpload(schema.field)"
                >
                  {{ uploadingFields[schema.field] ? '上传中...' : '选择文件' }}
                </sar-button>

                <!-- windsurf- 已上传文件列表 -->
                <view v-if="uploadedFiles[schema.field]?.length > 0" class="mt-2 flex flex-col gap-2">
                  <view
                    v-for="(file, index) in uploadedFiles[schema.field]"
                    :key="file.id"
                    class="flex items-center justify-between rounded p-2"
                  >
                    <view class="flex flex-1 items-center gap-2 overflow-hidden">
                      <text class="text-green-600">✓</text>
                      <text class="truncate whitespace-pre-line break-all text-sm text-gray-700">{{ file.name }}</text>
                    </view>
                    <view
                      class="i-carbon-close-filled cursor-pointer text-14px text-gray-400"
                      @click="handleDeleteFile(schema.field, index)"
                    />
                  </view>
                </view>
              </view>

              <sar-input
                v-else
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :readonly="schema?.readonly || schema?.disabled"
                clearable
                inlaid
              />
            </sar-form-item>
          </template>

          <!-- windsurf- 固定表单字段（始终显示） -->
          <template v-if="currentType === 'pass' && props.fixedSchemas.length > 0">
            <sar-form-item
              v-for="schema in props.fixedSchemas"
              v-show="schema.ifShow !== false"
              :key="schema.field"
              :label="schema.label"
              :prop="schema.field"
              :required="schema.required"
            >
              <sar-picker-input
                v-if="schema?.component === 'Select'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :disabled="schema.dynamicDisabled"
                clearable
                :columns="schema?.columns || []"
                @change="schema?.onChange($event, { formData }) || (() => {})"
              />

              <sar-datetime-picker-input
                v-else-if="schema?.component === 'DatePicker'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                type="yMd"
                clearable
                :value-format="schema?.valueFormat || 'YYYY-MM-DD'"
              />

              <sar-input
                v-else-if="schema?.component === 'InputNumber'"
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :readonly="schema?.readonly || schema?.disabled"
                clearable
                inlaid
                type="number"
              />

              <!-- windsurf- Upload上传组件 -->
              <view v-else-if="schema?.component === 'Upload'" class="flex flex-col gap-2">
                <sar-button
                  type="primary"
                  size="small"
                  :loading="uploadingFields[schema.field]"
                  @click="handleUpload(schema.field)"
                >
                  {{ uploadingFields[schema.field] ? '上传中...' : '选择文件' }}
                </sar-button>

                <!-- windsurf- 已上传文件列表 -->
                <view v-if="uploadedFiles[schema.field]?.length > 0" class="mt-2 flex flex-col gap-2">
                  <view
                    v-for="(file, index) in uploadedFiles[schema.field]"
                    :key="file.id"
                    class="flex items-center justify-between rounded p-2"
                  >
                    <view class="flex flex-1 items-center gap-2 overflow-hidden">
                      <text class="text-green-600">✓</text>
                      <text class="truncate text-sm text-gray-700">{{ file.name }}</text>
                    </view>
                    <view
                      class="i-carbon-close-filled cursor-pointer text-14px text-gray-400"
                      @click="handleDeleteFile(schema.field, index)"
                    />
                  </view>
                </view>
              </view>

              <sar-input
                v-else
                v-model="formData[schema.field]"
                :placeholder="`请输入${schema.label}`"
                :readonly="schema?.readonly || schema?.disabled"
                clearable
                inlaid
              />
            </sar-form-item>
          </template>

          <!-- windsurf- 转办用户选择（转办时显示） -->
          <template v-if="currentType === 'transfer'">
            <sar-form-item label="转办用户" required>
              <sar-picker-input
                v-model="assigneeUserId"
                placeholder="请选择转办用户"
                clearable
                :columns="transferUserList"
              />
            </sar-form-item>
          </template>

          <!-- windsurf- 审批意见输入框（转办时不显示） -->
          <sar-form-item
            v-if="currentType !== 'transfer'" label="审批意见"
            direction="vertical"
          >
            <sar-input
              v-model="reason"
              type="textarea"
              placeholder="请输入审批意见"
              :maxlength="500"
              :rows="4"
              show-limit
            />
          </sar-form-item>
        </sar-form>
      </view>
    </sar-popout>

    <!-- windsurf- 操作按钮 -->
    <view class="flex items-center gap-4">
      <sar-button
        v-if="showReject"
        round
        type="outline"
        theme="danger"
        class="flex-1"
        @click="handleReject"
      >
        {{ rejectButtonText }}
      </sar-button>
      <sar-button
        round
        class="flex-1"
        theme="success"
        @click="handlePass"
      >
        {{ passButtonText }}
      </sar-button>
      <sar-button
        v-if="showTransfer"
        theme="warning"
        round
        class="flex-1"
        @click="handleTransfer"
      >
        转办
      </sar-button>
    </view>
    <view class="pb-safe" />
  </view>
</template>
