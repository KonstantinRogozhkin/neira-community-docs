#!/usr/bin/env node

/**
 * Скрипт собирает markdown-документацию из соседних репозиториев
 * и копирует её в папку `docs/<repo>/` текущего сайта Docusaurus.
 * На CI этот скрипт можно заменить загрузкой .tar.gz из GitHub.
 */

import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { cpSync, rmSync, existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const repos = [
  { name: 'neira-cli', path: '../../neira-cli/docs' },
  { name: 'neira-core', path: '../../neira-core/docs' },
  { name: 'neira-cloud-backend', path: '../../neira-cloud-backend/docs' },
  { name: 'neira-apps', path: '../../neira-apps/docs' },
  { name: 'neira-enterprise', path: '../../neira-enterprise/docs' },
];

const destRoot = resolve(__dirname, '..', 'docs');

for (const repo of repos) {
  const source = resolve(__dirname, repo.path);
  if (!existsSync(source)) {
    console.warn(`⏩  Пропускаю ${repo.name}: docs не найдены (${source})`);
    continue;
  }

  const dest = join(destRoot, repo.name);

  // Очищаем старую версию
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  // Копируем рекурсивно
  cpSync(source, dest, { recursive: true });
  console.log(`✅  ${repo.name} → ${dest}`);
}

console.log('📚  Документация собрана успешно.'); 