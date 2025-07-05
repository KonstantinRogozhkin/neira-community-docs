# Руководство по работе с CRX3 Parser

**Статус:** Актуально  
**Версия:** 1.1 (Компактная)  
**Дата обновления:** 2025-06-30 (DOCBUILDER рефакторинг)

## Введение

CRX3 Parser — это компонент пакета `electron-chrome-web-store`, отвечающий за парсинг и валидацию файлов расширений Chrome в формате CRX3. CRX3 заменил устаревший CRX2 и добавил улучшенную систему подписей.

## Структура формата CRX3

Файл CRX3 состоит из:

1. **Заголовок** (12 байт):
   - Магическое число: `Cr24`
   - Версия формата: `3`
   - Длина заголовка

2. **Proto-сообщение CrxFileHeader**:
   - Метаданные расширения
   - Публичные ключи и подписи

3. **Архив ZIP**:
   - Файлы расширения
   - `manifest.json` и ресурсы

## Архитектура компонентов

- **Proto Definitions**: `proto/chrome-extensions.proto`
- **Parser**: `packages/electron-chrome-web-store/src/browser/crx3-parser.ts`
- **Generated Types**: `packages/electron-chrome-web-store/src/browser/crx3-generated.ts`

## Основное API

### `parseCrx3File(buffer: Buffer): Promise<ParsedCrx>`

Парсит CRX3 файл и возвращает структуру.

```typescript
import { parseCrx3File } from 'electron-chrome-web-store/src/browser/crx3-parser'

const buffer = await fs.promises.readFile('extension.crx')
const parsed = await parseCrx3File(buffer)

console.log('Extension ID:', parsed.id)
console.log('Manifest:', parsed.manifest)
```

### `validateCrx3Signature(header: CrxFileHeader, id: string): boolean`

Проверяет подпись CRX3 файла.

```typescript
const isValid = validateCrx3Signature(parsed.header, parsed.id)
if (!isValid) {
  throw new Error('Invalid extension signature')
}
```

### `extractCrx3Archive(buffer: Buffer): Promise<Buffer>`

Извлекает ZIP-архив из CRX3 файла.

```typescript
const zipBuffer = await extractCrx3Archive(buffer)
const zip = new AdmZip(zipBuffer)
zip.extractAllTo(outputPath, true)
```

## Типы данных

### `ParsedCrx`

```typescript
interface ParsedCrx {
  id: string                // ID расширения
  header: CrxFileHeader     // Заголовок CRX3
  manifest: ManifestType    // manifest.json
  zipBuffer: Buffer         // ZIP-архив
}
```

### `CrxFileHeader`

```typescript
interface CrxFileHeader {
  sha256WithRsa: SignedData[]    // Подписи RSA
  sha256WithEcdsa: SignedData[]  // Подписи ECDSA
  id: Uint8Array                 // ID расширения
}
```

## Пример установки расширения

```typescript
async function installExtensionFromCrx(crxPath: string, extensionsDir: string): Promise<string> {
  // Чтение и парсинг
  const buffer = await fs.promises.readFile(crxPath)
  const parsed = await parseCrx3File(buffer)
  
  // Валидация подписи
  const isValid = validateCrx3Signature(parsed.header, parsed.id)
  if (!isValid) {
    throw new Error('Invalid extension signature')
  }
  
  // Извлечение и установка
  const zipBuffer = await extractCrx3Archive(buffer)
  const extensionDir = path.join(extensionsDir, parsed.id)
  const zip = new AdmZip(zipBuffer)
  zip.extractAllTo(extensionDir, true)
  
  return parsed.id
}
```

## Работа с метаданными

```typescript
async function getExtensionMetadata(crxPath: string) {
  const buffer = await fs.promises.readFile(crxPath)
  const parsed = await parseCrx3File(buffer)
  
  return {
    id: parsed.id,
    name: parsed.manifest.name,
    version: parsed.manifest.version,
    description: parsed.manifest.description,
    permissions: parsed.manifest.permissions || [],
  }
}
```

## Генерация proto-типов

После изменений в `proto/chrome-extensions.proto`:

```bash
# Генерация TypeScript типов
yarn proto:gen:chrome-extensions

# Проверка сгенерированных файлов
ls packages/electron-chrome-web-store/src/browser/generated/
```

## Обработка ошибок

```typescript
try {
  const parsed = await parseCrx3File(buffer)
  // ... обработка
} catch (error) {
  if (error.message.includes('Invalid CRX3 header')) {
    console.error('Неверный формат файла')
  } else if (error.message.includes('Signature validation failed')) {
    console.error('Недействительная подпись')
  } else {
    console.error('Ошибка парсинга:', error.message)
  }
}
```

## Интеграция с ExtensionsManager

CRX3 Parser интегрирован с `ExtensionsManager` для автоматической установки расширений:

```typescript
// В ExtensionsManager
async installFromCrx(crxPath: string) {
  const extensionId = await installExtensionFromCrx(crxPath, this.extensionsDir)
  await this.loadExtension(extensionId)
  return extensionId
}
```

## Безопасность

- **Валидация подписей**: Все CRX3 файлы проверяются на подлинность
- **Проверка формата**: Строгая валидация структуры файла
- **Изоляция**: Извлечение в изолированные директории
- **Ограничения**: Проверка размера и типов файлов

## Отладка

Для отладки CRX3 парсера используйте:

```typescript
// Включение детального логирования
process.env.DEBUG_CRX3 = 'true'

// Вывод структуры заголовка
console.log('CRX3 Header:', JSON.stringify(parsed.header, null, 2))

// Проверка содержимого ZIP
const entries = zip.getEntries()
entries.forEach(entry => console.log('File:', entry.entryName))
```

## Ограничения

- Поддерживается только формат CRX3 (Chrome 64+)
- Максимальный размер файла: 100MB
- Требуется валидная подпись для установки
- Поддерживаются только Manifest V2 и V3

## Связанные документы

- [Chrome Extensions API](/reference/chrome-extensions)



---

**📝 Примечание:** Документ сокращен DOCBUILDER для соблюдения лимита 250 строк. Полные примеры доступны в исходном коде.
