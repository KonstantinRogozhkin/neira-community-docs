# 📜 Working with Logs in NEIRA Super App

> Status: Draft · Last updated January 2025

This guide explains where to find log files, how to change the log level, and how to prettify production logs.

---

## 1. Where are the logs?

- **Desktop (Electron)** – Logs are written to the `logs` directory inside the Electron _userData_ folder (`~/Library/Application Support/NEIRA Super App/logs` on macOS).
- **Development** – When running `yarn start:*` the same directory is used. In addition, coloured console output is available in the terminal.

Each day gets its own file: `app-YYYY-MM-DD.log`.

## 2. Changing log levels

The shell reads two environment variables at startup:

- `DEBUG=true` – Enables DEBUG level for _all_ components.
- `VERBOSE_LOGS=true` – Enables VERBOSE (very chatty) level.

You can pass them via the command line, or add them to your `.env.local`:

```bash
DEBUG=true
```

Front-end components respect the same variables because they forward their logs to the main process via IPC.

## 3. Pretty printing production logs

Raw log files are newline-delimited JSON. To make them easier to read use [`pino-pretty`](https://github.com/pinojs/pino-pretty):

```bash
cat app-2025-07-01.log | npx pino-pretty
```

You can grep for a specific component:

```bash
grep 'app:chat' app-2025-07-01.log | npx pino-pretty
```

## 4. FAQ

**Q: Can I disable a noisy component?**  
Yes – open `packages/shell/src/shared/logger-config.ts` and lower its level to `WARN` or `ERROR`.

**Q: Are logs sent anywhere?**  
No. All logs stay on the local machine unless you add your own transport.

---

> 💡 Tip: Never commit log files – the `.gitignore` already excludes the `logs/` directory.
