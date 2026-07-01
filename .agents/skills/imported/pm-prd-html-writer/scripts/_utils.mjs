import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

export const SKILL_ROOT = path.dirname(url.fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(SKILL_ROOT, '../../..');
export const DEFAULT_DOCS_DIR = path.join(REPO_ROOT, 'src/docs');
export const DEFAULT_ASSETS_DIR = path.join(DEFAULT_DOCS_DIR, 'assets');

export const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

export function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

export function logSuccess(msg) {
  log(`✓ ${msg}`, 'green');
}

export function logError(msg) {
  log(`✗ ${msg}`, 'red');
}

export function logInfo(msg) {
  log(`⏳ ${msg}`, 'yellow');
}

export function logWarn(msg) {
  log(`⚠ ${msg}`, 'yellow');
}

export function parseCommonArgs(argv) {
  const args = argv.slice(2);
  const positional = [];
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

export function resolveDocsBase(inputPath) {
  if (!inputPath) {
    return DEFAULT_DOCS_DIR;
  }

  const resolved = path.resolve(inputPath);
  if (resolved.endsWith('.html')) {
    return path.dirname(resolved);
  }
  return resolved;
}

export function resolveAssetsDir(baseDir) {
  const normalized = path.resolve(baseDir);
  if (path.basename(normalized) === 'assets') {
    return normalized;
  }
  return path.join(normalized, 'assets');
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeGitkeep(dirPath) {
  ensureDir(dirPath);
  const gitkeep = path.join(dirPath, '.gitkeep');
  if (!fs.existsSync(gitkeep)) {
    fs.writeFileSync(gitkeep, '', 'utf8');
  }
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function extractAssetRefs(html, htmlDir) {
  const refs = [];
  const patterns = [
    /(?:src|href)=["']([^"']+)["']/g,
    /url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const raw = match[1].trim();
      if (!raw || raw.startsWith('data:') || raw.startsWith('#') || raw.startsWith('http')) {
        continue;
      }
      const cleaned = raw.split('?')[0].split('#')[0];
      const resolved = path.resolve(htmlDir, cleaned);
      refs.push({ raw: cleaned, resolved, relative: path.relative(htmlDir, resolved) });
    }
  }

  return refs;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
