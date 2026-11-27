# Shloka Yatra 2027 — Developer Installation & Setup Guide

This guide describes how to install, configure, and run the Shloka Yatra 2027 application locally from scratch on Windows, macOS, or Linux.

---

## 1. Prerequisites

Ensure the following tools are installed on your workstation:
* **Node.js:** v18.0.0 or v20.x (Recommended: Node.js 20 LTS).
* **Package Manager:** npm (v9+ or v10+ included with Node.js).
* **Git:** Version control client.
* **Terminal Shell:** PowerShell (Windows), Bash, or Zsh (macOS/Linux).

Verify versions:
```bash
node -v
npm -v
git --version
```

---

## 2. Clone and Directory Structure

```bash
git clone https://github.com/praveepraveen012-cell/Shloka-yatra-main-.git
cd Shloka-yatra-main-
```

Project workspace structure:
```
Shloka-yatra-main-/
├── client/              # React + Vite frontend application
│   ├── src/             # Frontend source components, pages, services
│   └── package.json     # Client dependencies and build scripts
├── server/              # Express + Node.js backend application
│   ├── src/             # Modular routers, middleware, bootstrap
│   ├── tests/           # Automated API & unit test suites
│   └── package.json     # Server dependencies and test runner
├── prisma/              # Prisma database schema and migrations
│   └── schema.prisma    # Complete database model specifications
├── docs/                # Comprehensive architectural and user manuals
├── scripts/             # Administrative and database maintenance utilities
├── package.json         # Root orchestration scripts
└── .env.example         # Reference environment variables
```

---

## 3. Installing Dependencies

Run the automated root setup command to install dependencies across the root, client, and server workspaces:

```bash
npm run install:all
```

Or manually install each workspace:
```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

---

## 4. Environment Configuration

1. Copy `.env.example` to `.env` in the root and in the `server/` directory:
   ```bash
   cp .env.example server/.env
   ```
2. Key settings for local development:
   ```ini
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   DATABASE_URL="file:../prisma/dev.db"
   JWT_SECRET=shloka_secure_jwt_local_secret_2027
   ENABLE_OFFLINE_TEST_PAYMENT=true
   ```

---

## 5. Database Initialization

Generate the Prisma Client and push the schema to SQLite:

```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma db push --schema=prisma/schema.prisma
```

*(Optional)* To seed initial packages, departure batches, and FAQs for a new installation:
```bash
npm run seed
```

---

## 6. Running Locally

### Development Mode (Concurrent Vite + Express)
Open two terminal tabs:

**Terminal 1 (Backend API Server):**
```bash
npm run server
# Listening on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Vite development server running on http://localhost:5173
```

### Production Preview Mode (Unified Single Port)
Build the frontend client and run the unified Express server:
```bash
npm run build
npm start
# Both frontend and backend served together on http://localhost:5000
```

---

## 7. Verifying the Installation

1. Open your browser and navigate to: [http://localhost:5173](http://localhost:5173).
2. Check backend health: [http://localhost:5000/api/health](http://localhost:5000/api/health) (Status: `ok`).
3. Log in to the Super Admin Portal: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
   * **Email:** `admin@shloka.com`
   * **Password:** `Shloka#2027$Admin!`
