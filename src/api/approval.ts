// windsurf- 审批相关接口
import { http } from '@/http/http'

enum Api {
  // windsurf- 待办列表
  TodoPage = '/shy/task/process/todo',
  // windsurf- 已处理列表
  DonePage = '/shy/task/process/done',
  // windsurf- 我的列表
  MyPage = '/shy/task/process/myStart',
  // windsurf- 审批详情
  ProcessDetail = '/shy/task/process/detail',
  // windsurf- 审批通过
  Approve = '/shy/task/approve',
  // windsurf- 审批驳回
  Return = '/shy/task/return',
  // windsurf- 审批转办
  Transfer = '/bpm/task/change-assignee',
  // windsurf- 获取任务列表
  TaskList = '/bpm/task/list-by-process-instance-id-new',
  // windsurf- 根据任务ID获取字段配置
  FieldsConfig = '/bpm/activity/getFieldsConfigByTaskId',
}

// windsurf- 审批详情类型
export interface IApprovalDetail {
  approveStatus: number
  bizId: string
  buttonList: number[]
  createTime: number
  creator: string
  creatorName: string
  currentTaskKey: string
  currentTaskName: string
  definitionId: string
  definitionKey: string
  instanceId: string
  instanceName: string
  tabType: number
}

// windsurf- 审批列表项类型
export interface IApprovalItem {
  approveStatus: number
  bizId: string
  createTime: number
  creatorName: string
  currentTaskName: string
  definitionKey: string
  instanceId: string
  instanceName: string
  deptName?: string
  buttonList?: any[]
}

// windsurf- 分页参数
export interface IPageParams {
  pageNo: number
  pageSize: number
  [key: string]: any
}

// windsurf- 分页响应
export interface IPageResult<T> {
  list: T[]
  total: number
}

/**
 * 获取待办审批列表
 */
export function getTodoPage(params: IPageParams) {
  return http.get<IPageResult<IApprovalItem>>(Api.TodoPage, params)
}

/**
 * 获取已处理审批列表
 */
export function getDonePage(params: IPageParams) {
  return http.get<IPageResult<IApprovalItem>>(Api.DonePage, params)
}

/**
 * 获取我的审批列表
 */
export function getMyPage(params: IPageParams) {
  return http.get<IPageResult<IApprovalItem>>(Api.MyPage, params)
}

/**
 * 获取审批详情
 */
export function getProcessDetail(instanceId: string) {
  return http.get<IApprovalDetail>(Api.ProcessDetail, { instanceId })
}

/**
 * 审批通过
 */
export function approveTask(data: {
  processInstanceId: string
  reason: string
  variables?: string
}) {
  return http.post(Api.Approve, data)
}

/**
 * 审批驳回
 */
export function rejectTask(data: {
  processInstanceId: string
  reason: string
}) {
  return http.post(Api.Return, data)
}

/**
 * 获取任务列表
 */
export function getTaskListByProcessInstanceId(processInstanceId: string) {
  return http.get(`${Api.TaskList}?processInstanceId=${processInstanceId}`)
}

/**
 * 根据任务ID获取字段配置
 */
export function getFieldsConfigByTaskId(params: { taskId: string }) {
  return http.get(Api.FieldsConfig, params)
}

/**
 * 审批转办
 */
export function transferTask(data: {
  id: string
  assigneeUserId: string
}) {
  return http.post(Api.Transfer, data)
}
