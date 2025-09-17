# AI Python Console - Installation Guide

## How to Install and Use the Chrome Extension

### Prerequisites
- Google Chrome browser
- Node.js (version 16 or higher)
- npm package manager

### Quick Installation

1. **Clone and Install Dependencies**:
   ```bash
   git clone https://github.com/realharry/ai-python-console.git
   cd ai-python-console
   npm install
   ```

2. **Build the Extension**:
   ```bash
   npm run build
   ```
   
   This command will:
   - Compile TypeScript
   - Build the React application with Vite
   - Run the post-build script to organize files correctly
   - Place `sidepanel.html` in the root of the `dist` directory (where Chrome expects it)

3. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - ✅ **The extension should now load without any errors**

### Using the Python Console

1. **Open the Console**:
   - Look for the AI Python Console icon in your Chrome toolbar
   - Click the icon to open the side panel

2. **Write and Execute Python Code**:
   - Enter Python code in the top text area
   - Click "Run" or press Ctrl+Enter to execute
   - View results in the output area below

3. **Features Available**:
   - **Run Code**: Execute Python-like code with fallback interpreter
   - **Clear**: Clear code or output areas
   - **Copy**: Copy output to clipboard
   - **Download**: Save your Python code as a .py file
   - **Persistent State**: Code and output saved across browser sessions

### Important Notes

#### File Structure
The build process ensures the correct file structure:
```
dist/
├── sidepanel.html      ← Must be in root directory
├── manifest.json       ← Chrome extension manifest
├── background.js       ← Service worker
├── sidepanel.js        ← Main application
├── sidepanel.css       ← Styles
└── icon*.png          ← Extension icons
```

#### Python Functionality
- Uses a **fallback Python interpreter** due to Chrome Web Store security requirements
- Supports basic Python operations: print statements, arithmetic, variable assignments
- For full Python functionality, PyScript would need to be bundled locally

#### Build Process
The automated build process (`npm run build`) includes:
1. TypeScript compilation
2. Vite bundling
3. **Post-build script** that moves `sidepanel.html` to the correct location
4. Copying manifest and icons to the dist directory

### Troubleshooting

#### "Side panel file path must exist" Error
This error occurs when `sidepanel.html` is not in the root of the `dist` directory.

**Solution**: Always use `npm run build` (not just `vite build`) to ensure the post-build script runs and places files correctly.

#### Build Errors
If you encounter build errors:
1. Make sure you have the latest dependencies: `npm install`
2. Clear any existing build: `rm -rf dist/`
3. Run the full build: `npm run build`

#### Extension Not Loading
1. Verify the `dist` directory contains `sidepanel.html` in the root
2. Check that `manifest.json` exists in the `dist` directory
3. Try reloading the extension in Chrome's extension page

### Development

For development work:
- Use `npm run dev` to start the Vite development server
- Use `npm run lint` to check TypeScript types
- Always test with `npm run build` before deployment

The extension is now ready for production use and Chrome Web Store submission!