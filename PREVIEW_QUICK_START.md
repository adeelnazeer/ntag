# 🚀 Quick Start: Preview Your Mini App

## Fastest Method (Recommended)

### Step 1: Build Your Mini App
```bash
npm run build:miniapp
```

### Step 2: Preview Using Vite
```bash
npm run preview
```
This will open at: **http://localhost:4173**

Open that URL in your browser to see your Mini App!

---

## Alternative Methods

### Method 1: Macle Developer Toolkit
1. Open Macle Developer Toolkit
2. Click "Import Project"
3. Select `dist-miniapp` folder
4. Click "Preview" button ▶️

### Method 2: VS Code Extension
1. Install "Macle Development" extension in VS Code
2. Open `dist-miniapp` folder in VS Code
3. Press `Ctrl+Shift+P`
4. Type: `Macle: Preview Mini App`

### Method 3: Simple HTTP Server
```bash
# Navigate to dist-miniapp
cd dist-miniapp

# Start server (choose one):
# Python 3:
python -m http.server 8000

# Or Node.js (if you have http-server):
http-server -p 8000
```
Then open: **http://localhost:8000**

---

## Quick Commands

```bash
# Build + Convert
npm run build:miniapp

# Preview (easiest!)
npm run preview
```

**That's it! Just run `npm run preview` after building! 🎉**


