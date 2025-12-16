# 🚀 How to Run Mini App Conversion

## Simple Steps

### Step 1: Open Terminal/Command Prompt

Navigate to your project directory:
```bash
cd "E:\D Drive\NTag-portal"
```

### Step 2: Run the Conversion

**Option A: Build and Convert in One Command (Recommended)**
```bash
npm run build:miniapp
```

**Option B: Run Steps Separately**
```bash
# First, build your app
npm run build

# Then, convert to Mini App
npm run convert:miniapp
```

### Step 3: Wait for Completion

You'll see output like:
```
✓ built in 1m 3s
🚀 Starting HTML to Mini App conversion...
✅ Copied app.json
✅ Copied sitemap.json
...
✨ Conversion completed!
```

### Step 4: Check the Output

The converted Mini App is in the `dist-miniapp` folder:
```bash
# Windows
dir dist-miniapp

# Or open in File Explorer
explorer dist-miniapp
```

## What Happens?

1. ✅ Builds your React application
2. ✅ Converts it to Mini App format
3. ✅ Creates `dist-miniapp/` folder with all files
4. ✅ Ready for Macle Developer Toolkit

## Next: Open in Macle Developer Toolkit

1. **Download Macle Developer Toolkit** from [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
2. **Open Macle Toolkit**
3. **Import Project** → Select `dist-miniapp` folder
4. **Preview and Test** your Mini App

## Quick Commands Reference

```bash
# Development (normal web app)
npm run dev

# Build for production
npm run build

# Build + Convert to Mini App ⭐
npm run build:miniapp

# Convert only (after build)
npm run convert:miniapp
```

## Troubleshooting

**Error: "dist/ directory not found"**
→ Run `npm run build` first, then `npm run convert:miniapp`

**Error: "Cannot find module"**
→ Run `npm install` to install dependencies

**Build takes too long?**
→ This is normal for first build. Subsequent builds are faster.

---

**That's it! Just run `npm run build:miniapp` and you're done! 🎉**


