// windsurf- KV键值对接口（下拉选项等）
import { http } from "@/http/http";

// windsurf- 客户字典
export function getCustomerDictApi(params = {}) {
  return http.get("/drop/select/custom", params);
}

// windsurf- 根据客户获取联系人
export function getContactNameDictByCustomerApi(params = {}) {
  return http.get("/drop/select/contactsByCustom", params);
}

// windsurf- 用户字典
export function getUserApi(params = {}) {
  return http.get("/drop/select/user", params);
}

// windsurf- 业务部门用户字典
export function getDeptUserApi(params = {}) {
  return http.get("/drop/select/businessDeptUserList", params);
}

// windsurf- 通过部门查找所有人员
export function getUserAllByDeptApi(params = {}) {
  return http.get("/drop/select/dept/user", params);
}

// windsurf- 根据状态获取关联商机
export function getBusinessByStatusApi(params = {}) {
  return http.get("/drop/select/businessByStatus", params);
}

// windsurf- 根据状态获取关联商机（未关联前期工作）
export function getBusinessByStatusAndNotAssociationEarlyWork(params = {}) {
  return http.get("/drop/select/businessByStatusAndNotAssociationEarlyWork", params);
}

// windsurf- 根据关联商机获取关联客户
export function getCustomByBusinessApi(params = {}) {
  return http.get("/drop/select/customByBusinessKv", params);
}

// windsurf- 部门kv
export function getDeptKvApi(params = {}) {
  return http.get("/drop/select/dept", params);
}

// windsurf- 部门字典
export function getDeptApi(params = {}) {
  return http.get("/drop/select/deptTree", params);
}

// windsurf- 获取银行收款人
export function getBankPayeeDictApi(params = {}) {
  return http.get("/drop/select/bankPayee", params);
}

// windsurf- 获取银行
export function getBankDictApi(params = {}) {
  return http.get("/drop/select/bankName", params);
}

// windsurf- 获取银行账户
export function getBankAccountDictApi(params = {}) {
  return http.get("/drop/select/bankAccount", params);
}

// windsurf- 获取自研产品线
export function getProductLineDictApi(params = {}) {
  return http.get("/drop/select/productKv", params);
}

// windsurf- 根据产品线获取产品
export function getProductDictByLineApi(params = {}) {
  return http.get("/drop/select/productByProductLine", params);
}

// windsurf- 根据产品获取组件
export function getComponentDictByProductApi(params = {}) {
  return http.get("/drop/select/productById", params);
}

// windsurf- 仓库下拉
export function getWarehouseKvApi(params = {}) {
  return http.get("/drop/select/warehouse", params);
}

// windsurf- 供应商下拉
export function getSupplierKvApi(params = {}) {
  return http.get("/drop/select/scm/supplier", params);
}

// windsurf- 供应商联系人下拉
export function getSupplierContactsKvApi(params = {}) {
  return http.get("/drop/select/scm/supplier/contacts", params);
}

// windsurf- 项目下拉
export function getProjectKvApi(params = {}) {
  return http.get("/drop/select/project", params);
}

// windsurf- 预购合同下拉
export function getPreOrderKvApi(params = {}) {
  return http.get("/drop/select/preOrder", params);
}

// windsurf- 区域下拉
export function getAreaKvApi(params = {}) {
  return http.get("/system/area/tree", params);
}

// windsurf- 出库单下拉
export function getOutboundOrderKvApi(params = {}) {
  return http.get("/drop/select/scm/shipment", params);
}

// windsurf- 入库单下拉
export function getInboundOrderKvApi(params = {}) {
  return http.get("/drop/select/scm/receipt", params);
}

// windsurf- 个人报销费用归属类型下拉
export function getAttributionKvApi(params = {}) {
  return http.get("/drop/select/pe/attribution", params);
}

// windsurf- 个人报销报销部门下拉
export function getPeDeptKvApi(params = {}) {
  return http.get("/drop/select/pe/dept", params);
}

// windsurf- 个人报销项目下拉
export function getPeProjectKvApi(params = {}) {
  return http.get("/drop/select/pe/project", params);
}

// windsurf- 个人报销商机下拉
export function getPeBusinessByStatusKvApi(params = {}) {
  return http.get("/drop/select/pe/businessByStatus", params);
}

// windsurf- 投标下拉（个人报销）
export function getPeBidKvApi(params = {}) {
  return http.get("/drop/select/bid", params);
}

// windsurf- 待出库项目下拉
export function getWaitOutboundProjectKvApi(params = {}) {
  return http.get("/drop/select/scm/shipment/project", params);
}

// windsurf- 自研项目下拉
export function getSelfProjectKvApi(params = {}) {
  return http.get("/drop/select/company/self/project", params);
}

// windsurf- 已立项项目下拉
export function getProjectByStatusKv(params = {}) {
  return http.get("/drop/select/projectByStatus", params);
}

// windsurf- 已立项项目数据列表
export function getProjectListKv(params = {}) {
  return http.get("/project/list", params);
}

// windsurf- 已完成项目下拉
export function getFinishProjectKvApi(params = {}) {
  return http.get("/drop/select/finish/project", params);
}

// windsurf- 用款管理-付款银行下拉
export function getCompanyAccountDrop(params = {}) {
  return http.get("/drop/select/companyAccount", params);
}

// windsurf- 用款管理-账户名称下拉
export function getCompanyAccountNameDrop(params = {}) {
  return http.get("/drop/select/companyAccountName", params);
}

// windsurf- 待出库单项目下拉
export function getShipmentProjectKvApi(params = {}) {
  return http.get("/drop/select/scm/shipment/project", params);
}

// windsurf- 供应商账户下拉
export function getSupplierAccountKvApi(params = {}) {
  return http.get("/drop/select/supplierAccountBySupplierId", params);
}

// windsurf- 已审批采购合同下拉
export function getApprovedContractKvApi(params = {}) {
  return http.get("/drop/select/purchaseByApproveStatus", params);
}

// windsurf- 关联项目的已审批采购合同下拉
export function getApprovedContractByProjectKvApi(params = {}) {
  return http.get("/drop/select/purchaseByApproveStatusAndProjectId", params);
}

// windsurf- 关联项目的已审批预购合同下拉
export function getApprovedPreContractByProjectKvApi(params = {}) {
  return http.get("/drop/select/preOrderByApproveStatusAndProjectId", params);
}

// windsurf- 根据进像获取发票
export function getInvoiceByPictureApi(params = {}) {
  return http.get("/drop/select/invoiceInputByScmPurchaseId", params);
}

// windsurf- 已审批销售合同下拉
export function getApprovedSaleContractKvApi(params = {}) {
  return http.get("/drop/select/saleContractByApproveStatusAndType", params);
}

// windsurf- 关联项目的已审批销售合同下拉
export function getApprovedSaleContractByProjectKvApi(params = {}) {
  return http.get("/drop/select/saleContractByApproveStatusAndTypeAndProjectId", params);
}

// windsurf- 发票抬头下拉
export function getInvoiceTitleKvApi(params = {}) {
  return http.get("/drop/select/invoiceHeaderByCustomId", params);
}

// windsurf- 未被关联商机下拉
export function getUnrelatedBusinessKvApi(params = {}) {
  return http.get("/drop/select/businessByStatusAndNotAssociationBid", params);
}

// windsurf- 业务部门下拉
export function getBusinessDeptKvApi(params = {}) {
  return http.get("/drop/select/businessDept", params);
}

// windsurf- 职级职等下拉
export function getGradeLevelKvApi(params = {}) {
  return http.get("/drop/select/gradeLevel", params);
}

// windsurf- 多租户下拉
export function getTenantKvApi(params = {}) {
  return http.get("/drop/select/tenant", params);
}

// windsurf- 每周一语
export function getEveryWeekKvApi(params = {}) {
  return http.get("/humanCare/login/words", params);
}

// windsurf- 部门用户下拉树
export function getDeptUserTreeApi(params = {}) {
  return http.get("/drop/select/deptUserTree", params);
}

// windsurf- 项目预购合同下拉
export function getPreOrderSelectByProjectIdApi(params = {}) {
  return http.get("/projectPreorderRef/projectPreOrderSelectByProjectId", params);
}

// windsurf- 项目预购合同关联付款进程下拉
export function getPaymentFromSelectByPreOrderApi(params = {}) {
  return http.get("/drop/select/paymentFromSelectByPreOrder", params);
}

// windsurf- 入库单下拉
export function getReceiptKvApi(params = {}) {
  return http.get("/drop/select/scm/receiptList", params);
}

// windsurf- 行业下拉
export function getBasicIndustryKvApi(params = {}) {
  return http.get("/basicIndustry/tree", params);
}

// windsurf- 绩效模板下拉
export function getPerformanceTemplateKv(params = {}) {
  return http.get("/drop/select/kpi/kpiTemplateList", params);
}

// windsurf- 负责人下拉
export function getDeptLeaderKv(params = {}) {
  return http.get("/drop/select/deptLeader/user", params);
}

// windsurf- 采购/预购合同下拉
export function getPurchaseContractAndPreOrderKv(params = {}) {
  return http.get("/drop/select/purchaseContractOrPreOrder", params);
}

// windsurf- 部门用户树
export function getDeptUserListKv(params = {}) {
  return http.get("/drop/select/deptUserList", params);
}

// windsurf- 项目经理树
export function getProjectManagerTreeKv(params = {}) {
  return http.get("/drop/select/deptUserList/all", params);
}

// windsurf- 品牌活动
export function getBrandActiveKv(params = {}) {
  return http.get("/drop/select/brandActive", params);
}

// windsurf- 项目下拉（编码-名称）
export function getProjectCodeKv(params = {}) {
  return http.get("/drop/select/project/codeAndName", params);
}

// windsurf- 商机下拉（编码-名称）
export function getBusinessCodeKv(params = {}) {
  return http.get("/drop/select/business/codeAndName", params);
}

// windsurf- 流程节点下拉
export function getTaskKeyKv(params = {}) {
  return http.get("/drop/select/bpm/getTaskKeyList", params);
}

// windsurf- 项目质保金下拉
export function getProjectRetentionDetailKv(params = {}) {
  return http.get("/drop/select/projectRetentionDetail", params);
}
