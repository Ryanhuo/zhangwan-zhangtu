import React from 'react';

const tones = {
  success: { background: 'var(--state-success-bg)', color: 'var(--state-success-text)', border: 'var(--state-success-border)' },
  info: { background: 'var(--state-info-bg)', color: 'var(--state-info-text)', border: 'var(--state-info-border)' },
  danger: { background: 'var(--state-danger-bg)', color: 'var(--state-danger-text)', border: 'var(--state-danger-border)' },
  neutral: { background: 'var(--color-surface-muted)', color: 'var(--text-body)', border: '#e0e0e0' },
};

export function Tag(props) {
  const { children, tone = 'neutral' } = props;
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-block',
        background: t.background,
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-pill)',
        padding: '0 10px',
        fontSize: 'var(--text-xs)',
        lineHeight: '22px',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {children}
    </span>
  );
}
