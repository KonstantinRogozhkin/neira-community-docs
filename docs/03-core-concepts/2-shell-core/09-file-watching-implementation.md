# 🔧 File Watching Implementation Details

**Версия:** 2025-07-01 **Статус:** ✅ Technical Reference

Детальная реализация File Watcher в CodeOSSManager с примерами кода и конфигурацией.

---

## 1. Инициализация watcher

```typescript
// packages/shell/src/main/managers/CodeOSSManager.ts
import chokidar from 'chokidar'

export class CodeOSSManager extends BaseManager {
  private fileWatcher?: chokidar.FSWatcher

  private initializeFileWatcher(workspacePath: string) {
    this.fileWatcher = chokidar.watch(workspacePath, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**'
      ],
      persistent: true,
      ignoreInitial: false,
      
      // Конфигурация для стабильности
      useFsEvents: false, // Отключено для избежания fsevents ошибок
      usePolling: false,  // Включается автоматически как fallback
      interval: 1000,     // Интервал polling при необходимости
      binaryInterval: 3000
    })

    this.setupFileWatcherEvents()
  }

  private setupFileWatcherEvents() {
    if (!this.fileWatcher) return

    this.fileWatcher
      .on('add', (path) => {
        this.logger.debug(`File added: ${path}`)
        this.notifyVSCodeOfChange('add', path)
      })
      .on('change', (path) => {
        this.logger.debug(`File changed: ${path}`)
        this.notifyVSCodeOfChange('change', path)
      })
      .on('unlink', (path) => {
        this.logger.debug(`File removed: ${path}`)
        this.notifyVSCodeOfChange('unlink', path)
      })
      .on('error', (error) => {
        this.logger.error('File watcher error:', error)
        this.handleWatcherError(error)
      })
  }
}
```

---

## 2. Обработка ошибок и fallback

```typescript
private handleWatcherError(error: Error) {
  if (error.message.includes('SinceNow') || error.message.includes('fsevents')) {
    this.logger.warn('fsevents error detected, reinitializing with polling')
    
    // Пересоздание watcher с принудительным polling
    this.fileWatcher?.close()
    this.fileWatcher = chokidar.watch(this.currentWorkspace, {
      ...this.watcherOptions,
      useFsEvents: false,
      usePolling: true,
      interval: 1000
    })
    
    this.setupFileWatcherEvents()
  }
}
```

---

## 3. Оптимальная конфигурация

```typescript
// Конфигурация после исправления fsevents
const watcherConfig = {
  useFsEvents: false,    // ← Ключевое исправление для macOS
  usePolling: false,     // Автоматический fallback
  ignoreInitial: false,  // Отслеживание существующих файлов
  persistent: true,      // Поддержание процесса
  atomic: true,          // Ожидание завершения записи
  awaitWriteFinish: {    // Избежание частичных файлов
    stabilityThreshold: 100,
    pollInterval: 50
  }
}
```

---

## 4. Диагностика и мониторинг

```typescript
// Логирование для диагностики
this.fileWatcher
  .on('ready', () => {
    const watched = this.fileWatcher.getWatched()
    const fileCount = Object.values(watched).reduce((sum, files) => sum + files.length, 0)
    this.logger.info(`File watcher ready, watching ${fileCount} files`)
  })
  .on('error', (error) => {
    this.logger.error('File watcher error details:', {
      message: error.message,
      stack: error.stack,
      platform: process.platform,
      chokidarVersion: require('chokidar/package.json').version
    })
  })

// Периодический мониторинг производительности
setInterval(() => {
  const usage = process.cpuUsage()
  const memory = process.memoryUsage()
  
  this.logger.debug('File watcher performance:', {
    cpu: usage,
    memory: memory.heapUsed,
    watchedFiles: this.getWatchedFileCount()
  })
}, 30000) // Каждые 30 секунд
```

---

## 5. Интеграция с VS Code

```typescript
private notifyVSCodeOfChange(eventType: string, filePath: string) {
  // Уведомление VS Code о файловых изменениях
  this.vscodeInstance?.webContents.send('file-system-change', {
    type: eventType,
    path: filePath,
    timestamp: Date.now()
  })
}
```

---

## 6. Технические детали fsevents исправления

**Затронутые зависимости:**
- chokidar@3.6.0
- fsevents@2.3.3

**Альтернативы:**
- Обновление chokidar и fsevents
- Использование другого механизма отслеживания
- Добавление обработки ошибок с автоматическим переключением на polling

---

## 7. Связанные документы

- [File Watching Architecture](/03-core-concepts/2-shell-core/09-file-watching) — Основная архитектура
 