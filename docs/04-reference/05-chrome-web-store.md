# Интеграция с Chrome Web Store

## Обзор

NEIRA Super App поддерживает установку и обновление расширений Chrome непосредственно из официального Chrome Web Store, что значительно расширяет функциональность приложения и улучшает пользовательский опыт. Эта возможность реализована через пакет `electron-chrome-web-store`.

## 🏛️ Архитектура

Версия: 1.0 (2025-08-02)  
Статус: ✅ **Действующий стандарт**

## ⚡ Философия

Интеграция с Chrome Web Store является важным компонентом экосистемы расширений NEIRA Super App. Она позволяет пользователям устанавливать и обновлять расширения из официального источника, обеспечивая безопасность и актуальность используемых расширений. Пакет `electron-chrome-web-store` разработан для обеспечения надежного и безопасного взаимодействия с Chrome Web Store API.

## 🗺️ Архитектура: Взаимодействие с ExtensionsManager

Пакет `electron-chrome-web-store` тесно интегрирован с `ExtensionsManager`, который является центральным компонентом управления расширениями в NEIRA Super App. `ExtensionsManager` использует три ключевых пакета-сателлита:

- `electron-chrome-extensions`: Ядро, эмулирующее API Chrome Extensions.
- `electron-chrome-web-store`: Утилита для скачивания и установки расширений из Chrome Web Store.
- `electron-chrome-context-menu`: Управляет интеграцией пунктов меню от расширений в общее контекстное меню.

## ⚙️ Возможности пакета

`electron-chrome-web-store` предоставляет следующие возможности:

- **Установка расширений** из Chrome Web Store по ID расширения
- **Автоматическое обновление** установленных расширений
- **Управление белым и черным списками** расширений для контроля доступа
- **Поддержка манифестов версии 3** для совместимости с современными расширениями
- **Интеграция с Electron API** для бесшовной работы расширений

## 🛡️ Технические детали реализации

### Установка расширений

Расширения устанавливаются в директорию `Extensions` в `userData` приложения. Процесс установки включает следующие шаги:

1. Запрос информации о расширении из Chrome Web Store
2. Проверка совместимости расширения с приложением
3. Скачивание CRX файла расширения
4. Распаковка и установка расширения
5. Регистрация расширения в `ExtensionsManager`

### Автоматическое обновление

Автоматическое обновление расширений происходит каждые 3 часа. Процесс обновления включает:

1. Получение списка установленных расширений
2. Проверка наличия обновлений для каждого расширения
3. Скачивание и установка обновлений
4. Перезагрузка обновленных расширений

### Управление белым и черным списками

Пакет поддерживает управление белым и черным списками расширений для контроля доступа:

```typescript
installChromeWebStore({
  // Белый список разрешенных расширений
  allowlist: ['extension-id-1', 'extension-id-2'],
  
  // Черный список запрещенных расширений
  blocklist: ['malicious-extension-id'],
  
  // Автоматическое обновление расширений
  autoUpdate: true,
})
```

### Поддержка манифестов версии 3

Пакет полностью поддерживает расширения с манифестами версии 3, которые используют современные API Chrome Extensions.

## 🔧 Proto файлы и генерация кода

Для безопасного и типизированного взаимодействия с Chrome Web Store API и CRX файлами используется единый источник правды в виде proto-определений:

### Единый источник правды

Все определения proto находятся в `proto/chrome-extensions.proto`. Этот файл содержит:

- **CRX3 File Format**: Структуры для работы с упакованными расширениями Chrome
- **Chrome Web Store API**: Контракты для установки и управления расширениями
- **Extension Manifest**: Типизированные определения manifest.json

### Генерация кода

После изменения proto-файлов необходимо запустить генерацию кода:

```bash
# Генерация всех proto файлов
yarn proto:gen

# Только для Chrome Extensions
yarn proto:gen:chrome-extensions
```

Сгенерированные файлы помещаются в:
- `packages/electron-chrome-web-store/src/browser/generated/chrome-extensions_pb.js` - основной сгенерированный файл
- `packages/electron-chrome-web-store/src/browser/crx3-generated.ts` - TypeScript типы и функции для работы с proto

### Правила работы с proto

1. **Никогда не редактируйте** сгенерированные файлы вручную
2. **Все изменения** вносите только в `proto/chrome-extensions.proto`
3. **После изменений** обязательно запускайте генерацию кода
4. **Для обратной совместимости** используйте экспорты из `crx3.ts`

## 📚 Примеры использования

### Базовое использование

```typescript
import { app } from 'electron'
import { installChromeWebStore } from 'electron-chrome-web-store'

app.whenReady().then(() => {
  // Настройка и инициализация Chrome Web Store
  installChromeWebStore({
    // Опционально: настройка пути для хранения расширений
    extensionsPath: '/path/to/extensions',

    // Опционально: белый список разрешенных расширений
    allowlist: ['extension-id-1', 'extension-id-2'],

    // Автоматическое обновление расширений
    autoUpdate: true,
  })
})
```

### Интеграция с ExtensionsManager

```typescript
import { ExtensionsManager } from './ExtensionsManager'
import { installChromeWebStore } from 'electron-chrome-web-store'

export class MyExtensionsManager extends ExtensionsManager {
  async initialize() {
    // Инициализация базового менеджера расширений
    await super.initialize()
    
    // Настройка и инициализация Chrome Web Store
    installChromeWebStore({
      extensionsPath: this.extensionsPath,
      allowlist: this.allowlist,
      autoUpdate: true,
      
      // Обработчик событий
      onExtensionInstalled: (extensionId) => {
        this.logger.info(`Расширение ${extensionId} установлено`)
        // Дополнительные действия после установки расширения
      },
      
      onExtensionUpdated: (extensionId) => {
        this.logger.info(`Расширение ${extensionId} обновлено`)
        // Дополнительные действия после обновления расширения
      },
      
      onError: (error) => {
        this.logger.error(`Ошибка при работе с Chrome Web Store: ${error.message}`)
        // Обработка ошибок
      }
    })
  }
}
```

### Установка расширения по запросу пользователя

```typescript
import { installExtension } from 'electron-chrome-web-store'

// Обработчик запроса на установку расширения
async function handleInstallExtension(extensionId: string) {
  try {
    // Установка расширения
    const extension = await installExtension(extensionId)
    console.log(`Расширение ${extension.name} (${extensionId}) установлено`)
    return extension
  } catch (error) {
    console.error(`Ошибка при установке расширения ${extensionId}:`, error)
    throw error
  }
}
```

## 🧪 Тестирование

### Автоматизированные тесты

```bash
# Запуск тестов для Chrome Web Store
npm test -- chrome-web-store-spec.ts

# Тестирование интеграции с ExtensionsManager
npm test -- extensions-manager-web-store-spec.ts
```

### Проверенные расширения

- **1Password**: Полная поддержка через Native Messaging
- **uBlock Origin**: Работает с chrome.storage.sync
- **Dark Reader**: Совместим с BackgroundScriptManager

## 📝 Связанные файлы

- `packages/shell/src/main/managers/ExtensionsManager.ts`
- `packages/shell/src/main/managers/channels/ExtensionChannels.ts`
- `packages/shell/src/types/electron-chrome-web-store.d.ts`
- `packages/neira-app/lib/ipc-clients/extensions-client.ts`
- `packages/shared-types/src/index.ts`
- `docs/04-reference/02-chrome-extensions.md`
- `tests/1_integration/chrome-web-store.spec.ts`

---

**Верификация документа**

- **Дата создания:** 2025-08-02
- **Обновлено:** 2025-08-02
- **Создал:** DocBuilder AI Assistant
- **Источник:** 
  - `packages/electron-chrome-web-store/README.md`
  - `docs/changelog/chrome-web-store-integration.md`
  - `docs/04-reference/02-chrome-extensions.md`
- **Проверка актуальности:** Документ отражает текущее состояние интеграции с Chrome Web Store на 02.08.2025 