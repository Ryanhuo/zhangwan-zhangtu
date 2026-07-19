/**
 * 下载中心 — 对应 `DownloadCenter` 组件：导出任务面板，筛选表单
 * （任务ID/任务类型/任务状态）+ 任务表格（状态徽标、导出条件、创建/完成
 * 时间、下载链接）+ 底部分页。跨产品线导出类需求的标准页面外壳。
 */
export interface DownloadTask {
  taskCode: string;
  /** 0=未开始 11=执行中 21=已完成（可下载） 31=导出失败 */
  status: 0 | 11 | 21 | 31;
  taskName: string;
  /** 导出条件摘要（悬停可查看完整文本） */
  queryText?: string;
  createTime: string;
  completeTime?: string;
  /** 状态为已完成时的下载地址 */
  path?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface DownloadCenterProps {
  tasks: DownloadTask[];
  typeOptions?: Option[];
  statusOptions?: Option[];
  filters?: { taskCode?: string; taskType?: string; status?: string };
  onFiltersChange?: (next: DownloadCenterProps['filters']) => void;
  onSearch?: () => void;
  onReset?: () => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}
