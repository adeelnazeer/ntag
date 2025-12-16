# 🎮 How to Run Offline Simulator in Macle Developer Toolkit

## Step 1: Import Offline Simulator

1. **In Macle Developer Toolkit:**
   - You should see **"MINIPROGRAM TOOLING"** panel on the left
   - Under **"HELP"** section, click **"Import Offline Simulator"**
   - (This option is currently visible in your interface)

2. **Select Simulator Package:**
   - A file dialog will open
   - Navigate to where your offline simulator package is located
   - Select the simulator package file (usually a `.zip` or `.exe` file)
   - Click **"Open"**

3. **Wait for Import:**
   - Macle will extract and install the offline simulator
   - This may take a few minutes
   - Wait until you see a success message

## Step 2: Open/Run the Simulator

### Method 1: Using TOOL Menu

1. **In Macle Developer Toolkit:**
   - Look at the **"TOOL"** section in the left panel
   - Click **"Simulator"** option
   - This will launch the offline simulator

### Method 2: Using Run Menu

1. **Top Menu Bar:**
   - Click **"Run"** in the top menu
   - Select **"Start Simulator"** or **"Launch Simulator"**
   - The simulator window will open

### Method 3: Using Keyboard Shortcut

1. **Press `F5`** or **`Ctrl+F5`**
   - This should launch the simulator directly

## Step 3: Load Your Mini App Project

### Option A: Open Project First, Then Run Simulator

1. **Open Your Project:**
   - Click **"File"** → **"Open Folder"** (or `Ctrl+K Ctrl+O`)
   - Navigate to: `E:\D Drive\NTag-portal\dist-miniapp`
   - Select the `dist-miniapp` folder
   - Click **"Select Folder"**

2. **Run Simulator:**
   - After project is loaded, click **"Simulator"** under TOOL section
   - Or press **F5**
   - Your Mini App will automatically load in the simulator

### Option B: Use New Project Option

1. **Create/Import Project:**
   - Click **"New Project"** under TOOL section
   - Or **"File"** → **"New Project"**
   - Select **"Import Existing Project"**
   - Navigate to: `E:\D Drive\NTag-portal\dist-miniapp`
   - Click **"Open"**

2. **Run:**
   - Click **"Simulator"** or press **F5**

## Step 4: Verify Your Mini App is Running

Once the simulator opens, you should see:
- ✅ A mobile phone-like interface
- ✅ Your Mini App displayed inside
- ✅ Navigation and controls at the bottom
- ✅ Console/debug panel (if enabled)

## Troubleshooting

### Problem: "Simulator" option is grayed out

**Solution:**
- Make sure you've imported the offline simulator first
- Check that the simulator package was successfully imported
- Try restarting Macle Developer Toolkit

### Problem: Simulator won't start

**Solution:**
1. Check if simulator files are in the correct location
2. Try running Macle as Administrator
3. Check console for error messages (View → Output)
4. Verify simulator package is compatible with your Macle version

### Problem: "No project loaded"

**Solution:**
1. First open your project: **File → Open Folder → Select `dist-miniapp`**
2. Then run the simulator
3. Make sure `app.json` exists in your project folder

### Problem: Mini App not showing in simulator

**Solution:**
1. Verify project is open (check Explorer panel)
2. Check that `dist-miniapp` folder contains:
   - `app.json`
   - `index.html`
   - `pages/` folder
   - `assets/` folder
3. Rebuild if needed: `npm run build:miniapp`
4. Restart simulator

### Problem: Simulator shows blank screen

**Solution:**
1. Check Console panel for errors (View → Output → Macle)
2. Verify all files are in `dist-miniapp` folder
3. Check `app.json` configuration
4. Try rebuilding: `npm run build:miniapp`

## Quick Reference

### Import Simulator:
```
HELP → Import Offline Simulator → Select package → Wait for import
```

### Open Project:
```
File → Open Folder → Select dist-miniapp folder
```

### Run Simulator:
```
TOOL → Simulator
OR
Press F5
OR
Run → Start Simulator
```

## Complete Workflow

```bash
# 1. Build your Mini App
npm run build:miniapp

# 2. In Macle Developer Toolkit:
#    - HELP → Import Offline Simulator (if not done)
#    - File → Open Folder → Select dist-miniapp
#    - TOOL → Simulator (or press F5)

# 3. Your Mini App runs in the simulator! 🎉
```

## Alternative: Using Converter Tool

If you need to convert your project first:

1. **Click "Converter"** under TOOL section
2. **Select your web app folder** (or `dist` folder)
3. **Choose output location** (or use default)
4. **Click "Convert"**
5. **Then open the converted project** and run simulator

---

## Summary

**Quick Steps:**
1. ✅ **Import Simulator:** HELP → Import Offline Simulator
2. ✅ **Open Project:** File → Open Folder → `dist-miniapp`
3. ✅ **Run Simulator:** TOOL → Simulator (or F5)
4. ✅ **Test your Mini App!**

**That's it! Your offline simulator should now be running with your Mini App! 🚀**

