# Shloka Yatra 2027 — Database Deployment & Migration Guide

This directory contains the production database schema, initial PostgreSQL DDL scripts, and zero-demo-data production seeding logic for **Amazon RDS for PostgreSQL**.

## Contents
* `schema.prisma`: Production PostgreSQL Prisma schema definition.
* `001_initial_postgresql_schema.sql`: Raw SQL DDL script for direct database provisioning without Prisma CLI.
* `seed_production.js`: Clean production seed script initializing:
  * 8 Official 2027 Departure Batches (May through August).
  * 3 Travel Routes (Classic Overland, Fly to Lhasa, Fly to Lhasa & Ali).
  * 6 Statutory Pricing Tiers.
  * 8 Essential FAQs.
  * 4 Master Legal Contractual Documents.
  * Master Super Admin Account (`admin@shloka.com` with `SUPER_ADMIN`).
  * **Zero demo bookings and zero fake customer accounts.**

## Provisioning on Amazon RDS PostgreSQL
1. Create RDS PostgreSQL 16 instance.
2. Run database migration:
   ```bash
   $env:DATABASE_URL="postgresql://user:password@rds-endpoint:5432/shlloka_yatra?schema=public"
   npx prisma db push --schema=deployment/database/schema.prisma
   ```
3. Run initial production seed:
   ```bash
   node deployment/database/seed_production.js
   ```
