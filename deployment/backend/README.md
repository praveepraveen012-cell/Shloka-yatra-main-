# Shloka Yatra 2027 — Backend Deployment Artifacts

This directory contains clean production application files for deploying the Shloka Yatra Express API to AWS App Runner, Amazon ECS, or an Amazon EC2 instance.

## Contents
* `src/`: Clean modular Express routers, middleware, and bootstrap logic.
* `package.json` & `package-lock.json`: Production dependencies definition.
* `Dockerfile`: Multi-stage Alpine container build with non-root security user and health check.
* `.dockerignore`: Exclusion rules preventing build bloat, test files, and local databases from leaking into Docker images.
* `docker-compose.yml`: Local production container emulation paired with PostgreSQL.
* `apprunner.yaml`: Native AWS App Runner runtime configuration specification.

## Deployment Target
* **AWS Service:** AWS App Runner (or Amazon ECS Fargate).
* **Port:** 5000.
* **Health Check Path:** `/api/health`.
