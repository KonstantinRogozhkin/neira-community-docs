# Архитектура интеграции с Chrome Web Store

## Метаданные

- **Статус:** Актуально
- **Версия:** 1.0.0
- **Дата обновления:** 2025-06-30
- **Авторы:** DocBuilder AI Assistant

## Обзор

Пакет `electron-chrome-web-store` предоставляет полный цикл управления расширениями Chrome в приложениях Electron. Он позволяет устанавливать, обновлять и управлять расширениями из Chrome Web Store, обеспечивая совместимость с манифестами версии 3.

## Архитектурные компоненты

Пакет состоит из следующих основных компонентов:

### 1. Инициализация и конфигурация

**Ключевой файл:** `src/browser/index.ts`

Компонент отвечает за:

- Инициализацию Chrome Web Store API
- Настройку путей для хранения расширений
- Регистрацию preload-скриптов
- Управление белыми и черными списками расширений

```typescript
// Пример инициализации
installChromeWebStore({
  extensionsPath: '/path/to/extensions',
  allowlist: ['extension-id-1', 'extension-id-2'],
  autoUpdate: true,
  minimumManifestVersion: 3,
})
```

### 2. Установка расширений

**Ключевой файл:** `src/browser/installer.ts`

Компонент отвечает за:

- Загрузку CRX-файлов из Chrome Web Store
- Парсинг и валидацию CRX-формата (поддержка CRX2 и CRX3)
- Распаковку расширений и установку в указанную директорию
- Проверку подписей и идентификаторов расширений

Процесс установки:

1. Формирование URL для загрузки расширения
2. Загрузка CRX-файла
3. Валидация формата и подписи
4. Распаковка и обновление манифеста
5. Загрузка расширения в Electron

### 3. Загрузка расширений

**Ключевой файл:** `src/browser/loader.ts`

Компонент отвечает за:

- Поиск установленных расширений
- Загрузку расширений в сессию Electron
- Управление версиями расширений
- Поддержку распакованных расширений (для разработки)

### 4. Обновление расширений

**Ключевой файл:** `src/browser/updater.ts`

Компонент отвечает за:

- Периодическую проверку обновлений расширений
- Загрузку и установку новых версий
- Управление жизненным циклом обновлений

### 5. API для расширений

**Ключевой файл:** `src/browser/api.ts`

Компонент отвечает за:

- Регистрацию Chrome Web Store API для расширений
- Обработку запросов от расширений на установку/обновление
- Предоставление информации о статусе расширений

## Жизненный цикл расширения

### Установка

1. Пользователь или код вызывает `installExtension(extensionId, options)`
2. Формируется URL для загрузки с серверов Google
3. CRX-файл загружается во временную директорию
4. Проверяется формат и подпись расширения
5. Расширение распаковывается в директорию `extensionsPath/extensionId/version_0`
6. Расширение загружается в сессию Electron
7. Возвращается объект Extension

### Обновление

1. Периодически (или по запросу) вызывается `updateExtensions()`
2. Для каждого установленного расширения:
   - Проверяется наличие обновлений на серверах Google
   - Если доступна новая версия, она загружается и устанавливается
   - Старая версия сохраняется для возможного отката
   - Новая версия загружается в сессию Electron

### Удаление

1. Пользователь или код вызывает `uninstallExtension(extensionId, options)`
2. Расширение выгружается из сессии Electron
3. Директория расширения удаляется с диска

## Безопасность

Пакет реализует следующие механизмы безопасности:

1. **Валидация CRX-файлов**:
   - Проверка формата CRX (поддержка CRX2 и CRX3)
   - Проверка подписи расширения
   - Проверка соответствия ID расширения и публичного ключа

2. **Контроль доступа**:
   - Поддержка белого списка разрешенных расширений (`allowlist`)
   - Поддержка черного списка запрещенных расширений (`denylist`)
   - Callback `beforeInstall` для дополнительной валидации

3. **Проверка манифеста**:
   - Валидация версии манифеста (минимальная поддерживаемая версия)
   - Проверка наличия обязательных полей

## Интеграция с ExtensionsManager

Пакет `electron-chrome-web-store` интегрируется с `ExtensionsManager` в NEIRA Super App следующим образом:

1. `ExtensionsManager` инициализирует Chrome Web Store при запуске:

   ```typescript
   // В ExtensionsManager.ts
   _initialize() {
     installChromeWebStore({
       session: this.session,
       extensionsPath: this.extensionsPath,
       allowlist: this.config.allowedExtensions,
       denylist: this.config.blockedExtensions,
       autoUpdate: this.config.autoUpdate,
     })
   }
   ```

2. `ExtensionsManager` предоставляет методы для управления расширениями:

   ```typescript
   async installExtension(extensionId: string): Promise<Electron.Extension> {
     return installExtension(extensionId, { session: this.session })
   }
   
   async uninstallExtension(extensionId: string): Promise<void> {
     return uninstallExtension(extensionId, { session: this.session })
   }
   
   async updateAllExtensions(): Promise<void> {
     return updateExtensions({ session: this.session })
   }
   ```

## Рекомендации по использованию

1. **Используйте белый список** для контроля устанавливаемых расширений
2. **Включите автоматическое обновление** для получения исправлений безопасности
3. **Используйте callback `beforeInstall`** для дополнительной валидации
4. **Не редактируйте вручную** установленные расширения

## Известные ограничения

1. Не все API Chrome Extensions полностью поддерживаются в Electron
2. Некоторые расширения могут требовать дополнительной настройки для работы
3. Расширения с нативными компонентами могут не работать

## Связанные документы

- [Руководство по установке расширений Chrome](/how-to-guides/installing-chrome-extensions)
- [Справочник по Chrome Extensions API](/reference/chrome-extensions)

---

**Верификация документа**

- **Дата создания:** 2025-06-30
- **Создал:** DocBuilder AI Assistant
- **Источник:** Анализ пакета `electron-chrome-web-store`
- **Проверка актуальности:** Документ отражает текущее состояние кода на 30.06.2025
