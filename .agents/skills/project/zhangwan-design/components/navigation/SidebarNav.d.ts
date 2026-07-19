/**
 * 对应 layout/components/Sidebar 的左侧导航栏 — 白色背景，绿色激活态加右边缘
 * 强调条，展开 190px / 折叠 56px。
 *
 */
export interface SidebarNavItem {
  label: string;
  active?: boolean;
}
export interface SidebarNavProps {
  items: SidebarNavItem[];
  collapsed?: boolean;
  onSelect?: (index: number) => void;
}
