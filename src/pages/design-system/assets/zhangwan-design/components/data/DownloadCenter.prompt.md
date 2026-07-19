Export-task panel — filter form (task ID / type / status) over a task table with status pill, truncated export-condition tooltip text, and a download link that only activates once a task completes. Used wherever a page lets the user queue an async export instead of downloading inline.

```jsx
<DownloadCenter
  tasks={tasks}
  typeOptions={[{ label: '留存明细', value: 'preserve' }]}
  statusOptions={[{ label: '已完成', value: '21' }]}
  filters={filters}
  onFiltersChange={setFilters}
  onSearch={runSearch}
  onReset={resetFilters}
  page={page} total={total} onPageChange={setPage}
/>
```
