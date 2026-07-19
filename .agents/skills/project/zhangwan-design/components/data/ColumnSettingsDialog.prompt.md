对应 `el-checkbox` 分组、真实 `components/showTableColumn/index.vue` 的"自定义列"
弹窗——每个分组有一个"选中本组全部"复选框和一排子列复选框；底部左侧是一个全局
"全选"复选框，右侧是单一"关闭"按钮——真实场景每次勾选即时保存，因此没有独立的
取消/确定按钮对。

```jsx
<ColumnSettingsDialog
  open={open}
  groups={[
    { label:'基础信息', children:[{label:'内容信息',checked:true},{label:'渠道',checked:true}] },
    { label:'数据表现', children:[{label:'定价',checked:true},{label:'状态',checked:false}] },
  ]}
  onChange={setGroups}
  onClose={close}
/>
```
