# Shloka Yatra 2027 — Deployment Runbook

This runbook outlines the step-by-step procedure for deploying the Shloka Yatra 2027 application to Amazon Web Services (AWS) using infrastructure best practices.

---

## Architecture Overview
- **Frontend**: Single Page Application (Vite + React) hosted on **Amazon S3** and distributed globally via **Amazon CloudFront** CDN with SSL/TLS edge termination.
- **Backend**: Containerised Express.js REST API service deployed on **AWS App Runner** (or Amazon ECS Fargate) running Node.js 20 Alpine with automatic scaling and health monitoring.
- **Database**: **Amazon RDS for PostgreSQL 16 (Multi-AZ)** in a private VPC subnet.
- **DNS & Routing**: **Amazon Route 53** managing apex and subdomain alias routing.

```
Devotee / Browser
        │
        ├───> Route 53 (shllokayatra.com)
        │           │
        │           ├───> CloudFront CDN ───> S3 Bucket (React SPA client)
        │
        └───> Route 53 (api.shllokayatra.com)
                    │
                    └───> AWS App Runner / ALB (Node.js API Container)
                                │
                                └───> RDS PostgreSQL Multi-AZ (Private Subnet)
```

---

## Step 1: Provision the Production Database (Amazon RDS)

1. **Log in to the AWS Management Console** and navigate to RDS in region `ap-south-1` (Mumbai).
2. **Create DB Subnet Group**:
   - Select VPC and at least two subnets across `ap-south-1a` and `ap-south-1b`.
3. **Create Database**:
   - Engine: **PostgreSQL 16.x**
   - Template: **Production**
   - DB instance identifier: `shlloka-yatra-postgres-prod`
   - Master username: `shlloka_admin`
   - Master password: Generate and store securely in AWS Secrets Manager.
   - Instance configuration: `db.t4g.medium` (or `db.m6g.large`).
   - Storage: 20 GB gp3 with storage autoscaling enabled (max 200 GB).
   - Multi-AZ Deployment: **Yes (Create a standby instance)**.
   - Public access: **No** (accessible only within VPC).
   - Security Group: Attach `sg-shlloka-rds` (allow port 5432 only from `sg-shlloka-backend`).
   - Initial database name: `shlloka_yatra_prod`.
4. **Run Schema Migration & Seeding**:
   From a bastion host or secure CI/CD pipeline inside the VPC:
   ```bash
   # Set connection string
   export DATABASE_URL="postgresql://shlloka_admin:PASSWORD@shlloka-yatra-postgres-prod.region.rds.amazonaws.com:5432/shlloka_yatra_prod?sslmode=require"

   # Apply schema DDL
   psql $DATABASE_URL -f deployment/database/001_initial_postgresql_schema.sql

   # Execute clean production seeder (zero demo data)
   node deployment/database/seed_production.js
   ```

---

## Step 2: Deploy the Backend Service (AWS App Runner)

AWS App Runner provides fully managed container execution with built-in HTTPS, health checks, and VPC egress connector.

1. **Create ECR Repository** (or build directly via App Runner source code integration):
   ```bash
   aws ecr create-repository --repository-name shlloka-yatra-backend --region ap-south-1
   ```
2. **Build and Push Backend Container**:
   ```bash
   # Authenticate Docker to ECR
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

   # Build container image from deployment/backend
   cd deployment/backend
   docker build -t shlloka-yatra-backend:v1.0.0 .
   docker tag shlloka-yatra-backend:v1.0.0 <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/shlloka-yatra-backend:latest
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/shlloka-yatra-backend:latest
   ```
3. **Create App Runner Service**:
   - Service name: `shlloka-yatra-api`
   - Image URI: `<AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/shlloka-yatra-backend:latest`
   - CPU: 1 vCPU, Memory: 2 GB
   - Port: `5000`
   - **VPC Connector**: Select VPC and private subnets where RDS is reachable. Attach Security Group `sg-shlloka-backend`.
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `5000`
     - `DATABASE_URL`: Stored via AWS Secrets Manager reference.
     - `JWT_SECRET`: Stored via AWS Secrets Manager reference.
     - `CORS_ORIGIN`: `https://shllokayatra.com,https://www.shllokayatra.com`
     - `FEATURE_OFFLINE_PAYMENT`: `false`
   - **Health Check**:
     - Protocol: `HTTP`
     - Path: `/api/health`
     - Interval: 10s, Timeout: 5s, Healthy threshold: 2, Unhealthy threshold: 3
4. **Configure Custom Domain**:
   - Map `api.shllokayatra.com` to the App Runner service endpoint.
   - Complete DNS validation via Route 53.

---

## Step 3: Deploy Frontend Assets (Amazon S3 & CloudFront)

1. **Create Amazon S3 Bucket**:
   - Bucket name: `shlloka-yatra-frontend-prod`
   - Region: `ap-south-1`
   - Block *all* public access: **Enabled** (All traffic goes through CloudFront Origin Access Control).
2. **Build Production Client Assets**:
   ```bash
   cd client
   # Set API Base URL pointing to deployed App Runner service
   $env:VITE_API_BASE_URL="https://api.shllokayatra.com"
   npm run build
   ```
3. **Upload Assets to S3**:
   ```powershell
   aws s3 sync ../deployment/frontend/dist/ s3://shlloka-yatra-frontend-prod/ --delete
   ```
4. **Create CloudFront Distribution**:
   - Origin: `shlloka-yatra-frontend-prod.s3.ap-south-1.amazonaws.com`
   - Origin Access: **Origin Access Control (OAC)** (AWS automatically generates bucket policy).
   - Viewer Protocol Policy: **Redirect HTTP to HTTPS**.
   - Allowed HTTP Methods: `GET, HEAD, OPTIONS`.
   - Default Root Object: `index.html`.
   - **Custom Error Response (SPA Client Routing)**:
     - HTTP Error Code: `403: Forbidden` -> Response Page Path: `/index.html`, HTTP Response Code: `200: OK`
     - HTTP Error Code: `404: Not Found` -> Response Page Path: `/index.html`, HTTP Response Code: `200: OK`
   - Alternate Domain Names (CNAMEs): `shllokayatra.com`, `www.shllokayatra.com`
   - Custom SSL Certificate: Select ACM certificate issued in `us-east-1`.
5. **Apply S3 Bucket Policy**:
   Apply `deployment/frontend/s3-bucket-policy.json` with the CloudFront Distribution ID populated.
6. **Invalidate CloudFront Cache**:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

---

## Step 4: Route 53 DNS Configuration

1. In Route 53 Hosted Zone for `shllokayatra.com`:
   - Create `A` record for `shllokayatra.com` -> Alias to CloudFront distribution.
   - Create `A` record for `www.shllokayatra.com` -> Alias to CloudFront distribution.
   - Create `A` record for `api.shllokayatra.com` -> Alias to App Runner service (or ALB).
2. Wait for global DNS propagation (typically 1–5 minutes).
