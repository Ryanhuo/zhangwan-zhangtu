Saved-view row shown under a filter bar — a set of color-tinted pill buttons, one per saved view (filters/columns/coloring the user previously saved), with hover-to-delete and an expand/collapse toggle when there are many.

```jsx
<ViewSet
  views={[{ id: '1', label: '默认视图', color: '#f2f3f5', removable: false }, { id: '2', label: '高价值用户', color: '#fdeed2' }]}
  activeId={activeId}
  onSelect={setActiveId}
  onDelete={(v) => confirmDelete(v)}
/>
```

Renders nothing when `views` is empty — it's an enhancement row, not a permanent fixture.
