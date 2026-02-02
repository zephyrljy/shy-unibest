// windsurf- 导出DescItemList组件
export { default as DescItemList } from "./DescItemList.vue";

// windsurf- 列配置类型
export interface ColumnSchema {
  label: string;
  field: string;
  format?: "bool2string" | "date2string" | "number2money" | "dict" | "fileList";
  dictType?: string;
  customRender?: (record: any) => any;
}
