import React from 'react';

export function Dialog(props) {
  const { open, title, width = 480, children, confirmLoading = false, onCancel, onConfirm } = props;
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        fontFamily: 'var(--font-ui)',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          background: '#fff',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-heading)',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          {title}
        </div>
        <div style={{ padding: 20, color: 'var(--text-body)', fontSize: 'var(--text-sm)' }}>{children}</div>
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            borderTop: '1px solid var(--color-border-light)',
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
      </div>
    </div>
  );
}
