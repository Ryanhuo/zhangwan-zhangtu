/* @ds-bundle: {"format":4,"namespace":"CompassDesignSystem_6dfef5","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"LoadingBtn","sourcePath":"components/core/LoadingBtn.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"SectionTitle","sourcePath":"components/core/SectionTitle.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ColumnChart","sourcePath":"components/data/ColumnChart.jsx"},{"name":"ColumnSettingsDialog","sourcePath":"components/data/ColumnSettingsDialog.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"DownloadCenter","sourcePath":"components/data/DownloadCenter.jsx"},{"name":"LineChart","sourcePath":"components/data/LineChart.jsx"},{"name":"PieChart","sourcePath":"components/data/PieChart.jsx"},{"name":"PopoverTableCell","sourcePath":"components/data/PopoverTableCell.jsx"},{"name":"RetentionTable","sourcePath":"components/data/RetentionTable.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"UpdateTime","sourcePath":"components/data/UpdateTime.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Drawer","sourcePath":"components/feedback/Drawer.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"DatePicker","sourcePath":"components/forms/DatePicker.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"InputMultTag","sourcePath":"components/forms/InputMultTag.jsx"},{"name":"InputNumberRange","sourcePath":"components/forms/InputNumberRange.jsx"},{"name":"RadioButtonGroup","sourcePath":"components/forms/RadioButtonGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"SelectTimezone","sourcePath":"components/forms/SelectTimezone.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"FilterBar","sourcePath":"components/navigation/FilterBar.jsx"},{"name":"FilterField","sourcePath":"components/navigation/FilterBar.jsx"},{"name":"Hamburger","sourcePath":"components/navigation/Hamburger.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"},{"name":"SystemLink","sourcePath":"components/navigation/SystemLink.jsx"},{"name":"ViewSet","sourcePath":"components/navigation/ViewSet.jsx"}],"sourceHashes":{"components/core/Button.jsx":"5b22510a4aec","components/core/LoadingBtn.jsx":"f3961f8fa0cd","components/core/Panel.jsx":"c83284abe0a4","components/core/SectionTitle.jsx":"0a3bc751cad1","components/core/Tabs.jsx":"4131d0eb0683","components/core/Tag.jsx":"496bb7c6c4ae","components/data/ColumnChart.jsx":"0c59158e13da","components/data/ColumnSettingsDialog.jsx":"dc42c60939ef","components/data/DataTable.jsx":"c6a6e198e069","components/data/DownloadCenter.jsx":"229a61fdc5a7","components/data/LineChart.jsx":"3519d7e82493","components/data/PieChart.jsx":"73be8751e0c0","components/data/PopoverTableCell.jsx":"1b0963753bec","components/data/RetentionTable.jsx":"e7f74ad3404d","components/data/StatCard.jsx":"787703e678b9","components/data/UpdateTime.jsx":"f1d4c7990655","components/feedback/Dialog.jsx":"a65e24d7dc22","components/feedback/Drawer.jsx":"85c38e9068f7","components/feedback/Tooltip.jsx":"f89f697c015a","components/forms/Checkbox.jsx":"c234d690fcf0","components/forms/DatePicker.jsx":"1753f6729cfa","components/forms/Input.jsx":"d637f1e3285a","components/forms/InputMultTag.jsx":"5ce4968f0d44","components/forms/InputNumberRange.jsx":"e840c36d7686","components/forms/RadioButtonGroup.jsx":"c8d718cc1be6","components/forms/Select.jsx":"ea6975cd31d1","components/forms/SelectTimezone.jsx":"e527eb5be61d","components/navigation/Breadcrumb.jsx":"c065b0753de1","components/navigation/FilterBar.jsx":"6cfb1e4ba67f","components/navigation/Hamburger.jsx":"f8aecc7ce878","components/navigation/Navbar.jsx":"a6b8c90ea086","components/navigation/SidebarNav.jsx":"85f7e3e75691","components/navigation/SystemLink.jsx":"29d36efdfe14","components/navigation/ViewSet.jsx":"59e49d32c96d","ui_kits/zhangwan-console/AnalysisScreen.jsx":"2c4e3c0260e5","ui_kits/zhangwan-console/App.jsx":"5dcab86f694d","ui_kits/zhangwan-console/ConsoleShell.jsx":"e88bf03b66a5","ui_kits/zhangwan-console/DashboardScreen.jsx":"bb7bfa324ea7","ui_kits/zhangwan-console/menuData.js":"f116d8a13579"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CompassDesignSystem_6dfef5 = window.CompassDesignSystem_6dfef5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
if (typeof document !== 'undefined' && !document.getElementById('zw-button-kf')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'zw-button-kf';
  styleEl.textContent = '@keyframes zw-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleEl);
}
const sizes = {
  small: {
    height: 28,
    padding: '0 12px',
    fontSize: 12
  },
  medium: {
    height: 34,
    padding: '0 16px',
    fontSize: 14
  },
  large: {
    height: 40,
    padding: '0 20px',
    fontSize: 14
  }
};
const variants = {
  primary: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: '1px solid var(--brand-primary)'
  },
  default: {
    background: '#fff',
    color: 'var(--text-body)',
    border: '1px solid #dcdfe6'
  },
  text: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid transparent'
  },
  danger: {
    background: '#fff',
    color: 'var(--color-red)',
    border: '1px solid var(--color-pink-border)'
  }
};
function Button(props) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    loading = false,
    disabled = false,
    icon = null,
    onClick
  } = props;
  const sizeStyle = sizes[size] || sizes.medium;
  const variantStyle = variants[variant] || variants.default;
  const isDisabled = disabled || loading;
  return /*#__PURE__*/React.createElement("button", {
    onClick: isDisabled ? undefined : onClick,
    disabled: isDisabled,
    style: {
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
      boxSizing: 'border-box'
    },
    onMouseEnter: e => {
      if (isDisabled) return;
      if (variant === 'primary') e.currentTarget.style.background = '#00a878';else if (variant === 'default') e.currentTarget.style.borderColor = 'var(--brand-primary)';else if (variant === 'text') e.currentTarget.style.background = 'var(--brand-primary-bg)';
    },
    onMouseLeave: e => {
      if (isDisabled) return;
      e.currentTarget.style.background = variantStyle.background;
      e.currentTarget.style.borderColor = variantStyle.border.split(' ').pop();
    }
  }, loading && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'zw-spin 0.7s linear infinite'
    }
  }), !loading && icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/LoadingBtn.jsx
try { (() => {
const {
  useState
} = React;
const sizes = {
  small: {
    height: 28,
    padding: '0 12px',
    fontSize: 12
  },
  medium: {
    height: 34,
    padding: '0 16px',
    fontSize: 14
  },
  large: {
    height: 40,
    padding: '0 20px',
    fontSize: 14
  }
};
const variants = {
  primary: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: '1px solid var(--brand-primary)'
  },
  default: {
    background: '#fff',
    color: 'var(--text-body)',
    border: '1px solid #dcdfe6'
  },
  text: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid transparent'
  },
  danger: {
    background: '#fff',
    color: 'var(--color-red)',
    border: '1px solid var(--color-pink-border)'
  }
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
function LoadingBtn(props) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    disabled = false,
    icon = null,
    onClick
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
  return /*#__PURE__*/React.createElement("button", {
    onClick: isDisabled ? undefined : handleClick,
    disabled: isDisabled,
    style: {
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
      boxSizing: 'border-box'
    }
  }, busy && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'zw-loadingbtn-spin 0.7s linear infinite'
    }
  }), !busy && icon, children);
}
Object.assign(__ds_scope, { LoadingBtn });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/LoadingBtn.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
function Panel(props) {
  const {
    title,
    children
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--color-border-light)',
      fontFamily: 'var(--font-ui)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: '39px',
      background: 'var(--surface-sunken)',
      padding: '0 10px',
      borderBottom: '1px solid var(--color-border-light)',
      fontWeight: 500,
      color: 'var(--text-heading)',
      fontSize: 'var(--text-sm)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionTitle.jsx
try { (() => {
/**
 * lineLightTitle recreation — a 4px brand-green bar followed by a label,
 * the standard section-header treatment used throughout analysis pages
 * (userPortrait, dashboard blocks, etc).
 */
function SectionTitle(props) {
  const {
    children,
    fontSize = 16
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'var(--font-ui)',
      fontSize
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      height: '1em',
      background: 'var(--brand-primary)',
      marginRight: 8,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, children));
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function Tabs(props) {
  const {
    items = [],
    value,
    onChange
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-ui)'
    }
  }, items.map(item => {
    const active = item.value === value;
    return /*#__PURE__*/React.createElement("div", {
      key: item.value,
      onClick: () => onChange && onChange(item.value),
      style: {
        height: 50,
        lineHeight: '50px',
        padding: '0 20px',
        fontSize: 16,
        color: active ? 'var(--text-heading)' : 'var(--text-muted)',
        fontWeight: active ? 700 : 400,
        position: 'relative',
        cursor: 'pointer',
        boxSizing: 'border-box'
      }
    }, item.label, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: 'var(--brand-primary)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
const tones = {
  success: {
    background: 'var(--state-success-bg)',
    color: 'var(--state-success-text)',
    border: 'var(--state-success-border)'
  },
  info: {
    background: 'var(--state-info-bg)',
    color: 'var(--state-info-text)',
    border: 'var(--state-info-border)'
  },
  danger: {
    background: 'var(--state-danger-bg)',
    color: 'var(--state-danger-text)',
    border: 'var(--state-danger-border)'
  },
  neutral: {
    background: 'var(--color-surface-muted)',
    color: 'var(--text-body)',
    border: '#e0e0e0'
  }
};
function Tag(props) {
  const {
    children,
    tone = 'neutral'
  } = props;
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: t.background,
      color: t.color,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-pill)',
      padding: '0 10px',
      fontSize: 'var(--text-xs)',
      lineHeight: '22px',
      fontFamily: 'var(--font-ui)'
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/ColumnChart.jsx
try { (() => {
const {
  useState,
  useMemo
} = React;
const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
function niceTicks(max) {
  if (max <= 0) return [0, 1];
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / step;
  const niceStep = (norm <= 2 ? 0.5 : norm <= 5 ? 1 : 2) * step;
  const ticks = [];
  for (let v = 0; v <= max + niceStep * 0.5; v += niceStep) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

/**
 * chartsNew/columnChart.vue 的还原 — 柱状图，品牌绿填充、圆角柱顶，
 * 悬停高亮当前柱并显示数值提示。无数据时显示"暂无数据"。
 */
function ColumnChart(props) {
  const {
    data = [],
    height = 280,
    width = 600,
    color = '#00bf8a',
    formatValue = v => String(v)
  } = props;
  const [hover, setHover] = useState(null);
  const padding = {
    top: 24,
    right: 20,
    bottom: 32,
    left: 44
  };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const values = data.map(d => Number(d.value) || 0);
  const maxVal = Math.max(1, ...values, 0);
  const ticks = useMemo(() => niceTicks(maxVal), [maxVal]);
  const tickMax = ticks[ticks.length - 1] || 1;
  if (!data.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-faint)',
        fontSize: 16,
        fontWeight: 400
      }
    }, "\u6682\u65E0\u6570\u636E"));
  }
  const bandWidth = innerW / data.length;
  const barWidth = Math.min(40, bandWidth * 0.5);
  const yFor = v => padding.top + innerH - innerH * v / tickMax;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      fontFamily: FONT,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, ticks.map((t, i) => {
    const y = yFor(t);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y,
      y2: y,
      stroke: "#E5E6EB",
      strokeWidth: "1",
      strokeDasharray: "5,2"
    }), /*#__PURE__*/React.createElement("text", {
      x: padding.left - 8,
      y: y + 4,
      textAnchor: "end",
      fontSize: "11",
      fill: "#4E5969"
    }, t));
  }), data.map((d, i) => {
    const cx = padding.left + bandWidth * i + bandWidth / 2;
    const v = Number(d.value) || 0;
    const y = yFor(v);
    const h = padding.top + innerH - y;
    const active = hover === i;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: cx - barWidth / 2,
      y: y,
      width: barWidth,
      height: Math.max(h, 0),
      rx: 2,
      fill: active ? color : color,
      fillOpacity: active ? 1 : 0.85,
      style: {
        cursor: 'pointer',
        transition: 'fill-opacity 0.15s'
      },
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(null)
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: height - 8,
      textAnchor: "middle",
      fontSize: "11",
      fill: "#4E5969"
    }, d.label));
  })), hover !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${(padding.left + bandWidth * hover + bandWidth / 2) / width * 100}%`,
      top: `${yFor(Number(data[hover].value) || 0) / height * 100}%`,
      transform: 'translate(-50%, -130%)',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }
  }, data[hover].label, ": ", formatValue(data[hover].value)));
}
Object.assign(__ds_scope, { ColumnChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ColumnChart.jsx", error: String((e && e.message) || e) }); }

// components/data/ColumnSettingsDialog.jsx
try { (() => {
const {
  useState,
  useEffect
} = React;
/**
 * "自定义列" dialog — matches components/showTableColumn/index.vue exactly:
 * groups of columns, each with a parent "select all in group" checkbox and a
 * row of child checkboxes; a single global "全选" checkbox sits in the footer
 * (left-aligned) next to a single "关闭" button — there is no separate
 * cancel/confirm pair, since real usage saves each toggle immediately.
 */
function ColumnSettingsDialog(props) {
  const {
    open,
    groups = [],
    onChange,
    onClose
  } = props;
  const [state, setState] = useState(groups);
  useEffect(() => {
    setState(groups);
  }, [open]);
  if (!open) return null;
  const allChecked = state.length > 0 && state.every(g => g.children.every(c => c.checked));
  function toggleGroup(gi, val) {
    setState(prev => {
      const next = prev.map((g, i) => i === gi ? {
        ...g,
        children: g.children.map(c => ({
          ...c,
          checked: val
        }))
      } : g);
      onChange && onChange(next);
      return next;
    });
  }
  function toggleChild(gi, ci, val) {
    setState(prev => {
      const next = prev.map((g, i) => i === gi ? {
        ...g,
        children: g.children.map((c, j) => j === ci ? {
          ...c,
          checked: val
        } : c)
      } : g);
      onChange && onChange(next);
      return next;
    });
  }
  function toggleAll(val) {
    setState(prev => {
      const next = prev.map(g => ({
        ...g,
        children: g.children.map(c => ({
          ...c,
          checked: val
        }))
      }));
      onChange && onChange(next);
      return next;
    });
  }
  const checkboxStyle = checked => ({
    width: 16,
    height: 16,
    borderRadius: 2,
    border: `1px solid ${checked ? 'var(--brand-primary)' : '#dcdfe6'}`,
    background: checked ? 'var(--brand-primary)' : '#fff',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    flexShrink: 0,
    cursor: 'pointer'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-ui)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 620,
      maxWidth: '92vw',
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-heading)',
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, "\u81EA\u5B9A\u4E49\u5217"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      minHeight: 120,
      maxHeight: 420,
      overflowY: 'auto'
    }
  }, state.map((g, gi) => /*#__PURE__*/React.createElement("div", {
    key: g.label,
    style: {
      display: 'flex',
      padding: '10px 0',
      borderBottom: gi === state.length - 1 ? 'none' : '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      width: 140,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-heading)',
      cursor: 'pointer',
      flexShrink: 0
    },
    onClick: () => toggleGroup(gi, !g.children.every(c => c.checked))
  }, /*#__PURE__*/React.createElement("span", {
    style: checkboxStyle(g.children.every(c => c.checked))
  }, g.children.every(c => c.checked) ? '✓' : ''), g.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px 15px',
      flex: 1
    }
  }, g.children.map((c, ci) => /*#__PURE__*/React.createElement("label", {
    key: c.label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      width: 120
    },
    onClick: () => toggleChild(gi, ci, !c.checked)
  }, /*#__PURE__*/React.createElement("span", {
    style: checkboxStyle(c.checked)
  }, c.checked ? '✓' : ''), c.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      cursor: 'pointer'
    },
    onClick: () => toggleAll(!allChecked)
  }, /*#__PURE__*/React.createElement("span", {
    style: checkboxStyle(allChecked)
  }, allChecked ? '✓' : ''), "\u5168\u9009"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid #dcdfe6',
      background: '#fff',
      color: 'var(--text-body)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u5173\u95ED"))));
}
Object.assign(__ds_scope, { ColumnSettingsDialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ColumnSettingsDialog.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/**
 * BiTable-style data table.
 * Adds: optional row-selection checkbox column (sticky-left), optional
 * grouped/multi-level header row, sortable column headers, and a
 * sticky/fixed first data column for wide tables with horizontal scroll.
 */
function DataTable(props) {
  const {
    columns = [],
    rows = [],
    page = 1,
    pageSize = 20,
    total = 0,
    onPageChange,
    selectable = false,
    selectedKeys = [],
    rowKey = '__index',
    onSelectChange,
    groups = null,
    sortBy = null,
    sortOrder = 'asc',
    onSortChange,
    onRowClick
  } = props;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const getKey = (row, i) => rowKey === '__index' ? i : row[rowKey];
  const allKeys = rows.map((r, i) => getKey(r, i));
  const allSelected = allKeys.length > 0 && allKeys.every(k => selectedKeys.includes(k));
  const someSelected = allKeys.some(k => selectedKeys.includes(k)) && !allSelected;
  const toggleAll = () => {
    if (!onSelectChange) return;
    onSelectChange(allSelected ? [] : allKeys);
  };
  const toggleRow = k => {
    if (!onSelectChange) return;
    onSelectChange(selectedKeys.includes(k) ? selectedKeys.filter(x => x !== k) : [...selectedKeys, k]);
  };
  const stickyLeftOf = idx => {
    // width of checkbox col + any fixed columns before idx
    let left = selectable ? 42 : 0;
    for (let i = 0; i < idx; i++) {
      if (columns[i].fixed === 'left') left += Number(columns[i].width) || 120;
    }
    return left;
  };
  const thBase = {
    padding: '7px 10px',
    fontWeight: 500,
    color: 'var(--text-heading)',
    borderBottom: '1px solid var(--color-border-light)',
    whiteSpace: 'nowrap',
    background: 'var(--color-surface-muted)'
  };
  const handleSort = col => {
    if (!col.sortable || !onSortChange) return;
    if (sortBy !== col.prop) onSortChange(col.prop, 'asc');else onSortChange(col.prop, sortOrder === 'asc' ? 'desc' : 'asc');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'auto',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      minWidth: 'max-content',
      borderCollapse: 'separate',
      borderSpacing: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, groups && /*#__PURE__*/React.createElement("tr", null, selectable && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      position: 'sticky',
      left: 0,
      zIndex: 3
    }
  }), groups.map((g, gi) => /*#__PURE__*/React.createElement("th", {
    key: gi,
    colSpan: g.span,
    style: {
      ...thBase,
      textAlign: 'center',
      color: 'var(--text-faint)',
      fontWeight: 400,
      fontSize: 'var(--text-xs, 12px)',
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, g.label))), /*#__PURE__*/React.createElement("tr", null, selectable && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      width: 42,
      textAlign: 'center',
      position: 'sticky',
      left: 0,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: allSelected,
    ref: el => {
      if (el) el.indeterminate = someSelected;
    },
    onChange: toggleAll,
    style: {
      accentColor: 'var(--brand-primary)',
      cursor: 'pointer'
    }
  })), columns.map((col, idx) => /*#__PURE__*/React.createElement("th", {
    key: col.prop,
    onClick: () => handleSort(col),
    style: {
      ...thBase,
      textAlign: col.align || 'left',
      width: col.width,
      cursor: col.sortable ? 'pointer' : 'default',
      userSelect: 'none',
      ...(col.fixed === 'left' ? {
        position: 'sticky',
        left: stickyLeftOf(idx),
        zIndex: 2,
        boxShadow: '1px 0 0 var(--color-border-light)'
      } : {})
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, col.label, col.sortable && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      lineHeight: '6px',
      fontSize: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: sortBy === col.prop && sortOrder === 'asc' ? 'var(--brand-primary)' : 'var(--color-border-scrollbar-thumb)'
    }
  }, "\u25B2"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: sortBy === col.prop && sortOrder === 'desc' ? 'var(--brand-primary)' : 'var(--color-border-scrollbar-thumb)'
    }
  }, "\u25BC"))))))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => {
    const k = getKey(row, i);
    const checked = selectedKeys.includes(k);
    return /*#__PURE__*/React.createElement("tr", {
      key: i,
      onClick: () => onRowClick && onRowClick(row, i),
      onMouseEnter: e => {
        e.currentTarget.style.background = '#f5f7fa';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = checked ? 'var(--brand-primary-bg)' : 'transparent';
      },
      style: {
        transition: 'background 0.15s',
        background: checked ? 'var(--brand-primary-bg)' : 'transparent',
        cursor: onRowClick ? 'pointer' : 'default'
      }
    }, selectable && /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '7px 10px',
        textAlign: 'center',
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--color-border-light)',
        position: 'sticky',
        left: 0,
        zIndex: 1,
        background: checked ? 'var(--brand-primary-bg)' : 'var(--color-surface)'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: checked,
      onChange: () => toggleRow(k),
      style: {
        accentColor: 'var(--brand-primary)',
        cursor: 'pointer'
      }
    })), columns.map((col, idx) => /*#__PURE__*/React.createElement("td", {
      key: col.prop,
      style: {
        textAlign: col.align || 'left',
        padding: '7px 10px',
        color: 'var(--text-body)',
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--color-border-light)',
        ...(col.fixed === 'left' ? {
          position: 'sticky',
          left: stickyLeftOf(idx),
          zIndex: 1,
          background: checked ? 'var(--brand-primary-bg)' : 'var(--color-surface)',
          boxShadow: '1px 0 0 var(--color-border-light)'
        } : {})
      }
    }, col.render ? col.render(row) : row[col.prop])));
  })))), total > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 20,
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => page > 1 && onPageChange && onPageChange(page - 1),
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      padding: '2px 8px'
    }
  }, "\u2039"), Array.from({
    length: pageCount
  }).slice(0, 5).map((_, i) => {
    const p = i + 1;
    const active = p === page;
    return /*#__PURE__*/React.createElement("span", {
      key: p,
      onClick: () => onPageChange && onPageChange(p),
      style: {
        cursor: 'pointer',
        minWidth: 24,
        height: 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--brand-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-body)'
      }
    }, p);
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => page < pageCount && onPageChange && onPageChange(page + 1),
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      padding: '2px 8px'
    }
  }, "\u203A")));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/DownloadCenter.jsx
try { (() => {
const {
  useState
} = React;
const statusTone = {
  0: {
    label: '未开始',
    bg: 'var(--color-surface-muted)',
    color: 'var(--text-body)'
  },
  11: {
    label: '执行中',
    bg: '#ffeacb',
    color: '#e6a23c'
  },
  21: {
    label: '已完成',
    bg: 'var(--state-success-bg)',
    color: 'var(--state-success-text)'
  },
  31: {
    label: '导出失败',
    bg: 'var(--state-danger-bg)',
    color: 'var(--state-danger-text)'
  }
};
function StatusPill({
  status
}) {
  const t = statusTone[status] || statusTone[0];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: t.bg,
      color: t.color,
      borderRadius: 'var(--radius-pill)',
      padding: '0 10px',
      fontSize: 12,
      lineHeight: '20px'
    }
  }, t.label);
}

/**
 * DownloadCenter recreation — the "下载中心" export-task panel: a filter
 * form (task ID / type / status / time range) over a task table (status
 * pill, export-condition summary, created/completed time, download link),
 * with its own pagination footer. The standard shell for any export-queue
 * feature across the product's analysis pages.
 */
function DownloadCenter(props) {
  const {
    tasks = [],
    typeOptions = [],
    statusOptions = [],
    filters = {},
    onFiltersChange,
    onSearch,
    onReset,
    page = 1,
    pageSize = 20,
    total = 0,
    onPageChange
  } = props;
  const [local, setLocal] = useState(filters);
  const f = onFiltersChange ? filters : local;
  const setF = patch => {
    const next = {
      ...f,
      ...patch
    };
    onFiltersChange ? onFiltersChange(next) : setLocal(next);
  };
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      background: 'var(--surface-canvas)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      gap: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u4EFB\u52A1ID"
  }, /*#__PURE__*/React.createElement("input", {
    value: f.taskCode || '',
    onChange: e => setF({
      taskCode: e.target.value
    }),
    style: fieldInputStyle
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u4EFB\u52A1\u7C7B\u578B"
  }, /*#__PURE__*/React.createElement("select", {
    value: f.taskType || '',
    onChange: e => setF({
      taskType: e.target.value
    }),
    style: fieldInputStyle
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u5168\u90E8"), typeOptions.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)))), /*#__PURE__*/React.createElement(Field, {
    label: "\u4EFB\u52A1\u72B6\u6001"
  }, /*#__PURE__*/React.createElement("select", {
    value: f.status || '',
    onChange: e => setF({
      status: e.target.value
    }),
    style: fieldInputStyle
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u5168\u90E8"), statusOptions.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSearch,
    style: primaryBtnStyle
  }, "\u641C\u7D22"), /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    style: defaultBtnStyle
  }, "\u91CD\u7F6E")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['任务ID', '任务状态', '任务类型', '导出条件', '创建时间', '完成时间', '操作'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: thStyle
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, tasks.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 7,
    style: {
      ...tdStyle,
      textAlign: 'center',
      color: 'var(--text-faint)',
      padding: '32px 10px'
    }
  }, "\u6682\u65E0\u6570\u636E")), tasks.map((t, i) => /*#__PURE__*/React.createElement("tr", {
    key: t.taskCode || i
  }, /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, t.taskCode), /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: t.status
  })), /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, t.taskName), /*#__PURE__*/React.createElement("td", {
    style: {
      ...tdStyle,
      maxWidth: 260,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    title: t.queryText
  }, t.queryText || '——'), /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, t.createTime), /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, t.completeTime || '——'), /*#__PURE__*/React.createElement("td", {
    style: tdStyle
  }, t.status === 21 ? /*#__PURE__*/React.createElement("a", {
    href: t.path,
    target: "_blank",
    rel: "noreferrer",
    style: {
      color: 'var(--brand-primary)'
    }
  }, "\u4E0B\u8F7D") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, "\u4E0B\u8F7D"))))))), total > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 20,
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => page > 1 && onPageChange && onPageChange(page - 1),
    style: pagerArrowStyle
  }, "\u2039"), Array.from({
    length: pageCount
  }).slice(0, 5).map((_, i) => {
    const p = i + 1;
    const active = p === page;
    return /*#__PURE__*/React.createElement("span", {
      key: p,
      onClick: () => onPageChange && onPageChange(p),
      style: {
        cursor: 'pointer',
        minWidth: 24,
        height: 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--brand-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-body)'
      }
    }, p);
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => page < pageCount && onPageChange && onPageChange(page + 1),
    style: pagerArrowStyle
  }, "\u203A"))));
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, label), children);
}
const fieldInputStyle = {
  height: 32,
  width: 180,
  border: '1px solid #dcdfe6',
  borderRadius: 'var(--radius-md)',
  padding: '0 10px',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-ui)',
  color: 'var(--text-heading)',
  background: '#fff',
  boxSizing: 'border-box'
};
const primaryBtnStyle = {
  height: 32,
  padding: '0 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--brand-primary)',
  background: 'var(--brand-primary)',
  color: '#fff',
  fontSize: 14,
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer'
};
const defaultBtnStyle = {
  height: 32,
  padding: '0 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid #dcdfe6',
  background: '#fff',
  color: 'var(--text-body)',
  fontSize: 14,
  fontFamily: 'var(--font-ui)',
  cursor: 'pointer'
};
const thStyle = {
  padding: '7px 10px',
  fontWeight: 500,
  color: 'var(--text-heading)',
  borderBottom: '1px solid var(--color-border-light)',
  whiteSpace: 'nowrap',
  background: 'var(--color-surface-muted)',
  textAlign: 'left'
};
const tdStyle = {
  padding: '7px 10px',
  color: 'var(--text-body)',
  borderBottom: '1px solid var(--color-border-light)'
};
const pagerArrowStyle = {
  cursor: 'pointer',
  color: 'var(--text-faint)',
  padding: '2px 8px'
};
Object.assign(__ds_scope, { DownloadCenter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DownloadCenter.jsx", error: String((e && e.message) || e) }); }

// components/data/LineChart.jsx
try { (() => {
const {
  useState,
  useMemo
} = React;
const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
const PALETTE = ['#3bc2ac', '#3491FA', '#F88A02', '#7442D4', '#F97DDA'];
function niceTicks(max) {
  if (max <= 0) return [0, 1];
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / step;
  const niceStep = (norm <= 2 ? 0.5 : norm <= 5 ? 1 : 2) * step;
  const ticks = [];
  for (let v = 0; v <= max + niceStep * 0.5; v += niceStep) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

/**
 * chartsNew/lineChart.vue 的还原 — 单/多系列折线图，浅绿色面积填充，
 * 悬停显示数值点提示。无数据时显示"暂无数据"。
 */
function LineChart(props) {
  const {
    series = [],
    height = 280,
    width = 600,
    valueLabel = '',
    formatValue = v => String(v)
  } = props;
  const [hover, setHover] = useState(null); // { si, pi }

  const padding = {
    top: 24,
    right: 24,
    bottom: 32,
    left: 44
  };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const labels = series[0]?.data?.map(d => d.label) || [];
  const allValues = series.flatMap(s => s.data.map(d => Number(d.value) || 0));
  const maxVal = Math.max(1, ...allValues, 0);
  const ticks = useMemo(() => niceTicks(maxVal), [maxVal]);
  const tickMax = ticks[ticks.length - 1] || 1;
  const xFor = i => labels.length <= 1 ? padding.left + innerW / 2 : padding.left + innerW * i / (labels.length - 1);
  const yFor = v => padding.top + innerH - innerH * v / tickMax;
  const hasData = labels.length > 0 && allValues.some(v => v !== 0) || allValues.length > 0;
  if (!labels.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-faint)',
        fontSize: 16,
        fontWeight: 400
      }
    }, "\u6682\u65E0\u6570\u636E"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      fontFamily: FONT,
      position: 'relative'
    }
  }, series.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 4
    }
  }, series.map((s, si) => /*#__PURE__*/React.createElement("span", {
    key: si,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 2,
      background: s.color || PALETTE[si % PALETTE.length],
      display: 'inline-block'
    }
  }), s.name))), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, ticks.map((t, i) => {
    const y = yFor(t);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y,
      y2: y,
      stroke: "#E5E6EB",
      strokeWidth: "1",
      strokeDasharray: "5,2"
    }), /*#__PURE__*/React.createElement("text", {
      x: padding.left - 8,
      y: y + 4,
      textAnchor: "end",
      fontSize: "11",
      fill: "#4E5969"
    }, t));
  }), labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xFor(i),
    y: height - 8,
    textAnchor: "middle",
    fontSize: "11",
    fill: "#4E5969"
  }, l)), series.map((s, si) => {
    const color = s.color || PALETTE[si % PALETTE.length];
    const pts = s.data.map((d, i) => [xFor(i), yFor(Number(d.value) || 0)]);
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
    const areaPath = `${linePath} L${pts[pts.length - 1][0]},${padding.top + innerH} L${pts[0][0]},${padding.top + innerH} Z`;
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, /*#__PURE__*/React.createElement("path", {
      d: areaPath,
      fill: color,
      fillOpacity: "0.1",
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: linePath,
      fill: "none",
      stroke: color,
      strokeWidth: "2"
    }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: p[0],
      cy: p[1],
      r: hover && hover.si === si && hover.pi === i ? 5 : 3,
      fill: "#fff",
      stroke: color,
      strokeWidth: "2",
      style: {
        cursor: 'pointer'
      },
      onMouseEnter: () => setHover({
        si,
        pi: i
      }),
      onMouseLeave: () => setHover(null)
    })));
  })), hover && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${xFor(hover.pi) / width * 100}%`,
      top: `${yFor(Number(series[hover.si].data[hover.pi].value) || 0) / height * 100}%`,
      transform: 'translate(-50%, -130%)',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }
  }, series[hover.si].name || valueLabel, ": ", formatValue(series[hover.si].data[hover.pi].value)));
}
Object.assign(__ds_scope, { LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/data/PieChart.jsx
try { (() => {
const {
  useState
} = React;
const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
// exact categorical palette from chartsNew/pieChart.vue's `.color(...)` call
const PALETTE = ['#3491FA', '#3BCC96', '#F88A02', '#3EC6FF', '#7442D4', '#FAC300', '#304D77', '#B48DEB', '#299488', '#F97DDA', '#025DF4', '#EA5BDB', '#09A4F0', '#BBBDE6', '#4045B2', '#21A97A', '#FF745A', '#007E99', '#FFA8A8', '#2391FF', '#946DFF', '#626681', '#EB4185'];
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
function donutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const [x1, y1] = polar(cx, cy, outerR, startAngle);
  const [x2, y2] = polar(cx, cy, outerR, endAngle);
  const [x3, y3] = polar(cx, cy, innerR, endAngle);
  const [x4, y4] = polar(cx, cy, innerR, startAngle);
  return [`M${x1},${y1}`, `A${outerR},${outerR} 0 ${largeArc} 1 ${x2},${y2}`, `L${x3},${y3}`, `A${innerR},${innerR} 0 ${largeArc} 0 ${x4},${y4}`, 'Z'].join(' ');
}

/**
 * chartsNew/pieChart.vue 的还原 — 环形图（theta 坐标系，innerRadius 0.6 /
 * radius 0.75），右侧图例，悬停显示 名称/数值/占比。无数据时显示"暂无数据"。
 */
function PieChart(props) {
  const {
    data = [],
    height = 280,
    showLabelText = false,
    formatValue = v => String(v)
  } = props;
  const [hover, setHover] = useState(null);
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  if (!data.length || total <= 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-faint)',
        fontSize: 16,
        fontWeight: 400
      }
    }, "\u6682\u65E0\u6570\u636E"));
  }
  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.375;
  const innerR = outerR * 0.6 / 0.75;
  let angle = 0;
  const slices = data.map((d, i) => {
    const value = Number(d.value) || 0;
    const pct = value / total * 100;
    const start = angle;
    const end = angle + value / total * 360;
    angle = end;
    return {
      ...d,
      value,
      pct,
      start,
      end,
      color: d.color || PALETTE[i % PALETTE.length]
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      fontFamily: FONT,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    style: {
      flexShrink: 0,
      overflow: 'visible'
    }
  }, slices.map((s, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: donutSlicePath(cx, cy, outerR, innerR, s.start, s.end),
    fill: s.color,
    stroke: "#fff",
    strokeWidth: "1",
    opacity: hover === null || hover === i ? 1 : 0.35,
    style: {
      cursor: 'pointer',
      transition: 'opacity 0.15s'
    },
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 12,
      color: 'var(--text-muted)',
      maxWidth: 160
    }
  }, slices.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      opacity: hover === null || hover === i ? 1 : 0.45,
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: s.color,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--text-faint)'
    }
  }, s.pct.toFixed(0), "%")))), hover !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: cx,
      top: 0,
      transform: 'translate(-50%, -110%)',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      pointerEvents: 'none'
    }
  }, slices[hover].label, ": ", formatValue(slices[hover].value), "\uFF08", slices[hover].pct.toFixed(0), "%\uFF09"));
}
Object.assign(__ds_scope, { PieChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PieChart.jsx", error: String((e && e.message) || e) }); }

// components/data/PopoverTableCell.jsx
try { (() => {
const {
  useState
} = React;
/**
 * 表格单元格的多值列表展示 — 对应 components/popoverTableCell/index.vue：
 * 顿号连接的前 3 项 + "..."，超过 3 项时悬停弹出完整列表。
 */
function PopoverTableCell(props) {
  const {
    items = [],
    renderLabel = i => i.label
  } = props;
  const [open, setOpen] = useState(false);
  const shown = items.slice(0, 3);
  const overflow = items.length > 3;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)',
      color: 'var(--text-body)'
    },
    onMouseEnter: () => overflow && setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      cursor: overflow ? 'default' : 'inherit'
    }
  }, shown.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, renderLabel(it), i !== shown.length - 1 ? '、' : overflow ? '...' : ''))), open && overflow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      padding: '8px 12px',
      zIndex: 50,
      maxHeight: 200,
      overflowY: 'auto',
      minWidth: 160
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '2px 0',
      whiteSpace: 'nowrap'
    }
  }, renderLabel(it)))));
}
Object.assign(__ds_scope, { PopoverTableCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PopoverTableCell.jsx", error: String((e && e.message) || e) }); }

// components/data/RetentionTable.jsx
try { (() => {
const {
  useState
} = React; // Heat color from game/preserveAnalysis analysisColorOpacity():
// positive base rgb(133,221,131); negative/comparison base rgb(252,145,138).
// opacity scaled by value / maxValue (smooth), or snapped to the nearest
// ladder stop when colorMode is 'ladder'.
const LADDER_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
function heatStyle(value, maxValue, colorMode) {
  if (value === null || value === undefined || isNaN(value)) {
    return {
      background: 'transparent',
      color: 'var(--text-faint)'
    };
  }
  const negative = value < 0;
  let o = Math.abs(value) / (maxValue || 100);
  o = o < 0 ? 0 : o > 1 ? 1 : o;
  if (colorMode === 'ladder') {
    let snapped = LADDER_STOPS[0];
    for (const s of LADDER_STOPS) if (o >= s) snapped = s;
    o = snapped;
  }
  const base = negative ? '252,145,138' : '133,221,131';
  return {
    background: `rgba(${base},${o.toFixed(2)})`,
    color: o > 0.6 ? negative ? '#5c1414' : '#1f3d20' : 'var(--text-body)'
  };
}
function fmt(n) {
  return typeof n === 'number' ? n.toLocaleString('en-US') : n;
}

// Matches components/PreserveAnalysis/Color.vue exactly: a centered el-dialog
// (700px) with a 阶梯着色/平滑着色 radio row, and — only in ladder mode — two
// gradient inputs (ROI梯度 %, 收入梯度 元).
function ColorSettingsDialog({
  colorMode,
  onColorModeChange,
  roi,
  onRoiChange,
  income,
  onIncomeChange,
  onCancel,
  onConfirm
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 700,
      maxWidth: '92vw',
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-heading)',
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, "\u7740\u8272\u8BBE\u7F6E"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '0 10px 15px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      width: 80,
      height: 32,
      lineHeight: '32px',
      margin: 0
    }
  }, "\u7740\u8272\u5C55\u793A:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginLeft: 10,
      alignItems: 'center',
      height: 32
    }
  }, [['ladder', '阶梯着色'], ['smooth', '平滑着色']].map(([key, label]) => /*#__PURE__*/React.createElement("label", {
    key: key,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer'
    },
    onClick: () => onColorModeChange(key)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: `1px solid ${colorMode === key ? 'var(--brand-primary)' : '#dcdfe6'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, colorMode === key && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--brand-primary)'
    }
  })), label)))), colorMode === 'ladder' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '15px 10px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      width: 80,
      height: 32,
      lineHeight: '32px',
      margin: 0
    }
  }, "\u68AF\u5EA6\u8BBE\u7F6E:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      marginLeft: 4,
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, "ROI\u68AF\u5EA6\uFF1A"), /*#__PURE__*/React.createElement("input", {
    value: roi,
    onChange: e => onRoiChange(e.target.value),
    style: {
      width: 100,
      height: 32,
      boxSizing: 'border-box',
      border: '1px solid var(--color-border)',
      borderRadius: 4,
      padding: '0 8px',
      marginLeft: 4,
      fontFamily: 'var(--font-numeric)'
    }
  }), /*#__PURE__*/React.createElement("div", null, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, "\u6536\u5165\u68AF\u5EA6\uFF1A"), /*#__PURE__*/React.createElement("input", {
    value: income,
    onChange: e => onIncomeChange(e.target.value),
    style: {
      width: 100,
      height: 32,
      boxSizing: 'border-box',
      border: '1px solid var(--color-border)',
      borderRadius: 4,
      padding: '0 8px',
      marginLeft: 4,
      fontFamily: 'var(--font-numeric)'
    }
  }), /*#__PURE__*/React.createElement("div", null, "\u5143"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      borderTop: '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid #dcdfe6',
      background: '#fff',
      color: 'var(--text-body)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u53D6 \u6D88"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid var(--brand-primary)',
      background: 'var(--brand-primary)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u786E \u5B9A"))));
}
function RetentionTable(props) {
  const {
    dayLabels = [],
    rows = [],
    metricLabel = '留存率',
    maxValue: maxValueProp = 100,
    percent = true,
    cumulativeLabel = null,
    allowColorSettings = true
  } = props;
  const [colorMode, setColorMode] = useState('ladder');
  const [maxValue, setMaxValue] = useState(maxValueProp);
  const [roi, setRoi] = useState(5);
  const [income, setIncome] = useState(1000);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const cellBase = {
    padding: '7px 10px',
    fontSize: 'var(--text-sm)',
    borderBottom: '1px solid var(--color-border-light)',
    borderRight: '1px solid var(--color-border-light)',
    whiteSpace: 'nowrap'
  };
  const headBase = {
    ...cellBase,
    background: 'var(--color-surface-muted)',
    color: 'var(--text-heading)',
    fontWeight: 500,
    textAlign: 'center',
    position: 'sticky',
    top: 0
  };
  const cumMax = cumulativeLabel ? Math.max(1, ...rows.map(r => r.cumulative || 0)) : 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-ui)',
      position: 'relative'
    }
  }, allowColorSettings && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSettingsOpen(true),
    style: {
      fontSize: 12,
      color: 'var(--text-body)',
      cursor: 'pointer',
      padding: '5px 12px',
      border: '1px solid #dcdfe6',
      borderRadius: 'var(--radius-md)',
      background: '#fff',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u7740\u8272\u8BBE\u7F6E"), settingsOpen && /*#__PURE__*/React.createElement(ColorSettingsDialog, {
    colorMode: colorMode,
    onColorModeChange: setColorMode,
    roi: roi,
    onRoiChange: setRoi,
    income: income,
    onIncomeChange: setIncome,
    onCancel: () => setSettingsOpen(false),
    onConfirm: () => {
      setMaxValue(colorMode === 'ladder' ? Number(roi) || maxValue : maxValue);
      setSettingsOpen(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: 'collapse',
      width: '100%',
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      textAlign: 'left',
      width: 120,
      left: 0,
      zIndex: 2
    }
  }, "\u65E5\u671F"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      width: 90
    }
  }, "\u65B0\u589E"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      width: 100
    }
  }, "\u82B1\u8D39"), cumulativeLabel && /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      width: 120
    }
  }, cumulativeLabel), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      textAlign: 'center'
    },
    colSpan: dayLabels.length
  }, metricLabel)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      top: 34,
      left: 0,
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      top: 34
    }
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      top: 34
    }
  }), cumulativeLabel && /*#__PURE__*/React.createElement("th", {
    style: {
      ...headBase,
      top: 34
    }
  }), dayLabels.map(d => /*#__PURE__*/React.createElement("th", {
    key: d,
    style: {
      ...headBase,
      top: 34,
      width: 68
    }
  }, d)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellBase,
      textAlign: 'left',
      color: 'var(--text-heading)',
      position: 'sticky',
      left: 0,
      background: '#fff',
      zIndex: 1
    }
  }, row.label), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellBase,
      textAlign: 'right',
      fontFamily: 'var(--font-numeric)'
    }
  }, fmt(row.newUsers)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellBase,
      textAlign: 'right',
      fontFamily: 'var(--font-numeric)'
    }
  }, "\xA5", fmt(row.cost)), cumulativeLabel && /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellBase,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      background: 'var(--color-surface-muted)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.round((row.cumulative || 0) / cumMax * 100)}%`,
      height: '100%',
      background: 'var(--brand-primary)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontSize: 12,
      color: 'var(--text-body)',
      minWidth: 32,
      textAlign: 'right'
    }
  }, percent ? `${row.cumulative}%` : fmt(row.cumulative)))), row.values.map((v, j) => {
    const hs = heatStyle(v, maxValue, colorMode);
    return /*#__PURE__*/React.createElement("td", {
      key: j,
      style: {
        ...cellBase,
        textAlign: 'center',
        fontFamily: 'var(--font-numeric)',
        ...hs
      }
    }, v === null || v === undefined ? '-' : percent ? v + '%' : fmt(v));
  })))))));
}
Object.assign(__ds_scope, { RetentionTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/RetentionTable.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function StatCard(props) {
  const {
    title,
    value,
    caption,
    active = false,
    onClick,
    aside
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 130,
      padding: 20,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-sunken)',
      border: active ? '1px solid var(--brand-primary)' : '2px solid var(--surface-sunken)',
      boxShadow: active ? 'var(--shadow-card)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-ui)',
      width: 280
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-heading)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-numeric)',
      fontSize: 'var(--text-xl)',
      color: 'var(--text-heading)',
      padding: '10px 0'
    }
  }, value), caption && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, caption)), aside && /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 100,
      width: '50%',
      height: 98
    }
  }, aside));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/UpdateTime.jsx
try { (() => {
const {
  useState
} = React;
/**
 * "更新时间" 标签 — 对应 components/updateTime/index.vue：显示数据最后更新
 * 时间，悬停时（若提供了 breakdown）弹出各数据源明细。常见于分析页顶部，与
 * Breadcrumb 同一行右侧对齐。
 */
function UpdateTime(props) {
  const {
    time,
    breakdown = []
  } = props;
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)'
    },
    onMouseEnter: () => breakdown.length > 0 && setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "\u66F4\u65B0\u65F6\u95F4\uFF1A"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, time), open && breakdown.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: 6,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      padding: '10px 14px',
      zIndex: 50,
      whiteSpace: 'nowrap'
    }
  }, breakdown.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.key,
    style: {
      display: 'flex',
      gap: 8,
      padding: '2px 0',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 90,
      textAlign: 'right',
      color: 'var(--text-faint)'
    }
  }, b.key, "\uFF1A"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, b.time)))));
}
Object.assign(__ds_scope, { UpdateTime });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/UpdateTime.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog(props) {
  const {
    open,
    title,
    width = 480,
    children,
    confirmLoading = false,
    onCancel,
    onConfirm
  } = props;
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: 'var(--font-ui)'
    },
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: '0 12px 32px rgba(0,0,0,0.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-heading)',
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      color: 'var(--text-body)',
      fontSize: 'var(--text-sm)'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      borderTop: '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid #dcdfe6',
      background: '#fff',
      color: 'var(--text-body)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u53D6 \u6D88"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    disabled: confirmLoading,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid var(--brand-primary)',
      background: 'var(--brand-primary)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      cursor: confirmLoading ? 'default' : 'pointer',
      opacity: confirmLoading ? 0.7 : 1,
      fontFamily: 'var(--font-ui)'
    }
  }, confirmLoading ? '提交中…' : '确 定'))));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Drawer.jsx
try { (() => {
/**
 * Side drawer — matches BiDrawer, the app's primary panel pattern for
 * detail/edit views (used more often than the centered Dialog).
 */
function Drawer(props) {
  const {
    open,
    title,
    width = 480,
    children,
    footer = true,
    confirmLoading = false,
    onCancel,
    onConfirm
  } = props;
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 2000,
      fontFamily: 'var(--font-ui)'
    },
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width,
      background: '#fff',
      boxShadow: '-2px 0 12px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'zw-drawer-in 0.28s ease-in-out'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes zw-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }`), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-heading)',
      borderBottom: '1px solid var(--color-border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }
  }, title, /*#__PURE__*/React.createElement("span", {
    onClick: onCancel,
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 18,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      color: 'var(--text-body)',
      fontSize: 'var(--text-sm)',
      overflowY: 'auto',
      flex: 1
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      borderTop: '1px solid var(--color-border-light)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid #dcdfe6',
      background: '#fff',
      color: 'var(--text-body)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)'
    }
  }, "\u53D6 \u6D88"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    disabled: confirmLoading,
    style: {
      height: 32,
      padding: '0 16px',
      border: '1px solid var(--brand-primary)',
      background: 'var(--brand-primary)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      cursor: confirmLoading ? 'default' : 'pointer',
      opacity: confirmLoading ? 0.7 : 1,
      fontFamily: 'var(--font-ui)'
    }
  }, confirmLoading ? '提交中…' : '确 定'))));
}
Object.assign(__ds_scope, { Drawer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Drawer.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
/**
 * 深色气泡提示 — 对应 el-tooltip 的 effect="dark" 样式，及项目自有的
 * TextTooltip 用法（仅当文字被截断时才显示提示，否则不显示）。
 */
function Tooltip(props) {
  const {
    content,
    children,
    placement = 'top',
    disabled = false,
    onlyOnOverflow = false
  } = props;
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(!onlyOnOverflow);
  const ref = useRef(null);
  useEffect(() => {
    if (!onlyOnOverflow || !ref.current) return;
    const el = ref.current;
    setOverflowing(el.scrollWidth > el.clientWidth);
  }, [children, onlyOnOverflow]);
  const showTooltip = visible && !disabled && overflowing;
  const isTop = placement === 'top';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      maxWidth: '100%'
    },
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: onlyOnOverflow ? {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%'
    } : undefined
  }, children), showTooltip && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      [isTop ? 'bottom' : 'top']: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: isTop ? 0 : 6,
      marginBottom: isTop ? 6 : 0,
      background: '#303133',
      color: '#fff',
      fontSize: 12,
      lineHeight: '18px',
      padding: '6px 10px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      maxWidth: 320,
      zIndex: 100,
      fontFamily: 'var(--font-ui)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      pointerEvents: 'none'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox(props) {
  const {
    label,
    checked = false,
    disabled = false,
    onChange
  } = props;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--text-sm)',
      color: disabled ? 'var(--text-faint)' : 'var(--text-body)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 14,
      height: 14,
      borderRadius: 2,
      border: `1px solid ${checked ? 'var(--brand-primary)' : '#dcdfe6'}`,
      background: checked ? 'var(--brand-primary)' : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "7",
    viewBox: "0 0 9 7",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 3.5L3.2 5.7L8 1",
    stroke: "white",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/DatePicker.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
function fmt(d) {
  if (!d) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
const DEFAULT_PRESETS = [{
  label: '今天',
  range: () => {
    const t = new Date();
    return [t, t];
  }
}, {
  label: '昨天',
  range: () => {
    const y = addDays(new Date(), -1);
    return [y, y];
  }
}, {
  label: '近7天',
  range: () => [addDays(new Date(), -6), new Date()]
}, {
  label: '近30天',
  range: () => [addDays(new Date(), -29), new Date()]
}];

/**
 * BiDatePicker recreation — a text-field trigger that opens a panel with a
 * date-range display and quick-range preset shortcuts (今天/近7天/近30天…).
 * The calendar grid itself is intentionally simplified (no month-grid picker)
 * since exact calendar behavior lives in the un-mounted bi-element-ui source.
 */
function DatePicker(props) {
  const {
    value,
    presets = DEFAULT_PRESETS,
    onChange,
    startPlaceholder = '开始日期',
    endPlaceholder = '结束日期',
    separator = '~',
    width = 240
  } = props;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value || [null, null]);
  const ref = useRef(null);
  const [start, end] = value !== undefined ? value : internal;
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  function pick(preset) {
    const range = preset.range();
    setInternal(range);
    onChange && onChange(range);
    setOpen(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      width,
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      height: 32,
      border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 10px',
      fontSize: 'var(--text-sm)',
      color: start ? 'var(--text-heading)' : 'var(--text-faint)',
      background: '#fff',
      cursor: 'pointer',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "2.5",
    width: "12",
    height: "10.5",
    rx: "1",
    stroke: "#c0c4cc",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1 5.5h12M4.2 1v3M9.8 1v3",
    stroke: "#c0c4cc",
    strokeWidth: "1.2"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'center',
      color: start ? 'var(--text-heading)' : 'var(--text-faint)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, start ? fmt(start) : startPlaceholder), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      flexShrink: 0
    }
  }, separator), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'center',
      color: end ? 'var(--text-heading)' : 'var(--text-faint)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, end ? fmt(end) : endPlaceholder)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '110%',
      left: 0,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 10,
      display: 'flex',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: '1px solid var(--color-border-light)',
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 88
    }
  }, presets.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.label,
    onClick: () => pick(p),
    style: {
      padding: '6px 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      borderRadius: 4,
      whiteSpace: 'nowrap'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--color-surface-hover)';
      e.currentTarget.style.color = 'var(--brand-primary)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-body)';
    }
  }, p.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      minWidth: 200,
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8,
      color: 'var(--text-heading)',
      fontFamily: 'var(--font-numeric)'
    }
  }, start ? fmt(start) : '开始日期', " ~ ", end ? fmt(end) : '结束日期'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, "\u9009\u62E9\u5DE6\u4FA7\u5FEB\u6377\u65F6\u95F4\u6BB5\uFF0C\u6216\u5BF9\u63A5\u65E5\u5386\u7EC4\u4EF6\u8FDB\u884C\u7CBE\u786E\u9009\u62E9\u3002"))));
}
Object.assign(__ds_scope, { DatePicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/DatePicker.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input(props) {
  const {
    value,
    placeholder = '请输入',
    size = 'medium',
    disabled = false,
    clearable = false,
    width = 240,
    onChange
  } = props;
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(value || '');
  const val = value !== undefined ? value : internal;
  const height = size === 'small' ? 28 : 32;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height,
      width,
      border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      background: disabled ? 'var(--color-surface-muted)' : '#fff',
      padding: '0 10px',
      boxSizing: 'border-box',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: val,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: e => {
      setInternal(e.target.value);
      onChange && onChange(e.target.value);
    },
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)',
      color: 'var(--text-heading)'
    }
  }), clearable && val && !disabled && /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      setInternal('');
      onChange && onChange('');
    },
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 12,
      marginLeft: 4
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/InputMultTag.jsx
try { (() => {
const {
  useState
} = React;
/**
 * InputMultTag recreation — free-typed multi-tag input (Enter to commit,
 * dedupes, respects a max count). Distinct from Select's multi-select:
 * there is no dropdown/option list here, the user types arbitrary values
 * (IDs, keywords) and each becomes a removable chip.
 */
function InputMultTag(props) {
  const {
    value = [],
    placeholder = '请输入',
    disabled = false,
    clearable = false,
    collapseTags = false,
    multipleLimit = 0,
    width = 240,
    onChange
  } = props;
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  function commit() {
    const q = query.trim();
    if (!q) return;
    if (value.includes(q)) {
      setQuery('');
      return;
    }
    if (multipleLimit > 0 && value.length >= multipleLimit) {
      setQuery('');
      return;
    }
    onChange && onChange([...value, q]);
    setQuery('');
  }
  function removeTag(tag) {
    if (disabled) return;
    onChange && onChange(value.filter(v => v !== tag));
  }
  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !query && value.length) removeTag(value[value.length - 1]);
  }
  const shown = collapseTags ? value.slice(0, 1) : value;
  const overflow = collapseTags ? value.length - shown.length : 0;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => !disabled && document.getElementById(props.id || '__imt_focus')?.focus(),
    style: {
      display: 'flex',
      flexWrap: collapseTags ? 'nowrap' : 'wrap',
      alignItems: 'center',
      gap: 6,
      minHeight: 32,
      width,
      border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      background: disabled ? 'var(--color-surface-muted)' : '#fff',
      padding: '4px 8px',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-ui)',
      cursor: disabled ? 'not-allowed' : 'text',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, shown.map(tag => /*#__PURE__*/React.createElement("span", {
    key: tag,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--color-surface-muted)',
      color: 'var(--text-body)',
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 12,
      whiteSpace: 'nowrap'
    }
  }, tag, !disabled && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      removeTag(tag);
    },
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)'
    }
  }, "\u2715"))), overflow > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--brand-primary-bg)',
      color: 'var(--brand-primary)',
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 12,
      whiteSpace: 'nowrap'
    }
  }, "+", overflow), /*#__PURE__*/React.createElement("input", {
    id: props.id || '__imt_focus',
    value: query,
    disabled: disabled,
    placeholder: value.length === 0 ? placeholder : '',
    onChange: e => setQuery(e.target.value),
    onKeyDown: onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      commit();
    },
    style: {
      flex: 1,
      minWidth: 40,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)',
      color: 'var(--text-heading)'
    }
  }), clearable && value.length > 0 && !disabled && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onChange && onChange([]);
      setQuery('');
    },
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 12
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { InputMultTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/InputMultTag.jsx", error: String((e && e.message) || e) }); }

// components/forms/InputNumberRange.jsx
try { (() => {
const {
  useState
} = React;
/**
 * Numeric range input — matches InputNumberRange: two el-inputs joined by a
 * "~" separator (最小值 / 最大值 placeholders) with a trailing clear icon.
 */
function InputNumberRange(props) {
  const {
    from,
    to,
    placeholderFrom = '最小值',
    placeholderTo = '最大值',
    disabled = false,
    clearable = true,
    width = 240,
    onChange
  } = props;
  const [internalFrom, setInternalFrom] = useState(from ?? '');
  const [internalTo, setInternalTo] = useState(to ?? '');
  const [focused, setFocused] = useState(false);
  const f = from !== undefined ? from : internalFrom;
  const t = to !== undefined ? to : internalTo;
  function update(nf, nt) {
    setInternalFrom(nf);
    setInternalTo(nt);
    onChange && onChange(nf, nt);
  }
  const inputStyle = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-ui)',
    color: 'var(--text-heading)',
    textAlign: 'center'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 32,
      width,
      border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      background: disabled ? 'var(--color-surface-muted)' : '#fff',
      boxSizing: 'border-box',
      transition: 'border-color var(--duration-fast) var(--ease-standard)',
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: f,
    placeholder: placeholderFrom,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: e => update(e.target.value, t),
    style: {
      ...inputStyle,
      paddingLeft: 10
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      flexShrink: 0
    }
  }, "~"), /*#__PURE__*/React.createElement("input", {
    value: t,
    placeholder: placeholderTo,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: e => update(f, e.target.value),
    style: inputStyle
  }), clearable && (f || t) && !disabled && /*#__PURE__*/React.createElement("span", {
    onClick: () => update('', ''),
    style: {
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 12,
      padding: '0 8px',
      flexShrink: 0
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { InputNumberRange });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/InputNumberRange.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioButtonGroup.jsx
try { (() => {
function RadioButtonGroup(props) {
  const {
    options = [],
    value,
    onChange
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      fontFamily: 'var(--font-ui)'
    }
  }, options.map((opt, i) => {
    const active = opt.value === value;
    return /*#__PURE__*/React.createElement("div", {
      key: opt.value,
      onClick: () => onChange && onChange(opt.value),
      style: {
        minWidth: 70,
        padding: '0 16px',
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        border: `1px solid ${active ? 'var(--brand-primary)' : '#dcdfe6'}`,
        background: active ? 'var(--brand-primary)' : '#fff',
        color: active ? '#fff' : 'var(--text-body)',
        borderLeft: i === 0 ? undefined : 'none',
        borderRadius: i === 0 ? 'var(--radius-md) 0 0 var(--radius-md)' : i === options.length - 1 ? '0 var(--radius-md) var(--radius-md) 0' : 0,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: active ? 1 : 0
      }
    }, opt.label);
  }));
}
Object.assign(__ds_scope, { RadioButtonGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioButtonGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect,
  useMemo
} = React;
/**
 * Zhangwan dropdown select — matches el-select.
 * Adds: filterable search input (stand-in for remote search), collapsed
 * tag summary ("已选2项 +N") for multi-select, and a select-all row.
 */
function Select(props) {
  const {
    options = [],
    value,
    placeholder = '请选择',
    multiple = false,
    filterable = false,
    collapseTags = true,
    showSelectAll = true,
    showBatchInput = false,
    batchTitle = '批量输入',
    width = 240,
    onChange
  } = props;
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [internal, setInternal] = useState(multiple ? value || [] : value);
  const ref = useRef(null);
  const inputRef = useRef(null);
  const val = value !== undefined ? value : internal;
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  useEffect(() => {
    if (open && filterable && inputRef.current) inputRef.current.focus();
  }, [open, filterable]);
  const filtered = useMemo(() => {
    if (!filterable || !query) return options;
    return options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query, filterable]);
  function selectOpt(opt) {
    if (multiple) {
      const arr = Array.isArray(val) ? val : [];
      const next = arr.includes(opt.value) ? arr.filter(v => v !== opt.value) : [...arr, opt.value];
      setInternal(next);
      onChange && onChange(next);
    } else {
      setInternal(opt.value);
      onChange && onChange(opt.value);
      setOpen(false);
      setQuery('');
    }
  }
  function toggleAll() {
    const arr = Array.isArray(val) ? val : [];
    const allVals = filtered.map(o => o.value);
    const allChecked = allVals.length > 0 && allVals.every(v => arr.includes(v));
    const next = allChecked ? arr.filter(v => !allVals.includes(v)) : Array.from(new Set([...arr, ...allVals]));
    setInternal(next);
    onChange && onChange(next);
  }
  const selectedOpts = multiple ? options.filter(o => (val || []).includes(o.value)) : [];
  const labelText = multiple ? null : options.find(o => o.value === val)?.label;
  const arr = Array.isArray(val) ? val : [];
  const allVals = filtered.map(o => o.value);
  const allChecked = allVals.length > 0 && allVals.every(v => arr.includes(v));
  const someChecked = allVals.some(v => arr.includes(v)) && !allChecked;
  const MAX_TAGS = 2;
  function applyBatch() {
    const lines = batchText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setBatchOpen(false);
      return;
    }
    const matched = options.filter(o => lines.includes(String(o.label)) || lines.includes(String(o.value)));
    const nextVals = matched.map(o => o.value);
    if (multiple) {
      const merged = Array.from(new Set([...(Array.isArray(val) ? val : []), ...nextVals]));
      setInternal(merged);
      onChange && onChange(merged);
    } else if (nextVals.length) {
      setInternal(nextVals[0]);
      onChange && onChange(nextVals[0]);
    }
    setBatchText('');
    setBatchOpen(false);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      width,
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      minHeight: 32,
      border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${showBatchInput ? '38px' : '10px'} 0 10px`,
      fontSize: 'var(--text-sm)',
      color: labelText || selectedOpts.length ? 'var(--text-heading)' : 'var(--text-faint)',
      background: '#fff',
      cursor: 'pointer',
      boxSizing: 'border-box',
      gap: 6
    }
  }, multiple ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      overflow: 'hidden',
      flexWrap: collapseTags ? 'nowrap' : 'wrap',
      padding: '4px 0'
    }
  }, selectedOpts.length === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)'
    }
  }, placeholder), collapseTags ? /*#__PURE__*/React.createElement(React.Fragment, null, selectedOpts.slice(0, MAX_TAGS).map(o => /*#__PURE__*/React.createElement("span", {
    key: o.value,
    style: {
      background: 'var(--color-surface-muted)',
      color: 'var(--text-body)',
      borderRadius: 4,
      padding: '1px 6px',
      fontSize: 12,
      whiteSpace: 'nowrap'
    }
  }, o.label)), selectedOpts.length > MAX_TAGS && /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--brand-primary-bg)',
      color: 'var(--brand-primary)',
      borderRadius: 4,
      padding: '1px 6px',
      fontSize: 12,
      whiteSpace: 'nowrap'
    }
  }, "+", selectedOpts.length - MAX_TAGS)) : selectedOpts.map(o => /*#__PURE__*/React.createElement("span", {
    key: o.value,
    style: {
      background: 'var(--color-surface-muted)',
      color: 'var(--text-body)',
      borderRadius: 4,
      padding: '1px 6px',
      fontSize: 12,
      whiteSpace: 'nowrap'
    }
  }, o.label))) : /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, labelText || placeholder), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      transform: open ? 'rotate(180deg)' : 'none',
      flexShrink: 0
    }
  }, "\u25BE")), showBatchInput && /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      setBatchOpen(o => !o);
      setOpen(false);
    },
    title: batchTitle,
    style: {
      position: 'absolute',
      right: 1,
      top: 1,
      bottom: 1,
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-surface-sunken)',
      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      fontSize: 13
    }
  }, "\uD83D\uDCCB"), batchOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '110%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 11,
      padding: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-heading)',
      marginBottom: 6
    }
  }, batchTitle, "\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09"), /*#__PURE__*/React.createElement("textarea", {
    value: batchText,
    onChange: e => setBatchText(e.target.value),
    rows: 4,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      border: '1px solid var(--color-border)',
      borderRadius: 4,
      padding: 8,
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      resize: 'vertical'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setBatchOpen(false),
    style: {
      height: 26,
      padding: '0 10px',
      border: '1px solid #dcdfe6',
      background: '#fff',
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 12
    }
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
    onClick: applyBatch,
    style: {
      height: 26,
      padding: '0 10px',
      border: '1px solid var(--brand-primary)',
      background: 'var(--brand-primary)',
      color: '#fff',
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 12
    }
  }, "\u786E\u5B9A"))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '110%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 10,
      overflow: 'hidden'
    }
  }, filterable && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 8px',
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: query,
    onChange: e => setQuery(e.target.value),
    onClick: e => e.stopPropagation(),
    placeholder: "\u641C\u7D22\u5173\u952E\u8BCD",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 26,
      border: '1px solid var(--color-border)',
      borderRadius: 4,
      padding: '0 8px',
      fontSize: 12,
      outline: 'none',
      fontFamily: 'var(--font-ui)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 200,
      overflowY: 'auto'
    }
  }, multiple && showSelectAll && filtered.length > 1 && /*#__PURE__*/React.createElement("div", {
    onClick: toggleAll,
    style: {
      padding: '8px 12px',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      borderBottom: '1px solid var(--color-border-light)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--color-surface-hover)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: allChecked,
    ref: el => {
      if (el) el.indeterminate = someChecked;
    },
    readOnly: true,
    style: {
      accentColor: 'var(--brand-primary)'
    }
  }), "\u5168\u9009"), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px',
      fontSize: 12,
      color: 'var(--text-faint)',
      textAlign: 'center'
    }
  }, "\u65E0\u5339\u914D\u6570\u636E"), filtered.map(opt => {
    const active = multiple ? (val || []).includes(opt.value) : val === opt.value;
    return /*#__PURE__*/React.createElement("div", {
      key: opt.value,
      onClick: () => selectOpt(opt),
      style: {
        padding: '8px 12px',
        fontSize: 'var(--text-sm)',
        color: active ? 'var(--brand-primary)' : 'var(--text-body)',
        background: active ? 'var(--brand-primary-bg)' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--color-surface-hover)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, multiple && /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: active,
      readOnly: true,
      style: {
        accentColor: 'var(--brand-primary)'
      }
    }), opt.label);
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/SelectTimezone.jsx
try { (() => {
const {
  useState
} = React;
const DEFAULT_ZONES = [{
  label: '北京UTC+8',
  value: '+8'
}, {
  label: '纽约UTC-5',
  value: '-5'
}];

/**
 * Timezone dropdown — matches SelectTimezone: a small, non-clearable
 * el-select of a couple named UTC offsets, used to re-anchor day-boundary
 * figures on retention/overseas analysis pages.
 */
function SelectTimezone(props) {
  const {
    value = '+8',
    zones = DEFAULT_ZONES,
    onChange
  } = props;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value);
  const val = props.value !== undefined ? props.value : internal;
  const label = zones.find(z => z.value === val)?.label || val;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 150,
      fontFamily: 'var(--font-ui)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(o => !o),
    style: {
      height: 32,
      border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-heading)',
      background: '#fff',
      cursor: 'pointer',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      transform: open ? 'rotate(180deg)' : 'none'
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '110%',
      left: 0,
      right: 0,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 10,
      overflow: 'hidden'
    }
  }, zones.map(z => /*#__PURE__*/React.createElement("div", {
    key: z.value,
    onClick: () => {
      setInternal(z.value);
      onChange && onChange(z.value);
      setOpen(false);
    },
    style: {
      padding: '8px 12px',
      fontSize: 'var(--text-sm)',
      color: z.value === val ? 'var(--brand-primary)' : 'var(--text-body)',
      background: z.value === val ? 'var(--brand-primary-bg)' : 'transparent',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      if (z.value !== val) e.currentTarget.style.background = 'var(--color-surface-hover)';
    },
    onMouseLeave: e => {
      if (z.value !== val) e.currentTarget.style.background = 'transparent';
    }
  }, z.label))));
}
Object.assign(__ds_scope, { SelectTimezone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SelectTimezone.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
/**
 * 面包屑导航 — 对应 components/Breadcrumb/index.vue：斜杠分隔，最后一级为纯文本
 * （不可点击），其余各级可点击跳转。
 */
function Breadcrumb(props) {
  const {
    items = [],
    onNavigate
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)',
      lineHeight: '20px',
      padding: '10px 0'
    }
  }, items.map((item, i) => {
    const isLast = i === items.length - 1;
    return /*#__PURE__*/React.createElement("span", {
      key: item.label + i,
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        margin: '0 6px',
        color: 'var(--text-faint)'
      }
    }, "/"), isLast ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        cursor: 'text'
      }
    }, item.label) : /*#__PURE__*/React.createElement("a", {
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(item, i);
      },
      href: "#",
      style: {
        color: 'var(--text-body)',
        textDecoration: 'none'
      },
      onMouseEnter: e => {
        e.currentTarget.style.color = 'var(--brand-primary)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.color = 'var(--text-body)';
      }
    }, item.label));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterBar.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
/**
 * BiSearchBlock + .search-form recreation — matches compass/src/styles/ui.scss:
 * a white card whose .search-item cells flow as responsive percentage columns
 * (min-width 350px; 2–5 columns depending on available width), each cell being
 * [80px right-aligned label | control stretched to 100%]. Cells carry
 * padding-right/bottom 20px; the card supplies the remaining 20px on top/left.
 */
function FilterBar(props) {
  const {
    children
  } = props;
  const ref = useRef(null);
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      // real breakpoints: 50% / 33.3% / 25% / 20% with min-width 350px per item
      setCols(Math.max(2, Math.min(5, Math.floor(w / 350))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      background: '#fff',
      padding: '20px 0 0 20px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-ui)'
    }
  }, React.Children.map(children, child => child && child.type === FilterField ? React.cloneElement(child, {
    $cols: cols
  }) : child));
}
function FilterField(props) {
  const {
    label,
    children,
    $cols = 3,
    action = false
  } = props;
  // .search-item: label 80px right-aligned + content flex-grow, control 100% wide
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      width: action ? 'auto' : `calc(${(100 / $cols).toFixed(2)}% - 0.1px)`,
      minWidth: action ? 0 : 330,
      flex: '0 0 auto',
      paddingRight: 20,
      paddingBottom: 20,
      boxSizing: 'border-box'
    }
  }, label !== undefined && /*#__PURE__*/React.createElement("label", {
    style: {
      width: 80,
      flexShrink: 0,
      paddingRight: 10,
      textAlign: 'right',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-heading)',
      lineHeight: '16px',
      maxHeight: 32,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flexGrow: 1,
      minWidth: 0
    }
  }, React.Children.map(children, child => React.isValidElement(child) && typeof child.type !== 'string' ? React.cloneElement(child, {
    width: '100%'
  }) : child)));
}
Object.assign(__ds_scope, { FilterBar, FilterField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Hamburger.jsx
try { (() => {
/**
 * 侧边栏折叠/展开切换图标 — 对应 components/Hamburger/index.vue：一个三道杠
 * 图标，激活（侧边栏已折叠）时旋转 180°。
 */
function Hamburger(props) {
  const {
    isActive = false,
    onToggle
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onToggle && onToggle(),
    style: {
      cursor: 'pointer',
      display: 'inline-flex',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "20",
    height: "20",
    style: {
      transform: isActive ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "var(--text-body)",
    d: "M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
  })));
}
Object.assign(__ds_scope, { Hamburger });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Hamburger.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function Navbar(props) {
  const {
    title,
    userName = '管理员',
    avatarUrl
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      background: '#fff',
      boxShadow: 'var(--shadow-navbar)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontFamily: 'var(--font-ui)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-heading)',
      fontSize: 15
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'var(--surface-sunken)',
      border: '1px solid var(--color-border-light)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, userName)));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
function SidebarNav(props) {
  const {
    items = [],
    collapsed = false,
    onSelect
  } = props;
  const width = collapsed ? 56 : 190;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      background: '#fff',
      height: '100%',
      boxShadow: 'var(--shadow-sidebar)',
      fontFamily: 'var(--font-ui)',
      transition: 'width var(--duration-fast) var(--ease-standard)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? 0 : '0 14px',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'conic-gradient(from 180deg, var(--brand-primary), #22d3a0, var(--brand-primary))',
      flexShrink: 0
    }
  }), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-heading)',
      fontSize: 16
    }
  }, "\u638C\u73A9")), items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => onSelect && onSelect(i),
    style: {
      height: 50,
      lineHeight: '50px',
      paddingLeft: collapsed ? 0 : 20,
      textAlign: collapsed ? 'center' : 'left',
      fontSize: 15,
      color: item.active ? 'var(--brand-primary)' : 'var(--text-body)',
      background: item.active ? 'var(--brand-active-bg)' : 'transparent',
      borderRight: item.active ? '3px solid var(--brand-primary)' : '3px solid transparent',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    onMouseEnter: e => {
      if (!item.active) e.currentTarget.style.background = 'var(--brand-hover-bg)';
    },
    onMouseLeave: e => {
      if (!item.active) e.currentTarget.style.background = 'transparent';
    }
  }, collapsed ? item.label.slice(0, 1) : item.label)));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SystemLink.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
/**
 * SystemLink recreation — the top-navbar cross-system switcher: a row of
 * system entries (icon + name), a plain link for a single-destination
 * system, or a hover dropdown listing sub-systems/groups for one with
 * several destinations.
 */
function SystemLink(props) {
  const {
    systems = []
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      fontFamily: 'var(--font-ui)'
    }
  }, systems.map(s => /*#__PURE__*/React.createElement(SystemEntry, {
    key: s.name,
    system: s
  })));
}
function SystemEntry({
  system
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const hasMenu = Array.isArray(system.items) && system.items.length > 0;
  const label = /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '14px 15px',
      fontSize: 16,
      color: open ? 'var(--brand-primary)' : 'var(--text-body)',
      cursor: 'pointer',
      userSelect: 'none'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = 'var(--brand-primary)';
    },
    onMouseLeave: e => {
      if (!open) e.currentTarget.style.color = 'var(--text-body)';
    }
  }, system.icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 4,
      background: system.icon,
      flexShrink: 0
    }
  }), system.name);
  if (!hasMenu) {
    return /*#__PURE__*/React.createElement("a", {
      href: system.link || '#',
      target: "_blank",
      rel: "noreferrer",
      style: {
        textDecoration: 'none'
      }
    }, label);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    },
    onClick: () => setOpen(o => !o)
  }, label, open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      minWidth: 160,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      padding: '6px 0',
      zIndex: 20
    }
  }, system.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.name,
    href: it.link || '#',
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'block',
      padding: '8px 16px',
      fontSize: 14,
      color: 'var(--text-body)',
      textDecoration: 'none'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--color-surface-hover)';
      e.currentTarget.style.color = 'var(--brand-primary)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-body)';
    }
  }, it.name))));
}
Object.assign(__ds_scope, { SystemLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SystemLink.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ViewSet.jsx
try { (() => {
const {
  useState
} = React;
/**
 * ViewSet / ViewList recreation — the "自定义视图" saved-view row shown
 * under a filter bar: a row of color-tinted pill buttons (one per saved
 * view), each removable by its owner, plus an expand/collapse toggle when
 * there are many. Real usage saves the current filter/column/color state
 * as a named view and lets the user jump back to it later.
 */
function ViewSet(props) {
  const {
    views = [],
    activeId = null,
    onSelect,
    onDelete,
    label = '自定义视图:'
  } = props;
  const [expanded, setExpanded] = useState(true);
  if (views.length === 0) return null;
  const shown = expanded ? views : views.slice(0, 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'var(--font-ui)',
      padding: '10px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: '#323335',
      lineHeight: '22px',
      paddingLeft: 5,
      paddingRight: 12,
      marginBottom: 10,
      flexShrink: 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap'
    }
  }, shown.map(v => {
    const active = v.id === activeId;
    return /*#__PURE__*/React.createElement("span", {
      key: v.id,
      onClick: () => onSelect && onSelect(v.id),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        height: 28,
        marginRight: 12,
        marginBottom: 10,
        padding: '0 20px 0 14px',
        borderRadius: 4,
        fontSize: 14,
        color: active ? 'var(--brand-primary)' : 'var(--text-heading)',
        background: active ? 'var(--brand-primary-bg)' : v.color || 'var(--color-surface-muted)',
        border: active ? '1px solid var(--brand-primary)' : '1px solid transparent',
        cursor: 'pointer',
        userSelect: 'none'
      },
      onMouseEnter: e => {
        const del = e.currentTarget.querySelector('[data-del]');
        if (del) del.style.display = 'inline-block';
      },
      onMouseLeave: e => {
        const del = e.currentTarget.querySelector('[data-del]');
        if (del) del.style.display = 'none';
      }
    }, v.label, v.removable !== false && /*#__PURE__*/React.createElement("span", {
      "data-del": true,
      onClick: e => {
        e.stopPropagation();
        onDelete && onDelete(v);
      },
      style: {
        display: 'none',
        position: 'absolute',
        right: 4,
        color: active ? 'var(--brand-primary)' : 'var(--text-faint)',
        fontSize: 12
      }
    }, "\u2715"));
  })), views.length > 1 && /*#__PURE__*/React.createElement("span", {
    onClick: () => setExpanded(e => !e),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      color: '#777D8C',
      fontSize: 13,
      cursor: 'pointer',
      flexShrink: 0,
      lineHeight: '28px',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, expanded ? '▲' : '▼'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)'
    }
  }, expanded ? '收起' : '展示')));
}
Object.assign(__ds_scope, { ViewSet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ViewSet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/zhangwan-console/AnalysisScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Analysis screen — recreated from game/drama preserveAnalysis + dataOverviewChart:
// title -> tabs -> filter -> data-overview KPI cards -> toolbar -> table.
// Retention pages (买量留存/留存分析/回本留存…) render the green heatmap table;
// other pages render the generic content list table.

// Store status as plain data; the Tag is built in the cell renderer at render time.
// (Constructing JSX at module scope triggers createElement before editor deps exist.)
const DEMO_ROWS = [{
  title: '重生之我是首富',
  channel: '抖音',
  price: '120',
  status: 'success',
  statusLabel: '已上架'
}, {
  title: '闪婚老公是首富',
  channel: '快手',
  price: '90',
  status: 'success',
  statusLabel: '已上架'
}, {
  title: '999次告白',
  channel: '视频号',
  price: '150',
  status: 'danger',
  statusLabel: '已下架'
}, {
  title: '闪婚厂长小娇妻',
  channel: '抖音',
  price: '120',
  status: 'success',
  statusLabel: '已上架'
}, {
  title: '总裁的替嫁新娘',
  channel: '快手',
  price: '90',
  status: 'success',
  statusLabel: '已上架'
}];
const ALL_COLUMNS = [{
  label: '内容信息',
  prop: 'title',
  width: 260,
  fixed: 'left'
}, {
  label: '渠道',
  prop: 'channel',
  width: 120
}, {
  label: '定价(虚拟币/集)',
  prop: 'price',
  align: 'right',
  width: 140,
  sortable: true
}, {
  label: '状态',
  prop: 'status',
  align: 'center',
  render: row => /*#__PURE__*/React.createElement(CompassDesignSystem_6dfef5.Tag, {
    tone: row.status
  }, row.statusLabel)
}];
const SECTION_COPY = {
  game: {
    nameLabel: '游戏名称',
    infoLabel: '游戏信息',
    unit: '游戏'
  },
  gameOverseas: {
    nameLabel: '游戏名称',
    infoLabel: '游戏信息',
    unit: '游戏'
  },
  drama: {
    nameLabel: '短剧名称',
    infoLabel: '短剧信息',
    unit: '短剧'
  },
  dramaOverseas: {
    nameLabel: '短剧名称',
    infoLabel: '短剧信息',
    unit: '短剧'
  },
  mp: {
    nameLabel: '书籍名称',
    infoLabel: '书籍信息',
    unit: '书籍'
  },
  quickapp: {
    nameLabel: '书籍名称',
    infoLabel: '书籍信息',
    unit: '书籍'
  },
  qw: {
    nameLabel: '账号名称',
    infoLabel: '账号信息',
    unit: '账号'
  },
  novelOverseas: {
    nameLabel: '书籍名称',
    infoLabel: '书籍信息',
    unit: '书籍'
  },
  userPortrait: {
    nameLabel: '用户昵称',
    infoLabel: '用户信息',
    unit: '用户'
  },
  companyBi: {
    nameLabel: '项目名称',
    infoLabel: '项目信息',
    unit: '项目'
  },
  export: {
    nameLabel: '任务名称',
    infoLabel: '任务信息',
    unit: '任务'
  }
};

// deterministic demo retention rows: retention decays over day offsets
function buildRetentionRows() {
  const days = ['07-01', '07-02', '07-03', '07-04', '07-05', '07-06', '07-07'];
  const base = [63, 58, 66, 54, 61, 57, 64];
  const decay = [1, 0.72, 0.5, 0.36, 0.26, 0.18, 0.12]; // per day-offset
  return days.map((d, i) => {
    const b = base[i];
    return {
      label: '2026-' + d,
      newUsers: 9000 + i * 1730 % 6000,
      cost: 28000 + i * 2900 % 15000,
      // reveal fewer future columns for the most recent dates (data not matured)
      values: decay.map((k, j) => j > 6 - i ? null : Math.round(b * k))
    };
  });
}
const RETENTION_ROWS = buildRetentionRows();
const RETENTION_METRICS = [{
  label: '次留率',
  value: 'ret'
}, {
  label: '新增ROI',
  value: 'addRoi'
}, {
  label: '累计ROI',
  value: 'allRoi'
}];
function AnalysisScreen({
  moduleId = 'drama',
  itemName = '买量留存'
}) {
  const {
    FilterBar,
    FilterField,
    Select,
    Input,
    Button,
    RadioButtonGroup,
    DataTable,
    RetentionTable,
    StatCard,
    Tabs,
    Dialog,
    Drawer,
    DatePicker,
    InputNumberRange,
    SelectTimezone,
    ColumnSettingsDialog,
    ViewSet
  } = CompassDesignSystem_6dfef5;
  const copy = SECTION_COPY[moduleId] || SECTION_COPY.drama;
  const isRetention = /留存|回本/.test(itemName);
  const columns = React.useMemo(() => ALL_COLUMNS.map(c => c.prop === 'title' ? {
    ...c,
    label: copy.infoLabel
  } : c), [copy]);
  const [granularity, setGranularity] = React.useState('day');
  const [metric, setMetric] = React.useState('ret');
  const [activeKpi, setActiveKpi] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = React.useState('overview');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const [columnGroups, setColumnGroups] = React.useState(() => [{
    label: '基础信息',
    children: [{
      label: copy.infoLabel,
      prop: 'title',
      checked: true
    }, {
      label: '渠道',
      prop: 'channel',
      checked: true
    }]
  }, {
    label: '数据表现',
    children: [{
      label: '定价',
      prop: 'price',
      checked: true
    }, {
      label: '状态',
      prop: 'status',
      checked: true
    }]
  }]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [detailRow, setDetailRow] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [activeViewId, setActiveViewId] = React.useState('1');
  const [savedViews, setSavedViews] = React.useState(() => [{
    id: '1',
    label: '默认视图',
    color: '#f2f3f5',
    removable: false
  }, {
    id: '2',
    label: '高价值用户',
    color: '#fdeed2'
  }]);
  const shownColumns = columns.filter(c => columnGroups.some(g => g.children.some(ch => ch.prop === c.prop && ch.checked)));
  const metricLabel = RETENTION_METRICS.find(m => m.value === metric).label;
  const percent = metric === 'ret';
  const maxValue = metric === 'ret' ? 100 : 240;
  // scale demo values for ROI metrics so heat still reads well
  const retRows = React.useMemo(() => {
    if (metric === 'ret') return RETENTION_ROWS;
    return RETENTION_ROWS.map(r => ({
      ...r,
      values: r.values.map(v => v === null ? null : Math.round(v * 2.4))
    }));
  }, [metric]);
  const KPIS = [{
    title: '新增用户',
    value: '128,493',
    caption: '较昨日 +4.2%'
  }, {
    title: '广告花费',
    value: '¥ 236,110',
    caption: '较昨日 +6.1%'
  }, {
    title: '次日留存率',
    value: '62.4%',
    caption: '较昨日 -0.8%'
  }, {
    title: '首日ROI',
    value: '31.5%',
    caption: '较昨日 +1.2%'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      label: '数据概览',
      value: 'overview'
    }, {
      label: '留存明细',
      value: 'retention'
    }, {
      label: '付费分析',
      value: 'payment'
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement(FilterBar, null, /*#__PURE__*/React.createElement(FilterField, {
    label: copy.nameLabel
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u5173\u952E\u8BCD",
    clearable: true
  })), /*#__PURE__*/React.createElement(FilterField, {
    label: "\u6E20\u9053"
  }, /*#__PURE__*/React.createElement(Select, {
    options: [{
      label: '抖音',
      value: 1
    }, {
      label: '快手',
      value: 2
    }, {
      label: '视频号',
      value: 3
    }],
    multiple: true,
    placeholder: "\u8BF7\u9009\u62E9\u6E20\u9053"
  })), /*#__PURE__*/React.createElement(FilterField, {
    label: "\u5B9A\u4EF7\u533A\u95F4"
  }, /*#__PURE__*/React.createElement(InputNumberRange, null)), /*#__PURE__*/React.createElement(FilterField, {
    label: isRetention ? '日期' : '上架状态'
  }, isRetention ? /*#__PURE__*/React.createElement(DatePicker, {
    value: dateRange,
    onChange: setDateRange
  }) : /*#__PURE__*/React.createElement(Select, {
    options: [{
      label: '已上架',
      value: 1
    }, {
      label: '已下架',
      value: 2
    }],
    placeholder: "\u5168\u90E8"
  })), isRetention && /*#__PURE__*/React.createElement(FilterField, {
    label: "\u65F6\u533A"
  }, /*#__PURE__*/React.createElement(SelectTimezone, null)), /*#__PURE__*/React.createElement(FilterField, {
    action: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "\u641C\u7D22"), /*#__PURE__*/React.createElement(Button, {
    variant: "default"
  }, "\u91CD\u7F6E")))), ViewSet &&
  /*#__PURE__*/
  // real usage renders viewSetList as the footer row of the filter card itself
  // (BiSearchBlock's `footer` slot) — its own padding is top/sides-only (10px 20px 0),
  // so the wrapper supplies matching bottom padding to balance the card.
  React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-sm)',
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement(ViewSet, {
    views: savedViews,
    activeId: activeViewId,
    onSelect: setActiveViewId,
    onDelete: v => setSavedViews(savedViews.filter(x => x.id !== v.id))
  })), isRetention && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--text-heading)',
      marginBottom: 16
    }
  }, "\u6570\u636E\u603B\u89C8"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, KPIS.map((k, i) => /*#__PURE__*/React.createElement("div", {
    key: k.title,
    style: {
      flex: '1 1 220px'
    }
  }, /*#__PURE__*/React.createElement(StatCard, _extends({}, k, {
    active: i === activeKpi,
    onClick: () => setActiveKpi(i)
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 16,
      alignItems: 'flex-start',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(RadioButtonGroup, {
    options: [{
      label: '按天',
      value: 'day'
    }, {
      label: '按周',
      value: 'week'
    }, {
      label: '按月',
      value: 'month'
    }],
    value: granularity,
    onChange: setGranularity
  }), isRetention && /*#__PURE__*/React.createElement(Select, {
    options: RETENTION_METRICS,
    value: metric,
    onChange: setMetric
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "default",
    onClick: () => setColumnDialogOpen(true)
  }, "\u81EA\u5B9A\u4E49\u5217"), /*#__PURE__*/React.createElement(Button, {
    variant: "default"
  }, "\u5BFC\u51FA"), !isRetention && /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    disabled: selectedRows.length === 0,
    onClick: () => setConfirmOpen(true)
  }, "\u6279\u91CF\u5220\u9664", selectedRows.length > 0 ? `(${selectedRows.length})` : ''))), isRetention && RetentionTable ? /*#__PURE__*/React.createElement(RetentionTable, {
    metricLabel: metricLabel,
    dayLabels: ['次日', '3日', '7日', '14日', '30日', '60日', '90日'],
    rows: retRows,
    percent: percent,
    maxValue: maxValue,
    cumulativeLabel: percent ? '累计至今' : null
  }) : /*#__PURE__*/React.createElement(DataTable, {
    columns: shownColumns,
    rows: DEMO_ROWS,
    page: page,
    pageSize: 20,
    total: 86,
    onPageChange: setPage,
    selectable: true,
    selectedKeys: selectedRows,
    onSelectChange: setSelectedRows,
    sortBy: sortBy,
    sortOrder: sortOrder,
    onSortChange: (p, o) => {
      setSortBy(p);
      setSortOrder(o);
    },
    onRowClick: row => setDetailRow(row)
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: confirmOpen,
    title: "\u786E\u8BA4\u63D0\u793A",
    width: 360,
    onCancel: () => setConfirmOpen(false),
    onConfirm: () => setConfirmOpen(false)
  }, "\u786E\u5B9A\u8981\u5220\u9664\u9009\u4E2D\u7684", copy.unit, "\u4E48\uFF1F"), /*#__PURE__*/React.createElement(ColumnSettingsDialog, {
    open: columnDialogOpen,
    groups: columnGroups,
    onChange: setColumnGroups,
    onClose: () => setColumnDialogOpen(false)
  }), /*#__PURE__*/React.createElement(Drawer, {
    open: !!detailRow,
    title: copy.infoLabel + '详情',
    width: 380,
    onCancel: () => setDetailRow(null),
    onConfirm: () => setDetailRow(null)
  }, detailRow && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      marginBottom: 6
    }
  }, copy.nameLabel), /*#__PURE__*/React.createElement(Input, {
    value: detailRow.title,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      marginBottom: 6
    }
  }, "\u6E20\u9053"), /*#__PURE__*/React.createElement(Input, {
    value: detailRow.channel,
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      marginBottom: 6
    }
  }, "\u5B9A\u4EF7\uFF08\u865A\u62DF\u5E01/\u96C6\uFF09"), /*#__PURE__*/React.createElement(Input, {
    value: detailRow.price,
    onChange: () => {}
  })))));
}
window.AnalysisScreen = AnalysisScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/zhangwan-console/AnalysisScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/zhangwan-console/App.jsx
try { (() => {
// Root app — wires shell -> screen. Click-through only, no real backend.
function App() {
  const [moduleId, setModuleId] = React.useState('game');
  const [activeItem, setActiveItem] = React.useState(null); // "item@group" or null (dashboard)
  const [collapsed, setCollapsed] = React.useState(false);
  const itemName = activeItem ? activeItem.split('@')[0] : null;
  return /*#__PURE__*/React.createElement(ConsoleShell, {
    moduleId: moduleId,
    onModuleChange: id => {
      setModuleId(id);
      setActiveItem(null);
    },
    activeItem: activeItem,
    onSelectItem: (item, group) => setActiveItem(item + '@' + group),
    collapsed: collapsed,
    onToggleCollapse: () => setCollapsed(c => !c)
  }, itemName ? /*#__PURE__*/React.createElement(AnalysisScreen, {
    key: moduleId + activeItem,
    moduleId: moduleId,
    itemName: itemName
  }) : /*#__PURE__*/React.createElement(DashboardScreen, {
    moduleId: moduleId
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/zhangwan-console/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/zhangwan-console/ConsoleShell.jsx
try { (() => {
// App shell — recreated from compass/src/layout/index.vue + SelectRouter.vue + Sidebar/Menu.vue.
// Real 3-level nav: navbar module switcher -> sidebar menu groups -> leaf items.
// Fixed sidebar (190px / 56px collapsed) + 50px navbar.

function ConsoleShell({
  moduleId,
  onModuleChange,
  activeItem,
  onSelectItem,
  collapsed,
  onToggleCollapse,
  onLogout,
  children
}) {
  const {
    Select,
    UpdateTime,
    Breadcrumb
  } = CompassDesignSystem_6dfef5;
  const sidebarWidth = collapsed ? 56 : 190;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const modules = window.ZHANGWAN_MENU;
  const current = modules.find(m => m.id === moduleId) || modules[0];
  // Real sidebar is an el-menu with unique-opened: true (Sidebar/Menu.vue) —
  // opening one group accordions the previously-open one shut.
  const [openGroup, setOpenGroup] = React.useState(current.groups[0]?.title || null);
  React.useEffect(() => {
    setOpenGroup(current.groups[0]?.title || null);
  }, [moduleId]);
  React.useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width: sidebarWidth,
      background: '#fff',
      boxShadow: 'var(--shadow-sidebar)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? 0 : '0 14px',
      gap: 10,
      borderBottom: '1px solid var(--color-border-light)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.png",
    alt: "\u7F57\u76D8",
    style: {
      width: 32,
      height: 32,
      flexShrink: 0
    }
  }), !collapsed && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-heading)',
      fontSize: 16
    }
  }, "\u7F57\u76D8")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }, current.groups.map(group => {
    const open = openGroup === group.title;
    return /*#__PURE__*/React.createElement("div", {
      key: group.title
    }, !collapsed && /*#__PURE__*/React.createElement("div", {
      onClick: () => setOpenGroup(p => p === group.title ? null : group.title),
      style: {
        height: 50,
        lineHeight: '50px',
        paddingLeft: 20,
        paddingRight: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 500,
        color: 'var(--text-secondary)',
        cursor: 'pointer'
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = 'var(--brand-hover-bg)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", null, group.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-placeholder)',
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s'
      }
    }, "\u25BE")), open && group.items.map(item => {
      const active = activeItem === item + '@' + group.title;
      return /*#__PURE__*/React.createElement("div", {
        key: item,
        onClick: () => onSelectItem(item, group.title),
        title: item,
        style: {
          height: 50,
          lineHeight: '50px',
          paddingLeft: collapsed ? 0 : 60,
          textAlign: collapsed ? 'center' : 'left',
          fontSize: 14,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
          background: active ? 'var(--brand-active-bg)' : 'transparent',
          borderRight: active ? '3px solid var(--brand-primary)' : '3px solid transparent',
          cursor: 'pointer',
          boxSizing: 'border-box'
        },
        onMouseEnter: e => {
          if (!active) e.currentTarget.style.background = 'var(--brand-hover-bg)';
        },
        onMouseLeave: e => {
          if (!active) e.currentTarget.style.background = 'transparent';
        }
      }, collapsed ? item.slice(0, 1) : item);
    }));
  })), /*#__PURE__*/React.createElement("div", {
    onClick: onToggleCollapse,
    style: {
      flexShrink: 0,
      textAlign: 'center',
      cursor: 'pointer',
      padding: '10px 0',
      borderTop: '1px solid #e8e8e8',
      color: 'var(--text-body)',
      fontSize: 16
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(0,0,0,0.025)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, collapsed ? '»' : '«')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: sidebarWidth,
      transition: 'margin-left var(--duration-fast) var(--ease-standard)',
      minHeight: '100%',
      background: 'var(--surface-canvas)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      background: '#fff',
      boxShadow: 'var(--shadow-navbar)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px 0 0',
      boxSizing: 'border-box',
      position: 'sticky',
      top: 0,
      zIndex: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 20,
      minWidth: 140
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: modules.map(m => ({
      label: m.name,
      value: m.id
    })),
    value: moduleId,
    onChange: onModuleChange
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      position: 'relative'
    },
    ref: menuRef
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setMenuOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--color-border-light)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, "\u7BA1\u7406\u5458"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-faint)',
      transform: menuOpen ? 'rotate(180deg)' : 'none'
    }
  }, "\u25BE")), menuOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '130%',
      right: 0,
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      minWidth: 120,
      zIndex: 20,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onLogout,
    style: {
      padding: '10px 16px',
      fontSize: 14,
      color: 'var(--text-body)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--color-surface-hover)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, "\u9000\u51FA\u767B\u5F55")))), activeItem && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: activeItem.split('@')[1]
    }, {
      label: activeItem.split('@')[0]
    }]
  }), /*#__PURE__*/React.createElement(UpdateTime, {
    time: new Date().toISOString().slice(0, 16).replace('T', ' ')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, children)));
}
window.ConsoleShell = ConsoleShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/zhangwan-console/ConsoleShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/zhangwan-console/DashboardScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Dashboard home — recreated from compass/src/views/dashboard/index.vue
// Time-of-day greeting + a row of KPI stat cards (dataOverviewChart pattern).
function greeting() {
  const h = new Date().getHours();
  if (h >= 22 || h < 0) return '深夜好';
  if (h >= 18) return '晚上好';
  if (h >= 13) return '下午好';
  if (h >= 12) return '中午好';
  if (h >= 10) return '上午好';
  if (h >= 5) return '早上好';
  return '凌晨好';
}
const KPI_DATA = [{
  title: '新增用户',
  value: '128,493',
  caption: '较昨日 +4.2%'
}, {
  title: '次日留存率',
  value: '86.4%',
  caption: '较昨日 -0.8%'
}, {
  title: '当日充值',
  value: '¥ 392,110',
  caption: '较昨日 +12.1%'
}, {
  title: 'ARPU',
  value: '18.6',
  caption: '较昨日 +0.3'
}];
function DashboardScreen({
  moduleId
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-sm)',
      padding: 20,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      color: 'var(--text-heading)',
      fontWeight: 500
    }
  }, greeting(), "\uFF0C\u7BA1\u7406\u5458"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 13,
      color: 'var(--text-faint)'
    }
  }, "\u52A0\u6CB9\uFF01\u5E72\u996D\u4EBA \xB7 \u8FD9\u662F\u4ECA\u5929\u7684\u5173\u952E\u6307\u6807")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-sm)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, KPI_DATA.map((kpi, i) => /*#__PURE__*/React.createElement("div", {
    key: kpi.title,
    onClick: () => setActiveIdx(i),
    style: {
      flex: '1 1 240px'
    }
  }, /*#__PURE__*/React.createElement(CompassDesignSystem_6dfef5.StatCard, _extends({}, kpi, {
    active: i === activeIdx,
    onClick: () => setActiveIdx(i)
  })))))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/zhangwan-console/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/zhangwan-console/menuData.js
try { (() => {
// Real Zhangwan navigation model, derived verbatim from compass/src/router/index.js
// + SelectRouter.vue (navbar module switcher) + server-driven selectMenuRouter.
// Structure: module (navbar dropdown) -> menu groups -> leaf items.
window.ZHANGWAN_MENU = [{
  id: 'game',
  name: '游戏',
  groups: [{
    title: '买量投放',
    items: ['买量留存', '30日买量留存', '投放分析', '30日投放分析', '素材分析']
  }, {
    title: '留存分析',
    items: ['用户留存', '单产留存', '付费留存', '活跃留存', '创角留存', '全量付费留存', '首日付费留存', '首次付费留存', '付费活跃率']
  }, {
    title: '用户',
    items: ['RFM', '用户运营', '角色达标分析', '付费分层分析']
  }, {
    title: '区服',
    items: ['区服运营', '原始服留存', '开合服留存', '排行榜']
  }, {
    title: '运营',
    items: ['运营日报', '支付分析']
  }, {
    title: '客服',
    items: ['客服号分析', '客服服务分析', '客服转游分析', '客服质检数据', '客服优秀案例']
  }, {
    title: '智能分析',
    items: ['漏斗分析', '分布分析', '用户留存', '事件分析', 'BI看板', '路径分析', 'LTV分析', '间隔分析']
  }, {
    title: '数据看板',
    items: ['BI看板', '数据看板', '看板管理', '自定义指标']
  }]
}, {
  id: 'gameOverseas',
  name: '游戏出海',
  groups: [{
    title: '留存',
    items: ['回本留存', '留存分析', '首日付费留存', '首次付费留存', '活跃留存', '单产留存']
  }, {
    title: '投放',
    items: ['投放分析']
  }, {
    title: '运营',
    items: ['运营日报']
  }]
}, {
  id: 'drama',
  name: '短剧',
  groups: [{
    title: '买量投放',
    items: ['买量留存', '投放分析', '素材分析']
  }, {
    title: '内容',
    items: ['短剧分析', '渠道分析', '小程序分析']
  }, {
    title: '运营',
    items: ['支付分析']
  }, {
    title: '用户分析',
    items: ['用户留存', '路径分析', '事件分析', '漏斗分析', 'BI看板', '首日付费留存', '首日有效观看留存', '企微用户留存']
  }]
}, {
  id: 'dramaOverseas',
  name: '短剧出海',
  groups: [{
    title: '买量投放',
    items: ['买量留存', '投放分析', '8日留存']
  }, {
    title: '内容',
    items: ['短剧分析', '渠道分析', '短剧排行榜']
  }, {
    title: '智能',
    items: ['智能问数', '问答设置']
  }, {
    title: '用户',
    items: ['用户活跃留存', '首日付费留存']
  }, {
    title: '看板',
    items: ['Boss看板', '数据看板', '预估利润', '自定义指标']
  }, {
    title: '增长',
    items: ['facebook', 'tiktok', '监控预警', 'ASA留存分析', 'ASA投放分析']
  }]
}, {
  id: 'mp',
  name: '公众号',
  groups: [{
    title: '买量投放',
    items: ['留存分析', '投放分析', '投放监控']
  }, {
    title: '内容',
    items: ['运营分析', '书籍分析', '章节留存', '书籍对比', '公众号分析']
  }, {
    title: '运营',
    items: ['投运分析']
  }]
}, {
  id: 'quickapp',
  name: '快应用',
  groups: [{
    title: '分析',
    items: ['留存分析', '投放分析', '投放监控', '投运分析']
  }]
}, {
  id: 'qw',
  name: '企微',
  groups: [{
    title: '分析',
    items: ['留存分析', '投放分析']
  }]
}, {
  id: 'novelOverseas',
  name: '小说出海',
  groups: [{
    title: '买量投放',
    items: ['留存分析', '投放分析', '90日留存分析']
  }, {
    title: '内容',
    items: ['书籍分析']
  }, {
    title: '看板',
    items: ['BI看板', '数据看板', '看板管理', '自定义指标']
  }, {
    title: '智能',
    items: ['智能问数', '问答设置']
  }]
}, {
  id: 'userPortrait',
  name: '用户画像',
  groups: [{
    title: '画像',
    items: ['用户标签', '用户分群']
  }]
}, {
  id: 'companyBi',
  name: '公司BI',
  groups: [{
    title: '看板',
    items: ['BI看板', '数据看板', '看板管理', '自定义指标']
  }, {
    title: '分析',
    items: ['事件分析', '漏斗分析']
  }]
}, {
  id: 'export',
  name: '我的导出',
  groups: [{
    title: '导出',
    items: ['我的导出', '临时导出']
  }]
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/zhangwan-console/menuData.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.LoadingBtn = __ds_scope.LoadingBtn;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ColumnChart = __ds_scope.ColumnChart;

__ds_ns.ColumnSettingsDialog = __ds_scope.ColumnSettingsDialog;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.DownloadCenter = __ds_scope.DownloadCenter;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.PieChart = __ds_scope.PieChart;

__ds_ns.PopoverTableCell = __ds_scope.PopoverTableCell;

__ds_ns.RetentionTable = __ds_scope.RetentionTable;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.UpdateTime = __ds_scope.UpdateTime;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Drawer = __ds_scope.Drawer;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.DatePicker = __ds_scope.DatePicker;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.InputMultTag = __ds_scope.InputMultTag;

__ds_ns.InputNumberRange = __ds_scope.InputNumberRange;

__ds_ns.RadioButtonGroup = __ds_scope.RadioButtonGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.SelectTimezone = __ds_scope.SelectTimezone;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.FilterBar = __ds_scope.FilterBar;

__ds_ns.FilterField = __ds_scope.FilterField;

__ds_ns.Hamburger = __ds_scope.Hamburger;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.SystemLink = __ds_scope.SystemLink;

__ds_ns.ViewSet = __ds_scope.ViewSet;

})();
