# Native Messaging Host Architecture

Version: 2.0 (Post-TypeScript Refactoring)
Status: ✅ Active and Production-Ready

## ⚡ Philosophy

The Native Messaging Host is the secure bridge between the sandboxed world of Chrome Extensions and the powerful capabilities of the main Electron process. Its sole purpose is to provide a robust, secure, and high-performance communication channel, allowing extensions to request actions that they cannot perform themselves (e.g., file system access). This component is architected with an enterprise-grade focus on security, reliability, and structured code.

This architecture is a critical part of the [Chrome Extensions support](/core-concepts/architecture-patterns/system-overview) in NEIRA Super App.

## 1. Core Architecture (TypeScript)

The host was completely rewritten in TypeScript, moving from a simple 27-line script to a 700+ line Object-Oriented, fully-typed architecture.

### Key Components

- **`NativeMessagingHost` Class**: The central class encapsulating all logic. It handles the message loop, parsing, validation, and error handling.
- **Async I/O**: The entire I/O pipeline is asynchronous, using `async/await` instead of blocking synchronous calls. This prevents the host from blocking and ensures high throughput.
- **Structured Logging**: A built-in logging system with timestamps and different levels (INFO, ERROR, DEBUG) provides deep introspection into the host's operations, with the ability to output to a file.
- **Graceful Shutdown**: The host correctly handles shutdown signals, ensuring all resources are cleaned up properly.

## 2. Security (Enterprise-Grade)

Security is the primary design principle of this component. A multi-layered approach protects the application from malicious or poorly-formed messages.

- **Message Size Validation**: A strict 1MB limit is enforced on incoming messages to prevent DoS attacks using large payloads.
- **DoS Timeout Protection**: The host implements timeouts to protect against clients that open a connection but never send data.
- **Strict Origin Checks**: The host's manifest (`manifest.json`) defines a strict list of `allowed_origins`, and this is the first line of defense.
- **Typed Error Codes**: The host uses specific, typed error codes for different failure modes (e.g., `INVALID_MESSAGE_LENGTH`, `JSON_PARSE_ERROR`, `STDIO_READ_ERROR`), allowing clients to react intelligently to failures.

## 3. Message Protocol

The host communicates with extensions over `stdio` using the standard Chrome Native Messaging protocol.

1.  **Input**: The host reads a 4-byte little-endian value indicating the message length, followed by the UTF-8 encoded JSON message.
2.  **Output**: The host sends messages back in the same format: a 4-byte length prefix followed by a JSON payload.

## 4. Build and Deployment

The Native Messaging Host has a dedicated, automated build pipeline.

1.  **TypeScript Compilation**: `npx tsc` compiles the TypeScript source (`main.ts`) into JavaScript (`dist/main.js`).
2.  **SEA Blob Creation**: The compiled JavaScript is converted into a Single Executable Application (SEA) blob.
3.  **Executable Generation**: The blob is injected into a Node.js binary to create a standalone native executable (`crxtesthost_simple`) that requires no external dependencies.

This entire process is managed by the `build.js` script in the `packages/electron-chrome-extensions/script/native-messaging-host/` directory.

## 5. Comprehensive Testing

A dedicated, comprehensive test suite (`chrome-nativeMessaging-security-spec.ts` and `chrome-nativeMessaging-enhanced-spec.ts`) was developed to validate the host's reliability and security. The 16+ automated tests cover:

- **Protocol Compliance**: Validating various data types (strings, numbers, complex objects, Unicode characters).
- **Error Handling Resilience**: Testing behavior with malformed JSON, messages exceeding the size limit, and rapid concurrent messages.
- **Security Boundaries**: Ensuring the host correctly handles security-related edge cases.
- **Performance Benchmarks**: Measuring message processing time to be consistently under 50-100ms.
