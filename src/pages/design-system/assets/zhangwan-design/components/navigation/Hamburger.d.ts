/**
 * 侧边栏折叠/展开切换图标 — 对应 components/Hamburger/index.vue：三道杠图标，
 * `isActive`（侧边栏已折叠）时旋转 180°。
 */
export interface HamburgerProps {
  isActive?: boolean;
  onToggle?: () => void;
}
