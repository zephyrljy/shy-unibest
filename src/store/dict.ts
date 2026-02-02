// windsurf- 字典 store
import type { DictDataVO } from '@/api/dict'
import { defineStore } from 'pinia'
import { listSimpleDictData } from '@/api/dict'

// windsurf- 字典缓存 key
const DICT_STORAGE_KEY = 'app_dict_data'
// windsurf- 字典缓存过期时间（毫秒）
const DICT_EXPIRE_TIME = 3600 * 1000 * 24 * 10

// windsurf- 字典数据类型
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: string
  cssClass: string
}

// windsurf- 字典 Map 类型
type DictMap = Record<string, DictDataType[]>

// windsurf- 缓存数据结构
interface DictCache {
  data: DictMap
  expireTime: number
}

export const useDictStore = defineStore('dict', {
  state: () => ({
    dictMap: {} as DictMap,
    isSetDict: false,
  }),

  getters: {
    // windsurf- 获取字典 Map
    getDictMap(): DictMap {
      // windsurf- 如果内存中没有，尝试从本地存储获取
      if (!this.isSetDict) {
        const cached = uni.getStorageSync(DICT_STORAGE_KEY) as DictCache | null
        if (cached && cached.expireTime > Date.now()) {
          this.dictMap = cached.data
          this.isSetDict = true
        }
      }
      return this.dictMap
    },
    // windsurf- 是否已设置字典
    getIsSetDict(): boolean {
      return this.isSetDict
    },
  },

  actions: {
    // windsurf- 设置字典数据
    async setDictMap() {
      // windsurf- 先尝试从本地存储获取
      // const cached = uni.getStorageSync(DICT_STORAGE_KEY) as DictCache | null
      // if (cached && cached.expireTime > Date.now()) {
      //   this.dictMap = cached.data
      //   this.isSetDict = true
      //   return
      // }

      // windsurf- 从接口获取
      try {
        const res = await listSimpleDictData()
        const dictDataMap: DictMap = {}

        res.forEach((dictData: DictDataVO) => {
          // windsurf- 获得 dictType 层级
          if (!dictDataMap[dictData.dictType]) {
            dictDataMap[dictData.dictType] = []
          }
          // windsurf- 处理 dictValue 层级
          dictDataMap[dictData.dictType].push({
            dictType: dictData.dictType,
            value: dictData.value,
            label: dictData.label,
            colorType: dictData.colorType,
            cssClass: dictData.cssClass,
          })
        })

        this.dictMap = dictDataMap
        this.isSetDict = true

        // windsurf- 存储到本地
        const cacheData: DictCache = {
          data: dictDataMap,
          expireTime: Date.now() + DICT_EXPIRE_TIME,
        }
        uni.setStorageSync(DICT_STORAGE_KEY, cacheData)
      }
      catch (error) {
        console.error('获取字典数据失败:', error)
      }
    },

    // windsurf- 清除字典缓存
    clearDictCache() {
      this.dictMap = {}
      this.isSetDict = false
      uni.removeStorageSync(DICT_STORAGE_KEY)
    },
  },
})
