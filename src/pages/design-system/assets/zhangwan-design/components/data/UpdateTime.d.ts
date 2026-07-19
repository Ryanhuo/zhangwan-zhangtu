/**
 * "更新时间" 标签 — 对应 components/updateTime/index.vue：展示数据最后更新
 * 时间；若提供 `breakdown`（多数据源各自的更新时间），悬停时弹出明细列表
 * （对应真实组件里巨量引擎/磁力引擎/腾讯-ADQ 等各渠道数据源明细）。
 */
export interface UpdateTimeBreakdown {
  /** 数据源名称，例如 "巨量引擎" */
  key: string;
  time: string;
}
export interface UpdateTimeProps {
  time: string;
  /** 可选：按数据源列出的更新时间明细，悬停展示 */
  breakdown?: UpdateTimeBreakdown[];
}
