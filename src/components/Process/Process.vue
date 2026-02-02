<script lang="ts" setup>
// windsurf- 流程展示组件，用于展示审批流程信息
import { getTaskListByProcessInstanceId } from '@/api/approval'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/format'

defineOptions({
  name: 'Process',
})

const props = withDefaults(defineProps<Props>(), {
  title: '流程跳转信息',
  processInstanceId: '',
  api: undefined,
  options: () => getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT) as Array<{ label: string, value: string | number, colorType?: string }>,
  labelWidth: 60,
  columns: () => [
    { title: '审批人', dataIndex: 'nickname' },
    { title: '审批结果', dataIndex: 'result', tag: true },
    { title: '审批评论', dataIndex: 'reason' },
  ],
  timeFormat: 'YYYY-MM-DD HH:mm:ss',
})

// windsurf- 列配置类型
interface ColumnItem {
  title: string
  dataIndex: string
  labelWidth?: number | string
  tag?: boolean
  options?: Array<{ label: string, value: string | number, colorType?: string }>
  ifShow?: boolean | ((record: Record<string, any>, index: number) => boolean)
  customRender?: (record: Record<string, any>) => string
}

// windsurf- Props 定义
interface Props {
  // windsurf- 标题
  title?: string
  // windsurf- 流程实例ID
  processInstanceId?: string
  // windsurf- 自定义API
  api?: () => Promise<Record<string, any>[]>
  // windsurf- 状态选项
  options?: Array<{ label: string, value: string | number, color?: string }>
  // windsurf- 标签宽度
  labelWidth?: number
  // windsurf- 列配置
  columns?: ColumnItem[]
  // windsurf- 时间格式
  timeFormat?: string
}

// windsurf- 任务列表数据
const taskList = ref<Record<string, any>[]>([])

// windsurf- 加载状态
const loading = ref(false)

// windsurf- 展开状态
const expandedKeys = ref<(string | number)[]>([])

// windsurf- 平铺children数组
function flatChildren(arr: Record<string, any>[]): Record<string, any>[] {
  const result: Record<string, any>[] = []
  for (const cur of arr) {
    if (cur.children && cur.children.length > 0) {
      result.push(...flatChildren(cur.children))
      delete cur.children
    }
    result.push(cur)
  }
  return result
}

// windsurf- 获取任务列表
async function getTasks(instanceId: string) {
  if (!instanceId)
    return
  loading.value = true
  try {
    const data = await getTaskListByProcessInstanceId(instanceId) as Record<string, any>[]
    taskList.value = data.map(task => ({
      ...task,
      taskList: flatChildren(task.taskList?.filter((child: Record<string, any>) => child.result !== 4) || []),
    }))
    // windsurf- 初始化展开所有项
    expandedKeys.value = taskList.value.map(item => item.definitionKey)
  }
  finally {
    loading.value = false
  }
}

// windsurf- 监听processInstanceId变化
watch(
  () => props.processInstanceId,
  (val) => {
    if (val) {
      getTasks(val)
    }
  },
)

// windsurf- 页面加载
onMounted(async () => {
  if (props.api) {
    taskList.value = await props.api()
    expandedKeys.value = taskList.value.map(item => item.definitionKey)
  }
  else if (props.processInstanceId) {
    getTasks(props.processInstanceId)
  }
})

// windsurf- 切换展开状态
function toggleExpand(key: string | number) {
  const index = expandedKeys.value.indexOf(key)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  }
  else {
    expandedKeys.value.push(key)
  }
}

// windsurf- 判断是否展开
function isExpanded(key: string | number) {
  return expandedKeys.value.includes(key)
}

// windsurf- 获取状态标签
function getStatusTag(value: string | number): any {
  const option = props.options.find(item => item.value === value)

  return option || { label: '-', color: '#999' }
}

// windsurf- 获取列值
function getColumnValue(record: Record<string, any>, column: ColumnItem) {
  if (column.customRender) {
    return column.customRender(record)
  }
  // windsurf- 如果是tag类型，使用column.options或props.options
  if (column.tag) {
    const options = column.options || props.options
    const option = options.find(item => item.value === record[column.dataIndex])

    return option?.label || record[column.dataIndex] || '-'
  }

  const value = record[column.dataIndex]
  return value === '' || value === null || value === undefined ? '-' : value
}

// windsurf- 获取列标签颜色
function getColumnTagColor(record: Record<string, any>, column: ColumnItem) {
  if (column.tag) {
    const options: any = column.options || props.options
    const option = options.find(item => item.value === record[column.dataIndex])
    return option?.colorType || '#999'
  }
  return ''
}

// windsurf- 判断列是否显示
function isColumnVisible(column: ColumnItem, record: Record<string, any>, index: number) {
  if (typeof column.ifShow === 'function') {
    return column.ifShow(record, index)
  }
  return column.ifShow !== false
}

// windsurf- 格式化时间
function formatTime(time: string | number) {
  if (!time)
    return ''
  return formatDate(time)
}

// windsurf- 获取子节点列表
function getChildren(record: Record<string, any>) {
  return record.taskList || []
}

// windsurf- 获取标签宽度样式
function getLabelWidthStyle(column: ColumnItem) {
  const width = column.labelWidth || props.labelWidth
  return typeof width === 'number' ? `${width}px` : width
}
</script>

<template>
  <view class="process-wrapper mt-4">
    <!-- windsurf- 标题 -->
    <view class="process-header">
      <text class="process-title text-base text-gray-800 font-bold">{{ title }}</text>
    </view>

    <!-- windsurf- 流程列表 -->
    <view class="process-body">
      <view
        v-for="(item, index) in taskList"
        :key="item.definitionKey"
        class="process-item"
      >
        <!-- windsurf- 折叠面板头部 -->
        <view
          class="process-item-header"
          @click="toggleExpand(item.definitionKey)"
        >
          <view class="process-item-header-left">
            <view
              class="process-item-arrow"
              :class="{ 'is-expanded': isExpanded(item.definitionKey) }"
            >
              <text class="arrow-icon">›</text>
            </view>
            <text class="process-item-title">{{ item.name }}</text>
          </view>

          <sar-tag plain :color="getStatusTag(item.result).colorType">
            {{ getStatusTag(item.result).label }}
          </sar-tag>
        </view>

        <!-- windsurf- 折叠面板内容 -->
        <view
          v-show="isExpanded(item.definitionKey)"
          class="process-item-content"
        >
          <!-- windsurf- 有子节点时渲染子节点 -->
          <template v-if="getChildren(item).length > 0">
            <view
              v-for="(child, childIndex) in getChildren(item)"
              :key="childIndex"
              class="process-group"
            >
              <view
                v-for="column in columns"
                :key="column.dataIndex"
                class="process-row"
              >
                <template v-if="isColumnVisible(column, child, index)">
                  <text class="process-row-label">
                    {{ column.title }}
                  </text>
                  <view class="process-row-value">
                    <text
                      v-if="column.tag"
                      class="process-row-tag"
                      :style="{ color: getColumnTagColor(child, column) }"
                    >
                      {{ getColumnValue(child, column) }}
                    </text>
                    <text v-else>{{ getColumnValue(child, column) }}</text>
                  </view>
                </template>
              </view>
              <view v-if="child.endTime" class="process-footer">
                <text class="process-time">{{ formatTime(child.endTime) }}</text>
                <view class="process-actions" />
              </view>
            </view>
          </template>

          <!-- windsurf- 无子节点时直接渲染 -->
          <!-- 目前看是无效代码 -->
          <template v-else>
            <view class="process-group">
              <view
                v-for="column in columns"
                :key="column.dataIndex"
                class="process-row"
              >
                <template v-if="isColumnVisible(column, item, index)">
                  <text class="process-row-label">
                    {{ column.title }}
                  </text>
                  <view class="process-row-value">
                    <text
                      v-if="column.tag"
                      class="process-row-tag"
                      :style="{ color: getColumnTagColor(item, column) }"
                    >
                      {{ getColumnValue(item, column) }}
                    </text>
                    <text v-else>{{ getColumnValue(item, column) }}</text>
                  </view>
                </template>
              </view>
              <view class="process-footer">
                <text v-if="item.endTime" class="process-time">{{ formatTime(item.endTime) }}</text>
                <view class="process-actions">
                  <view class="action-icon i-carbon-edit text-blue-500" />
                  <view class="action-icon i-carbon-trash-can text-red-500" />
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.process-wrapper {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.process-header {
  padding: 20px 16px;
  // border-bottom: 1px solid #f0f0f0;
}

.process-title {
}

.process-body {
  padding: 16px;
  background-color: #fff;
}

.process-item {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &:not(:first-child)::before {
    content: '';
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 16px;
    background-color: #e0e0e0;
  }
}

.process-connector {
  display: none;
}

.process-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: #fff;
  cursor: pointer;
}

.process-item-header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.process-item-arrow {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  margin-right: 8px;

  &.is-expanded {
    transform: rotate(90deg);
  }
}

.arrow-icon {
  font-size: 18px;
  color: #999;
  font-weight: bold;
}

.process-item-title {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
}

.process-status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;

  &.status-2 {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.status-3 {
    background-color: #ffebee;
    color: #c62828;
  }

  &.status-1 {
    background-color: #e3f2fd;
    color: #1565c0;
  }
}

.status-text {
  font-size: 13px;
}

.process-item-content {
  padding: 0 16px 12px;
  background-color: #fff;
}

.process-group {
  padding: 16px;
  background-color: #fff;
  border-radius: 0;
  margin-bottom: 12px;
  border: none;

  &:last-child {
    margin-bottom: 0;
  }
}

.process-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.process-row-label {
  font-size: 14px;
  color: #999;
  flex-shrink: 0;
  min-width: 80px;
  margin-right: 8px;
}

.process-row-value {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
}

.process-row-tag {
  font-size: 14px;
}

.process-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-top: 12px;
  // padding-top: 12px;
}

.process-time {
  font-size: 13px;
  color: #999;
}

.process-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.6;
  }
}
</style>
