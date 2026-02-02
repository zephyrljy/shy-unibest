// windsurf- 数据字典工具类
import type { DictDataType } from "@/store/dict";
import { useDictStore } from "@/store/dict";

/**
 * 获取 dictType 对应的数据字典数组
 */
export function getDictOptions(dictType: string): DictDataType[] {
  const dictStore = useDictStore();
  return dictStore.getDictMap[dictType] || [];
}

/**
 * 获取 dictType 对应的数据字典数组（值为整数）
 */
export function getIntDictOptions(dictType: string): DictDataType[] {
  const dictOptions = getDictOptions(dictType);
  return dictOptions.map(dict => ({
    ...dict,
    value: Number.parseInt(String(dict.value)),
  }));
}

/**
 * 获取 dictType 对应的数据字典数组（值为字符串）
 */
export function getStrDictOptions(dictType: string): DictDataType[] {
  const dictOptions = getDictOptions(dictType);
  return dictOptions.map(dict => ({
    ...dict,
    value: String(dict.value),
  }));
}

/**
 * 获取 dictType 对应的数据字典数组（值为布尔值）
 */
export function getBoolDictOptions(dictType: string): DictDataType[] {
  const dictOptions = getDictOptions(dictType);
  return dictOptions.map(dict => ({
    ...dict,
    value: String(dict.value) === "true",
  }));
}

/**
 * 获取 dictType 对应的指定 value 的字典对象
 */
export function getDictObj(dictType: string, value: any): DictDataType | undefined {
  const dictOptions = getDictOptions(dictType);
  // eslint-disable-next-line eqeqeq
  return dictOptions.find(dict => dict.value == value);
}

/**
 * 获取 dictType 对应的指定 value 的 label
 */
export function getDictLabel(dictType: string, value: any): string {
  const dictObj = getDictObj(dictType, value);
  return dictObj?.label || "";
}

/**
 * 字典类型枚举
 */
export enum DICT_TYPE {
  USER_TYPE = "user_type",
  COMMON_STATUS = "common_status",
  SYSTEM_TENANT_PACKAGE_ID = "system_tenant_package_id",

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = "system_user_sex",
  SYSTEM_MENU_TYPE = "system_menu_type",
  SYSTEM_ROLE_TYPE = "system_role_type",
  SYSTEM_DATA_SCOPE = "system_data_scope",
  SYSTEM_NOTICE_TYPE = "system_notice_type",
  SYSTEM_OPERATE_TYPE = "system_operate_type",
  SYSTEM_LOGIN_TYPE = "system_login_type",
  SYSTEM_LOGIN_RESULT = "system_login_result",

  // ========== BPM 模块 ==========
  BPM_MODEL_CATEGORY = "bpm_model_category",
  BPM_PROCESS_INSTANCE_STATUS = "bpm_process_instance_status",
  BPM_PROCESS_INSTANCE_RESULT = "bpm_process_instance_result",

  // ========== 业务模块 ==========
  PRODUCT_LINE = "product_line",
  INDUSTRY = "industry",
  BUSINESS_RATE = "business_rate",
  BUSINESS_DIRECTION = "business_direction",
  BUSINESS_LEVEL = "business_level",
  USE_FUND_TYPE = "use_fund_type",
  REMITTANCE_METHOD = "remittance_method",
  BIG_MARGIN_FEE_STATUS = "bid_margin_fee_status",
  BID_WIN_SERVE_FEE_STATUS = "bid_win_serve_fee_status",
  BID_PROCESS_STATUS = "bid_process_status",
  BID_STATUS = "bid_status",
  BID_RESULT_STATUS = "bid_result_status",
  PROJECT_TYPE = "project_type",
  COMPANY_PROJECT_STATUS = "company_project_status",
  COMPANY_PROJECT_APPROVE_TYPE = "company_project_approve_type",
  PRODUCT_UNIT = "product_unit",
  WAREHOUSE_TYPE = "warehouse_type",
  TAX_RATE = "tax_rate",
  CONTRACT_TYPE = "contract_type",
  CONTRACT_MOLD = "contract_mold",
  SCM_RECEIPT_TICKET_TYPE = "scm_receipt_ticket_type",
  SCM_RETURN_TYPE = "scm_return_type",
  SCM_RETURN_WAY = "scm_return_way",
  SCM_RETURN_REASON = "scm_return_reason",
  SCM_RETURN_REASON_PUR = "scm_return_reason_pur",
  PERSON_EXPENSE_ATTRIBUTION_TYPE = "person_expense_attribution_type",
  WORKING_TYPE = "working_type",
  PERSON_EXPENSE_PROJECT_MANAGE_TYPE = "person_expense_project_manage_type",
  PERSON_EXPENSE_BUSINESS_TYPE = "person_expense_business_type",
  PERSON_EXPENSE_DEPT_TYPE = "person_expense_dept_type",
  PERSON_EXPENSE_EXHIBITION_TYPE = "person_expense_exhibition_type",
  PERSON_EXPENSE_QUALIFICATION_EXPENSE_TYPE = "person_expense_qualification_expense_type",
  PERSON_EXPENSE_TENDER_BID_TYPE = "person_expense_tender_bid_type",
  PERSON_EXPENSE_PROJECT_TYPE = "person_expense_project_type",
  EXHIBITION = "exhibition",
  PERSON_LOAN_REPAYMENT_TYPE = "person_loan_repayment_type",
  REMITTANCE_FORM = "remittance_form",
  INVOICE_TYPE = "invoice_type",
  ACCEPT_TYPE = "accept_type",
  PAYMENT_METHOD = "payment_method",
  SCM_SHIPMENT_TICKET_TYPE = "scm_shipment_ticket_type",
  SCM_SHIPMENT_PENDING_TYPE = "scm_shipment_pending_type",
  SCM_SHIPMENT_PENDING_STATUS = "scm_shipment_pending_status",
  SCM_RECEIPT_PENDING_STATUS = "scm_receipt_pending_status",
  BID_APPLY_FEE_STATUS = "bid_apply_fee_status",
  OFFICE_SELF_BUY = "office_self_buy",
  BUSINESS_PROGRESS = "business_progress",
  WORKFLOW_JUMP = "workflow_jump",
  WORKFLOW_MODAL = "workflow_modal",
  PRODUCT_LINE_TYPE = "product_line_type",
  BUSINESS_STATUS = "business_status",
  PERSON_EXPENSE_TYPE = "person_expense_type",
  TRANSPORT_VEHICLE = "transport_vehicle",
  BPM_TASK_COPY_SCRIPT = "bpm_task_copy_script",
  COLOR_TYPE = "color_type",
  BUSINESS_OPPORTUNITY_RATE = "business_opportunity_rate",
  PROJECT_STATUS = "project_status",
  BUSINESS_RATE_ENUM = "business_rate_enum",
  COMPANY_PROJECT_TYPE = "company_project_type",
  ADD_BUDGET_TYPE = "add_budget_type",
  KPI_MANAGEMENT_STATUS = "kpi_management_status",
  ASSESSMENT_STATE = "assessment_state",
  SCORING_TYPE = "scoring_type",
  RECEIPT_FORM_TYPE = "receipt_form_type",
  PAYMENT_FORM_TYPE = "payment_form_type",
  COMPANY_ACCOUNT_STATUS = "company_account_status",
  TENANT_DEPT_CONTRACT = "tenant_dept_contract",
  TENANT_DEPT_STANDARDCASE = "tenant_dept_standardcase",
  TENANT_DEPT_BUSINESS = "tenant_dept_business",
  TENANT_DEPT_DELIVERY = "tenant_dept_delivery",
  TENANT_TRAVEL_SUBSITY = "tenant_travel_subsity",
  BUSINESS_TYPE = "business_type",
}
