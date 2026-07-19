// Real Zhangwan navigation model, derived verbatim from compass/src/router/index.js
// + SelectRouter.vue (navbar module switcher) + server-driven selectMenuRouter.
// Structure: module (navbar dropdown) -> menu groups -> leaf items.
window.ZHANGWAN_MENU = [
  {
    id: 'game',
    name: '游戏',
    groups: [
      { title: '买量投放', items: ['买量留存', '30日买量留存', '投放分析', '30日投放分析', '素材分析'] },
      { title: '留存分析', items: ['用户留存', '单产留存', '付费留存', '活跃留存', '创角留存', '全量付费留存', '首日付费留存', '首次付费留存', '付费活跃率'] },
      { title: '用户', items: ['RFM', '用户运营', '角色达标分析', '付费分层分析'] },
      { title: '区服', items: ['区服运营', '原始服留存', '开合服留存', '排行榜'] },
      { title: '运营', items: ['运营日报', '支付分析'] },
      { title: '客服', items: ['客服号分析', '客服服务分析', '客服转游分析', '客服质检数据', '客服优秀案例'] },
      { title: '智能分析', items: ['漏斗分析', '分布分析', '用户留存', '事件分析', 'BI看板', '路径分析', 'LTV分析', '间隔分析'] },
      { title: '数据看板', items: ['BI看板', '数据看板', '看板管理', '自定义指标'] },
    ],
  },
  {
    id: 'gameOverseas',
    name: '游戏出海',
    groups: [
      { title: '留存', items: ['回本留存', '留存分析', '首日付费留存', '首次付费留存', '活跃留存', '单产留存'] },
      { title: '投放', items: ['投放分析'] },
      { title: '运营', items: ['运营日报'] },
    ],
  },
  {
    id: 'drama',
    name: '短剧',
    groups: [
      { title: '买量投放', items: ['买量留存', '投放分析', '素材分析'] },
      { title: '内容', items: ['短剧分析', '渠道分析', '小程序分析'] },
      { title: '运营', items: ['支付分析'] },
      { title: '用户分析', items: ['用户留存', '路径分析', '事件分析', '漏斗分析', 'BI看板', '首日付费留存', '首日有效观看留存', '企微用户留存'] },
    ],
  },
  {
    id: 'dramaOverseas',
    name: '短剧出海',
    groups: [
      { title: '买量投放', items: ['买量留存', '投放分析', '8日留存'] },
      { title: '内容', items: ['短剧分析', '渠道分析', '短剧排行榜'] },
      { title: '智能', items: ['智能问数', '问答设置'] },
      { title: '用户', items: ['用户活跃留存', '首日付费留存'] },
      { title: '看板', items: ['Boss看板', '数据看板', '预估利润', '自定义指标'] },
      { title: '增长', items: ['facebook', 'tiktok', '监控预警', 'ASA留存分析', 'ASA投放分析'] },
    ],
  },
  {
    id: 'mp',
    name: '公众号',
    groups: [
      { title: '买量投放', items: ['留存分析', '投放分析', '投放监控'] },
      { title: '内容', items: ['运营分析', '书籍分析', '章节留存', '书籍对比', '公众号分析'] },
      { title: '运营', items: ['投运分析'] },
    ],
  },
  {
    id: 'quickapp',
    name: '快应用',
    groups: [
      { title: '分析', items: ['留存分析', '投放分析', '投放监控', '投运分析'] },
    ],
  },
  {
    id: 'qw',
    name: '企微',
    groups: [
      { title: '分析', items: ['留存分析', '投放分析'] },
    ],
  },
  {
    id: 'novelOverseas',
    name: '小说出海',
    groups: [
      { title: '买量投放', items: ['留存分析', '投放分析', '90日留存分析'] },
      { title: '内容', items: ['书籍分析'] },
      { title: '看板', items: ['BI看板', '数据看板', '看板管理', '自定义指标'] },
      { title: '智能', items: ['智能问数', '问答设置'] },
    ],
  },
  {
    id: 'userPortrait',
    name: '用户画像',
    groups: [
      { title: '画像', items: ['用户标签', '用户分群'] },
    ],
  },
  {
    id: 'companyBi',
    name: '公司BI',
    groups: [
      { title: '看板', items: ['BI看板', '数据看板', '看板管理', '自定义指标'] },
      { title: '分析', items: ['事件分析', '漏斗分析'] },
    ],
  },
  {
    id: 'export',
    name: '我的导出',
    groups: [
      { title: '导出', items: ['我的导出', '临时导出'] },
    ],
  },
];
