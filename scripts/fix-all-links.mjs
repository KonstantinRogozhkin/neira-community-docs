import fs from 'fs';
import path from 'path';

/**
 * Рекурсивно обходит директорию и исправляет все ссылки в Markdown файлах.
 * @param {string} dir - Путь к директории для сканирования.
 */
const fixAllLinksInDirectory = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixAllLinksInDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Исправляем различные типы ссылок
      
      // 1. Ссылки с числовыми префиксами в начале
      content = content.replace(
        /\[([^\]]+)\]\(\/(\d+-[^)]+)\)/g,
        (match, text, path) => {
          changed = true;
          // Удаляем числовые префиксы из всех сегментов пути
          const cleanPath = path.split('/').map(segment => segment.replace(/^\d+-/, '')).join('/');
          return `[${text}](/${cleanPath})`;
        }
      );
      
      // 2. Относительные ссылки с числовыми префиксами
      content = content.replace(
        /\[([^\]]+)\]\(((\.\.?\/)*\d+-[^)]+\.mdx?)\)/g,
        (match, text, relativePath) => {
          // Создаем абсолютный путь от корня документации
          const absolutePath = path.resolve(path.dirname(fullPath), relativePath);
          const docRoot = path.join(process.cwd(), 'docs');
          let docusaurusPath = path.relative(docRoot, absolutePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
          
          // Удаляем числовые префиксы из всех сегментов пути
          docusaurusPath = docusaurusPath.split('/').map(segment => {
            return segment.replace(/^\d+-/, '');
          }).join('/');
          
          changed = true;
          return `[${text}](/${docusaurusPath})`;
        }
      );
      
      // 3. Ссылки на docs/README - заменяем на корневой путь
      content = content.replace(
        /\[([^\]]+)\]\(\/neira-super-app-2\/docs\/README\)/g,
        (match, text) => {
          changed = true;
          return `[${text}](/)`;
        }
      );
      
      // 4. Другие ссылки с базовым URL, которые нужно исправить
      content = content.replace(
        /\[([^\]]+)\]\(\/neira-super-app-2\/(\d+-[^)]+)\)/g,
        (match, text, path) => {
          changed = true;
          // Удаляем числовые префиксы из всех сегментов пути
          const cleanPath = path.split('/').map(segment => segment.replace(/^\d+-/, '')).join('/');
          return `[${text}](/${cleanPath})`;
        }
      );
      
      // 5. Исправляем ссылки на внешние файлы (например, ../packages/...)
      content = content.replace(
        /\[([^\]]+)\]\(\/neira-super-app-2\/\.\.\/([^)]+)\)/g,
        (match, text, externalPath) => {
          changed = true;
          return `[${text}](https://github.com/neira-org/neira-super-app-2/tree/main/${externalPath})`;
        }
      );
      
      // 6. Исправляем ссылки на несуществующие файлы в templates
      content = content.replace(
        /\[([^\]]+)\]\(\/neira-super-app-2\/templates\/([^)]+)\)/g,
        (match, text, templatePath) => {
          changed = true;
          return `[${text}](https://github.com/neira-org/neira-super-app-2/tree/main/templates/${templatePath})`;
        }
      );
      
      // 7. Исправляем ссылки на ROADMAP и другие корневые файлы
      content = content.replace(
        /\[([^\]]+)\]\(\/neira-super-app-2\/\.\.\/([A-Z]+)\)/g,
        (match, text, fileName) => {
          changed = true;
          return `[${text}](https://github.com/neira-org/neira-super-app-2/blob/main/${fileName})`;
        }
      );

      // 8. Исправляем относительные ссылки без префиксов (самая важная часть!)
      content = content.replace(
        /\[([^\]]+)\]\(([a-z][a-z-]+\/[^)]+)\)/g,
        (match, text, relativePath) => {
          // Проверяем, что это не URL и не начинается с /
          if (!relativePath.startsWith('http') && !relativePath.startsWith('/')) {
            changed = true;
            // Делаем ссылку абсолютной от корня документации
            return `[${text}](/${relativePath})`;
          }
          return match;
        }
      );

      // 9. Удаляем ссылку на несуществующий changelog
      content = content.replace(
        /\[([^\]]+)\]\(\.\/changelog\/[^)]+\)/g,
        (match, text) => {
          changed = true;
          return `**${text}**`; // Заменяем на обычный текст
        }
      );

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed links in: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
};

const DOCS_PATH = path.join(process.cwd(), 'docs');

console.log('🔧 Fixing all broken links in documentation...');
fixAllLinksInDirectory(DOCS_PATH);
console.log('✅ All links have been fixed!'); 