import dayjs from "dayjs";

export function formatBoolean(value: boolean) {
  return value ? "是" : "否";
}

export function formatDate(value: string | number, type = "YYYY-MM-DD HH:mm:ss") {
  if (!value)
    return "";
  // windsurf- 如果是数字或纯数字字符串，按时间戳处理；否则直接解析字符串
  const isTimestamp = typeof value === "number" || /^\d+$/.test(String(value));
  const date = isTimestamp ? dayjs(Number(value)).format(type) : dayjs(value).format(type);
  return date;
}

export function formatNumber(value?: string | number): string {
  const num = Number(value);
  if (Number.isNaN(num))
    return "0.00";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumberWithThousandSeparator(
  val: string | number,
  useThousandSeparator = true,
  fixedDecimalDigits = 2,
): string {
  if (val === null || val === undefined || val === "")
    return "";

  let numStr = String(val);

  // 统一保留固定小数位（默认2位）
  if (!Number.isNaN(+val)) {
    numStr = (+val).toFixed(fixedDecimalDigits);
  }

  const [intPart, decimalPart] = numStr.split(".");

  const formattedInt = useThousandSeparator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : intPart;

  return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
}

/**
 * 将数字转换为人民币大写
 * @param num 数字
 * @returns 人民币大写字符串
 */
export function numToChinese(num: number): string {
  // windsurf- 数字映射
  const rmb_num = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  // windsurf- 单位映射
  const big_unit = ["", "万", "亿", "兆"];
  const middle_unit = ["", "拾", "佰", "仟"];
  const small_unit = ["角", "分", "毫", "厘"];

  // windsurf- 参数校验
  if (typeof num !== "number" || Number.isNaN(num))
    return "";

  const absNum = Math.abs(num);

  // windsurf- 数值范围检查
  if (absNum >= 1e15) {
    console.warn("超出最大处理数字");
    return "";
  }

  // windsurf- 零值处理
  if (absNum === 0)
    return `${rmb_num[0]}圆整`;

  const isNegative = num < 0;
  const numStr = absNum.toString();

  // windsurf- 分离整数和小数部分
  const [intPart = "", floatPart = ""] = numStr.split(".");
  const limitedFloat = floatPart.substring(0, 4); // 限制小数位数为4位

  let rmb = "";

  // windsurf- 处理整数部分
  if (Number.parseInt(intPart, 10) > 0) {
    const length = intPart.length;
    let zeroCount = 0;

    for (let i = 0; i < length; i++) {
      const position = length - i - 1;
      const bigUnitIndex = Math.floor(position / 4);
      const middleUnitIndex = position % 4;
      const digit = intPart[i];

      if (digit === "0") {
        zeroCount++;
      }
      else {
        // windsurf- 添加零（如果前面有连续的零）
        if (zeroCount > 0) {
          rmb += rmb_num[0];
          zeroCount = 0;
        }
        // windsurf- 添加数字和单位
        rmb += rmb_num[Number.parseInt(digit)] + middle_unit[middleUnitIndex];
      }

      // windsurf- 添加大单位（万、亿、兆）
      if (middleUnitIndex === 0 && zeroCount < 4) {
        rmb += big_unit[bigUnitIndex];
      }
    }
    rmb += "圆";
  }

  // windsurf- 处理小数部分
  if (limitedFloat) {
    for (let i = 0; i < limitedFloat.length; i++) {
      const digit = limitedFloat[i];
      if (digit !== "0") {
        rmb += rmb_num[Number.parseInt(digit)] + small_unit[i];
      }
    }
  }

  // windsurf- 处理空值情况
  if (rmb === "") {
    rmb = `${rmb_num[0]}圆整`;
  }
  else if (!limitedFloat && !rmb.endsWith("整")) {
    rmb += "整";
  }

  // windsurf- 添加负号
  return (isNegative ? "负" : "") + rmb;
}

/**
 * 通用格式化函数
 * @param value 值
 * @param format 格式化类型
 * @returns 格式化后的值
 */
export function formatValue(value: any, format: string): string {
  if (value === null || value === undefined)
    return "-";

  switch (format) {
    case "date2string":
      return formatDate(value, "YYYY-MM-DD");
    case "datetime2string":
      return formatDate(value, "YYYY-MM-DD HH:mm:ss");
    case "number2money":
      return formatNumber(value);
    case "boolean":
      return formatBoolean(value);
    default:
      return String(value);
  }
}
