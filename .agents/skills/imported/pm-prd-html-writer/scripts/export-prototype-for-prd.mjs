#!/usr/bin/env node
/**
 * 将 Axhub Make 原型导出为离线 HTML，供 HTML PRD 内嵌（iframe 或同目录引用）。
 *
 * 用法:
 *   node export-prototype-for-prd.mjs --prototype management-mode
 *   node export-prototype-for-prd.mjs --prototype management-mode --prd src/docs/PRD/管理模式/管理模式_PRD_V1.0.html
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  logError,
  logInfo,
  logSuccess,
  parseCommonArgs,
  REPO_ROOT,
} from './_utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OFFLINE_REACT = 'react.production.min.js';
const OFFLINE_REACT_DOM = 'react-dom.production.min.js';
const OFFLINE_BOOTSTRAP = 'export-html-bootstrap.js';

function resolveNodeModule(relativePath) {
  let dir = REPO_ROOT;
  while (true) {
    const candidate = path.join(dir, 'node_modules', relativePath);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(`缺少依赖: ${relativePath}`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getOfflineBootstrapScript() {
  return `;(function () {
  function applyRootSizing() {
    var urlParams = new URLSearchParams(window.location.search);
    var scale = urlParams.get('scale');
    var width = urlParams.get('width');
    var height = urlParams.get('height');
    var rootElement = document.getElementById('root');
    if (!rootElement) return;
    if (scale) {
      var scaleValue = parseFloat(scale);
      if (!Number.isNaN(scaleValue) && scaleValue > 0) {
        rootElement.style.transform = 'scale(' + scaleValue + ')';
        rootElement.style.transformOrigin = 'top left';
      }
    }
    if (width) {
      var widthValue = parseInt(width, 10);
      if (!Number.isNaN(widthValue) && widthValue > 0) rootElement.style.width = widthValue + 'px';
    }
    if (height) {
      var heightValue = parseInt(height, 10);
      if (!Number.isNaN(heightValue) && heightValue > 0) rootElement.style.height = heightValue + 'px';
    }
  }
  function renderComponent(Component, props) {
    var rootElement = document.getElementById('root');
    if (!rootElement) { console.error('[Html Template] 找不到 #root 元素'); return; }
    if (!window.React || !window.ReactDOM) { console.error('[Html Template] React 未加载'); return; }
    var finalProps = props || { container: rootElement, config: {}, data: {}, events: {} };
    try {
      if (typeof window.ReactDOM.createRoot === 'function') {
        window.ReactDOM.createRoot(rootElement).render(window.React.createElement(Component, finalProps));
        return;
      }
      if (typeof window.ReactDOM.render === 'function') {
        window.ReactDOM.render(window.React.createElement(Component, finalProps), rootElement);
        return;
      }
      throw new Error('ReactDOM 不支持 createRoot/render');
    } catch (error) {
      console.error('[Html Template] 渲染失败:', error);
    }
  }
  applyRootSizing();
  window.__AXHUB_DEFINE_COMPONENT__ = function (Component) {
    window.UserComponent = Component;
    return Component;
  };
  window.HtmlTemplateBootstrap = {
    renderComponent: renderComponent,
    React: window.React,
    ReactDOM: window.ReactDOM,
  };
})();`;
}

function buildOfflineRenderScript(entryScriptPath) {
  return `  <script>
    function waitForBootstrap(timeoutMs = 10000) {
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        function check() {
          if (window.HtmlTemplateBootstrap) { resolve(window.HtmlTemplateBootstrap); return; }
          if (Date.now() - startedAt >= timeoutMs) {
            reject(new Error('[Html Template] Bootstrap 初始化超时'));
            return;
          }
          setTimeout(check, 10);
        }
        check();
      });
    }
    function loadEntryScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('[Html Template] 入口脚本加载失败: ' + src));
        document.body.appendChild(script);
      });
    }
    async function bootstrapAndRender() {
      try {
        const bootstrap = await waitForBootstrap();
        const { renderComponent, React, ReactDOM } = bootstrap;
        window.React = React;
        window.ReactDOM = ReactDOM;
        await loadEntryScript('${entryScriptPath}');
        const Component = window.UserComponent?.Component || window.UserComponent?.default || window.UserComponent;
        if (!Component) throw new Error('[Html Template] 入口脚本未暴露 UserComponent');
        renderComponent(Component);
      } catch (error) {
        console.error('[Html Template] 页面初始化失败:', error);
      }
    }
    bootstrapAndRender();
  </script>`;
}

function generateExportPageHtml(projectRoot, title, entryScriptPath) {
  const templatePath = path.join(projectRoot, 'admin', 'html-template.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('缺少 admin/html-template.html');
  }
  const reactPath = `./assets/${OFFLINE_REACT}`;
  const reactDomPath = `./assets/${OFFLINE_REACT_DOM}`;
  const bootstrapPath = `./assets/${OFFLINE_BOOTSTRAP}`;
  const vendorTags = `  <script src="${reactPath}"></script>
  <script src="${reactDomPath}"></script>
  <script src="${bootstrapPath}"></script>`;

  return fs
    .readFileSync(templatePath, 'utf8')
    .replace(/\{\{TITLE\}\}/g, escapeHtml(title))
    .replace(
      '<body>',
      `<body>\n\n  <script>\n    window.__AXHUB_EXPORT_META__ = {"group":"prototypes"};\n  </script>`,
    )
    .replace(
      /window\.location\.pathname\.includes\('\/components\/'\)/g,
      `window.location.pathname.includes('/components/') || window.__AXHUB_EXPORT_META__?.group === 'components'`,
    )
    .replace(/<script type="module" src="\{\{BOOTSTRAP_PATH\}\}"><\/script>/, vendorTags)
    .replace(
      /<script type="module">[\s\S]*?bootstrapAndRender\(\);\s*<\/script>/,
      buildOfflineRenderScript(entryScriptPath),
    );
}

function buildPrototype(entryKey) {
  logInfo(`构建原型: ${entryKey}`);
  const result = spawnSync('npx', ['vite', 'build'], {
    cwd: REPO_ROOT,
    env: { ...process.env, ENTRY_KEY: entryKey },
    stdio: 'inherit',
    shell: true,
    timeout: 5 * 60 * 1000,
  });
  if (result.status !== 0) {
    throw new Error(`构建失败: ${entryKey}`);
  }
}

function readDisplayName(entryKey) {
  const tsx = path.join(REPO_ROOT, 'src', entryKey, 'index.tsx');
  if (!fs.existsSync(tsx)) return path.basename(entryKey);
  const text = fs.readFileSync(tsx, 'utf8');
  const match = text.match(/@name\s+([^\n*]+)/);
  return match ? match[1].trim() : path.basename(entryKey);
}

function exportPrototype(prototypeName, prdPath = null) {
  const entryKey = `prototypes/${prototypeName}`;
  const distJs = path.join(REPO_ROOT, 'dist', `${entryKey}.js`);
  const outDir = prdPath
    ? path.join(path.dirname(path.resolve(prdPath)), 'assets', 'prototypes', prototypeName)
    : path.join(REPO_ROOT, 'src/docs/assets/prototypes', prototypeName);
  const assetsDir = path.join(outDir, 'assets');

  buildPrototype(entryKey);

  if (!fs.existsSync(distJs)) {
    throw new Error(`未找到构建产物: ${distJs}`);
  }

  fs.mkdirSync(assetsDir, { recursive: true });

  fs.copyFileSync(distJs, path.join(outDir, 'index.js'));
  fs.copyFileSync(
    resolveNodeModule(path.join('react', 'umd', OFFLINE_REACT)),
    path.join(assetsDir, OFFLINE_REACT),
  );
  fs.copyFileSync(
    resolveNodeModule(path.join('react-dom', 'umd', OFFLINE_REACT_DOM)),
    path.join(assetsDir, OFFLINE_REACT_DOM),
  );
  fs.writeFileSync(path.join(assetsDir, OFFLINE_BOOTSTRAP), getOfflineBootstrapScript(), 'utf8');

  const title = `${readDisplayName(entryKey)} - 交互原型`;
  const html = generateExportPageHtml(REPO_ROOT, title, './index.js');
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

  logSuccess(`已导出: ${outDir}`);
  return {
    outDir,
    iframeSrc: `./assets/prototypes/${prototypeName}/index.html`,
  };
}

function patchPrdHtml(prdPath, iframeSrc, prototypeName) {
  let html = fs.readFileSync(prdPath, 'utf8');
  const embedBlock = `<div class="prototype-section">
                <div class="prototype-tabs">
                    <button class="prototype-tab active" data-tab="interactive">交互原型</button>
                </div>
                <div class="prototype-content">
                    <div class="prototype-panel active" id="panel-interactive">
                        <div class="prototype-iframe-preview" data-design-width="1280" data-design-height="800">
                            <div class="prototype-iframe-hint">点击全屏交互</div>
                            <div class="prototype-iframe-scale">
                                <iframe class="interactive-prototype interactive-prototype--preview"
                                        src="${iframeSrc}"
                                        title="${prototypeName} - 交互原型"
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                        loading="lazy">
                                </iframe>
                            </div>
                            <div class="prototype-iframe-placeholder" hidden>全屏交互中，关闭全屏后恢复此处预览</div>
                        </div>
                        <p style="text-align:center;margin-top:12px;color:var(--text-muted);font-size:14px;">图 3-5-13：可交互原型（预览区按比例展示完整布局，点击可全屏操作，路径 ${iframeSrc}）</p>
                    </div>
                </div>
            </div>`;

  const sectionRe = /<div class="prototype-section">[\s\S]*?id="panel-interactive"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (!sectionRe.test(html)) {
    throw new Error('未在 PRD 中找到可替换的交互原型区块');
  }

  html = html.replace(sectionRe, embedBlock);
  fs.writeFileSync(prdPath, html, 'utf8');
  logSuccess(`已更新 PRD iframe: ${prdPath} -> ${iframeSrc}`);
}

function printUsage() {
  console.log(`
用法: node export-prototype-for-prd.mjs [选项]

选项:
  --prototype, -p <name>   原型目录名（默认: management-mode）
  --prd <html-path>        同步更新 PRD 中的 iframe 地址
  --help                   显示帮助
`);
}

function main() {
  const { flags } = parseCommonArgs(process.argv);
  if (flags.help) {
    printUsage();
    process.exit(0);
  }

  const prototypeName = flags.prototype || flags.p || 'management-mode';
  const prdPath = flags.prd ? path.resolve(flags.prd) : null;

  try {
    const { iframeSrc } = exportPrototype(prototypeName, prdPath);
    if (prdPath) {
      patchPrdHtml(prdPath, iframeSrc, prototypeName);
    }
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }
}

main();
