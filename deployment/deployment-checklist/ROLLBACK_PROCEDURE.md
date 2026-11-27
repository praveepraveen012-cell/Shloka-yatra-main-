# Shloka Yatra 2027 — Production Rollback Procedure

In the event of critical service disruption, database corruption, or fatal release defects discovered during post-deployment verification, follow this immediate rollback procedure.

---

## Rollback Decision Matrix

| Severity Level | Trigger Condition | Immediate Action |
| :--- | :--- | :--- |
| **P0 — Critical** | Database unreachable, payment webhook failure, widespread 500 errors | Execute immediate traffic rollback to previous stable version. |
| **P1 — High** | Specific route booking failures, SPA routing broken on CloudFront | Roll back frontend S3 bucket or backend container image. |
| **P2 — Medium** | Cosmetic UI defects, missing non-critical image assets | Patch forward with hotfix release; rollback not required. |

---

## 1. Backend Service Rollback (AWS App Runner / Container)

If the new backend release causes 500 errors, crashes, or database connection failures:

### Option A: App Runner Deployment Rollback
1. Navigate to **AWS App Runner Console** > `shlloka-yatra-api`.
2. Click **Deployment History**.
3. Select the previous stable deployment ID (e.g., `v1.0.0-stable`).
4. Click **Deploy**.
5. App Runner will route traffic to the previous healthy container image within 60–90 seconds with zero downtime.

### Option B: CLI Image Rollback
```bash
# Tag previous stable image as latest
aws ecr batch-get-image --repository-name shlloka-yatra-backend --image-ids imageTag=v1.0.0-stable --query 'images[].imageManifest' --output text > manifest.json
aws ecr put-image --repository-name shlloka-yatra-backend --image-tag latest --image-manifest file://manifest.json

# Trigger App Runner deployment
aws apprunner start-deployment --service-arn <SERVICE_ARN>
```

---

## 2. Frontend S3 & CloudFront Rollback

If the new frontend build introduces breaking client errors:

1. **Re-sync Previous Build from S3 Versioning or Backup**:
   If S3 Bucket Versioning is enabled:
   ```bash
   # Restore previous index.html version
   aws s3api get-object --bucket shlloka-yatra-frontend-prod --key index.html --version-id <PREVIOUS_VERSION_ID> index.html
   aws s3 cp index.html s3://shlloka-yatra-frontend-prod/index.html
   ```
2. **Or Re-deploy Previous Build Folder**:
   ```powershell
   # Deploy previous stable dist build
   aws s3 sync ./backup/dist-stable/ s3://shlloka-yatra-frontend-prod/ --delete
   ```
3. **Invalidate CloudFront Cache Immediately**:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

---

## 3. Database Recovery (Point-in-Time Recovery - PITR)

If database integrity has been compromised or destructive operations occurred:

1. **Do NOT run destructive SQL scripts.**
2. Navigate to **RDS Console** > Databases > `shlloka-yatra-postgres-prod`.
3. Click **Actions** > **Restore to point in time**.
4. Select restore time: Set timestamp to 5 minutes prior to the deployment start time.
5. Restore to new DB instance identifier: `shlloka-yatra-postgres-restored`.
6. Once restored, update the `DATABASE_URL` environment variable in AWS App Runner to point to the restored DB instance.
7. Restart the backend service.

---

## 4. Post-Rollback Communication

1. Notify the Incident Management team and executive stakeholders.
2. Confirm live application health using `POST_DEPLOYMENT_VERIFICATION.md`.
3. Preserve all container logs, CloudWatch traces, and RDS logs for post-mortem analysis.
4. Schedule engineering review to reproduce and remediate the root cause before rescheduling deployment.
