# 🔧 Fix Macle Simulator JavaScript Error

## Error: "A JavaScript error occurred in the main process"

This error typically occurs when running `macle-simulator.exe`. Here are solutions:

## Solution 1: Run as Administrator

1. **Right-click** on `macle-simulator.exe`
2. Select **"Run as administrator"**
3. Click "Yes" if prompted by UAC
4. Try running again

## Solution 2: Check Windows Defender / Antivirus

1. **Temporarily disable** Windows Defender or your antivirus
2. Try running `macle-simulator.exe` again
3. If it works, add an exception for the Macle folder in your antivirus

**To add exception in Windows Defender:**
- Windows Security → Virus & threat protection
- Manage settings → Exclusions
- Add folder where Macle is installed

## Solution 3: Reinstall Macle

1. **Uninstall** the current installation
2. **Download** a fresh copy from the Developer Portal
3. **Install** in a path without spaces (e.g., `C:\Macle` instead of `D Drive\...`)
4. Try running again

## Solution 4: Install Required Dependencies

Macle might need Visual C++ Redistributables:

1. Download and install:
   - **Visual C++ Redistributable 2015-2022**: https://aka.ms/vs/17/release/vc_redist.x64.exe
2. Restart your computer
3. Try running Macle again

## Solution 5: Check File Permissions

1. **Right-click** the Macle installation folder
2. Select **Properties** → **Security** tab
3. Click **Edit**
4. Ensure your user has **Full Control**
5. Click **Apply** and **OK**
6. Try running again

## Solution 6: Run from Command Line (for debugging)

1. Open **Command Prompt as Administrator**
2. Navigate to Macle folder:
   ```cmd
   cd "C:\Program Files\Macle" 
   ```
   (or wherever Macle is installed)
3. Run with error output:
   ```cmd
   macle-simulator.exe
   ```
4. Check for more detailed error messages

## Solution 7: Check Windows Event Viewer

1. Press `Win + X` → **Event Viewer**
2. Go to **Windows Logs** → **Application**
3. Look for errors related to `macle-simulator.exe`
4. Check the error details for more information

## Solution 8: Use VS Code Extension Instead

If the desktop app continues to fail, use the VS Code extension:

1. **Open VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X`)
3. Search for **"Macle"**
4. Install **"Macle Development"** extension
5. Open your `dist-miniapp` folder in VS Code
6. Use Macle commands from Command Palette (`Ctrl+Shift+P`)

## Solution 9: Check System Requirements

Ensure your system meets requirements:
- **Windows 10/11** (64-bit)
- **4GB RAM** minimum
- **Administrator rights** for installation
- **Internet connection** for first launch

## Solution 10: Contact Support

If none of the above work:

1. **Contact Ethio Telecom Developer Support**:
   - Email: 994@ethionet.et
   - Phone: +251-994 / +251-980
   - Portal: https://developer.ethiotelecom.et

2. **Provide them with**:
   - Windows version
   - Error screenshot
   - Installation path
   - Any error logs from Event Viewer

## Quick Fix Checklist

Try these in order:

- [ ] Run as Administrator
- [ ] Check antivirus/Windows Defender
- [ ] Install Visual C++ Redistributables
- [ ] Reinstall in a path without spaces
- [ ] Check file permissions
- [ ] Try VS Code extension instead
- [ ] Contact support if all else fails

## Alternative: Use Web-Based Tools

If the desktop app doesn't work, check if Ethio Telecom provides:
- **Web-based Mini App simulator**
- **Online development tools**
- **Cloud-based testing environment**

Check the Developer Portal documentation for alternatives.

---

**Most common fix: Run as Administrator + Install Visual C++ Redistributables**


