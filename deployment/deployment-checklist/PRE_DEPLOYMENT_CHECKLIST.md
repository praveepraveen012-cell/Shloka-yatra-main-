# Shloka Yatra 2027 — Pre-Deployment Checklist

Before initiating production deployment to Amazon Web Services (AWS), verify every item on this checklist. Do not proceed with the deployment runbook until all mandatory gates are approved.

---

## 1. Domain & DNS Prerequisites
- [ ] Registered domain name available (`shllokayatra.com` or configured subdomains).
- [ ] Route 53 Hosted Zone created and delegation name servers verified with domain registrar.
- [ ] SSL/TLS Certificate requested in AWS Certificate Manager (ACM) in `us-east-1` (mandatory for CloudFront).
- [ ] SSL/TLS Certificate requested in ACM in backend region (e.g., `ap-south-1` Mumbai) for Application Load Balancer / App Runner custom domain.
- [ ] DNS validation CNAME records added and certificates show status `ISSUED`.

---

## 2. AWS Account & IAM Configuration
- [ ] Dedicated AWS Production Account isolated from development/staging environments.
- [ ] IAM Deployment Role / User created with least-privilege policies:
  - Amazon S3 (`s3:PutObject`, `s3:GetObject`, `s3:ListBucket`, `s3:DeleteObject`)
  - Amazon CloudFront (`cloudfront:CreateInvalidation`, `cloudfront:GetDistribution`)
  - AWS App Runner (`apprunner:*`) or Amazon ECS (`ecs:*`, `ecr:*`)
  - Amazon RDS (`rds-db:connect`, `rds:DescribeDBInstances`)
  - AWS Secrets Manager (`secretsmanager:GetSecretValue`)
- [ ] MFA enforced on root and administrative IAM users.
- [ ] AWS Budgets and CloudWatch billing alerts set (e.g., $100, $250 thresholds).

---

## 3. Database Infrastructure (Amazon RDS PostgreSQL)
- [ ] VPC created across at least 2 Availability Zones (Multi-AZ) in `ap-south-1` (Mumbai).
- [ ] Private DB Subnet Group configured (no public IP allocation for RDS).
- [ ] Security Group for RDS created: Inbound PostgreSQL port 5432 allowed *only* from the Backend Security Group.
- [ ] Amazon RDS PostgreSQL 16 instance provisioned (`db.t4g.medium` or `db.m6g.large`).
- [ ] Multi-AZ enabled for high availability and automated failover.
- [ ] Automated backups enabled (7-day or 30-day retention window).
- [ ] Storage auto-scaling enabled (starting at 20 GB gp3 up to 200 GB).

---

## 4. Secrets Management & Environment Variables
Store all production secrets in AWS Secrets Manager or App Runner secure environment configuration:
- [ ] `DATABASE_URL`: `postgresql://app_user:STRONG_PASSWORD@rds-endpoint.region.rds.amazonaws.com:5432/shlloka_yatra_prod?sslmode=require`
- [ ] `JWT_SECRET`: High-entropy 64-character random hexadecimal string.
- [ ] `NODE_ENV`: Set to `production`.
- [ ] `PORT`: `5000` (or App Runner target port).
- [ ] `CORS_ORIGIN`: Exact production domain `https://shllokayatra.com` (and `https://www.shllokayatra.com`).
- [ ] `FEATURE_OFFLINE_PAYMENT`: Set to `'false'` for production launch (or `'true'` only during initial staging sign-off).
- [ ] Third-Party Gateway Secrets:
  - PhonePe / Razorpay Production Key ID & Key Secret
  - Twilio / MSG91 SMS gateway production API keys
  - Google OAuth Client ID & Secret for Devotee Google Sign-In

---

## 5. Security & Build Readiness
- [ ] All automated unit and integration tests passing (`npm run test:all` executes with 100% pass rate).
- [ ] Production frontend build verified (`npm --prefix client run build` succeeds with zero errors, output in `deployment/frontend/dist/`).
- [ ] Frontend API Base URL configured via `VITE_API_BASE_URL` pointing to backend production endpoint (`https://api.shllokayatra.com`).
- [ ] No hardcoded passwords, test tokens, or local file paths in production bundles.
- [ ] Super Admin initial password configured via `INITIAL_ADMIN_PASSWORD` or forced password change enabled on first login.
- [ ] Database schema DDL validated against `deployment/database/001_initial_postgresql_schema.sql`.

---

## Sign-Off Gate
- **Lead DevOps Engineer**: ____________________  Date: ____________
- **Security Auditor**: ____________________  Date: ____________
- **Super Administrator**: ____________________  Date: ____________
