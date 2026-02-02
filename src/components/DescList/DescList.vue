<script lang="ts" setup>
// windsurf- 通用描述列表组件
import type { DescDataBlock } from "../DescCard/types";
import { FileList } from "@/components/FileList";
import { getDictLabel } from "@/utils/dict";
import { formatBoolean, formatDate, formatNumber } from "@/utils/format";

defineOptions({
  name: "DescList",
});

const props = defineProps<Props>();

// windsurf- Props 定义
interface Props {
  // windsurf- 数据块配置数组
  blocks: DescDataBlock[];
  // windsurf- 数据源
  data: Record<string, any>;
}

// windsurf- 获取字段值
function getFieldValue(field: string): string {
  const value = props.data?.[field];
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
}

//  获取原生值
function getNativeValue(field: string): string {
  const value = props.data?.[field];
  return value;
}

// windsurf- 获取字典标签值
function getDictValue(field: string, dictType: string): string {
  const value = props.data?.[field];
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const label = getDictLabel(dictType, value);
  return label || String(value);
}

// dayjs()
</script>

<template>
  <view class="space-y-4">
    <!-- windsurf- 遍历数据块 -->
    <view
      v-for="(block, index) in blocks"
      :key="index"
      class="rounded-xl bg-white p-4 shadow-sm"
    >
      <!-- windsurf- 模块标题 -->
      <view class="mb-4 border-b border-gray-100 pb-3">
        <text class="text-base text-gray-800 font-bold">{{ block.title }}</text>
      </view>

      <!-- windsurf- 字段列表 -->
      <view class="space-y-3">
        <view
          v-for="schema in block.data"
          :key="schema.field"
          class="flex items-start text-sm"
        >
          <!-- windsurf- 字段标签 -->
          <view class="w-24 shrink-0 text-gray-400">
            <text v-if="schema.required" class="mr-1 text-red-500">*</text>
            <text>{{ schema.label }}</text>
          </view>
          <!-- windsurf- 字段值 -->
          <view v-if="schema.format === 'bool2string'" class="break-all">
            {{ formatBoolean(getNativeValue(schema.field) as unknown as boolean) }}
          </view>
          <view v-else-if="schema.format === 'date2string'">
            {{ formatDate(getNativeValue(schema.field)) }}
          </view>
          <view v-else-if="schema.format === 'dict'">
            {{ getDictValue(schema.field, schema.dictType) }}
          </view>

          <view v-else-if="schema.format === 'number2money'">
            {{ formatNumber(getNativeValue(schema.field)) }}
          </view>

          <view v-else-if="schema.format === 'fileList'" class="w-full">
            <FileList :ids="getNativeValue(schema.field)" />
          </view>

          <view v-else class="break-all">
            {{ getFieldValue(schema.field) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
