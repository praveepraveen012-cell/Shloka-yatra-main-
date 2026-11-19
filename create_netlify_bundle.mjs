import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'client', 'dist');
const zipOutput = path.join(rootDir, 'Shloka_Yatra_Netlify_Deploy.zip');
const oldZipOutput = path.join(rootDir, 'Shlloka_Yatra_Netlify_Deploy.zip');

console.log('Packaging client/dist into POSIX-compliant Netlify deployment zip...');

if (!fs.existsSync(distDir)) {
  console.error('Error: client/dist directory not found. Please build first.');
  process.exit(1);
}

if (fs.existsSync(zipOutput)) {
  fs.rmSync(zipOutput, { force: true });
}
if (fs.existsSync(oldZipOutput)) {
  fs.rmSync(oldZipOutput, { force: true });
}

// Make sure _redirects exists in distDir
const redirectsPath = path.join(distDir, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  fs.writeFileSync(redirectsPath, '/*    /index.html   200\n', 'utf8');
}

// Use bsdtar (tar.exe) which produces standard POSIX forward slashes in ZIP archives
try {
  execSync(`tar -a -cf "${zipOutput}" -C "${distDir}" * _redirects`, {
    stdio: 'inherit',
    cwd: distDir,
    shell: 'cmd.exe',
  });

  if (fs.existsSync(zipOutput)) {
    const stats = fs.statSync(zipOutput);
    console.log(`\n========================================`);
    console.log(`POSIX-compliant Netlify deployment package created successfully!`);
    console.log(`Archive: ${zipOutput}`);
    console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`========================================\n`);
  }
} catch (err) {
  console.error('Error creating Netlify zip archive with tar:', err.message);
  process.exit(1);
}
