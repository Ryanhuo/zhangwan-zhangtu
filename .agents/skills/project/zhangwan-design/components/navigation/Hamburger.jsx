import React from 'react';

/**
 * 侧边栏折叠/展开切换图标 — 对应 components/Hamburger/index.vue：一个三道杠
 * 图标，激活（侧边栏已折叠）时旋转 180°。
 */
export function Hamburger(props) {
  const { isActive = false, onToggle } = props;
  return (
    <div onClick={() => onToggle && onToggle()} style={{ cursor: 'pointer', display: 'inline-flex', padding: 8 }}>
      <svg
        viewBox="0 0 1024 1024"
        width="20"
        height="20"
        style={{ transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast) var(--ease-standard)' }}
      >
        <path
          fill="var(--text-body)"
          d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        />
      </svg>
    </div>
  );
}
