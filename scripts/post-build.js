#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');

console.log('🔧 Running post-build script...');

try {
  // Check if sidepanel.html is in dist/src/ and move it to dist/
  const srcSidepanel = path.join(distDir, 'src', 'sidepanel.html');
  const distSidepanel = path.join(distDir, 'sidepanel.html');
  
  if (fs.existsSync(srcSidepanel)) {
    console.log('📁 Moving sidepanel.html to correct location...');
    fs.renameSync(srcSidepanel, distSidepanel);
    
    // Remove empty src directory
    const srcDir = path.join(distDir, 'src');
    if (fs.existsSync(srcDir) && fs.readdirSync(srcDir).length === 0) {
      fs.rmdirSync(srcDir);
    }
  }
  
  // Copy manifest.json and icons from public/
  const manifest = path.join(publicDir, 'manifest.json');
  const distManifest = path.join(distDir, 'manifest.json');
  
  if (fs.existsSync(manifest)) {
    console.log('📋 Copying manifest.json...');
    fs.copyFileSync(manifest, distManifest);
  }
  
  // Copy all icon files
  const iconFiles = fs.readdirSync(publicDir).filter(file => file.startsWith('icon') && file.endsWith('.png'));
  iconFiles.forEach(iconFile => {
    const srcIcon = path.join(publicDir, iconFile);
    const distIcon = path.join(distDir, iconFile);
    console.log(`🖼️ Copying ${iconFile}...`);
    fs.copyFileSync(srcIcon, distIcon);
  });
  
  // Verify final structure
  console.log('\n✅ Final dist structure:');
  const distFiles = fs.readdirSync(distDir);
  distFiles.forEach(file => {
    console.log(`   📄 ${file}`);
  });
  
  // Verify sidepanel.html exists
  if (fs.existsSync(distSidepanel)) {
    console.log('\n✅ sidepanel.html is correctly placed in dist/ directory');
  } else {
    console.error('\n❌ ERROR: sidepanel.html not found in dist/ directory');
    process.exit(1);
  }
  
  console.log('\n🎉 Post-build script completed successfully!');
  
} catch (error) {
  console.error('❌ Post-build script failed:', error.message);
  process.exit(1);
}