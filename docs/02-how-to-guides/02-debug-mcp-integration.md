# How to Debug MCP Integration

Этот гайд предоставляет быстрый и надежный способ решения 95% проблем с MCP-интеграцией, а также инструменты для глубокого анализа.

## ⚡ Паттерн "Самодиагностика и Самоисцеление" (Решение за 5 минут)

Вместо ручной отладки мы используем простой 3-шаговый процесс, который в большинстве случаев решает проблему автоматически.

### Шаг 1: Запустите скрипт самодиагностики

Откройте терминал в корне проекта и выполните:

```bash
node scripts/debug/test-mcp-tools-fix.js
```

Этот скрипт проверит вашу локальную конфигурацию. Если вы видите `✅ ВСЕ ГОТОВО`, то проблема, скорее всего, не в конфигурации. Если видите ошибку, переходите к шагу 2.

### Шаг 2: Вставьте "лечащий" скрипт в консоль

1. Запустите NEIRA Super App (`yarn start:fast`).
2. Откройте DevTools (F12 или Cmd+Opt+I).
3. Перейдите на вкладку **Console**.
4. **Скопируйте и вставьте туда весь следующий код**, затем нажмите Enter:

```javascript
// MCP Tools Fix - Добавление/обновление production MCP серверов с autoConnect
console.log('🔧 Применяем скрипт самоисцеления MCP...')

const productionServers = [
  \{
    id: 'asana-production',
    name: 'NEIRA Production Server (asana)',
    url: 'https://workflow.neira.sale/mcp/danya-asana/sse',
    type: 'sse',
    autoConnect: true,
  },
  \{
    id: 'workflow-production',
    name: 'NEIRA Production Server (workflow)',
    url: 'https://workflow.neira.sale/mcp/ceaad0bd-9d70-4381-95eb-fd7275735c3b/sse',
    type: 'sse',
    autoConnect: true,
  },
]

try \{
  const currentServers = JSON.parse(
    localStorage.getItem('mcp-servers-store') || '\{"state":\{"servers":[]}}',
  ).state.servers
  productionServers.forEach((server) => \{
    const existingIndex = currentServers.findIndex((s) => s.id === server.id)
    if (existingIndex >= 0) \{
      Object.assign(currentServers[existingIndex], server)
      console.log('🔄 Обновлен сервер:', server.name)
    } else \{
      currentServers.push(server)
      console.log('➕ Добавлен сервер:', server.name)
    }
  })

  const newState = \{ state: \{ servers: currentServers }, version: 0 }
  localStorage.setItem('mcp-servers-store', JSON.stringify(newState))
  console.log('✅ Конфигурация MCP успешно восстановлена!')
} catch (e) \{
  console.error('❌ Не удалось восстановить конфигурацию MCP:', e)
}

console.log('🔄 Пожалуйста, полностью перезапустите NEIRA Super App.')
```

### Шаг 3: Полностью перезапустите приложение

Закройте NEIRA Super App и запустите его снова командой `yarn start:fast`. Это необходимо, чтобы приложение подхватило новую, исправленную конфигурацию.

---

## 2. Глубокий анализ (для разработчиков)

Если 5-минутное решение не помогло, следуйте этому 6-этапному процессу для глубокой диагностики.

### Pre-Debug Checklist

Before you start, ensure that:

- The project builds successfully: `yarn build`.
- All dependencies are installed: `yarn install`.
- Network ports 3000-3010 are free.
- You have a stable internet connection.

### Diagnostic Tools

- **Full-Cycle Script**: For a comprehensive, automated check, run `node scripts/debug/mcp-full-debug-cycle.js`. It tests all stages and generates a detailed report.
- **DevTools Console**: For interactive, real-time checks, use the commands from `scripts/debug/mcp-devtools-console.js` directly in the DevTools Console.

### The 6 Stages of Debugging

1. **Stage 1: MCPManager Initialization**

    - **Goal**: Verify that the `MCPManager` is created, initialized, and has registered its IPC channels.
    - **Check**: Look for `MCPManager initialized` logs at startup. Check the initialization order in `super-app.ts`.

2. **Stage 2: Server Addition**

    - **Goal**: Ensure servers are added correctly, either from defaults or via the UI.
    - **Check**: Verify the `mcp:add-server` IPC calls, check the contents of the `electron-store` (`mcp-servers.json`), and inspect the runtime state in the manager.

3. **Stage 3: Server Connection**

    - **Goal**: Confirm that the application can establish connections (SSE, stdio) to the servers.
    - **Check**: Monitor server status changes in the UI. Look for connection logs and ensure there are no timeouts.

4. **Stage 4: Tool Loading**

    - **Goal**: Check if tools are correctly fetched from connected servers.
    - **Check**: The `status_check` tool should be available for any compliant server. Verify the logic in `prepareMCPTools()` and the handling of SSE responses.

5. **Stage 5: Tool Execution**

    - **Goal**: Test if tools can be executed via the `mcp:execute-tool` IPC channel.
    - **Check**: Manually trigger `status_check` and other tools. Ensure the results are correct and returned without timeouts.

6. **Stage 6: Overall System Health**
    - **Goal**: Get a final picture of the MCP system's health.
    - **Check**: Run the full debug cycle script. A result of 4-6 successful stages indicates a healthy system. 0-1 indicates critical failures.

## 3. When to Escalate

If you have gone through all the steps and the issues persist, gather the following before creating a report:

- The full diagnostic report from `mcp-full-debug-cycle.js`.
- Logs from the DevTools console.
- System information (OS, Node/Yarn versions).
- A detailed description of the problem and the steps to reproduce it.
