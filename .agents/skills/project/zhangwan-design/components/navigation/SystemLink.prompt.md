Cross-system switcher for the top navbar — a row of system entries; a system with one destination is a plain external link, a system with several (`items`) opens a hover dropdown.

```jsx
<SystemLink systems={[
  { name: '罗盘', icon: '#00bf8a', link: 'https://...' },
  { name: '掌上喵', items: [{ name: '漏斗分析', link: '...' }, { name: 'RFM', link: '...' }] },
]} />
```

Place at the navbar's left edge, next to (not replacing) the module dropdown in `SidebarNav`/`ConsoleShell` — this is for jumping *between* internal systems, not between modules within one.
