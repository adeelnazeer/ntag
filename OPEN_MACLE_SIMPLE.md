# 🚀 How to Open Macle Developer Toolkit - Simple Guide

## Quick Steps

### 1. Download Macle Developer Toolkit

**Go to Ethio Telecom Developer Portal:**
- Visit: https://developer.ethiotelecom.et
- Log in (or register if you don't have an account)
- Navigate to **"Doc"** → **"Mini App Development Guide"**
- Look for **"Macle Developer Toolkit"** download link
- Download for your operating system (Windows/Mac/Linux)

### 2. Install the Toolkit

**Windows:**
- Double-click the downloaded `.exe` file
- Follow installation wizard
- Click "Install"

**Mac:**
- Open the downloaded `.dmg` file
- Drag to Applications folder
- Open from Applications

**Linux:**
- Make executable: `chmod +x Macle-Developer-Toolkit.AppImage`
- Run: `./Macle-Developer-Toolkit.AppImage`

### 3. Open Macle Developer Toolkit

**After Installation:**
- **Windows**: Start Menu → Search "Macle" → Click it
- **Mac**: Applications → "Macle Developer Toolkit"
- **Linux**: Application menu → "Macle Developer Toolkit"

### 4. Open Your Mini App Project

1. In Macle Developer Toolkit, click **"Import Project"** or **"Open Project"**
2. Navigate to: `E:\D Drive\NTag-portal\dist-miniapp`
3. **Important**: Select the `dist-miniapp` folder (not the root folder)
4. Click "Open"
5. Wait for it to load
6. Use the preview button to test your Mini App!

## Alternative: VS Code Extension

If you prefer VS Code:

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Macle"
4. Install "Macle Development" extension
5. Open folder: `E:\D Drive\NTag-portal\dist-miniapp`
6. Use Macle commands from Command Palette (`Ctrl+Shift+P`)

## Before Opening Macle

Make sure you've built your Mini App first:

```bash
npm run build:miniapp
```

This creates the `dist-miniapp` folder that Macle needs.

## Troubleshooting

**Can't find Macle?**
- Check if it installed correctly
- Look in Start Menu (Windows) or Applications (Mac)

**Can't open project?**
- Make sure you selected `dist-miniapp` folder
- Verify you ran `npm run build:miniapp` first

**Need the download link?**
- Visit: https://developer.ethiotelecom.et
- Go to "Doc" → "Mini App Development Guide"
- Look for download section

---

**That's it! Once Macle is open, import your `dist-miniapp` folder and start testing! 🎉**


