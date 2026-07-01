/**
 * PRD HTML 页面内联编辑器
 * 用法：<script src="./assets/scripts/prd-inline-editor.js" defer></script>
 * 开发环境保存：PUT /api/html-file?path=src/docs/PRD/.../*.html
 * 离线环境：触发下载覆盖原文件
 */
(function () {
    'use strict';

    var EDITABLE_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,td,.sidebar-header h1,.sidebar-version,blockquote';
    var SKIP_ANCESTOR = '.prototype-section,.mermaid,.prototype-gallery,.prototype-iframe-preview,.prototype-fullscreen-overlay,.prd-edit-toolbar,.prd-hint-panel,table thead,script,#prd-update-meta,.toc-list,.lightbox-overlay,.back-to-top,.menu-toggle,.sidebar-overlay';
    var YES_NO_HEADERS = ['必填', '可修改'];
    var yesNoCellMap = new WeakMap();

    var editMode = false;
    var dirty = false;
    var toolbar = null;
    var statusEl = null;

    function $(id) {
        return document.getElementById(id);
    }

    function getContentRoot() {
        return $('content');
    }

    function getMeta() {
        var el = $('prd-update-meta');
        if (!el) return {};
        try {
            return JSON.parse(el.textContent);
        } catch (err) {
            console.warn('[PrdEditor] prd-update-meta 解析失败', err);
            return {};
        }
    }

    function resolveHtmlFilePath() {
        var meta = getMeta();
        if (meta.htmlFile) return String(meta.htmlFile).replace(/\\/g, '/');

        var pathname = window.location.pathname || '';
        if (pathname.indexOf('/raw-docs/') === 0) {
            return 'src/docs/' + decodeURIComponent(pathname.slice('/raw-docs/'.length));
        }
        return '';
    }

    function isDevServer() {
        return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    }

    function canUseApiSave() {
        return isDevServer() && Boolean(resolveHtmlFilePath());
    }

    function isSkipped(el) {
        if (!el || el.nodeType !== 1) return true;
        if (el.closest(SKIP_ANCESTOR)) return true;
        if (el.closest('.prd-edit-toolbar')) return true;
        if (el.matches('code, pre, img, iframe, button, input, textarea, select, svg')) return true;
        return false;
    }

    function getEditableNodes() {
        var root = document;
        var nodes = [];
        root.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el) {
            if (!isSkipped(el)) nodes.push(el);
        });
        return nodes;
    }

    function normalizeYesNoText(text) {
        return String(text || '').replace(/\s+/g, '').trim();
    }

    function isValidYesNo(text) {
        return text === '是' || text === '否';
    }

    function getYesNoColumnIndices(table) {
        var headerRow = table.querySelector('thead tr');
        if (!headerRow) return [];
        var indices = [];
        headerRow.querySelectorAll('th').forEach(function (th, index) {
            var label = normalizeYesNoText(th.textContent);
            if (YES_NO_HEADERS.indexOf(label) !== -1) indices.push(index);
        });
        return indices;
    }

    function isFieldDescriptionTable(table) {
        var headerRow = table.querySelector('thead tr');
        if (!headerRow) return false;
        var labels = [];
        headerRow.querySelectorAll('th').forEach(function (th) {
            labels.push(normalizeYesNoText(th.textContent));
        });
        return labels.indexOf('字段名称') !== -1 && labels.indexOf('可修改') !== -1;
    }

    function getYesNoCells() {
        var cells = [];
        document.querySelectorAll('table').forEach(function (table) {
            if (!isFieldDescriptionTable(table)) return;
            var indices = getYesNoColumnIndices(table);
            if (!indices.length) return;
            table.querySelectorAll('tbody tr').forEach(function (row) {
                var tds = row.querySelectorAll('td');
                indices.forEach(function (colIndex) {
                    if (tds[colIndex]) cells.push(tds[colIndex]);
                });
            });
        });
        return cells;
    }

    function validateYesNoCell(cell, showStatus) {
        if (!cell) return true;
        var value = normalizeYesNoText(cell.textContent);
        if (isValidYesNo(value)) {
            cell.textContent = value;
            cell.classList.remove('prd-yes-no-invalid');
            yesNoCellMap.set(cell, value);
            return true;
        }
        cell.classList.add('prd-yes-no-invalid');
        if (showStatus) {
            setStatus('「必填」「可修改」列只能填「是」或「否」；状态条件请写在「说明」列', 'error');
        }
        return false;
    }

    function restoreInvalidYesNoCells() {
        getYesNoCells().forEach(function (cell) {
            if (!validateYesNoCell(cell, false)) {
                var previous = yesNoCellMap.get(cell);
                if (previous) {
                    cell.textContent = previous;
                    cell.classList.remove('prd-yes-no-invalid');
                }
            }
        });
    }

    function injectStyles() {
        if ($('prd-inline-editor-style')) return;
        var style = document.createElement('style');
        style.id = 'prd-inline-editor-style';
        style.textContent = [
            '.prd-edit-toolbar {',
            '  padding: 10px 16px 12px;',
            '  border-bottom: 1px solid var(--border-secondary, #f0f0f0);',
            '  background: var(--bg-secondary, #f5f5f5);',
            '  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;',
            '}',
            '.prd-edit-toolbar .prd-edit-title {',
            '  font-size: 12px; color: var(--text-muted, rgba(0,0,0,.45)); margin-right: auto;',
            '}',
            '.prd-edit-btn {',
            '  appearance: none; border: 1px solid var(--border-color, #d9d9d9);',
            '  background: #fff; color: var(--text-primary, rgba(0,0,0,.88));',
            '  border-radius: 6px; padding: 4px 12px; font-size: 12px; cursor: pointer;',
            '  transition: all .2s;',
            '}',
            '.prd-edit-btn:hover { border-color: var(--primary-color, #1677ff); color: var(--primary-color, #1677ff); }',
            '.prd-edit-btn.is-primary {',
            '  background: var(--primary-color, #1677ff); border-color: var(--primary-color, #1677ff); color: #fff;',
            '}',
            '.prd-edit-btn.is-primary:hover { background: var(--primary-hover, #4096ff); border-color: var(--primary-hover, #4096ff); color: #fff; }',
            '.prd-edit-btn:disabled { opacity: .45; cursor: not-allowed; }',
            '.prd-edit-status { font-size: 12px; color: var(--text-secondary, rgba(0,0,0,.65)); min-height: 18px; }',
            '.prd-edit-status.is-error { color: var(--error-color, #ff4d4f); }',
            '.prd-edit-status.is-success { color: var(--success-color, #52c41a); }',
            'body.prd-edit-mode [data-prd-editable="1"] {',
            '  outline: 1px dashed rgba(22, 119, 255, .45); outline-offset: 2px; border-radius: 2px;',
            '}',
            'body.prd-edit-mode [data-prd-editable="1"]:focus {',
            '  outline: 2px solid rgba(22, 119, 255, .75); background: rgba(22, 119, 255, .04);',
            '}',
            'body.prd-edit-mode [data-prd-yes-no="1"] {',
            '  background: rgba(22, 119, 255, .06); text-align: center; min-width: 48px;',
            '}',
            'body.prd-edit-mode [data-prd-yes-no="1"].prd-yes-no-invalid {',
            '  outline: 2px solid var(--error-color, #ff4d4f); background: rgba(255, 77, 79, .08);',
            '}',
            'body.prd-edit-mode .sidebar-overlay,',
            'body.prd-edit-mode .menu-toggle { pointer-events: none; opacity: .35; }'
        ].join('\n');
        document.head.appendChild(style);
    }

    function injectToolbar() {
        if ($('prdEditToolbar')) {
            toolbar = $('prdEditToolbar');
            statusEl = $('prdEditStatus');
            return;
        }

        var sidebar = $('sidebar');
        if (!sidebar) return;

        toolbar = document.createElement('div');
        toolbar.className = 'prd-edit-toolbar';
        toolbar.id = 'prdEditToolbar';
        toolbar.innerHTML = [
            '<span class="prd-edit-title">页面编辑</span>',
            '<button type="button" class="prd-edit-btn" id="prdEditToggle">进入编辑</button>',
            '<button type="button" class="prd-edit-btn is-primary" id="prdSaveBtn" hidden>保存</button>',
            '<button type="button" class="prd-edit-btn" id="prdDownloadBtn" hidden>下载 HTML</button>',
            '<span class="prd-edit-status" id="prdEditStatus"></span>'
        ].join('');

        var header = sidebar.querySelector('.sidebar-header');
        if (header && header.nextSibling) {
            sidebar.insertBefore(toolbar, header.nextSibling);
        } else {
            sidebar.appendChild(toolbar);
        }

        statusEl = $('prdEditStatus');
    }

    function setStatus(message, type) {
        if (!statusEl) return;
        statusEl.textContent = message || '';
        statusEl.classList.remove('is-error', 'is-success');
        if (type) statusEl.classList.add('is-' + type);
    }

    function markDirty() {
        if (!dirty) {
            dirty = true;
            setStatus('有未保存的修改');
        }
    }

    function clearDirty() {
        dirty = false;
        setStatus('');
    }

    function requestTocRefresh() {
        window.dispatchEvent(new CustomEvent('prd:toc-refresh'));
        if (window.PrdDocHooks && typeof window.PrdDocHooks.regenerateTOC === 'function') {
            window.PrdDocHooks.regenerateTOC();
        }
    }

    function syncDocumentTitle() {
        var sidebarTitle = document.querySelector('.sidebar-header h1');
        if (sidebarTitle && sidebarTitle.textContent.trim()) {
            var version = '';
            var versionEl = document.querySelector('.sidebar-version');
            if (versionEl) version = versionEl.textContent.trim();
            document.title = sidebarTitle.textContent.trim() + (version ? ' - ' + version : '');
        }
    }

    function enableEditMode() {
        editMode = true;
        document.body.classList.add('prd-edit-mode');

        getEditableNodes().forEach(function (el) {
            el.setAttribute('data-prd-editable', '1');
            el.setAttribute('contenteditable', 'true');
            el.setAttribute('spellcheck', 'false');
        });

        getYesNoCells().forEach(function (cell) {
            cell.setAttribute('data-prd-yes-no', '1');
            yesNoCellMap.set(cell, normalizeYesNoText(cell.textContent));
        });

        $('prdEditToggle').textContent = '退出编辑';
        $('prdSaveBtn').hidden = false;
        $('prdDownloadBtn').hidden = !canUseApiSave();
        setStatus(canUseApiSave() ? '编辑中，完成后点「保存」写回项目文件' : '编辑中，完成后点「保存」或「下载 HTML」');
    }

    function disableEditMode(keepStatus) {
        editMode = false;
        document.body.classList.remove('prd-edit-mode');

        document.querySelectorAll('[data-prd-editable="1"]').forEach(function (el) {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
            el.removeAttribute('data-prd-editable');
        });
        document.querySelectorAll('[data-prd-yes-no="1"]').forEach(function (el) {
            el.removeAttribute('data-prd-yes-no');
            el.classList.remove('prd-yes-no-invalid');
        });
        yesNoCellMap = new WeakMap();

        $('prdEditToggle').textContent = '进入编辑';
        $('prdSaveBtn').hidden = true;
        $('prdDownloadBtn').hidden = true;
        if (!keepStatus && !dirty) setStatus('');
    }

    function cleanupBeforeSerialize() {
        disableEditMode(true);
        syncDocumentTitle();
        requestTocRefresh();
    }

    function serializeDocumentHtml() {
        cleanupBeforeSerialize();
        var clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll('[contenteditable]').forEach(function (el) {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
        });
        clone.querySelectorAll('[data-prd-editable]').forEach(function (el) {
            el.removeAttribute('data-prd-editable');
        });
        clone.querySelectorAll('[data-prd-yes-no]').forEach(function (el) {
            el.removeAttribute('data-prd-yes-no');
            el.classList.remove('prd-yes-no-invalid');
        });
        if (clone.querySelector('body')) {
            clone.querySelector('body').classList.remove('prd-edit-mode');
        }
        return '<!DOCTYPE html>\n' + clone.outerHTML;
    }

    function downloadHtml(content, filename) {
        var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename || 'PRD.html';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function guessFilename() {
        var htmlPath = resolveHtmlFilePath();
        if (htmlPath) {
            var parts = htmlPath.split('/');
            return parts[parts.length - 1] || 'PRD.html';
        }
        var meta = getMeta();
        if (meta.productName) return meta.productName + '_PRD.html';
        return 'PRD.html';
    }

    async function saveDocument() {
        var invalidCells = getYesNoCells().filter(function (cell) {
            return !validateYesNoCell(cell, false);
        });
        if (invalidCells.length) {
            setStatus('「必填」「可修改」列只能填「是」或「否」；状态条件请写在「说明」列', 'error');
            invalidCells[0].focus();
            return;
        }

        var htmlPath = resolveHtmlFilePath();
        var content = serializeDocumentHtml();
        var saveBtn = $('prdSaveBtn');
        if (saveBtn) saveBtn.disabled = true;

        try {
            if (canUseApiSave()) {
                var response = await fetch('/api/html-file?path=' + encodeURIComponent(htmlPath), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: content })
                });
                var result = await response.json().catch(function () { return {}; });
                if (!response.ok) {
                    throw new Error(result.error || ('保存失败 (' + response.status + ')'));
                }
                clearDirty();
                setStatus('已保存到 ' + (result.path || htmlPath), 'success');
                return;
            }

            downloadHtml(content, guessFilename());
            clearDirty();
            setStatus('已下载 HTML，请覆盖原文件', 'success');
        } catch (err) {
            console.error('[PrdEditor] 保存失败', err);
            setStatus(err.message || '保存失败', 'error');
            if (canUseApiSave()) {
                downloadHtml(content, guessFilename());
                setStatus((err.message || '保存失败') + '，已改为下载 HTML', 'error');
            }
        } finally {
            if (saveBtn) saveBtn.disabled = false;
        }
    }

    function bindEvents() {
        $('prdEditToggle').addEventListener('click', function () {
            if (editMode) {
                restoreInvalidYesNoCells();
                disableEditMode(false);
                if (dirty) setStatus('已退出编辑，仍有未保存的修改');
            } else {
                enableEditMode();
            }
        });

        $('prdSaveBtn').addEventListener('click', function () {
            saveDocument();
        });

        $('prdDownloadBtn').addEventListener('click', function () {
            var content = serializeDocumentHtml();
            downloadHtml(content, guessFilename());
            setStatus('已下载 HTML', 'success');
        });

        document.addEventListener('input', function (e) {
            if (!editMode) return;
            var target = e.target;
            if (target && target.getAttribute && target.getAttribute('data-prd-editable') === '1') {
                markDirty();
            }
        }, true);

        document.addEventListener('blur', function (e) {
            if (!editMode) return;
            var target = e.target;
            if (target && target.getAttribute && target.getAttribute('data-prd-yes-no') === '1') {
                validateYesNoCell(target, true);
            }
        }, true);

        window.addEventListener('beforeunload', function (e) {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = '';
        });
    }

    function init() {
        injectStyles();
        injectToolbar();
        if (!toolbar) return;
        bindEvents();

        if (!canUseApiSave() && isDevServer()) {
            setStatus('未配置 htmlFile 路径，保存时将下载 HTML');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.PrdInlineEditor = {
        enable: enableEditMode,
        disable: disableEditMode,
        save: saveDocument,
        isDirty: function () { return dirty; },
        resolveHtmlFilePath: resolveHtmlFilePath
    };
})();
