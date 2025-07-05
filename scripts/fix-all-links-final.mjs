#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.join(__dirname, '..', 'docs');

// Маппинг правильных путей для Docusaurus (без числовых префиксов)
const PATH_MAPPINGS = {
  // User Journeys
  '/user-journeys/for-new-developer': '/user-journeys/for-new-developer',
  '/user-journeys/for-qa-engineer': '/user-journeys/for-qa-engineer',
  '/user-journeys/for-architect': '/user-journeys/for-architect',
  '/user-journeys/glossary': '/user-journeys/glossary',
  
  // Getting Started
  '/getting-started/developer-onboarding': '/getting-started/developer-onboarding',
  '/getting-started/api-keys-configuration': '/getting-started/api-keys-configuration',
  '/getting-started/system-compatibility': '/getting-started/system-compatibility',
  
  // How-to Guides
  '/how-to-guides/troubleshooting-common-issues': '/how-to-guides/troubleshooting-common-issues',
  '/how-to-guides/debug-mcp-integration': '/how-to-guides/debug-mcp-integration',
  '/how-to-guides/using-voice-interface': '/how-to-guides/using-voice-interface',
  '/how-to-guides/build-and-deploy': '/how-to-guides/build-and-deploy',
  '/how-to-guides/installing-chrome-extensions': '/how-to-guides/installing-chrome-extensions',
  '/how-to-guides/test-workers-with-chat': '/how-to-guides/test-workers-with-chat',
  '/how-to-guides/working-with-logs': '/how-to-guides/working-with-logs',
  '/how-to-guides/run-and-debug-e2e-tests': '/how-to-guides/run-and-debug-e2e-tests',
  '/how-to-guides/ui-performance-optimization': '/how-to-guides/ui-performance-optimization',
  '/how-to-guides/mcp-reverse-ssh-tunnel': '/how-to-guides/mcp-reverse-ssh-tunnel',
  '/how-to-guides/work-with-chat-hooks': '/how-to-guides/work-with-chat-hooks',
  '/how-to-guides/using-github-projects-for-docs': '/how-to-guides/using-github-projects-for-docs',
  '/how-to-guides/export-code-dumps': '/how-to-guides/export-code-dumps',
  '/how-to-guides/debugging-chrome-extensions': '/how-to-guides/debugging-chrome-extensions',
  '/how-to-guides/chrome-extensions-debug/debug-tools': '/how-to-guides/chrome-extensions-debug/debug-tools',
  '/how-to-guides/chrome-extensions-debug/installation-issues': '/how-to-guides/chrome-extensions-debug/installation-issues',
  '/how-to-guides/troubleshooting/startup-and-performance': '/how-to-guides/troubleshooting/startup-and-performance',
  '/how-to-guides/troubleshooting/feature-specific-issues': '/how-to-guides/troubleshooting/feature-specific-issues',
  '/how-to-guides/troubleshooting/critical-system-problems': '/how-to-guides/troubleshooting/critical-system-problems',
  '/how-to-guides/troubleshooting/common-errors': '/how-to-guides/troubleshooting/common-errors',
  
  // Core Concepts - Architecture Patterns
  '/core-concepts/architecture-patterns/system-overview': '/core-concepts/architecture-patterns/system-overview',
  '/core-concepts/architecture-patterns/code-organization': '/core-concepts/architecture-patterns/code-organization',
  '/core-concepts/architecture-patterns/manager-architecture': '/core-concepts/architecture-patterns/manager-architecture',
  '/core-concepts/architecture-patterns/logging-strategy': '/core-concepts/architecture-patterns/logging-strategy',
  '/core-concepts/architecture-patterns/polylith-backend-integration': '/core-concepts/architecture-patterns/polylith-backend-integration',
  '/core-concepts/architecture-patterns/cross-platform-compatibility': '/core-concepts/architecture-patterns/cross-platform-compatibility',
  '/core-concepts/architecture-patterns/security-principles': '/core-concepts/architecture-patterns/security-principles',
  '/core-concepts/architecture-patterns/development-integration': '/core-concepts/architecture-patterns/development-integration',
  '/core-concepts/architecture-patterns/polylith-architecture': '/core-concepts/architecture-patterns/polylith-architecture',
  '/core-concepts/architecture-patterns/protobuf-architecture': '/core-concepts/architecture-patterns/protobuf-architecture',
  '/core-concepts/architecture-patterns/database-architecture': '/core-concepts/architecture-patterns/database-architecture',
  '/core-concepts/architecture-patterns/risk-management-overview': '/core-concepts/architecture-patterns/risk-management-overview',
  '/core-concepts/architecture-patterns/risk-management': '/core-concepts/architecture-patterns/risk-management',
  '/core-concepts/architecture-patterns/14b-command-validation-pattern': '/core-concepts/architecture-patterns/14b-command-validation-pattern',
  '/core-concepts/architecture-patterns/risk-management-patterns': '/core-concepts/architecture-patterns/risk-management-patterns',
  '/core-concepts/architecture-patterns/build-security': '/core-concepts/architecture-patterns/build-security',
  '/core-concepts/architecture-patterns/build-system': '/core-concepts/architecture-patterns/build-system',
  '/core-concepts/architecture-patterns/configuration-management': '/core-concepts/architecture-patterns/configuration-management',
  '/core-concepts/architecture-patterns/interaction-diagrams': '/core-concepts/architecture-patterns/interaction-diagrams',
  '/core-concepts/architecture-patterns/code-analysis': '/core-concepts/architecture-patterns/code-analysis',
  '/core-concepts/architecture-patterns/stability-compatibility': '/core-concepts/architecture-patterns/stability-compatibility',
  '/core-concepts/architecture-patterns/documentation-system': '/core-concepts/architecture-patterns/documentation-system',
  '/core-concepts/architecture-patterns/adr-029-centralize-ai-logic-in-polylith': '/core-concepts/architecture-patterns/adr-029-centralize-ai-logic-in-polylith',
  
  // Core Concepts - Shell Core
  '/core-concepts/shell-core/shell-architecture': '/core-concepts/shell-core/shell-architecture',
  '/core-concepts/shell-core/electron-principles': '/core-concepts/shell-core/electron-principles',
  '/core-concepts/shell-core/api-management': '/core-concepts/shell-core/api-management',
  '/core-concepts/shell-core/ipc-architecture': '/core-concepts/shell-core/ipc-architecture',
  '/core-concepts/shell-core/command-security': '/core-concepts/shell-core/command-security',
  '/core-concepts/shell-core/logging-system': '/core-concepts/shell-core/logging-system',
  '/core-concepts/shell-core/mcp-architecture': '/core-concepts/shell-core/mcp-architecture',
  '/core-concepts/shell-core/error-handling': '/core-concepts/shell-core/error-handling',
  '/core-concepts/shell-core/logger-architecture': '/core-concepts/shell-core/logger-architecture',
  '/core-concepts/shell-core/tab-management': '/core-concepts/shell-core/tab-management',
  '/core-concepts/shell-core/file-watching-implementation': '/core-concepts/shell-core/file-watching-implementation',
  '/core-concepts/shell-core/file-watching': '/core-concepts/shell-core/file-watching',
  '/core-concepts/shell-core/workers-architecture': '/core-concepts/shell-core/workers-architecture',
  '/core-concepts/shell-core/e2e-livelock-fix': '/core-concepts/shell-core/e2e-livelock-fix',
  '/core-concepts/shell-core/note-e2e-livelock-fix': '/core-concepts/shell-core/note-e2e-livelock-fix',
  '/core-concepts/shell-core/proto-contracts': '/core-concepts/shell-core/proto-contracts',
  '/core-concepts/shell-core/file-watching-system': '/core-concepts/shell-core/file-watching-system',
  '/core-concepts/shell-core/automation-engine': '/core-concepts/shell-core/automation-engine',
  '/core-concepts/shell-core/session-management': '/core-concepts/shell-core/session-management',
  '/core-concepts/shell-core/chrome-web-store-integration': '/core-concepts/shell-core/chrome-web-store-integration',
  '/core-concepts/shell-core/chrome-web-store-architecture': '/core-concepts/shell-core/chrome-web-store-architecture',
  '/core-concepts/shell-core/browser-session-and-authentication': '/core-concepts/shell-core/browser-session-and-authentication',
  '/core-concepts/shell-core/ipc-architecture/channel-groups-basics': '/core-concepts/shell-core/ipc-architecture/channel-groups-basics',
  '/core-concepts/shell-core/ipc-architecture/proto-generation': '/core-concepts/shell-core/ipc-architecture/proto-generation',
  '/core-concepts/shell-core/chrome-extensions/updater-service': '/core-concepts/shell-core/chrome-extensions/updater-service',
  '/core-concepts/shell-core/chrome-extensions/storage-api': '/core-concepts/shell-core/chrome-extensions/storage-api',
  '/core-concepts/shell-core/chrome-extensions/ui-integration': '/core-concepts/shell-core/chrome-extensions/ui-integration',
  '/core-concepts/shell-core/chrome-extensions/missing-apis': '/core-concepts/shell-core/chrome-extensions/missing-apis',
  
  // Core Concepts - UI Layer
  '/core-concepts/ui-layer/chat-architecture': '/core-concepts/ui-layer/chat-architecture',
  '/core-concepts/ui-layer/navigation-architecture': '/core-concepts/ui-layer/navigation-architecture',
  '/core-concepts/ui-layer/design-theming': '/core-concepts/ui-layer/design-theming',
  '/core-concepts/ui-layer/thinking-indicator': '/core-concepts/ui-layer/thinking-indicator',
  '/core-concepts/ui-layer/neira-app-architecture': '/core-concepts/ui-layer/neira-app-architecture',
  '/core-concepts/ui-layer/chat-streaming-lifecycle': '/core-concepts/ui-layer/chat-streaming-lifecycle',
  '/core-concepts/ui-layer/code-editor': '/core-concepts/ui-layer/code-editor',
  '/core-concepts/ui-layer/layout-and-window-management': '/core-concepts/ui-layer/layout-and-window-management',
  '/core-concepts/ui-layer/chat-core': '/core-concepts/ui-layer/chat-core',
  '/core-concepts/ui-layer/chat-state': '/core-concepts/ui-layer/chat-state',
  
  // Core Concepts - AI Engine
  '/core-concepts/ai-engine/ai-architecture': '/core-concepts/ai-engine/ai-architecture',
  '/core-concepts/ai-engine/planner-service': '/core-concepts/ai-engine/planner-service',
  '/core-concepts/ai-engine/voice-audio': '/core-concepts/ai-engine/voice-audio',
  '/core-concepts/ai-engine/python-integration': '/core-concepts/ai-engine/python-integration',
  '/core-concepts/ai-engine/proxy-ai-server': '/core-concepts/ai-engine/proxy-ai-server',
  '/core-concepts/ai-engine/grpc-api-reference': '/core-concepts/ai-engine/grpc-api-reference',
  '/core-concepts/ai-engine/grpc-methods-reference': '/core-concepts/ai-engine/grpc-methods-reference',
  '/core-concepts/ai-engine/python-agent-setup': '/core-concepts/ai-engine/python-agent-setup',
  '/core-concepts/ai-engine/python-grpc-api': '/core-concepts/ai-engine/python-grpc-api',
  '/core-concepts/ai-engine/grpc-troubleshooting': '/core-concepts/ai-engine/grpc-troubleshooting',
  '/core-concepts/ai-engine/python-troubleshooting': '/core-concepts/ai-engine/python-troubleshooting',
  
  // Reference
  '/reference/web-api': '/api-reference/web-api',
  '/reference/openrouter-integration': '/reference/openrouter-integration',
  '/reference/chrome-extensions': '/reference/chrome-extensions',
  '/reference/code-editor': '/reference/code-editor',
  '/reference/mcp-integration': '/reference/mcp-integration',
  '/reference/chrome-web-store': '/reference/chrome-web-store',
  '/reference/native-messaging-host': '/reference/native-messaging-host',
  '/reference/state-management': '/reference/state-management',
  '/reference/ui-and-design': '/reference/ui-and-design',
  '/reference/crx3-parser-guide': '/reference/crx3-parser-guide',
  
  // Contributing
  '/contributing/style-guide': '/contributing/style-guide',
  '/contributing/golden-principles': '/contributing/golden-principles',
  '/contributing/development-checklist': '/contributing/development-checklist',
  '/contributing/code-quality-checks': '/contributing/code-quality-checks',
  '/contributing/documentation-lifecycle': '/contributing/documentation-lifecycle',
  '/contributing/auto-rules-generation': '/contributing/auto-rules-generation',
  '/contributing/code-quality-standards': '/contributing/code-quality-standards',
  '/contributing/managing-scripts-lifecycle': '/contributing/managing-scripts-lifecycle',
  '/contributing/polylith-migration-roadmap': '/contributing/polylith-migration-roadmap',
  '/contributing/repository-management': '/contributing/repository-management',
  '/contributing/next-development-priorities': '/contributing/next-development-priorities',
  '/contributing/test-the-application': '/contributing/test-the-application',
  '/contributing/tests-reviewer-guide': '/contributing/tests-reviewer-guide',
  '/contributing/qa-roadmap': '/contributing/qa-roadmap',
  '/contributing/release-notes-process': '/contributing/release-notes-process',
  '/contributing/extension-security-guidelines-new': '/contributing/extension-security-guidelines-new',
  '/contributing/extension-security-guidelines': '/contributing/extension-security-guidelines',
  '/contributing/code-audit-resolutions-2025-07': '/contributing/code-audit-resolutions-2025-07',
  '/contributing/circular-dependency-prevention': '/contributing/circular-dependency-prevention',
  '/contributing/security-best-practices': '/contributing/security-best-practices',
  '/contributing/dependency-management': '/contributing/dependency-management',
  '/contributing/CONTRIBUTING': '/contributing/CONTRIBUTING',
  
  // API Reference
  '/api-reference/web-api': '/api-reference/web-api',
  
  // Специальные исправления
  '/code-editor': '/reference/code-editor',
  '/python-integration': '/core-concepts/ai-engine/python-integration',
  '/parser-guide': '/reference/crx3-parser-guide',
  
  // Исправления для shell-core
  '/core-concepts/shell-core/security-principles': '/core-concepts/architecture-patterns/security-principles',
  '/core-concepts/shell-core/mcp-integration': '/reference/mcp-integration',
  '/core-concepts/architecture-patterns/api-management': '/core-concepts/shell-core/api-management',
  '/core-concepts/ui-layer/18-code-editor': '/core-concepts/ui-layer/code-editor',
  '/core-concepts/ai-engine/17-python-integration': '/core-concepts/ai-engine/python-integration',
  '/core-concepts/shell-core/ipc-architecture/ipc-overview': '/core-concepts/shell-core/ipc-architecture',
};

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

function fixMarkdownLinks(content, filePath) {
  let fixed = content;
  let hasChanges = false;

  // Исправляем все ссылки используя маппинг
  for (const [oldPath, newPath] of Object.entries(PATH_MAPPINGS)) {
    const regex = new RegExp(`(\\[.*?\\]\\()${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\))`, 'g');
    if (fixed.includes(oldPath)) {
      const newFixed = fixed.replace(regex, `$1${newPath}$2`);
      if (newFixed !== fixed) {
        hasChanges = true;
        fixed = newFixed;
      }
    }
  }

  // Удаляем ссылки на внешние пути (с ../)
  fixed = fixed.replace(/(\[.*?\]\()\.\.\/[^)]+(\))/g, '');
  if (fixed !== content) hasChanges = true;

  return { content: fixed, hasChanges };
}

console.log('🔧 Final fix for all broken links...');

const markdownFiles = getAllMarkdownFiles(docsPath);
let processedCount = 0;

for (const file of markdownFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const { content: fixedContent, hasChanges } = fixMarkdownLinks(content, file);
  
  if (hasChanges) {
    fs.writeFileSync(file, fixedContent, 'utf-8');
    console.log(`✅ Fixed links in: ${path.relative(process.cwd(), file)}`);
    processedCount++;
  }
}

console.log(`✅ Final fix complete! Processed ${processedCount} files.`); 