import type {
  IAuthLoginRes,
  ICaptcha,
  IDoubleTokenRes,
  IUpdateInfo,
  IUpdatePassword,
  IUserInfoRes,
} from "./types/login";
import { http } from "@/http/http";

enum Api {
  Login = "/system/auth/login",
  RefreshToken = "/system/auth/refresh-token?refreshToken=",
  GetTenantIdByName = "/system/tenant/get-id-by-name?name=",
  LoginOut = "/system/auth/logout",
  GetUserInfo = "/system/auth/get-permission-info",
  GetAsyncRoutes = "/system/auth/list-menus",
  GetCaptcha = "/system/captcha/get",
  CheckCaptcha = "/system/captcha/check",
  getTabPermission = "/system/auth/list-menus-table-permission",
  getOemDetail = "/infra/oem/detail",
  getTenantKv = "/system/tenant/kv",
}

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string;
  password: string;
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getCode() {
  return http.get<ICaptcha>(Api.GetCaptcha);
}

/**
 * 用户登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return http.post<IAuthLoginRes>(
    Api.Login,
    loginForm,
    {},
    { "tenant-id": "1" },
  );
}

/**
 * 刷新token
 * @param refreshToken 刷新token
 */
export function refreshToken(refreshToken: string) {
  return http.post<IDoubleTokenRes>(Api.RefreshToken + refreshToken);
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<IUserInfoRes>(Api.GetUserInfo);
}

/**
 * 退出登录
 */
export function logout() {
  return http.post<void>(Api.LoginOut);
}

/**
 * 修改用户信息
 */
export function updateInfo(data: IUpdateInfo) {
  return http.post("/user/updateInfo", data);
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post("/user/updatePassword", data);
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    });
  });
}

/**
 * 微信登录
 * @param params 微信登录参数，包含code
 * @returns Promise 包含登录结果
 */
export function wxLogin(data: { code: string }) {
  return http.post<IAuthLoginRes>("/auth/wxLogin", data);
}

/**
 * 企业微信 code 登录
 * @param code 企业微信授权码
 * @returns Promise 包含登录结果
 */
export function wechatWorkLogin(code: string) {
  return http.post<IAuthLoginRes>(
    "/qywx/auth/login",
    { code },
    { code },
    { "tenant-id": "1" },
  );
}
