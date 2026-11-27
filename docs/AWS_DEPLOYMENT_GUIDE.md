# Shloka Yatra 2027 — AWS Production Deployment Guide

This guide details the exact architecture, services, provisioning steps, and deployment procedures for hosting Shloka Yatra 2027 on **Amazon Web Services (AWS)**.

---

## 1. AWS Architecture Overview

```
                                  [ Route 53 ]
                           (DNS: shloka.com / api.shloka.com)
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
         [ CloudFront CDN ]                     [ Application Load Balancer ]
       (SSL Certificate via ACM)                    (HTTPS:443 -> Target Group)
                 │                                         │
                 ▼                                         ▼
         [ Amazon S3 Bucket ]                   [ AWS App Runner / Amazon ECS ]
       (Frontend Static Assets)                  (Dockerized Node.js API Server)
                                                           │
                                        ┌──────────────────┴──────────────────┐
                                        ▼                                     ▼
                                [ Amazon RDS PostgreSQL ]             [ Amazon S3 Private ]
                                  (Multi-AZ Database)              (Encrypted Devotee Documents)
```

---

## 2. Recommended AWS Services

1. **Frontend Hosting:**
   * **Amazon S3:** Bucket configured for static website hosting with Block Public Access bypass managed by CloudFront Origin Access Control (OAC).
   * **Amazon CloudFront:** Global Content Delivery Network providing HTTP/3, TLS 1.3, edge caching, and custom domain SSL.
2. **Backend API Hosting:**
   * **AWS App Runner** *(Recommended for simplicity & automatic scaling)*: Fully managed container runtime running the Express API server on Node.js 20.
   * *Alternative:* **Amazon ECS (Fargate)** behind an **Application Load Balancer (ALB)**.
3. **Database Layer:**
   * **Amazon RDS for PostgreSQL 16 (Multi-AZ):** High availability, automatic daily snapshots, encrypted storage (KMS).
4. **Private Document Storage:**
   * **Amazon S3 Private Bucket:** Stores yatri passports, photos, and physician fitness certificates with SSE-KMS encryption and time-limited pre-signed URLs.
5. **DNS & SSL Certificates:**
   * **Amazon Route 53:** Authoritative DNS routing for apex domain and subdomains.
   * **AWS Certificate Manager (ACM):** Free auto-renewing wildcard SSL/TLS certificates (`*.shloka.com`).

---

## 3. Step-by-Step Deployment Procedure

### Phase A: Database Setup (Amazon RDS)
1. In the AWS Management Console, navigate to **RDS** &rarr; **Create database**.
2. Engine: **PostgreSQL 16**.
3. Template: **Production** (Multi-AZ deployment).
4. DB instance identifier: `shloka-yatra-db`.
5. Master username: `shloka_admin`.
6. Enable automatic encryption with AWS KMS.
7. Note the connection endpoint: `shloka-yatra-db.xxxxxx.us-east-1.rds.amazonaws.com`.

### Phase B: Backend API Deployment (AWS App Runner)
1. Prepare the backend container using `deployment/backend/Dockerfile`.
2. Push the Docker image to **Amazon ECR** (Elastic Container Registry):
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t shloka-backend:1.0 deployment/backend/
   docker tag shloka-backend:1.0 <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/shloka-backend:latest
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/shloka-backend:latest
   ```
3. Create an **App Runner Service**:
   * Image repository: ECR `shloka-backend:latest`.
   * Port: `5000`.
   * Configure environment variables (refer to `docs/ENVIRONMENT_VARIABLES.md`).
4. Note the generated service URL (e.g., `https://api.shloka.com` or App Runner default domain).

### Phase C: Database Migration
From a secure workstation or bastion host connected to the VPC:
```bash
$env:DATABASE_URL="postgresql://shloka_admin:<PASSWORD>@shloka-yatra-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/shlloka_yatra?schema=public"
npx prisma db push --schema=deployment/database/schema.prisma
node deployment/database/seed_production.js
```

### Phase D: Frontend Build & S3 Upload
1. Build the production React frontend with the live backend URL:
   ```bash
   cd client
   $env:VITE_API_BASE_URL="https://api.shloka.com/api"
   npm run build
   ```
2. Upload the `client/dist` directory to the Amazon S3 frontend bucket:
   ```bash
   aws s3 sync dist/ s3://shloka-yatra-frontend-prod/ --delete
   ```
3. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
   ```

---

## 4. Post-Deployment Verification Checklist

* [ ] `GET https://api.shloka.com/api/health` returns `{"status":"ok"}`.
* [ ] Devotee registration successfully creates member in RDS PostgreSQL.
* [ ] 8-step booking creates authentic booking reference `SHY-2027-XXXXXX`.
* [ ] Super Admin portal at `https://shloka.com/admin/login` authenticates Super Admin.
* [ ] CORS headers permit only `https://shloka.com` with `credentials: true`.
* [ ] SPA client routing renders without 404 errors on page refresh.
