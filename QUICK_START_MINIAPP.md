# Quick Start: Converting to Mini App

## 🚀 Quick Steps

### 1. Install Macle Framework Tools

Download and install:
- **Macle Developer Toolkit** from [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
- **VS Code Macle Plugin** (search "Macle" in VS Code Extensions)

### 2. Build and Convert

```bash
# Build your app and convert to Mini App format
npm run build:miniapp
```

This will:
- Build your React application
- Convert it to Mini App format
- Generate files in `dist-miniapp/` directory

### 3. Test with Macle Developer Toolkit

1. Open Macle Developer Toolkit
2. Import the `dist-miniapp/` directory
3. Preview and test your Mini App

### 4. Package and Submit

1. Use Macle toolkit to package your Mini App
2. Submit to Ethio Telecom Developer Portal
3. Complete joint commissioning process
4. Go live!

## 📁 Generated Files

After running `npm run build:miniapp`, you'll find:

```
dist-miniapp/
├── app.json              # Mini App configuration
├── sitemap.json          # Sitemap configuration
├── project.config.json   # Project settings
├── pages/                # Mini App pages (structure)
└── utils/                # Mini App utilities
    └── miniapp-api.js   # API wrapper
```

## 🔧 Configuration Files

- **`app.json`** - Main Mini App configuration (pages, window, tabBar)
- **`macle.config.js`** - Macle framework settings
- **`project.config.json`** - Project-specific settings
- **`sitemap.json`** - Sitemap for Mini App

## 📝 Important Notes

1. **API Calls**: Use `miniAppAPI` from `src/utils/miniapp-api.js` instead of direct fetch/axios
2. **Navigation**: Use Mini App navigation methods instead of React Router
3. **Testing**: Always test in Macle Developer Toolkit before submission
4. **Documentation**: See `MINIAPP_SETUP.md` for detailed information

## 🆘 Troubleshooting

### Build fails?
- Ensure Node.js v16+ is installed
- Run `npm install` to install dependencies
- Check for any syntax errors in your code

### Conversion issues?
- Verify all configuration files are present
- Check `scripts/convert-to-miniapp.js` for errors
- Review the output in `dist-miniapp/` directory

### Macle Toolkit not working?
- Ensure Macle Developer Toolkit is properly installed
- Check Ethio Telecom Developer Portal for latest version
- Verify your developer account is active

## 📚 Resources

- [Full Setup Guide](./MINIAPP_SETUP.md)
- [Ethio Telecom Developer Portal](https://developer.ethiotelecom.et)
- [Macle Documentation](https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide)

