/**
 * 分区小标题 — 对应 `lineLightTitle` 组件：4px 品牌绿竖线 + 标题文字，
 * 用于分析页/详情页内的分区标题（不是页面级标题，页面级用 Breadcrumb）。
 */
export interface SectionTitleProps {
  /** 标题文字 */
  children: React.ReactNode;
  /** 字号（px），竖线高度随字号等比例（1em） */
  fontSize?: number;
}
