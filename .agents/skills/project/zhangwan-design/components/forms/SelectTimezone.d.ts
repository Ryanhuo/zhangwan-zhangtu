/**
 * 时区下拉 — 对应真实的 SelectTimezone：一个紧凑、不可清空的 el-select，列出
 * 命名的 UTC 偏移量（例如 "北京UTC+8"），用于海外/留存分析页重新锚定日期边界。
 */
export interface TimezoneOption {
  label: string;
  value: string;
}
export interface SelectTimezoneProps {
  value?: string;
  zones?: TimezoneOption[];
  onChange?: (value: string) => void;
}
