# 🎮 How to Run Your Mini App on Macle Simulator

## Prerequisites

1. ✅ **Macle Developer Toolkit installed**
   - Download from: https://developer.ethiotelecom.et
   - If installation fails, see `FIX_MACLE_ERROR.md`

2. ✅ **Mini App built and converted**
   ```bash
   npm run build:miniapp
   ```

## Step-by-Step Guide

### Step 1: Build Your Mini App

```bash
# From your project root directory
npm run build:miniapp
```

This will:
- Build your web app
- Convert it to Mini App format
- Create `dist-miniapp` folder with all necessary files

**Verify the build:**
```bash
# Check that dist-miniapp folder exists
dir dist-miniapp
```

You should see:
- `app.json`
- `project.config.json`
- `sitemap.json`
- `index.html`
- `pages/` folder
- `assets/` folder
- Other necessary files

### Step 2: Open Macle Developer Toolkit

1. **Launch Macle Simulator**
   - Find `macle-simulator.exe` in your installation folder
   - Or search "Macle" in Windows Start Menu
   - Double-click to open

2. **If you get an error:**
   - See `FIX_MACLE_ERROR.md` for troubleshooting
   - Try running as Administrator
   - Check if Visual C++ Redistributables are installed

### Step 3: Import Your Project

1. **In Macle Developer Toolkit:**
   - Click **"Import Project"** or **"Open Project"** button
   - Or go to: **File → Open Project**

2. **Navigate to your project:**
   - Browse to: `E:\D Drive\NTag-portal\dist-miniapp`
   - **Important:** Select the `dist-miniapp` folder (not the parent folder)
   - Click **"Select Folder"** or **"Open"**

3. **Wait for import:**
   - Macle will analyze your project
   - It may show a loading indicator
   - Wait until the project appears in the editor

### Step 4: Configure Project (If Needed)

1. **Check Project Settings:**
   - Look for **"Project Settings"** or **"Settings"** tab
   - Verify:
     - **App ID:** (You may need to get this from Ethio Telecom)
     - **Project Name:** Should show "ntag-miniapp" or similar
     - **Project Path:** Should point to `dist-miniapp`

2. **If App ID is missing:**
   - You may need to register your Mini App first
   - Visit: https://developer.ethiotelecom.et
   - Create an account and register your Mini App
   - Get your App ID
   - Update `project.config.json` with your App ID

### Step 5: Run on Simulator

1. **Start the Simulator:**
   - Click the **"Preview"** button (usually a play icon ▶️)
   - Or press **`F5`** key
   - Or go to: **Run → Preview** or **Debug → Start Debugging**

2. **Wait for compilation:**
   - Macle will compile your Mini App
   - You may see a progress bar or loading message
   - This may take 30 seconds to 2 minutes

3. **Simulator Window Opens:**
   - A new window will open showing your Mini App
   - It looks like a mobile phone screen
   - Your Mini App should be running inside it

### Step 6: Test Your Mini App

1. **Navigate through pages:**
   - Use the simulator's touch/click interface
   - Test all navigation links
   - Check all pages load correctly

2. **Test functionality:**
   - Try all buttons and forms
   - Test user interactions
   - Check API calls (if any)

3. **Check Console:**
   - Look for **"Console"** or **"Debug"** panel
   - Usually at the bottom or side of Macle window
   - Check for any errors or warnings

4. **Test on different devices:**
   - Macle may have device selection (iPhone, Android, etc.)
   - Test on different screen sizes
   - Check responsive design

## Alternative: Using VS Code Extension

If Macle Desktop App doesn't work:

1. **Install VS Code Extension:**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions)
   - Search: **"Macle Development"**
   - Click **Install**

2. **Open Project:**
   - File → Open Folder
   - Select: `E:\D Drive\NTag-portal\dist-miniapp`

3. **Run Preview:**
   - Press `Ctrl+Shift+P`
   - Type: `Macle: Preview Mini App`
   - Press Enter

4. **Simulator opens:**
   - VS Code will launch the Macle simulator
   - Your Mini App runs inside it

## Troubleshooting

### Problem: "Cannot find project" or "Invalid project"

**Solution:**
- Make sure you selected the `dist-miniapp` folder (not parent folder)
- Verify `app.json` exists in `dist-miniapp`
- Check that `npm run build:miniapp` completed successfully
- Try rebuilding: `npm run build:miniapp`

### Problem: "App ID is required"

**Solution:**
1. Register your Mini App at: https://developer.ethiotelecom.et
2. Get your App ID
3. Open `dist-miniapp/project.config.json`
4. Update `"appid"` field with your App ID
5. Save and try again

### Problem: Simulator won't start

**Solution:**
- Check `FIX_MACLE_ERROR.md` for installation issues
- Try running Macle as Administrator
- Restart your computer
- Reinstall Macle Developer Toolkit

### Problem: Mini App shows blank screen

**Solution:**
1. Check Console for errors (F12 or Debug panel)
2. Verify `index.html` exists in `dist-miniapp`
3. Check that all assets are copied correctly
4. Try rebuilding: `npm run build:miniapp`

### Problem: Pages not loading

**Solution:**
- Check routing configuration in `app.json`
- Verify all page files exist in `pages/` folder
- Check console for routing errors
- Ensure `sitemap.json` is configured correctly

### Problem: Styles not loading

**Solution:**
- Check that CSS files are in `assets/` folder
- Verify paths in `index.html` are correct
- Check console for 404 errors on CSS files
- Rebuild: `npm run build:miniapp`

## Quick Command Reference

```bash
# 1. Build Mini App
npm run build:miniapp

# 2. Open Macle Developer Toolkit
# (Launch from Start Menu or desktop shortcut)

# 3. In Macle:
#    - Click "Import Project"
#    - Select dist-miniapp folder
#    - Click "Preview" button (▶️)
```

## Expected Result

When successful, you should see:
- ✅ Macle simulator window opens
- ✅ Your Mini App displays in the simulator
- ✅ You can interact with it like a mobile app
- ✅ Navigation works
- ✅ All pages load correctly
- ✅ No errors in console

## Next Steps After Running

1. **Test all features:**
   - Login/Registration
   - Navigation
   - Forms
   - API calls
   - All user flows

2. **Fix any issues:**
   - Note any errors
   - Fix in source code
   - Rebuild: `npm run build:miniapp`
   - Re-import in Macle

3. **Optimize:**
   - Check performance
   - Optimize images
   - Minimize bundle size

4. **Prepare for submission:**
   - Test thoroughly
   - Prepare screenshots
   - Write app description
   - Submit to Ethio Telecom

---

## Summary

**Quick Steps:**
1. ✅ `npm run build:miniapp`
2. ✅ Open Macle Developer Toolkit
3. ✅ Import `dist-miniapp` folder
4. ✅ Click Preview button (▶️)
5. ✅ Test your Mini App!

**That's it! Your Mini App should now be running in the Macle simulator! 🎉**

