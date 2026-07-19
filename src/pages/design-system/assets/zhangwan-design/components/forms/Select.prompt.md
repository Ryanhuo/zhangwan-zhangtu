对应 `el-select` 外观的下拉选择器，用于搜索栏筛选。已对照真实的
`components/customSelect/customSelect.vue` 补充了可筛选搜索框、多选
collapse-tags "+N" 折叠、全选行、批量输入图标入口。默认宽度 240px，和
Input/DatePicker/InputNumberRange 保持统一。

```jsx
<Select options={[{label:'短剧', value:1}, {label:'小说', value:2}]} placeholder="请选择" onChange={setVal} />
<Select options={channelOptions} multiple filterable showSelectAll onChange={setChannels} />
<Select options={idOptions} multiple showBatchInput batchTitle="批量输入" onChange={setIds} />
```

单选模式选中后关闭；`multiple` 保持菜单打开，选中项折叠为前两个标签 + "+N"，
对应应用里的 `collapse-tags` 搜索字段。
