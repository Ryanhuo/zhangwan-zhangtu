Button that auto-manages its own loading state around an async click handler — use for one-off async actions (export, save) where you don't want a separate `useState` + try/finally boilerplate in the caller.

```jsx
<LoadingBtn variant="primary" onClick={async () => { await exportReport(); }}>
  导出
</LoadingBtn>
```

Differs from `Button`'s own `loading` prop: `Button.loading` is caller-controlled (you flip it), `LoadingBtn` flips it for you around the promise returned by `onClick`.
