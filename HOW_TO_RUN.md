# How to Run Mini App Conversion

## Step-by-Step Instructions

### Step 1: Install Dependencies (if not already done)

```bash
npm install
```

### Step 2: Build Your Application

First, build your React application:

```bash
npm run build
```

This creates the `dist/` directory with your compiled application.

### Step 3: Convert to Mini App Format

Run the conversion script:

```bash
npm run convert:miniapp
```

**OR** run both build and conversion in one command:

```bash
npm run build:miniapp
```

### Step 4: Check the Output

After running the conversion, check the `dist-miniapp/` directory:

```bash
# On Windows PowerShell
dir dist-miniapp

# On Windows CMD
dir dist-miniapp

# On Mac/Linux
ls -la dist-miniapp
```

You should see:
- `app.json` - Mini App configuration
- `sitemap.json` - Sitemap file
- `project.config.json` - Project config
- `index.html` - Main HTML file
- `assets/` - All your assets
- `pages/` - Pages directory structure
- `utils/` - Mini App utilities

### Step 5: Test with Macle Developer Toolkit

1. **Download Macle Developer Toolkit** from [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
2. **Open Macle Developer Toolkit**
3. **Import Project**: 
   - Click "Import" or "Open Project"
   - Select the `dist-miniapp` folder
4. **Preview**: Use the preview feature to test your Mini App
5. **Debug**: Check for any errors in the console

## Quick Command Reference

```bash
# Development (normal web app)
npm run dev

# Build for production (web)
npm run build

# Build and convert to Mini App (one command)
npm run build:miniapp

# Convert only (after build)
npm run convert:miniapp

# Preview web build
npm run preview
```

## Troubleshooting

### Error: "dist/ directory not found"
**Solution**: Run `npm run build` first, then `npm run convert:miniapp`

### Error: "Cannot find module"
**Solution**: Run `npm install` to install all dependencies

### Error: "Permission denied"
**Solution**: Make sure you have write permissions in the project directory

### Conversion script not working
**Solution**: 
1. Check Node.js version: `node --version` (should be v16+)
2. Verify the script exists: `ls scripts/convert-to-miniapp.js` (Mac/Linux) or `dir scripts\convert-to-miniapp.js` (Windows)
3. Try running directly: `node scripts/convert-to-miniapp.js`

## What Happens During Conversion?

1. ✅ Creates `dist-miniapp/` directory
2. ✅ Copies configuration files (`app.json`, `sitemap.json`, `project.config.json`)
3. ✅ Copies built assets from `dist/` to `dist-miniapp/`
4. ✅ Creates Mini App directory structure (`pages/`, `utils/`)
5. ✅ Generates Mini App API wrapper utilities

## Next Steps After Conversion

1. **Review** the generated files in `dist-miniapp/`
2. **Test** with Macle Developer Toolkit
3. **Fix** any issues found during testing
4. **Package** using Macle toolkit
5. **Submit** to Ethio Telecom Developer Portal

## Need Help?

- Check `MINIAPP_SETUP.md` for detailed setup guide
- Check `QUICK_START_MINIAPP.md` for quick reference
- Visit [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)

