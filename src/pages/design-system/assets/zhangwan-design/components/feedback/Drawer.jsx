import React from 'react';

/**
 * Side drawer — matches BiDrawer, the app's primary panel pattern for
 * detail/edit views (used more often than the centered Dialog).
 */
export function Drawer(props) {
  const { open, title, width = 480, children, footer = true, confirmLoading = false, onCancel, onConfirm } = props;
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 2000,
        fontFamily: 'var(--font-ui)',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width,
          background: '#fff',
          boxShadow: '-2px 0 12px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'zw-drawer-in 0.28s ease-in-out',
        }}
      >
        <style>{`@keyframes zw-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        <div
          style={{
            padding: '16px 20px',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-heading)',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          {title}
          <span onClick={onCancel} style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 18, lineHeight: 1 }}>×</span>
        </div>
        <div style={{ padding: 20, color: 'var(--text-body)', fontSize: 'var(--text-sm)', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              borderTop: '1px solid var(--color-border-light)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={onCancel}
              style={{
                height: 32,
                padding: '0 16px',
                border: '1px solid #dcdfe6',
                background: '#fff',
                color: 'var(--text-body)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              取 消
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmLoading}
              style={{
                height: 32,
                padding: '0 16px',
                border: '1px solid var(--brand-primary)',
                background: 'var(--brand-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                cursor: confirmLoading ? 'default' : 'pointer',
                opacity: confirmLoading ? 0.7 : 1,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {confirmLoading ? '提交中…' : '确 定'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
