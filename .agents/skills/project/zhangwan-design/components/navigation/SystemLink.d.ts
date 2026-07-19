/**
 * 跨系统跳转器 — 对应 `SystemLink` 组件：顶栏一排系统入口（图标 + 名称），
 * 单一目的地的系统渲染为直接外链，有多个子目的地的系统 hover 展开一个
 * 下拉列表。公司内多套后台系统间跳转的标准位置（通常紧邻 Navbar 左侧）。
 */
export interface SystemLinkItem {
  name: string;
  link?: string;
}

export interface SystemEntry {
  name: string;
  /** 小方块图标颜色/背景占位（真实场景是系统 logo 图片） */
  icon?: string;
  /** 单一目的地时的直接链接 */
  link?: string;
  /** 有多个子目的地时，hover 展开为下拉列表 */
  items?: SystemLinkItem[];
}

export interface SystemLinkProps {
  systems: SystemEntry[];
}
