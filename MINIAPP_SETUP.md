# Mini App Conversion Guide

This guide will help you convert your existing NameTAG Portal web application into a Mini App using the Macle framework for Ethio Telecom's telebirr SuperApp.

## Prerequisites

1. **Macle Developer Toolkit**: Download and install from [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
2. **VS Code with Macle Plugin**: Install the Macle Development VSCode Plugin
3. **Node.js**: Ensure Node.js is installed (v16 or higher recommended)
4. **Developer Account**: Register on the Ethio Telecom Developer Portal

## Installation Steps

### 1. Install Macle Framework

The Macle framework is primarily a VS Code plugin and toolkit. However, you can also use it via command line:

```bash
# If Macle CLI is available, install it globally
npm install -g @macle/cli

# Or use the VS Code plugin from the marketplace
# Search for "Macle" in VS Code Extensions
```

### 2. Project Setup

The project has been configured with the following files:

- `app.json` - Mini App configuration
- `macle.config.js` - Macle framework configuration
- `project.config.json` - Project settings
- `sitemap.json` - Sitemap configuration
- `scripts/convert-to-miniapp.js` - Conversion script

### 3. Build for Mini App

Run the build command to generate the Mini App package:

```bash
# Build and convert to Mini App format
npm run build:miniapp

# Or run conversion separately
npm run convert:miniapp
```

This will:
- Build your React application
- Convert it to Mini App format
- Generate files in `dist-miniapp/` directory

## Configuration

### App Configuration (`app.json`)

The `app.json` file contains the Mini App configuration:

```json
{
  "pages": [...],           // List of pages
  "window": {...},          // Window configuration
  "tabBar": {...},          // Tab bar configuration
  "networkTimeout": {...}   // Network settings
}
```

### Macle Configuration (`macle.config.js`)

Edit `macle.config.js` to customize:
- App ID and name
- Build output directory
- Route mappings
- API endpoints

## Development Workflow

### 1. Local Development

```bash
# Start development server
npm run dev

# In another terminal, start Macle dev tools (if available)
macle dev
```

### 2. Testing

Use the Macle Developer Toolkit to:
- Preview your Mini App
- Test on different devices
- Debug issues

### 3. Conversion Process

The conversion script (`scripts/convert-to-miniapp.js`) will:
1. Create the Mini App directory structure
2. Copy configuration files
3. Generate Mini App compatible code
4. Create API wrappers for Mini App environment

## Key Changes for Mini App

### 1. API Calls

Use the Mini App API wrapper instead of direct fetch/axios:

```javascript
import miniAppAPI from '@/utils/miniapp-api';

// Instead of axios.get()
miniAppAPI.request({
  url: '/api/endpoint',
  method: 'GET',
  data: {}
});
```

### 2. Navigation

Use Mini App navigation methods:

```javascript
import miniAppAPI from '@/utils/miniapp-api';

// Instead of navigate()
miniAppAPI.navigateTo('/pages/dashboard/index');
```

### 3. Toast Messages

Use Mini App toast API:

```javascript
import miniAppAPI from '@/utils/miniapp-api';

miniAppAPI.showToast('Success!');
```

## File Structure

After conversion, your Mini App structure will be:

```
dist-miniapp/
├── app.json              # App configuration
├── sitemap.json          # Sitemap
├── project.config.json   # Project config
├── pages/                # Mini App pages
│   ├── home/
│   ├── login/
│   └── ...
├── utils/                # Utilities
│   └── miniapp-api.js   # API wrapper
└── static/              # Static assets
```

## Debugging

### Using Macle Developer Toolkit

1. Open Macle Developer Toolkit
2. Import the `dist-miniapp` directory
3. Use the preview and debug features
4. Check console for errors

### Common Issues

1. **API Calls Failing**: Ensure API endpoints are accessible from Mini App environment
2. **Navigation Issues**: Use Mini App navigation methods instead of React Router
3. **Styling Issues**: Some CSS features may not be supported in Mini App

## Packaging

### 1. Build the Mini App

```bash
npm run build:miniapp
```

### 2. Review Generated Files

Check the `dist-miniapp/` directory and ensure all files are correct.

### 3. Package for Submission

Use Macle Developer Toolkit to:
- Package the Mini App
- Generate submission package
- Validate the package

## Submission Process

1. **Prepare Package**: Use Macle toolkit to create submission package
2. **Submit**: Upload to Ethio Telecom Developer Portal
3. **Joint Commissioning**: Work with Ethio Telecom team for testing
4. **Go Live**: After approval, your Mini App will be available

## Resources

- [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
- [Mini App Development Guide](https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/GettingStarted)
- [Macle Documentation](https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide)

## Support

For issues and questions:
- Check the Developer Portal documentation
- Contact Ethio Telecom Developer Support
- Review the Macle framework documentation

## Notes

- The conversion maintains your existing React code structure
- Most React components will work without changes
- API calls need to use the Mini App wrapper
- Navigation should use Mini App methods
- Some browser-specific features may need alternatives

