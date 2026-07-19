/**
 * 面包屑导航 — 对应 components/Breadcrumb/index.vue：斜杠 "/" 分隔，最后一级
 * 渲染为纯文本（光标为 text，不可点击），其余各级可点击跳转。
 */
export interface BreadcrumbItem {
  label: string;
}
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
}
