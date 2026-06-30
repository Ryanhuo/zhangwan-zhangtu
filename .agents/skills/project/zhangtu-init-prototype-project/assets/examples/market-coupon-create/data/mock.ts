export const templateOptions = [
  {
    label: "满减券",
    value: "full-reduction",
    hint: "适合首单拉新和复购召回",
  },
  {
    label: "折扣券",
    value: "discount",
    hint: "适合清库存和活动冲量",
  },
  {
    label: "新人券",
    value: "new-user",
    hint: "适合首购转化和注册激励",
  },
];

export const audienceOptions = [
  { label: "新客", value: "新客" },
  { label: "沉默用户", value: "沉默用户" },
  { label: "高价值用户", value: "高价值用户" },
  { label: "全量用户", value: "全量用户" },
];

export const channelOptions = [
  { label: "站内弹窗", value: "站内弹窗" },
  { label: "短信", value: "短信" },
  { label: "Push", value: "Push" },
  { label: "公众号", value: "公众号" },
];

export const metricCards = [
  { label: "预计触达", value: "12.4k", suffix: "人", note: "近 7 天新客池" },
  { label: "预算上限", value: "¥80k", note: "审批阈值内" },
  { label: "评审进度", value: "72%", note: "已完成规则和预算校验" },
];

export const checklistItems = [
  {
    title: "券面值与门槛关系",
    detail: "门槛必须高于券面值 4 倍，避免逆向补贴。",
    tone: "success",
  },
  {
    title: "预算审批",
    detail: "预计预算超过 10 万元时，需要二级审批。",
    tone: "warning",
  },
  {
    title: "投放节奏",
    detail: "建议先灰度 24 小时，再全量上线。",
    tone: "processing",
  },
];
