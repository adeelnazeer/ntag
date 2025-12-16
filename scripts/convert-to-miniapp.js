/**
 * HTML to Mini App Converter Script
 * This script converts the existing web portal to Mini App format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Convert HTML/React components to Mini App compatible format
 */
function convertToMiniApp() {
  console.log('🚀 Starting HTML to Mini App conversion...');

  // Create output directory
  const outputDir = path.join(rootDir, 'dist-miniapp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Copy configuration files
  const configFiles = ['app.json', 'sitemap.json', 'project.config.json'];
  configFiles.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(outputDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file}`);
    }
  });

  // Copy built assets from dist directory if it exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const assetsDir = path.join(outputDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Copy index.html
    const indexHtml = path.join(distDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      fs.copyFileSync(indexHtml, path.join(outputDir, 'index.html'));
      console.log('✅ Copied index.html');
    }

    // Copy assets directory
    const distAssets = path.join(distDir, 'assets');
    if (fs.existsSync(distAssets)) {
      const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
              path.join(src, childItemName),
              path.join(dest, childItemName)
            );
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };
      copyRecursiveSync(distAssets, assetsDir);
      console.log('✅ Copied assets directory');
    }

    // Copy other static files
    const staticFiles = ['fav.jpeg', 'vite.svg'];
    staticFiles.forEach(file => {
      const srcPath = path.join(distDir, file);
      const destPath = path.join(outputDir, file);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${file}`);
      }
    });
  } else {
    console.log('⚠️  dist/ directory not found. Please run "npm run build" first.');
  }

  // Create pages directory structure
  const pagesDir = path.join(outputDir, 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  // Create utils directory for Mini App utilities
  const utilsDir = path.join(outputDir, 'utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  // Create Mini App API wrapper
  const apiWrapper = `/**
 * Mini App API Wrapper
 * Wraps web APIs to work with Mini App environment
 */

// Mini App API methods
export const miniAppAPI = {
  // Request wrapper
  request: (options) => {
    // Use Mini App request API if available
    if (typeof wx !== 'undefined' && wx.request) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: options.url,
          method: options.method || 'GET',
          data: options.data || {},
          header: options.headers || {},
          success: (res) => resolve(res),
          fail: (err) => reject(err),
        });
      });
    }
    // Fallback to fetch for web
    return fetch(options.url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.data ? JSON.stringify(options.data) : undefined,
    }).then(res => res.json());
  },

  // Navigation wrapper
  navigateTo: (url) => {
    if (typeof wx !== 'undefined' && wx.navigateTo) {
      wx.navigateTo({ url });
    } else {
      window.location.href = url;
    }
  },

  // Show toast
  showToast: (message, duration = 2000) => {
    if (typeof wx !== 'undefined' && wx.showToast) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration,
      });
    } else {
      alert(message);
    }
  },

  // Get user info
  getUserInfo: () => {
    if (typeof wx !== 'undefined' && wx.getUserInfo) {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success: (res) => resolve(res.userInfo),
          fail: (err) => reject(err),
        });
      });
    }
    return Promise.resolve({});
  },
};

export default miniAppAPI;
`;

  fs.writeFileSync(path.join(utilsDir, 'miniapp-api.js'), apiWrapper);
  console.log('✅ Created Mini App API wrapper');

  console.log('✨ Conversion completed!');
  console.log(`📦 Output directory: ${outputDir}`);
  console.log('📝 Next steps:');
  console.log('   1. Review the generated files in dist-miniapp/');
  console.log('   2. Use Macle Developer Toolkit to test the Mini App');
  console.log('   3. Package and submit for review');
}

// Run conversion
convertToMiniApp();

