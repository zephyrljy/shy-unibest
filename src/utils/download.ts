/**
 * uni-app 通用下载函数（只下载，不打开）
 * @param url 文件地址
 * @param fileName 可选，App端保存时使用
 */
export function downloadFile(
  url: string,
  fileName?: string,
) {
  if (!url) {
    uni.showToast({ title: '文件地址为空', icon: 'none' })
    return
  }

  console.log('[ url ] >', url)
  // ======================
  // H5 / 企业微信
  // ======================
  // #ifdef H5
  const link = document.createElement('a')
  link.href = `/admin-api${url}`
  link.download = fileName || ''
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return
  // #endif

  // ======================
  // 小程序 / App
  // ======================
  uni.downloadFile({
    url,
    success(res) {
      if (res.statusCode !== 200) {
        uni.showToast({ title: '下载失败', icon: 'none' })
        return
      }

      // ---------- App ----------
      // #ifdef APP
      uni.saveFile({
        tempFilePath: res.tempFilePath,
        success(saveRes) {
          uni.showToast({ title: '文件已保存', icon: 'success' })
          // 如需返回保存路径：
          // saveRes.savedFilePath
        },
        fail() {
          uni.showToast({ title: '保存文件失败', icon: 'none' })
        },
      })
      // #endif

      // ---------- 小程序 ----------
      // #ifdef MP
      uni.showToast({ title: '文件已下载', icon: 'success' })
      // tempFilePath 如需后续使用可自行缓存
      // res.tempFilePath
      // #endif
    },
    fail() {
      uni.showToast({ title: '下载失败', icon: 'none' })
    },
  })
}
