# ⚡ Quick Start: Run on Macle Simulator

## 3 Simple Steps

### Step 1: Build Your Mini App
```bash
npm run build:miniapp
```

### Step 2: Open Macle Developer Toolkit
- Launch `macle-simulator.exe` from Start Menu
- Or find it in your installation folder

### Step 3: Import & Run
1. Click **"Import Project"** button
2. Navigate to: `E:\D Drive\NTag-portal\dist-miniapp`
3. Select the `dist-miniapp` folder
4. Click **"Preview"** button (▶️) or press **F5**

**That's it! Your Mini App will run in the simulator! 🎉**

---

## If Macle Won't Open

### Quick Fixes:
1. **Right-click** → **Run as Administrator**
2. Check `FIX_MACLE_ERROR.md` for detailed solutions
3. Try VS Code Extension instead (see below)

---

## Alternative: VS Code Extension

If Macle desktop app doesn't work:

1. **Install Extension:**
   - VS Code → Extensions (`Ctrl+Shift+X`)
   - Search: **"Macle Development"**
   - Click **Install**

2. **Open Project:**
   - File → Open Folder
   - Select: `dist-miniapp` folder

3. **Run:**
   - Press `Ctrl+Shift+P`
   - Type: `Macle: Preview Mini App`
   - Press Enter

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find project" | Make sure you select `dist-miniapp` folder (not parent) |
| "App ID required" | Register at https://developer.ethiotelecom.et and get App ID |
| Simulator won't start | Run as Administrator, see `FIX_MACLE_ERROR.md` |
| Blank screen | Check console (F12), rebuild with `npm run build:miniapp` |

---

## Full Guide

For detailed instructions, see: **`RUN_ON_MACLE_SIMULATOR.md`**

---

**Quick Command:**
```bash
npm run build:miniapp
# Then open Macle → Import dist-miniapp → Click Preview ▶️
```

