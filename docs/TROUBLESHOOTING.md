# Shloka Yatra 2027 — Technical Troubleshooting Guide

This guide provides diagnostic procedures and verified solutions for common development, deployment, network, and database issues.

---

## 1. HTTP 405 Method Not Allowed on Deployed Frontend

### Symptom:
Member registration, login, or booking submission fails on the deployed GitHub Pages site with:
`HTTP 405 Method Not Allowed`

### Root Cause:
GitHub Pages is a static file server designed to serve HTML, CSS, and JS via `GET` and `HEAD` requests. If `VITE_API_BASE_URL` is omitted during the build, API calls default to relative paths (`/api/...`), sending `POST` requests directly to GitHub Pages servers.

### Solution:
1. Deploy the backend Express application to a Node.js cloud host (e.g. AWS App Runner, Render, or a VPS).
2. Obtain your live backend API URL (e.g. `https://api.shloka.com/api`).
3. Add a repository secret in GitHub:
   * **Name:** `VITE_API_BASE_URL`
   * **Value:** `https://api.shloka.com/api`
4. Trigger a new deployment in GitHub Actions so Vite compiles the client with the live backend URL.

---

## 2. Backend Connection Refusal (`ECONNREFUSED` / Port Conflict)

### Symptom:
Browser console displays `Failed to fetch` or `Unable to connect to backend server at http://localhost:5000`.

### Root Cause:
* The backend process is not running.
* A port conflict exists on port 5000 (often Apple AirPlay Receiver on macOS or another local service on Windows).

### Diagnostic & Solution:
1. Check if port 5000 is occupied:
   ```powershell
   # Windows PowerShell
   Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
   ```
2. Kill stale processes if necessary:
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
   ```
3. Restart the backend:
   ```bash
   npm run server
   ```
4. Verify health endpoint in your browser: [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## 3. CORS Network Errors

### Symptom:
Browser blocks API responses with:
`Access to fetch at '...' from origin '...' has been blocked by CORS policy`

### Solution:
1. Check `server/.env` configuration:
   ```ini
   CORS_ORIGIN=http://localhost:5173,https://praveepraveen012-cell.github.io,https://shloka.com
   ```
2. Verify that `server/src/index.js` handles preflight `OPTIONS` requests:
   ```javascript
   app.options('*', cors());
   ```
3. Ensure client requests specify `credentials: 'include'` when sending authentication cookies or tokens.

---

## 4. SQLite Database Locks (`SQLITE_BUSY: database is locked`)

### Symptom:
During high-concurrency local testing, SQLite returns database busy or lock errors.

### Solution:
1. SQLite is a single-writer file database intended for development and automated testing.
2. Ensure write transactions are committed promptly.
3. For production multi-user concurrency on AWS, deploy **Amazon RDS PostgreSQL**, which handles thousands of simultaneous ACID transactions without table locks.

---

## 5. Super Admin Token Expiration & Access Denied

### Symptom:
Admin attempts an action on `/admin/*` and receives `401 Unauthorized` or `403 Forbidden`.

### Solution:
1. Administrative sessions expire automatically after 7 days (`JWT_EXPIRES_IN=7d`).
2. Log out and sign in again via `/admin/login` using `admin@shloka.com` and your updated password.
3. Verify that the authenticated user object in database has role `SUPER_ADMIN`.
