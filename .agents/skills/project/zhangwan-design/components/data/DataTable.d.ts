/**
 * 对应 BiTable 的数据表格 — 带边框表头行、密集数据行、居中分页 footer。支持
 * 吸顶复选框列（行多选）、分组/多级表头、可排序列，以及固定左列 + 横向滚动
 * （用于超宽表格）。几乎每个分析页都会用到。
 */
export interface TableColumn {
  label: string;
  prop: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  /** 横向滚动时将该列固定在左侧（需要设置数值宽度）。 */
  fixed?: 'left';
  /** 显示排序箭头并让表头可点击。 */
  sortable?: boolean;
  /** 自定义单元格渲染；返回 ReactNode。未提供时直接渲染 row[prop]。 */
  render?: (row: Record<string, any>) => React.ReactNode;
}
export interface TableColumnGroup {
  label: string;
  /** 该分组表头跨越的叶子列数量。 */
  span: number;
}
export interface DataTableProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  /** 分页 footer 状态 */
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  /** 增加一个吸顶复选框列，表头带全选。 */
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  /** 用作行标识的字段名；默认使用行索引。 */
  rowKey?: string;
  onSelectChange?: (keys: (string | number)[]) => void;
  /** 可选的分组行，渲染在列表头之上（多级表头）。 */
  groups?: TableColumnGroup[];
  sortBy?: string | null;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (prop: string, order: 'asc' | 'desc') => void;
  /** 让行可点击（例如打开详情 Drawer）；会显示手型光标。 */
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void;
}
