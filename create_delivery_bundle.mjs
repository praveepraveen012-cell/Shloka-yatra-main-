import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const bundleDir = path.join(rootDir, 'Shloka_Yatra_Delivery_Package');
const zipOutput = path.join(rootDir, 'Shloka_Yatra_2027_Core_Files.zip');
const oldZipOutput = path.join(rootDir, 'Shlloka_Yatra_2027_Core_Files.zip');

console.log('Preparing clean deliverable package for higher authority...');

// Clean previous bundle if exists
if (fs.existsSync(bundleDir)) {
  fs.rmSync(bundleDir, { recursive: true, force: true });
}
if (fs.existsSync(zipOutput)) {
  fs.rmSync(zipOutput, { force: true });
}
if (fs.existsSync(oldZipOutput)) {
  fs.rmSync(oldZipOutput, { force: true });
}

fs.mkdirSync(bundleDir, { recursive: true });

// Copy function with exclusions
function copyDirectory(src, dest, ignoreList = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (ignoreList.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy Client (excluding node_modules and dist)
console.log('Copying client files...');
copyDirectory(
  path.join(rootDir, 'client'),
  path.join(bundleDir, 'client'),
  ['node_modules', 'dist', '.vite']
);

// 2. Copy Server (excluding node_modules)
console.log('Copying server files...');
copyDirectory(
  path.join(rootDir, 'server'),
  path.join(bundleDir, 'server'),
  ['node_modules']
);

// 3. Copy Root files
const rootFiles = [
  'package.json',
  'README.md',
  '.gitignore',
  'HANDOVER_GUIDE.md',
  'Shlloka_Yatra_2027_Executive_Handover_Guide.html',
  'Shlloka_Yatra_2027_Executive_Handover_Guide.docx'
];
for (const f of rootFiles) {
  const p = path.join(rootDir, f);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(bundleDir, f));
  }
}

// Copy any reference documents if present
const refDocs = fs.readdirSync(rootDir).filter(f => f.endsWith('.docx') || f.endsWith('.pdf'));
for (const doc of refDocs) {
  fs.copyFileSync(path.join(rootDir, doc), path.join(bundleDir, doc));
}

console.log('Files gathered in staging directory. Creating ZIP archive...');

// Create ZIP using .NET ZipFile (instant & zero console progress issues)
try {
  execSync(
    `powershell -Command "$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${bundleDir}', '${zipOutput}')"`,
    { stdio: 'inherit' }
  );
  if (fs.existsSync(zipOutput)) {
    const stats = fs.statSync(zipOutput);
    console.log(`\nSuccessfully created delivery archive: ${zipOutput}`);
    console.log(`Archive Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  }
} catch (err) {
  console.error('Error creating zip archive:', err.message);
} finally {
  // Clean up staging folder
  if (fs.existsSync(bundleDir)) {
    fs.rmSync(bundleDir, { recursive: true, force: true });
  }
}
