import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('zw-button-kf')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'zw-button-kf';
  styleEl.textContent = '@keyframes zw-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);
}

const sizes = {
  small: { height: 28, padding: '0 12px', fontSize: 12 },
  medium: { height: 34, padding: '0 16px', fontSize: 14 },
  large: { height: 40, padding: '0 20px', fontSize: 14 },
};

const variants = {
  primary: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: '1px solid var(--brand-primary)',
  },
  default: {
    background: '#fff',
    color: 'var(--text-body)',
    border: '1px solid #dcdfe6',
  },
  text: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid transparent',
  },
  danger: {
    background: '#fff',
    color: 'var(--color-red)',
    border: '1px solid var(--color-pink-border)',
  },
};

export function Button(props) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    loading = false,
    disabled = false,
    icon = null,
    onClick,
  } = props;

  const sizeStyle = sizes[size] || sizes.medium;
  const variantStyle = variants[variant] || variants.default;
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      style={{
        ...sizeStyle,
        ...variantStyle,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-ui)',
        fontWeight: 'var(--weight-regular)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        if (variant === 'primary') e.currentTarget.style.background = '#00a878';
        else if (variant === 'default') e.currentTarget.style.borderColor = 'var(--brand-primary)';
        else if (variant === 'text') e.currentTarget.style.background = 'var(--brand-primary-bg)';
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.background = variantStyle.background;
        e.currentTarget.style.borderColor = variantStyle.border.split(' ').pop();
      }}
    >
      {loading && (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            display: 'inline-block',
            animation: 'zw-spin 0.7s linear infinite',
          }}
        />
      )}
      {!loading && icon}
      {children}
    </button>
  );
}
