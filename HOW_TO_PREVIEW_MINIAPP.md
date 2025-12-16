# 👀 How to Preview Your Mini App

## Method 1: Using Macle Developer Toolkit (Desktop App)

### If Macle Simulator is Working:

1. **Open Macle Developer Toolkit**
   - Launch `macle-simulator.exe` (or Macle Developer Toolkit)
   - If you get errors, see `FIX_MACLE_ERROR.md` for solutions

2. **Import Your Project**
   - Click "Import Project" or "Open Project"
   - Navigate to: `E:\D Drive\NTag-portal\dist-miniapp`
   - Select the `dist-miniapp` folder
   - Click "Open"

3. **Preview**
   - Click the **"Preview"** or **"Play"** button (usually a play icon ▶️)
   - Or press `F5` to start preview
   - Your Mini App will open in the simulator window

4. **Test Features**
   - Navigate through pages
   - Test all functionality
   - Check console for errors (usually at bottom or side panel)

## Method 2: Using VS Code Macle Extension

### Setup:

1. **Install VS Code Extension**
   ```bash
   # Open VS Code
   # Press Ctrl+Shift+X (or Cmd+Shift+X on Mac)
   # Search for "Macle"
   # Install "Macle Development" extension
   ```

2. **Open Your Project**
   - File → Open Folder
   - Select: `E:\D Drive\NTag-portal\dist-miniapp`

3. **Preview Using Commands**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type: `Macle: Preview Mini App`
   - Select the command
   - Preview will open in a new window

### Available Commands:
- `Macle: Preview Mini App` - Start preview
- `Macle: Build Mini App` - Build the app
- `Macle: Package Mini App` - Package for submission

## Method 3: Using Local Web Server (Quick Preview)

Since your Mini App is essentially a web app, you can preview it locally:

### Option A: Using Vite Preview (Recommended)

1. **Build your app** (if not already done):
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Open in browser**:
   - The terminal will show a URL like: `http://localhost:4173`
   - Open this URL in your browser
   - Note: This shows the web version, not the Mini App environment

### Option B: Using Python HTTP Server

1. **Navigate to dist-miniapp**:
   ```bash
   cd dist-miniapp
   ```

2. **Start Python server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Open in browser**:
   - Go to: `http://localhost:8000`
   - Your Mini App files will be served

### Option C: Using Node.js http-server

1. **Install http-server** (if not installed):
   ```bash
   npm install -g http-server
   ```

2. **Navigate to dist-miniapp**:
   ```bash
   cd dist-miniapp
   ```

3. **Start server**:
   ```bash
   http-server -p 8000
   ```

4. **Open in browser**:
   - Go to: `http://localhost:8000`

## Method 4: Direct File Opening (Limited)

1. **Navigate to dist-miniapp folder**
2. **Double-click `index.html`**
3. **Opens in default browser**
   - ⚠️ Note: Some features may not work (routing, API calls)
   - This is just for basic visual preview

## Method 5: Using Browser DevTools (Advanced)

1. **Open Chrome/Edge**
2. **Press F12** to open DevTools
3. **Toggle Device Toolbar** (`Ctrl+Shift+M`)
4. **Select mobile device** (e.g., iPhone, Android)
5. **Navigate to your local server** (from Method 3)
6. **Test responsive design**

## Recommended Workflow

### For Development:
```bash
# 1. Make changes to your code
# 2. Rebuild
npm run build:miniapp

# 3. Preview using one of these methods:
# - Macle Developer Toolkit (best for Mini App testing)
# - VS Code Extension
# - Local web server (npm run preview)
```

### For Quick Visual Check:
```bash
npm run preview
# Opens at http://localhost:4173
```

### For Full Mini App Testing:
- Use Macle Developer Toolkit or VS Code Extension
- This provides the actual Mini App environment

## Troubleshooting Preview

### Preview not showing?
- ✅ Make sure you ran `npm run build:miniapp` first
- ✅ Check that `dist-miniapp` folder exists
- ✅ Verify `index.html` is in `dist-miniapp` folder
- ✅ Check browser console for errors (F12)

### Features not working in preview?
- ⚠️ Some Mini App APIs only work in Macle simulator
- ⚠️ Use Macle Developer Toolkit for full functionality testing
- ⚠️ Web preview is mainly for visual/UI testing

### Macle preview not working?
- See `FIX_MACLE_ERROR.md` for troubleshooting
- Try VS Code extension as alternative
- Use local web server for basic preview

## Quick Commands Reference

```bash
# Build and convert to Mini App
npm run build:miniapp

# Preview web build (quick visual check)
npm run preview

# Or use Macle Developer Toolkit
# 1. Open Macle
# 2. Import dist-miniapp folder
# 3. Click Preview button
```

## Best Practices

1. **Use Macle Developer Toolkit** for:
   - Full Mini App environment testing
   - Testing Mini App specific APIs
   - Final testing before submission

2. **Use Local Web Server** for:
   - Quick visual checks
   - UI/UX testing
   - Responsive design testing

3. **Use VS Code Extension** for:
   - Development workflow
   - Integrated testing
   - Quick preview during development

---

**Start with: `npm run preview` for quick visual check, then use Macle Developer Toolkit for full testing! 🚀**


