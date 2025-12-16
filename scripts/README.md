# Scripts Directory

This directory contains utility scripts for the project.

## convert-to-miniapp.js

Converts the built web application to Mini App format compatible with Macle framework.

### Usage

```bash
# Run after building the project
npm run build:miniapp

# Or run conversion separately
npm run convert:miniapp
```

### What it does

1. Creates the `dist-miniapp/` output directory
2. Copies Mini App configuration files (`app.json`, `sitemap.json`, `project.config.json`)
3. Creates the Mini App directory structure
4. Generates Mini App API wrapper utilities
5. Prepares the project for Macle Developer Toolkit

### Output

The script generates files in `dist-miniapp/` directory:
- Configuration files
- Pages directory structure
- Utilities for Mini App API integration

