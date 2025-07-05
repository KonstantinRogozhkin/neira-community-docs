# 🎯 Диаграммы взаимодействия менеджеров

**Версия:** 1.0 | **Статус:** ✅ Стандарт | **Дата сжатия:** 2025-06-21

## ⚡ Философия

Менеджеры NEIRA взаимодействуют через четкие IPC-каналы и event-driven архитектуру. Эти диаграммы - **единственный источник правды** о потоках данных в системе. Связь с [Manager Architecture](/core-concepts/architecture-patterns/manager-architecture) и [IPC Architecture](/core-concepts/shell-core/ipc-architecture).

## 🏗️ Архитектура системы

```mermaid
graph TB
    subgraph "🖥️ Main Process (shell)"
        IPCMgr[IPCManager<br/>📡 IPC Router]
        API[APIManager<br/>🤖 AI Proxy]
        MCP[MCPManager<br/>🔌 MCP Tools]
        TM[TabManager<br/>🗂️ Browser Tabs]
        PM[ProcessManager<br/>⚙️ Workers]
    end

    subgraph "🎨 Renderer"
        UI[neira-app<br/>Next.js UI]
    end

    subgraph "⚙️ Workers"
        BW[browser-worker<br/>🌐 CDP]
        AC[agent-core<br/>🤖 gRPC]
    end

    subgraph "🔌 External"
        MCPS[MCP Servers<br/>🛠️ Tools]
        AIP[AI Providers<br/>🧠 LLMs]
    end

    UI <-->|IPC| IPCMgr
    IPCMgr --> API
    IPCMgr --> MCP
    IPCMgr --> TM
    API --> MCP
    API --> AIP
    MCP <-> MCPS
    PM --> BW
    PM --> AC

    class IPCMgr,API,MCP,TM,PM fill:#e1f5fe
    class UI fill:#f3e5f5
    class BW,AC fill:#fff3e0
    class MCPS,AIP fill:#e8f5e8
```

## 💬 AI Chat Flow

```mermaid
sequenceDiagram
    participant UI as neira-app
    participant IPC as IPCManager
    participant API as APIManager
    participant MCP as MCPManager
    participant AI as AI Provider
    participant BE as Backend

    UI->>IPC: invoke('api:chat', {messages, model})
    IPC->>API: handleChat()
    API->>BE: generateText(..., toolExecutor)
    BE->>AI: API request + tools
    AI-->>BE: response + tool_calls

    alt Tool execution needed (delegated to Shell via ToolExecutor)
        BE->>API: toolExecutor.execute()
        API->>MCP: executeToolByName()
        MCP-->>API: tool results
        API->>BE: return tool results
        BE->>AI: follow-up with results
        AI-->>BE: final response
    end

    BE-->>API: {content, toolCalls}
    API-->>IPC: {success: true, content}
    IPC-->>UI: response data
```

## 🔌 MCP Connection Flow

```mermaid
sequenceDiagram
    participant UI as neira-app
    participant IPC as IPCManager
    participant MCP as MCPManager
    participant Server as MCP Server

    UI->>IPC: invoke('mcp:add-server', config)
    IPC->>MCP: addServer()
    MCP->>MCP: configStore.set()
    MCP-->>IPC: {success: true}

    UI->>IPC: invoke('mcp:connect-server', id)
    IPC->>MCP: connectServer()
    MCP->>Server: POST /messages (initialize)
    Server-->>MCP: {capabilities, serverInfo}
    MCP->>Server: POST /messages (tools/list)
    Server-->>MCP: {tools: []}
    MCP->>IPC: webContents.send('mcp:state-update')
    MCP-->>IPC: {success: true}
```

## 🌐 Tab Creation Flow

```mermaid
sequenceDiagram
    participant UI as neira-app
    participant IPC as IPCManager
    participant TM as TabManager
    participant WCV as WebContentsView

    UI->>IPC: invoke('tabs:create', {url})
    IPC->>TM: createTab()
    TM->>TM: findTabByUrl() // Prevent duplicates

    alt New tab needed
        TM->>WCV: new WebContentsView()
        TM->>WCV: setBounds() + loadURL()
        TM->>TM: tabViews.set(tabId, data)
        TM->>IPC: send('tabs:state-update')
    end

    TM-->>IPC: tabId
    IPC-->>UI: {success: true, tabId}
```

## 🎯 Архитектурные принципы

### SSOT (Single Source of Truth)

- **MCPManager** → состояние MCP-серверов
- **TabManager** → состояние вкладок
- **APIManager** → координация AI-запросов

### IPC-First Communication

- Все взаимодействие `neira-app ↔ shell` только через типизированные каналы
- Безопасность через изоляцию процессов
- TypeScript типы в `shared-types`

### Manager Isolation

- Четкие зоны ответственности
- Event-driven коммуникация
- Dependency injection через конструкторы

## 🛠️ Практические правила

### Для разработчиков

1. **Следуйте диаграммам** при добавлении новых потоков
2. **IPC-First** — никаких прямых вызовов между процессами
3. **Используйте паттерны** из существующих диаграмм

### Для code review

1. **Проверьте соответствие** установленным потокам
2. **Убедитесь в error handling** на каждом уровне
3. **Валидируйте типизацию** IPC каналов

---

**Примечание:** Диаграммы отражают архитектуру v2.0 после Polylith миграции. При изменениях архитектуры обновляйте диаграммы соответственно.
