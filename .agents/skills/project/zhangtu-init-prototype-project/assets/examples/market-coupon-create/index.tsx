import React from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { CalendarClock, CheckCircle2, Gift, Sparkles, Target, WalletCards, type LucideIcon } from "lucide-react";
import "./styles/page.css";
import premiumAvatarUrl from "./assets/images/avatar-premium.svg";
import { audienceOptions, channelOptions, checklistItems, metricCards, templateOptions } from "./data/mock";

type CouponDraft = {
  name: string;
  template: string;
  amount: number;
  threshold: number;
  audience: string;
  channel: string;
  startDate: string;
  endDate: string;
  notes: string;
};

const defaultValues: CouponDraft = {
  name: "春节拉新券",
  template: templateOptions[0].value,
  amount: 20,
  threshold: 99,
  audience: audienceOptions[0].value,
  channel: channelOptions[0].value,
  startDate: "2026-02-01",
  endDate: "2026-02-10",
  notes: "用于首购用户的节日召回。",
};

const templateToneMap: Record<string, string> = {
  "full-reduction": "gold",
  discount: "processing",
  "new-user": "success",
};

function MarketCouponCreatePage() {
  const [form] = Form.useForm<CouponDraft>();
  const [draft, setDraft] = React.useState(defaultValues);

  React.useEffect(() => {
    document.title = "业务示例 / 【示例】新建优惠券活动";
    form.setFieldsValue(defaultValues);
  }, [form]);

  const activeTemplate = templateOptions.find((item) => item.value === draft.template) ?? templateOptions[0];
  const summaryCards: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "券面值", value: `¥${draft.amount}`, icon: Gift },
    { label: "使用门槛", value: `满 ¥${draft.threshold} 可用`, icon: WalletCards },
    { label: "投放渠道", value: draft.channel, icon: Target },
    { label: "生效窗口", value: `${draft.startDate} - ${draft.endDate}`, icon: CalendarClock },
  ];

  const handleTemplatePick = (value: string) => {
    const nextDraft = { ...draft, template: value };
    setDraft(nextDraft);
    form.setFieldsValue(nextDraft);
  };

  return (
    <main className="coupon-page">
      <div className="coupon-shell">
        <header className="coupon-hero">
          <div className="coupon-hero-copy">
            <Tag color="gold">业务示例 / 【示例】新建优惠券活动</Tag>
            <h1>新建优惠券活动</h1>
            <p>
              围绕券面值、门槛、目标客群和投放渠道，快速完成一次可评审、可复用、可落地的优惠券方案。
            </p>
            <Space wrap>
              <Button type="primary">保存草稿</Button>
              <Button>提交评审</Button>
              <Button icon={<Sparkles size={16} />}>自动校验</Button>
            </Space>
          </div>

          <Card className="coupon-preview-panel" variant="outlined">
            <div className="coupon-preview-art">
              <img src={premiumAvatarUrl} alt="优惠券示意图" />
            </div>
            <Space size={8} wrap>
              <Tag color={templateToneMap[activeTemplate.value] || "default"}>{activeTemplate.label}</Tag>
              <Tag color="blue">{draft.audience}</Tag>
              <Tag color="purple">{draft.channel}</Tag>
            </Space>
            <Typography.Title level={4}>{draft.name}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {activeTemplate.hint}，当前配置已通过基础门槛和预算校验。
            </Typography.Paragraph>
            <div className="coupon-preview-grid">
              {summaryCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="coupon-preview-stat" key={item.label}>
                    <Icon size={18} />
                    <Typography.Text type="secondary">{item.label}</Typography.Text>
                    <strong>{item.value}</strong>
                  </div>
                );
              })}
            </div>
          </Card>
        </header>

        <section className="coupon-body">
          <Card className="coupon-form-card" title="活动配置" variant="outlined">
            <Form
              form={form}
              layout="vertical"
              initialValues={defaultValues}
              onValuesChange={(_, allValues) => setDraft(allValues as CouponDraft)}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="活动名称" name="name" rules={[{ required: true, message: "请输入活动名称" }]}>
                    <Input placeholder="例如：春节拉新券" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="券模板" name="template">
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      options={templateOptions.map((item) => ({ label: item.label, value: item.value }))}
                      onChange={(event) => handleTemplatePick(event.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="券面值" name="amount">
                    <InputNumber min={1} style={{ width: "100%" }} addonBefore="¥" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="使用门槛" name="threshold">
                    <InputNumber min={1} style={{ width: "100%" }} addonBefore="¥" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="目标客群" name="audience">
                    <Select options={audienceOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="投放渠道" name="channel">
                    <Select options={channelOptions} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="开始日期" name="startDate">
                    <Input placeholder="2026-02-01" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="结束日期" name="endDate">
                    <Input placeholder="2026-02-10" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="活动备注" name="notes">
                <Input.TextArea rows={4} placeholder="补充活动目标、预算规则或评审说明" />
              </Form.Item>
            </Form>
          </Card>

          <Card className="coupon-insight-card" title="评审清单" variant="outlined">
            <div className="coupon-template-list">
              {templateOptions.map((item) => {
                const isActive = item.value === draft.template;
                return (
                  <button
                    key={item.value}
                    type="button"
                    className={`coupon-template-chip ${isActive ? "is-active" : ""}`}
                    onClick={() => handleTemplatePick(item.value)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </button>
                );
              })}
            </div>

            <List
              className="coupon-checklist"
              dataSource={checklistItems}
              split={false}
              renderItem={(item) => (
                <List.Item>
                  <div className="coupon-checklist-item">
                    <Space align="start" size={10}>
                      <CheckCircle2 size={18} />
                      <div>
                        <Tag color={item.tone}>{item.title}</Tag>
                        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                          {item.detail}
                        </Typography.Paragraph>
                      </div>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MarketCouponCreatePage />
  </React.StrictMode>,
);
