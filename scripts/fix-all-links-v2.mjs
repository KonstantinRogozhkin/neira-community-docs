#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsPath = path.join(__dirname, '..', 'docs');
const srcPath = path.join(__dirname, '..', 'src');

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

function getAllTsxFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
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

  // 1. Исправляем ссылки с числовыми префиксами в путях
  fixed = fixed.replace(/(\[.*?\]\()(\.\.\/)*([^)]*?)(\d+-)([^/)]*)(\/[^)]*)?(\))/g, (match, prefix, dotdot, beforeNum, numPrefix, afterNum, rest, suffix) => {
    hasChanges = true;
    const cleanPath = afterNum + (rest || '');
    return `${prefix}/${cleanPath}${suffix}`;
  });

  // 2. Преобразуем относительные ссылки в абсолютные
  fixed = fixed.replace(/(\[.*?\]\()(?!https?:\/\/)(?!\/)(\.\.\/)*([^)]+)(\))/g, (match, prefix, protocol, dotdot, linkPath, suffix) => {
    if (linkPath.startsWith('#') || linkPath.includes('://')) {
      return match;
    }
    
    hasChanges = true;
    
    // Удаляем числовые префиксы из пути
    let cleanPath = linkPath.replace(/\d+-/g, '');
    
    // Если путь не начинается с /, делаем его абсолютным
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    return `${prefix}${cleanPath}${suffix}`;
  });

  // 3. Исправляем ссылки на README файлы
  fixed = fixed.replace(/(\[.*?\]\()([^)]*?)\/README(\.md)?(\))/g, (match, prefix, path, ext, suffix) => {
    hasChanges = true;
    return `${prefix}${path}/${suffix}`;
  });

  // 4. Удаляем ссылки на несуществующие changelog файлы
  fixed = fixed.replace(/\[.*?\]\([^)]*changelog[^)]*\)/gi, '');

  // 5. Исправляем ссылки на внешние файлы (делаем их GitHub ссылками)
  fixed = fixed.replace(/(\[.*?\]\()\.\.\/([^)]+)(\))/g, (match, prefix, path, suffix) => {
    hasChanges = true;
    return `${prefix}https://github.com/neira-org/neira-super-app-2/tree/main/${path}${suffix}`;
  });

  // 6. Исправляем специфичные проблемные ссылки
  const problemLinks = {
    '/core-concepts/shell-core/security-principles': '/core-concepts/architecture-patterns/security-principles',
    '/core-concepts/shell-core/mcp-integration': '/reference/mcp-integration',
    '/core-concepts/architecture-patterns/api-management': '/core-concepts/shell-core/api-management',
    '/core-concepts/ui-layer/18-code-editor': '/core-concepts/ui-layer/code-editor',
    '/core-concepts/ai-engine/17-python-integration': '/core-concepts/ai-engine/python-integration',
    '/templates/release-note-template': 'https://github.com/neira-org/neira-super-app-2/tree/main/templates/release-note-template',
    '/ROADMAP': 'https://github.com/neira-org/neira-super-app-2/tree/main/ROADMAP'
  };

  for (const [oldLink, newLink] of Object.entries(problemLinks)) {
    const regex = new RegExp(`(\\[.*?\\]\\()${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\))`, 'g');
    if (fixed.includes(oldLink)) {
      fixed = fixed.replace(regex, `$1${newLink}$2`);
      hasChanges = true;
    }
  }

  return { content: fixed, hasChanges };
}

function fixTsxLinks(content, filePath) {
  let fixed = content;
  let hasChanges = false;

  // Исправляем ссылки в TSX файлах
  fixed = fixed.replace(/(to:\s*['"`])([^'"`]*?)(['"`])/g, (match, prefix, linkPath, suffix) => {
    if (linkPath.startsWith('http') || linkPath.startsWith('#')) {
      return match;
    }

    let cleanPath = linkPath;
    
    // Удаляем числовые префиксы
    cleanPath = cleanPath.replace(/\/\d+-/g, '/');
    
    // Исправляем специфичные пути
    if (cleanPath.includes('/docs/README')) {
      cleanPath = '/docs/';
      hasChanges = true;
    }

    if (cleanPath !== linkPath) {
      hasChanges = true;
    }

    return `${prefix}${cleanPath}${suffix}`;
  });

  return { content: fixed, hasChanges };
}

console.log('🔧 Fixing all broken links in documentation (v2)...');

// Обрабатываем markdown файлы
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

// Обрабатываем TSX файлы
const tsxFiles = getAllTsxFiles(srcPath);

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const { content: fixedContent, hasChanges } = fixTsxLinks(content, file);
  
  if (hasChanges) {
    fs.writeFileSync(file, fixedContent, 'utf-8');
    console.log(`✅ Fixed links in: ${path.relative(process.cwd(), file)}`);
    processedCount++;
  }
}

console.log(`✅ All links have been fixed! Processed ${processedCount} files.`); 