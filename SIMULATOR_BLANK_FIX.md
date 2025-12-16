# 🔧 Fix: Simulator Shows Blank Screen

## Problem Identified ✅

Your `app.json` was referencing pages that **don't exist**:
- `pages/home/index` ❌ (doesn't exist)
- `pages/login/index` ❌ (doesn't exist)
- `pages/register/index` ❌ (doesn't exist)
- `pages/dashboard/index` ❌ (doesn't exist)

## Solution Applied ✅

I've created a proper entry page and fixed `app.json`:

1. ✅ Created `pages/index/index.js` - Page logic
2. ✅ Created `pages/index/index.maml` - Page template
3. ✅ Created `pages/index/index.json` - Page config
4. ✅ Created `pages/index/index.mass` - Page styles
5. ✅ Updated `app.json` to point to `pages/index/index`

## Next Steps

### Step 1: Rebuild Your Mini App
```bash
npm run build:miniapp
```

### Step 2: Reload in Macle Simulator

1. **Close the simulator** (if open)
2. **In Macle Developer Toolkit:**
   - Make sure `dist-miniapp` folder is still open
   - Click **"Simulator"** again (or press F5)
   - Or go to **Run → Restart Simulator**

3. **The simulator should now show:**
   - At minimum, a page with "Loading NameTAG..." or "NameTAG Mini App"
   - This confirms the page is loading

### Step 3: Check Console for Errors

1. **In Macle:**
   - Open **View → Output** or **Console** panel
   - Look for any error messages
   - Check if there are warnings

### Step 4: Load Your React App

Since your app is a React SPA, you have two options:

#### Option A: Use Web-View (Recommended for Quick Testing)

The page I created tries to load your React app via web-view. However, you may need to:

1. **Serve your app on a local server:**
   ```bash
   # In one terminal
   cd dist-miniapp
   python -m http.server 8080
   ```

2. **Update the webview URL in `pages/index/index.js`:**
   ```javascript
   this.setData({
     webviewUrl: 'http://localhost:8080/index.html'
   });
   ```

3. **Rebuild and test again**

#### Option B: Convert Routes to Mini App Pages

Convert each React route to a proper Mini App page (more work but better performance).

---

## Troubleshooting

### Still Blank Screen?

1. **Check Console:**
   - View → Output → Select "Macle" or "Console"
   - Look for errors like:
     - "Page not found"
     - "Cannot find pages/index/index"
     - "app.json error"

2. **Verify Files Exist:**
   ```bash
   # Check these files exist:
   dir dist-miniapp\pages\index\
   ```
   
   You should see:
   - `index.js`
   - `index.maml`
   - `index.json`
   - `index.mass`

3. **Check app.json:**
   ```bash
   # Open dist-miniapp/app.json
   # First page should be: "pages/index/index"
   ```

4. **Try Restarting:**
   - Close Macle completely
   - Reopen Macle Developer Toolkit
   - Open `dist-miniapp` folder again
   - Run simulator

### "Page not found" Error?

- Make sure `pages/index/index.js` exists
- Check file paths in `app.json` are correct
- Verify no typos in page paths

### "Cannot load web-view" Error?

- Web-view might need a full URL (not local file)
- Try serving your app on a local server
- Or use a different approach to load your React app

### Simulator Crashes?

- Check console for errors
- Try running Macle as Administrator
- Check if all required files are present

---

## Quick Test

To verify the fix worked:

1. **Rebuild:**
   ```bash
   npm run build:miniapp
   ```

2. **In Macle:**
   - Open `dist-miniapp` folder
   - Click **Simulator** (or F5)
   - You should see **something** (even if just text)

3. **If you see content:**
   - ✅ Fix worked! Now we can work on loading your React app

4. **If still blank:**
   - Check console for specific errors
   - Verify all files were created
   - Try the troubleshooting steps above

---

## Expected Result

After the fix, you should see:
- ✅ Simulator opens without errors
- ✅ At minimum, text or a loading message
- ✅ No "Page not found" errors in console
- ✅ Page structure is loading

Then we can work on properly loading your React app!

---

## Summary

**What I Fixed:**
- ✅ Created missing entry page (`pages/index/index`)
- ✅ Updated `app.json` to use the correct page path
- ✅ Added proper page files (`.js`, `.maml`, `.json`, `.mass`)

**What You Need to Do:**
1. ✅ Rebuild: `npm run build:miniapp`
2. ✅ Reload simulator in Macle
3. ✅ Check if something shows (even if just text)
4. ✅ Report back what you see!

**Next:** Once the page loads, we'll work on loading your React app properly.

