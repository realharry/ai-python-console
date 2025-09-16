# AI Python Console - Installation Guide

## How to Install and Test the Chrome Extension

### Prerequisites
- Google Chrome browser
- Basic understanding of Chrome extension development (optional)

### Installation Steps

1. **Build the Extension** (if you haven't already):
   ```bash
   npm install
   npm run build
   ```

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - The extension should now appear in your extensions list

3. **Open the Python Console**:
   - Look for the AI Python Console icon in your Chrome toolbar
   - Click the icon to open the side panel
   - The Python console will open on the right side of your browser

### Features

- **Python Code Execution**: Write and execute Python code using PyScript
- **State Persistence**: Your code and output are saved even when closing the panel
- **Active Badge**: Extension icon shows a green badge when the console is active
- **Code Management**: Run, clear, copy, and download your Python code
- **Fallback Mode**: Basic functionality even when PyScript is loading

### Usage

1. **Write Python Code**: Enter your Python code in the top text area
2. **Execute Code**: Click "Run" or press Ctrl+Enter
3. **View Output**: Results appear in the bottom text area
4. **Manage Code**: Use buttons to clear, copy, or download your code

### Troubleshooting

- **PyScript Loading**: Wait for PyScript to fully load (up to 30 seconds)
- **Fallback Mode**: Basic operations work even when PyScript isn't ready
- **Permissions**: Make sure the extension has the required permissions

### Technical Details

- Built with React, TypeScript, Vite, and Tailwind CSS
- Uses PyScript for Python execution in the browser
- Chrome Storage API for state persistence
- Manifest V3 compatible