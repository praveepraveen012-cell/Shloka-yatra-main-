# Shloka Yatra 2027 — Frontend AWS S3 + CloudFront Deployment Script
param (
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$true)]
    [string]$DistributionId,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiBaseUrl = "https://api.shloka.com/api"
)

Write-Host "=== SHLOKA YATRA 2027 FRONTEND DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "1. Building React SPA with VITE_API_BASE_URL=$ApiBaseUrl..."
$env:VITE_API_BASE_URL = $ApiBaseUrl
npm --prefix client run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Client build failed. Aborting deployment."
    exit 1
}

Write-Host "2. Syncing client/dist to S3 Bucket s3://$BucketName/..."
aws s3 sync client/dist/ "s3://$BucketName/" --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html" --exclude "404.html"
aws s3 cp client/dist/index.html "s3://$BucketName/index.html" --cache-control "no-cache, no-store, must-revalidate"
aws s3 cp client/dist/404.html "s3://$BucketName/404.html" --cache-control "no-cache, no-store, must-revalidate"

Write-Host "3. Creating CloudFront Invalidation for Distribution $DistributionId..."
aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"

Write-Host "Frontend deployment completed successfully!" -ForegroundColor Green
