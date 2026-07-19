Free-typed multi-tag input — the user types a value and presses Enter (or blurs) to commit it as a removable chip. Use for batch ID/keyword entry where the values aren't a fixed option list (that's `Select multiple` instead).

```jsx
<InputMultTag value={ids} onChange={setIds} placeholder="输入订单号，回车添加" />
<InputMultTag value={ids} onChange={setIds} collapseTags clearable multipleLimit={20} />
```
