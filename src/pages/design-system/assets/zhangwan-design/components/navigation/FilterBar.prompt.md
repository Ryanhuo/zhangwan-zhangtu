对应 `BiSearchBlock` + `BiForm` 的筛选/搜索工具栏外壳；依次排列 `FilterField`
筛选项，最后跟搜索/重置 `Button`。

```jsx
<FilterBar>
  <FilterField label="短剧名称"><Select options={titleOptions} /></FilterField>
  <FilterField label="上架状态"><Select options={statusOptions} /></FilterField>
  <FilterField>
    <div style={{display:'flex', gap:8}}>
      <Button variant="primary">搜索</Button>
      <Button variant="default">重置</Button>
    </div>
  </FilterField>
</FilterBar>
```
