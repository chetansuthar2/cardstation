#!/usr/bin/env node

/**
 * Script to approve build scripts for packages like sharp
 * This can be run manually if needed during deployment
 */

const { execSync } = require('child_process');

try {
  console.log('Attempting to approve build scripts for sharp...');
  
  // Try to approve builds using pnpm
  try {
    execSync('pnpm approve-builds sharp', { stdio: 'inherit' });
    console.log('✅ Successfully approved build scripts for sharp');
  } catch (error) {
    console.log('ℹ️ No packages awaiting approval or pnpm approve-builds not available');
  }
  
  // Alternative: try to install with explicit flags
  try {
    console.log('Installing with explicit build script permissions...');
    execSync('pnpm install --unsafe-perm --enable-pre-post-scripts', { stdio: 'inherit' });
    console.log('✅ Installation completed with build script permissions');
  } catch (error) {
    console.log('⚠️ Could not install with pnpm flags:', error.message);
  }
  
} catch (error) {
  console.error('❌ Error in approve-builds script:', error.message);
  process.exit(1);
}
