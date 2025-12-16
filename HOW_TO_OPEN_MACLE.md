# 📱 How to Open Macle Developer Toolkit

## Step 1: Download Macle Developer Toolkit

### Option A: From Ethio Telecom Developer Portal

1. **Visit the Developer Portal**
   - Go to: https://developer.ethiotelecom.et
   - Log in with your developer account (or register if you don't have one)

2. **Navigate to Mini App Resources**
   - Look for "Mini App Development Guide" section
   - Find "Macle Developer Toolkit" or "Development Tools"
   - Click on the download link

3. **Download the Toolkit**
   - Download the appropriate version for your operating system:
     - **Windows**: `.exe` installer
     - **Mac**: `.dmg` file
     - **Linux**: `.AppImage` or package file

### Option B: VS Code Extension (Alternative)

1. **Open VS Code**
2. **Go to Extensions**
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Or click the Extensions icon in the sidebar

3. **Search for "Macle"**
   - Type "Macle" in the search box
   - Look for "Macle Development" or "Macle Mini App" extension
   - Click "Install"

## Step 2: Install Macle Developer Toolkit

### For Windows (.exe file):
1. **Run the installer**
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard
   - Choose installation location (default is usually fine)
   - Click "Install" and wait for completion

2. **Launch after installation**
   - The installer may offer to launch immediately
   - Or find it in Start Menu → "Macle Developer Toolkit"

### For Mac (.dmg file):
1. **Open the .dmg file**
   - Double-click the downloaded `.dmg` file
   - Drag "Macle Developer Toolkit" to Applications folder
   - Eject the disk image

2. **Launch the app**
   - Open Applications folder
   - Double-click "Macle Developer Toolkit"
   - If you get a security warning, go to System Preferences → Security & Privacy → Click "Open Anyway"

### For Linux:
1. **Make executable** (if .AppImage):
   ```bash
   chmod +x Macle-Developer-Toolkit.AppImage
   ```

2. **Run it**:
   ```bash
   ./Macle-Developer-Toolkit.AppImage
   ```

## Step 3: Open Macle Developer Toolkit

### Method 1: From Start Menu / Applications
- **Windows**: Start Menu → Search "Macle" → Click "Macle Developer Toolkit"
- **Mac**: Applications → "Macle Developer Toolkit"
- **Linux**: Application menu → "Macle Developer Toolkit"

### Method 2: Desktop Shortcut
- If a shortcut was created during installation, double-click it

### Method 3: Command Line (if available)
```bash
# Windows (if added to PATH)
macle

# Mac/Linux
/Applications/Macle\ Developer\ Toolkit.app/Contents/MacOS/Macle
```

## Step 4: Open Your Mini App Project

Once Macle Developer Toolkit is open:

1. **Click "Import Project" or "Open Project"**
   - Look for a button/option like:
     - "Import Project"
     - "Open Project"
     - "Open Folder"
     - "Select Project Directory"

2. **Navigate to Your Project**
   - Browse to: `E:\D Drive\NTag-portal\dist-miniapp`
   - **Important**: Select the `dist-miniapp` folder (not the root project folder)
   - Click "Open" or "Select Folder"

3. **Wait for Loading**
   - Macle will load your project
   - It may take a few moments to analyze the files

4. **Preview Your Mini App**
   - Use the preview/play button
   - Test your Mini App functionality
   - Check the console for any errors

## Step 5: Using VS Code Extension (Alternative Method)

If you installed the VS Code extension:

1. **Open VS Code**
2. **Open Your Project**
   - File → Open Folder
   - Select `E:\D Drive\NTag-portal\dist-miniapp`

3. **Use Macle Commands**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Macle" to see available commands
   - Select commands like:
     - "Macle: Preview Mini App"
     - "Macle: Build Mini App"
     - "Macle: Package Mini App"

## Troubleshooting

### "Macle Developer Toolkit not found"
- **Solution**: Make sure you downloaded and installed it from the Developer Portal
- Check if it's in your Applications/Programs folder

### "Cannot open project"
- **Solution**: Make sure you're selecting the `dist-miniapp` folder, not the root project
- Verify all configuration files exist (`app.json`, `project.config.json`, etc.)

### "Project format not recognized"
- **Solution**: Run `npm run build:miniapp` again to regenerate files
- Check that `app.json` is properly formatted

### "Preview not working"
- **Solution**: Check the console for errors
- Verify all assets are in the `dist-miniapp/assets` folder
- Make sure the build completed successfully

### Can't find download link
- **Solution**: 
  - Contact Ethio Telecom Developer Support
  - Check the Developer Portal documentation
  - Look for "Resources" or "Downloads" section

## Quick Checklist

- [ ] Registered on Ethio Telecom Developer Portal
- [ ] Downloaded Macle Developer Toolkit
- [ ] Installed Macle Developer Toolkit
- [ ] Opened Macle Developer Toolkit
- [ ] Ran `npm run build:miniapp` to create `dist-miniapp` folder
- [ ] Imported `dist-miniapp` folder in Macle
- [ ] Previewed Mini App successfully

## Need Help?

- **Developer Portal**: https://developer.ethiotelecom.et
- **Documentation**: Check "Mini App Development Guide" section
- **Support**: Contact Ethio Telecom Developer Support through the portal

---

**Once Macle is open, import your `dist-miniapp` folder and start testing! 🚀**


