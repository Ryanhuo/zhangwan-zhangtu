#!/usr/bin/env node
/**
 * 为 HTML PRD 正文中的英文术语补充中文释义：术语（中文含义）
 * 跳过 script/style/mermaid 源码块内的替换
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node localize-prd-english.mjs <html-file>');
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('<div class="content-wrapper" id="content">');
const end = html.indexOf('<!-- ==================== 示例内容结束 ==================== -->');
if (start === -1 || end === -1) {
  console.error('Content markers not found');
  process.exit(1);
}

const before = html.slice(0, start);
const content = html.slice(start, end);
const after = html.slice(end);

const GLOSSARY = [
  ['pm-prd-writer', '产品需求文档编写规范（pm-prd-writer）'],
  ['UI/UX', '界面与体验（UI/UX）'],
  ['silent fail', '静默失败（silent fail）'],
  ['image_enhancement.enabled', '图像增强功能开关（image_enhancement.enabled）'],
  ['relatedAlarms[]', '关联报警列表（relatedAlarms）'],
  ['images[]', '图片列表（images）'],
  ['enhancedImageUrl', '增强图地址（enhancedImageUrl）'],
  ['triggerTime', '触发时间（triggerTime）'],
  ['vehicleType', '车型编码（vehicleType）'],
  ['alarmType', '报警类型编码（alarmType）'],
  ['pushTime', '推送时间（pushTime）'],
  ['alarmTime', '报警时间编码（alarmTime）'],
  ['description', '描述编码（description）'],
  ['durationMs', '耗时毫秒数（durationMs）'],
  ['errorCode', '错误码（errorCode）'],
  ['taskId', '任务编号（taskId）'],
  ['targetTab', '目标标签页（targetTab）'],
  ['activeTaskCount', '并行任务数（activeTaskCount）'],
  ['enhanceStatus', '增强状态（enhanceStatus）'],
  ['image_enhance_rate_limit', '图像增强并发超限（image_enhance_rate_limit）'],
  ['image_enhance_tab_switch', '图像增强标签切换（image_enhance_tab_switch）'],
  ['image_enhance_regenerate_click', '图像增强重新生成点击（image_enhance_regenerate_click）'],
  ['image_enhance_fail', '图像增强失败（image_enhance_fail）'],
  ['image_enhance_success', '图像增强成功（image_enhance_success）'],
  ['image_enhance_request', '图像增强请求（image_enhance_request）'],
  ['image_enhance_modal_open', '图像增强弹窗打开（image_enhance_modal_open）'],
  ['alarmId', '报警编号（alarmId）'],
  ['imageId', '图片编号（imageId）'],
  ['pileNo', '桩号编码（pileNo）'],
  ['highway', '路段编码（highway）'],
  ['Spinner', '加载动画（Spinner）'],
  ['Session', '会话（Session）'],
  ['Toast', '轻提示（Toast）'],
  ['Grid', '网格布局（Grid）'],
  ['Chrome/Edge', 'Chrome/Edge 浏览器'],
  ['403', '403 无权限'],
  ['P95', 'P95 百分位耗时'],
  ['P0', 'P0 最高优先级'],
  ['P1', 'P1 次高优先级'],
  [' PRD', ' 产品需求文档（PRD）'],
  ['generating（生成中）', 'GENERATING_PLACEHOLDER'],
  ['idle（未请求）', 'IDLE_PLACEHOLDER'],
  ['ready（已完成）', 'READY_PLACEHOLDER'],
  ['failed（失败）', 'FAILED_PLACEHOLDER'],
  ['success（成功）', 'SUCCESS_PLACEHOLDER'],
  ['warning（警告）', 'WARNING_PLACEHOLDER'],
  ['generating', 'generating（生成中）'],
  ['idle', 'idle（未请求）'],
  ['ready', 'ready（已完成）'],
  ['failed', 'failed（失败）'],
  ['success', 'success（成功）'],
  ['warning', 'warning（警告）'],
  ['GENERATING_PLACEHOLDER', 'generating（生成中）'],
  ['IDLE_PLACEHOLDER', 'idle（未请求）'],
  ['READY_PLACEHOLDER', 'ready（已完成）'],
  ['FAILED_PLACEHOLDER', 'failed（失败）'],
  ['SUCCESS_PLACEHOLDER', 'success（成功）'],
  ['WARNING_PLACEHOLDER', 'warning（警告）'],
  [' Tab', ' Tab（标签页）'],
  ['Tab【', 'Tab（标签页）【'],
  ['Tab 原图', 'Tab（标签页）原图'],
  ['Tab 图像增强', 'Tab（标签页）图像增强'],
  [' false', ' false（关闭）'],
  [' true', ' true（开启）'],
];

function localizeText(text) {
  // 跳过 src/href/code 属性与路径中的英文
  const tokens = text.split(/(<(?:img[^>]*src|iframe[^>]*src|a[^>]*href|code)[^>]*>)/gi);
  return tokens
    .map((token, i) => {
      if (i % 2 === 1) return token;
      let out = token;
      for (const [from, to] of GLOSSARY) {
        out = out.split(from).join(to);
      }
      out = out.replace(/（([^）]+)）（\1）/g, '（$1）');
      return out;
    })
    .join('');
}

function localizeContent(raw) {
  const parts = raw.split(/(<pre class="mermaid">[\s\S]*?<\/pre>)/g);
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return localizeMermaid(part);
      return localizeText(part);
    })
    .join('');
}

function localizeMermaid(block) {
  return block
    .replace(/\bidle\b/g, '未请求')
    .replace(/\bgenerating\b/g, '生成中')
    .replace(/\bready\b/g, '已完成')
    .replace(/\bfailed\b/g, '失败')
    .replace(/原图 Tab/g, '原图标签页')
    .replace(/增强 Tab/g, '增强标签页')
    .replace(/Toast /g, '轻提示 ');
}

const localized = localizeContent(content);
fs.writeFileSync(file, before + localized + after, 'utf8');
console.log('Localized:', file);
