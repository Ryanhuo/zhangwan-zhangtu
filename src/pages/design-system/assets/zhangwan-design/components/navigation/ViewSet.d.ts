/**
 * 自定义视图行 — 对应 `ViewSet/List.vue`：筛选栏下方一行"保存的视图"色块
 * 按钮（点击切换、hover 出现删除叉、支持展开/收起），真实场景用来保存当前
 * 筛选条件/列设置/着色方案并随时切回。
 */
export interface ViewItem {
  id: string;
  label: string;
  /** 视图色块背景色（默认使用中性灰） */
  color?: string;
  /** false 表示该视图不可删除（例如系统预设视图） */
  removable?: boolean;
}

export interface ViewSetProps {
  views: ViewItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  onDelete?: (view: ViewItem) => void;
  /** 行首标签文字 */
  label?: string;
}
