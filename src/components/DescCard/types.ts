// windsurf- 审批详情展示组件类型定义

// windsurf- Schema 类型定义
export interface DescSchema {
  // windsurf- 字段标签
  label: string
  // windsurf- 字段名
  field: string
  // windsurf- 是否必填（显示红色星号）
  required?: boolean
  // windsurf- 列属性（用于布局）
  colProps?: {
    span?: number
  }
  // windsurf- 格式化函数
  format?: 'bool2string' | 'date2string' | 'dict' | 'number2money' | 'fileList'
  // windsurf- 字典类型（用于字典转换）
  dictType?: string
}

// windsurf- 数据块定义
export interface DescDataBlock {
  // windsurf- 模块标题
  title: string
  // windsurf- 字段配置
  data: DescSchema[]
}

// windsurf- 兼容旧名称
export type ApprovalDataBlock = DescDataBlock
