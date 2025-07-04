import fs from 'fs';
import path from 'path';

/**
 * Преобразует имя файла или папки в читаемый заголовок.
 * Удаляет числовой префикс и расширение, заменяет дефисы на пробелы.
 * @param {string} name - Имя файла или папки.
 * @returns {string} - Отформатированный заголовок.
 */
const toTitleCase = (name) => {
  const baseName = path.basename(name, path.extname(name));
  return baseName
    .replace(/^\d+-/, '') // Удалить числовой префикс
    .replace(/-/g, ' ') // Заменить дефисы на пробелы
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Сделать первую букву каждого слова заглавной
};

/**
 * Извлекает ID из frontmatter файла, если он есть
 */
const extractIdFromFrontmatter = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const idMatch = frontmatter.match(/^id:\s*(.+)$/m);
      
      if (idMatch) {
        return idMatch[1].trim();
      }
    }
  } catch (error) {
    // Если не удается прочитать файл, просто возвращаем null
  }
  
  return null;
};

/**
 * Рекурсивно сканирует директорию и создает структуру для сайдбара Docusaurus.
 * @param {string} dir - Путь к директории для сканирования.
 * @param {string} docRoot - Корневой путь к документам для построения ID.
 * @returns {Array<Object>} - Массив элементов сайдбара.
 */
const scanDirectory = (dir, docRoot) => {
  const items = fs.readdirSync(dir);

  items.sort(); // Сортируем по имени файла (с префиксами)

  const sidebarItems = items.map((item) => {
    // Игнорируем файлы, не являющиеся документацией
    if (item.startsWith('.') || item.endsWith('.json')) {
      return null;
    }

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return {
        type: 'category',
        label: toTitleCase(item),
        items: scanDirectory(fullPath, docRoot),
      };
    } else if (item.match(/\.(md|mdx)$/)) {
      // Сначала пытаемся извлечь ID из frontmatter файла
      const frontmatterId = extractIdFromFrontmatter(fullPath);
      
      let docId;
      if (frontmatterId) {
        // Если в frontmatter есть явно заданный ID, используем его
        // Но если это короткий ID (без слешей), добавляем путь к директории
        if (frontmatterId.includes('/')) {
          // Полный путь уже указан в frontmatter
          docId = frontmatterId;
        } else {
          // Короткий ID, добавляем путь директории
          const dirPath = path.relative(docRoot, path.dirname(fullPath)).replace(/\\/g, '/');
          const cleanDirPath = dirPath.split('/').map(segment => segment.replace(/^\d+-/, '')).join('/');
          docId = cleanDirPath ? `${cleanDirPath}/${frontmatterId}` : frontmatterId;
        }
      } else {
        // Иначе генерируем ID автоматически
        docId = path.relative(docRoot, fullPath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
        
        // Docusaurus удаляет числовые префиксы из всех сегментов пути
        docId = docId.split('/').map(segment => {
          return segment.replace(/^\d+-/, '');
        }).join('/');
      }
      
      // Пропускаем README.md, так как он обычно используется как индексная страница категории
      // if (path.basename(docId).toLowerCase() === 'docs/readme') { // Изменено для соответствия новому ID
      //   return null;
      // }
      return {
        type: 'doc',
        id: docId,
        label: toTitleCase(item),
      };
    }
    return null;
  });

  return sidebarItems.filter(Boolean); // Удаляем все null элементы
};

/**
 * Рекурсивно обходит директорию и исправляет относительные ссылки в Markdown файлах.
 * @param {string} dir - Путь к директории для сканирования.
 */
const fixMarkdownLinks = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixMarkdownLinks(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Регулярное выражение для поиска относительных ссылок в Markdown: [текст](./ссылка.md)
      const markdownLinkRegex = /\[([^\]]+)\]\(((\.\.?\/)+[\w\d\-\/]+\.mdx?)\)/g;

      let changed = false;
      const newContent = content.replace(markdownLinkRegex, (match, text, relativePath) => {
        // Создаем абсолютный путь от корня документации
        const absolutePath = path.resolve(path.dirname(fullPath), relativePath);
        
        // Преобразуем его в путь, понятный для Docusaurus (/docs/...)
        const docRoot = path.join(process.cwd(), 'docs');
        const docusaurusPath = path.relative(docRoot, absolutePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
        
        // Docusaurus 3 требует, чтобы пути начинались с /
        const finalPath = docusaurusPath.startsWith('/') ? docusaurusPath : `/${docusaurusPath}`;

        changed = true;
        return `[${text}](${finalPath})`;
      });

      if (changed) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
      }
    }
  }
};


const DOCS_PATH = path.join(process.cwd(), 'docs');

try {
  console.log('Fixing relative links in Markdown files...');
  fixMarkdownLinks(DOCS_PATH);
  console.log('✅ Link fixing complete.');

  console.log(`Scanning directory: ${DOCS_PATH}`);
  const sidebarContent = scanDirectory(DOCS_PATH, DOCS_PATH);

  // Добавляем ссылку на главный README.md в начало
  const rootReadmePath = path.join(DOCS_PATH, 'README.md');
  if (fs.existsSync(rootReadmePath)) {
    sidebarContent.unshift({
      type: 'doc',
      id: 'README', // Изменено для соответствия новому ID, без 'docs/'
      label: 'Introduction',
    });
  }

  const finalSidebarObject = {
    docsSidebar: sidebarContent,
  };

  const fileContent = `/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 THIS FILE IS AUTOGENERATED BY "neira-docs/scripts/generate-sidebar.mjs"
 DO NOT EDIT THIS FILE MANUALLY
 */

const sidebars = ${JSON.stringify(finalSidebarObject, null, 2)};

export default sidebars;
`;
  
  const finalPath = path.join(process.cwd(), 'sidebars.ts');

  fs.writeFileSync(finalPath, fileContent);
  console.log(`✅ Sidebar configuration written to ${finalPath}`);

} catch (error) {
  console.error('Error generating sidebar:', error);
  process.exit(1);
}
