import React, { useState } from 'react';

const sizes = {
  small: { height: 28, padding: '0 12px', fontSize: 12 },
  medium: { height: 34, padding: '0 16px', fontSize: 14 },
  large: { height: 40, padding: '0 20px', fontSize: 14 },
};

const variants = {
  primary: { background: 'var(--brand-primary)', color: '#fff', border: '1px solid var(--brand-primary)' },
  default: { background: '#fff', color: 'var(--text-body)', border: '1px solid #dcdfe6' },
  text: { background: 'transparent', color: 'var(--brand-primary)', border: '1px solid transparent' },
  danger: { background: '#fff', color: 'var(--color-red)', border: '1px solid var(--color-pink-border)' },
};

if (typeof document !== 'undefined' && !document.getElementById('zw-loadingbtn-kf')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'zw-loadingbtn-kf';
  styleEl.textContent = '@keyframes zw-loadingbtn-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);
}

/**
 * LoadingBtn recreation — wraps the Button visual treatment so the caller
 * doesn't have to manage a loading flag by hand: pass an async onClick and
 * the button flips into its loading state for the duration of the promise,
 * then resets in a `finally` (matching the project's own try/finally
 * convention). Self-contained (does not depend on the Button component).
 */
export function LoadingBtn(props) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    disabled = false,
    icon = null,
    onClick,
  } = props;
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!onClick || busy) return;
    setBusy(true);
    try {
      await onClick();
    } finally {
      setBusy(false);
    }
  }

  const sizeStyle = sizes[size] || sizes.medium;
  const variantStyle = variants[variant] || variants.default;
  const isDisabled = disabled || busy;

  return (
    <button
      onClick={isDisabled ? undefined : handleClick}
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
    >
      {busy && (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            display: 'inline-block',
            animation: 'zw-loadingbtn-spin 0.7s linear infinite',
          }}
        />
      )}
      {!busy && icon}
      {children}
    </button>
  );
}
