# 🔧 Fix: Blank Simulator Screen

## Problem
When you open the simulator, nothing shows - just a blank/white screen.

## Root Cause
The `app.json` file references pages that don't exist in the `pages/` folder. Mini Apps need actual page files, not just HTML.

## Solution 1: Fix app.json to Use Web View (Quick Fix)

Since your app is a React web app, we need to create a page that loads it via web-view.

### Step 1: Update app.json

The `app.json` should point to an entry page that exists. Let's use the `ntag` folder structure or create a simple entry page.

### Step 2: Create Entry Page

We need to create a page that loads your React app.

---

## Solution 2: Use the ntag Folder Structure

I see you have an `ntag/` folder with pages. Let's use that structure.

### Quick Fix Steps:

1. **Update `app.json` to point to the ntag structure:**
   ```json
   {
     "pages": [
       "ntag/pages/index/index"
     ]
   }
   ```

2. **Or create a web-view page that loads your React app**

---

## Solution 3: Create a Web-View Entry Page (Recommended)

Since your app is a React SPA, we need a page that loads it via web-view.

### Steps:

1. **Create pages/index/index.js:**
   ```javascript
   Page({
     data: {},
     onLoad() {
       // Load your React app
     }
   });
   ```

2. **Create pages/index/index.maml (or .wxml):**
   ```html
   <web-view src="{{webviewUrl}}"></web-view>
   ```

3. **Update app.json:**
   ```json
   {
     "pages": [
       "pages/index/index"
     ]
   }
   ```

---

## Immediate Fix: Check These

### 1. Verify Project is Open
- In Macle, make sure you opened the `dist-miniapp` folder
- Check Explorer panel - you should see files

### 2. Check Console for Errors
- In Macle, open **View → Output** or **Console**
- Look for error messages
- Common errors:
  - "Page not found"
  - "Cannot find pages/..."
  - "app.json error"

### 3. Check app.json Configuration
- Open `dist-miniapp/app.json`
- Verify `pages` array has valid page paths
- First page in array is the entry page

### 4. Verify Files Exist
- Check that page files exist at paths specified in `app.json`
- Each page needs: `.js`, `.maml` (or `.wxml`), and optionally `.json`, `.wxss`

---

## Quick Diagnostic Steps

1. **Open Console in Macle:**
   - View → Output → Select "Macle" or "Console"
   - Look for error messages

2. **Check app.json:**
   ```bash
   # Open dist-miniapp/app.json
   # Verify pages array points to existing files
   ```

3. **Verify Entry Page Exists:**
   ```bash
   # Check if first page in app.json exists
   # Example: if app.json has "pages/index/index"
   # Check: dist-miniapp/pages/index/index.js exists
   ```

---

## Most Likely Fix

Since your app is a React web app, you need to either:

**Option A: Use Web-View (Easiest)**
- Create a simple page that loads your `index.html` via web-view
- This allows your React app to run inside the Mini App

**Option B: Convert to Native Mini App Pages**
- Convert each React route to a Mini App page
- More work but better performance

Let me create the web-view solution for you...

