// windsurf- 企业微信OAuth2授权相关工具函数

// windsurf- 企业微信配置Map
export const WECHAT_WORK_CONFIGS = {
  1000016: {
    corpId: 'ww38439acc33ec914e',
    secret: 'WRtVvZEFrZkkj-7xUsO69uI_WPeH0sBjQGO9fgz6-uk',
    agentId: '1000016',
  },
  1000030: {
    corpId: 'wwc51809934069a272',
    secret: 'qIlQkGGZFfQoRDoY4HvvWtr4u9TK-MpywviwXLHLgOk',
    agentId: '1000030',
  },
  1000003: {
    corpId: 'ww31214802cc86fe9d',
    secret: 'sFPyP5tU7jf3nJcrRsVVPnOuiHDHGKkFqYzpJOXoTIo',
    agentId: '1000003',
  },
  1000004: {
    corpId: 'ww8fc17871847acfba',
    secret: 'c4EdZUfHHxR394VAZINtTVnH4hk_TKjC_xSzu1W6iic',
    agentId: '1000004',
  },
} as const

// windsurf- 获取企业微信配置
export function getWechatWorkConfig(key: keyof typeof WECHAT_WORK_CONFIGS) {
  return WECHAT_WORK_CONFIGS[key]
}

/**
 * windsurf- 生成企业微信OAuth2授权链接
 * @param params 授权参数
 * @param params.corpId 企业ID
 * @param params.redirectUri 授权后重定向的回调链接地址
 * @param params.state 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
 * @param params.agentId 企业应用的id
 * @param params.scope 应用授权作用域，默认为snsapi_base
 * @returns 授权链接
 */
export function getWechatWorkOAuth2Url(params: {
  corpId?: string
  redirectUri?: string
  state?: string
  agentId?: string
  secret?: string
  scope?: 'snsapi_base' | 'snsapi_privateinfo'
}): string {
  const { corpId = 'ww38439acc33ec914e', redirectUri = 'https://iot.3h1china.com/', state = '', agentId = '1000016', scope = 'snsapi_base' } = params

  // windsurf- 对redirect_uri进行URL编码
  const encodedRedirectUri = encodeURIComponent(redirectUri)

  // windsurf- 构建授权链接
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&state=${state}&agentid=${agentId}#wechat_redirect`

  return authUrl
}
