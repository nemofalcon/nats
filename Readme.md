# 📦 Permissions Service

A **microservice for managing API key permissions**, built with **Node.js + TypeScript**, using:
- **PostgreSQL** for persistent storage (raw SQL only),
- **NATS.io** for RPC communication (request/reply),
- **NATS Key-Value Store** for caching permissions.

---

## 🚀 Features

- Grant or revoke permissions for API keys (`module`, `action`)
- Check if a key has a specific permission
- List all permissions for a key
- Caching with **NATS KV** to reduce database load
- Fully typed with reusable helper functions
- Structured JSON logging
- Graceful error handling with typed `ErrorCode`

---

## 🛠️ Stack

| Technology     | Purpose                         |
|----------------|----------------------------------|
| Node.js + TS   | Core microservice logic          |
| PostgreSQL     | Data storage (no ORM used)       |
| NATS.io        | RPC request/reply + KV store     |
| NATS KV        | Cache layer for fast lookup      |
| Docker Compose | Local development environment    |

---

## 📂 Project Structure

```
permissions-service/
├── src/
│   ├── handlers/          # RPC Handlers: grant, revoke, check, list
│   ├── lib/               # Shared types, error codes, utils
│   ├── db/                # Raw SQL queries
│   ├── nats/              # NATS connection, KV logic
│   ├── logger.ts          # Structured logger (pino or similar)
│   └── index.ts           # Bootstrap and routing
├── scripts/               # CLI testing scripts
├── docker-compose.yml     # For local Postgres & NATS
└── README.md
```

---

## 🧪 API over NATS (RPC)

### 🔐 `permissions.grant`
Assign permission to API key.
```json
Request:
{
  "apiKey": "abcd-1234",
  "module": "trades",
  "action": "create"
}
Response:
{ "status": "ok" }
```

### ❌ `permissions.revoke`
Remove permission from API key.
```json
Request:
{
  "apiKey": "abcd-1234",
  "module": "trades",
  "action": "create_manual"
}
Response:
{ "status": "ok" }
```

### ✅ `permissions.check`
Check if key has the given permission.
```json
Request:
{ "apiKey": "abcd-1234", "module": "trades", "action": "create" }
Response:
{ "allowed": true }
```

### 📃 `permissions.list`
Get all permissions for a key.
```json
Request:
{ "apiKey": "abcd-1234" }
Response:
{
  "permissions": [
    { "module": "trades", "action": "create" },
    { "module": "trades", "action": "create_manual" }
  ]
}
```

---

## 🧠 Typed Library

This service exposes a **typed utility library** for internal consumption in other services:
- Request/Response types for each topic
- `ErrorCode` enum
- Helper functions for validation and payload building

---

## 🧱 Caching Logic

- Cache is stored in `NATS KV` under bucket `permissions_cache`.
- On `check` and `list`, if data is not cached:
  - Service fetches from PostgreSQL
  - Fills KV store to avoid future DB hits
- On `grant`/`revoke`, cache is updated immediately.

---

## 🪵 Logging Format

All logs are structured JSON:

```json
{
  "timestamp": "2025-08-06T08:00:00Z",
  "level": "info",
  "topic": "permissions.grant",
  "request": { ... },
  "response": { ... },
  "msg": "Permission granted successfully"
}
```

---

## ⚠️ Error Handling

Unified error format with `ErrorCode` enum:

```ts
enum ErrorCode {
  invalid_payload = 'invalid_payload',
  db_error = 'db_error',
  cache_error = 'cache_error',
  apiKey_not_found = 'apiKey_not_found',
  unknown = 'unknown'
}
```

Sample error response:

```json
{
  "error": {
    "code": "db_error",
    "message": "Unable to execute SQL query"
  }
}
```

---

## 🧪 Local Development

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) and Docker Compose

### ▶️ Run Locally

```bash
# Start dependencies
docker-compose up -d  nats

# Install dependencies
npm install

# Build and start
npm run build && npm start 
```
# or
npm run dev 

# I use local postgres if you want to use the same, you can use the following command to start the database

### 🧪 Testing via NATS CLI

Grant permission:
```bash
nats request permissions.grant '{"apiKey": "abcd-1234", "module": "trades", "action": "create"}'
```

List permissions:
```bash
nats request permissions.list '{"apiKey": "abcd-1234"}'
```

---

## 📦 Production Considerations

- Retry + timeout handling on NATS requests
- Persistent KV store configuration
- Auto-reconnect and health checks
- Observability (metrics, tracing if needed)
- Unit + integration test coverage

---

## 👨‍💻 Author

Asliddin Nazarov  
Telegram: [@nemofalcon96](https://t.me/nemofalcon96)  

---

## 📝 License

This project is licensed under the MIT License.