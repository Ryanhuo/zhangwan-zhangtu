Primary button for actions inside search bars and table toolbars, styled to the Zhangwan green theme.

```jsx
<Button variant="primary" onClick={handleSearch}>搜索</Button>
<Button variant="default" onClick={reset}>重置</Button>
<Button variant="text" onClick={handleExport} icon={<DownloadIcon />}>导出</Button>
```

Variants: `primary` (filled green, main action — always rightmost in a toolbar), `default` (outlined gray, secondary actions), `text` (borderless, for inline/tertiary actions), `danger` (outlined red, destructive — always paired with a confirm dialog per project convention). Sizes: `small` | `medium` | `large`. Set `loading` while an async request is in flight; the project convention is to flip it in a `finally` block.
