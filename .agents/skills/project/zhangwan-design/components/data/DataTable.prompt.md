对应 `BiTable` 的带边框分析页表格，内置分页 footer（`total`/`page`/`pageSize`
对应应用的 `page_info` 约定）。已对照真实源码补充固定左列、分组表头、可排序
表头、行多选（吸顶复选框列）、行点击（用于打开详情抽屉）等交互。

```jsx
<DataTable
  columns={[
    { label:'短剧信息', prop:'title', fixed:'left', width:220 },
    { label:'定价', prop:'price', align:'right', sortable:true },
  ]}
  rows={[{title:'重生之我是首富', price:'120'}]}
  total={86}
  page={1}
  pageSize={20}
  onPageChange={setPage}
  selectable
  selectedKeys={selected}
  onSelectChange={setSelected}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSortChange={(prop, order) => { setSortBy(prop); setSortOrder(order); }}
  onRowClick={(row) => openDetail(row)}
/>
```

`groups` 用于渲染表头之上的分组行（多级表头），值为 `{label, span}` 数组，
span 之和应等于列数。
