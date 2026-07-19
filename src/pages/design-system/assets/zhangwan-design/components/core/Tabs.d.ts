/**
 * 下划线 tab 栏 — 对应分析页面中反复出现的 `.tabs-box-resetSty` 模式
 * （公告板、短剧详情、小说详情）：50px 高的选项，激活 tab 加粗并带 2px 绿色下划线。
 */
export interface TabItem {
  label: string;
  value: string | number;
}
export interface TabsProps {
  items: TabItem[];
  value: string | number;
  onChange?: (value: string | number) => void;
}
