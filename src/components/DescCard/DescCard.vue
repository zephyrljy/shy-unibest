<script lang="ts" setup>
// windsurf- 审批详情展示组件
import type { DescSchema } from "./types";
import { formatBoolean, formatDate } from "@/utils/format";

defineOptions({
  name: "DescCard",
});

const props = withDefaults(defineProps<Props>(), {
  title: "",
});

// windsurf- Props 定义
interface Props {
  // windsurf- 标题
  title?: string;
  // windsurf- 数据源
  data: Record<string, any>;
  // windsurf- 字段配置
  schemas: DescSchema[];
}

// windsurf- 获取字段值
function getFieldValue(field: string): string {
  const value = props.data?.[field];
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
}
</script>

<template>
  <view class="mb-4 rounded-xl bg-white p-4 shadow-sm">
    <!-- windsurf- 卡片标题 -->
    <view v-if="title" class="mb-4 border-b border-gray-100 pb-3">
      <text class="text-base text-gray-800 font-bold">{{ title }}</text>
    </view>

    <!-- windsurf- 字段列表 -->
    <view class="space-y-3">
      <view
        v-for="schema in schemas"
        :key="schema.field"
        class="flex items-start text-sm"
      >
        <!-- windsurf- 字段标签 -->
        <view class="w-24 shrink-0 text-gray-400">
          <text v-if="schema.required" class="mr-1 text-red-500">*</text>
          <text>{{ schema.label }}</text>
        </view>
        <!-- windsurf- 字段值 -->
        <view class="flex-1 text-gray-800">
          <view v-if="schema.format === 'bool2string'">
            {{ formatBoolean(getFieldValue(schema.field) as unknown as boolean) }}
          </view>
          <view v-else-if="schema.format === 'date2string'">
            {{ formatDate(getFieldValue(schema.field) as unknown as string) }}
          </view>
          <view v-else>
            {{ getFieldValue(schema.field) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
