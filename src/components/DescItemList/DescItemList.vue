<script lang="ts" setup>
// windsurf- 通用明细列表组件，用于渲染产品/采购等明细信息
import type { VNode } from 'vue'
import { getDictLabel } from '@/utils/dict'
import { formatBoolean, formatDate, formatNumber } from '@/utils/format'

defineOptions({
  name: 'DescItemList',
})

const props = defineProps<Props>()

// windsurf- 列配置类型
interface ColumnSchema {
  label: string
  field: string
  format?: 'bool2string' | 'date2string' | 'number2money' | 'dict' | 'fileList'
  dictType?: string
  customRender?: (record: any) => string | VNode | VNode[]
}

// windsurf- Props 定义
interface Props {
  // windsurf- 标题
  title: string
  // windsurf- 列配置
  columns: ColumnSchema[]
  // windsurf- 数据列表
  list: Record<string, any>[]
}

// windsurf- 判断是否有自定义渲染
function hasCustomRender(col: ColumnSchema): boolean {
  return !!col.customRender
}

// windsurf- 获取自定义渲染内容
function getCustomRenderValue(item: Record<string, any>, col: ColumnSchema): string | VNode | VNode[] {
  return col.customRender!(item)
}

// windsurf- 获取字段值
function getFieldValue(item: Record<string, any>, field: string, col: ColumnSchema): string {
  const value = item?.[field]
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  // windsurf- 根据format格式化值
  if (col.format === 'bool2string') {
    return formatBoolean(value as boolean)
  }
  if (col.format === 'date2string') {
    return formatDate(value)
  }
  if (col.format === 'number2money') {
    return formatNumber(value)
  }
  if (col.format === 'dict' && col.dictType) {
    return getDictLabel(col.dictType, value) || String(value)
  }

  return String(value)
}
</script>

<template>
  <view class="mt-4 rounded-xl bg-white p-4 shadow-sm">
    <view class="mb-3 text-base text-gray-800 font-bold">
      {{ title }}
    </view>

    <!-- windsurf- 数据展示 -->
    <view v-if="list.length > 0" class="max-h-60 overflow-auto bg-gray-50">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="mb-3 rounded-lg bg-gray-50 p-3"
      >
        <view
          v-for="col in columns"
          :key="col.field"
          class="mb-2 flex text-sm"
        >
          <text class="w-28 shrink-0 text-gray-400">{{ col.label }}</text>
          <view v-if="hasCustomRender(col)" class="flex-1 text-gray-800">
            <component :is="() => getCustomRenderValue(item, col)" />
          </view>
          <text v-else class="flex-1 whitespace-pre-line break-all text-gray-800">{{ getFieldValue(item, col.field, col) }}</text>
        </view>
      </view>
    </view>

    <!-- windsurf- 空数据展示 -->
    <view v-else class="py-8 text-center text-gray-400">
      <text>暂无数据</text>
    </view>
  </view>
</template>
