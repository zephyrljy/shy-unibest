// windsurf- 字典相关接口
import { http } from '@/http/http'

// windsurf- 字典数据类型
export interface DictDataVO {
  id: number
  dictType: string
  label: string
  value: string
  colorType: string
  cssClass: string
}

/**
 * 获取所有字典数据（精简列表）
 */
export function listSimpleDictData() {
  return http.get<DictDataVO[]>('/system/dict-data/list-all-simple')
}
