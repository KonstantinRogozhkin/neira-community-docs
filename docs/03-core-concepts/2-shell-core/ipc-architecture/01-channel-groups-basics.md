# Основы Channel Groups архитектуры

**Родительский документ:** [IPC-архитектура](/03-core-concepts/2-shell-core/06-ipc-architecture)

## 🏛️ Архитектурная диаграмма

```mermaid
graph TD
    subgraph "neira-app (Renderer)"
        A[UI Component] --> B{ipc-api Client}
    end

    B -- ipcRenderer.invoke(channel, ...args) --> C{ipcMain}

    subgraph "shell (Main)"
        C --> D[IPCManager]
        D --> E{Channel Groups}
        E --> F[Business Logic (Managers)]
    end

    subgraph Channel Groups
        direction LR
        G[TabChannels]
        H[WindowChannels]
        I[VoiceChannels]
        J[...]
    end

    style B fill:#333,stroke:#555
    style D fill:#444,stroke:#666
    style E fill:#555,stroke:#777
```

## 🎯 IPCManager как дирижер

`IPCManager` — это легковесный дирижер, а не исполнитель. Его задачи:

1. **Инициализация**: Создает экземпляры всех групп каналов при старте
2. **Внедрение зависимостей**: Предоставляет группам каналов доступ к другим менеджерам
3. **Централизованная регистрация**: Предоставляет метод `registerHandler` для регистрации IPC-обработчиков

## 📋 Структура группы каналов

Каждая группа — это класс, отвечающий за свой домен:

```typescript
// packages/shell/src/main/managers/channels/TabChannels.ts

export class TabChannels {
  private tabManager: TabManager;

  constructor({ tabManager }) {
    this.tabManager = tabManager;
  }

  register(ipcManager: IPCManager) {
    ipcManager.registerHandler('tabs:create', this.handleCreateTab.bind(this));
    ipcManager.registerHandler('tabs:close', this.handleCloseTab.bind(this));
    // ... другие обработчики
  }

  private async handleCreateTab(_event: IpcMainInvokeEvent, options: TabOptions) {
    // 1. Валидация
    if (!options.url) throw new Error('URL is required');
    // 2. Вызов бизнес-логики
    const tab = await this.tabManager.createTab(options);
    // 3. Возврат результата
    return tab.toJSON();
  }
}
```

## 🎨 Принципы дизайна

- **SRP**: Каждый класс отвечает только за свою часть логики
- **Тестируемость**: Каждую группу каналов можно тестировать в изоляции
- **Масштабируемость**: Добавление новой функциональности = новый файл
- **Читаемость**: Код становится самодокументируемым

---

**Модуль создан DOCBUILDER при рефакторинге больших документов**
