/**
 * Language templates for code editor
 * Each template includes:
 * - name: Display name
 * - color: Theme color
 * - icon: Display icon
 * - template: Sandpack template type
 * - files: Default files structure
 */

export const LANGUAGE_TEMPLATES = {
  html: { 
    name: 'HTML', 
    color: '#e34c26', 
    icon: '🌐', 
    template: 'vanilla',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>`,
      '/index.js': `// This file is required for the sandbox to work
// No need to modify this file for HTML assignments`
    }
  },
  css: { 
    name: 'CSS', 
    color: '#264de4', 
    icon: '🎨', 
    template: 'vanilla',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>This is styled with CSS</p>
  </div>
</body>
</html>`,
      '/styles.css': `/* Add your styles here */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #264de4;
}

p {
  color: #333;
  line-height: 1.6;
}`,
      '/index.js': `// This file is required for the sandbox to work
// Import CSS file to make styling work
import "./styles.css";`
    }
  },
  javascript: { 
    name: 'JavaScript', 
    color: '#f7df1e', 
    icon: '📜', 
    template: 'vanilla',
    files: {
      '/index.html': `<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Assignment</title>
</head>
<body>
  <h1>JavaScript Assignment</h1>
  <div id="app">Loading...</div>
</body>
</html>`,
      '/styles.css': `/* CSS styles for JavaScript assignment */
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

h1 {
  color: #f7df1e;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
}

#app {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}`,
      '/index.js': `// Import CSS
import "./styles.css";

// JavaScript code
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Example usage
document.getElementById('app').innerHTML = greet('World');

// Add more JavaScript code below
console.log('JavaScript is running!');`
    }
  },
  react: { 
    name: 'React', 
    color: '#61dafb', 
    icon: '⚛️', 
    template: 'react',
    files: {
      '/App.js': `import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Hello React!</h1>
      <p className="app-text">This is a React component with imported CSS</p>
      <button className="app-button">Click me</button>
    </div>
  );
}

export default App;`,
      '/styles.css': `/* Styles for React component */
.app-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.app-title {
  color: #61dafb;
  margin-bottom: 16px;
}

.app-text {
  color: #333;
  line-height: 1.5;
  margin-bottom: 20px;
}

.app-button {
  background-color: #61dafb;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.app-button:hover {
  background-color: #0099cc;
}`,
      '/index.js': `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`
    }
  },
  github: { 
    name: 'GitHub', 
    color: '#333', 
    icon: '🐙', 
    template: 'vanilla',
    files: {
      '/README.md': `# Git Commands

## Basic Commands
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

## Additional Commands
\`\`\`bash
git status
git branch
git checkout -b feature/new-branch
\`\`\``,
      '/index.js': `// This file is required for the sandbox to work
// You can add your JavaScript code here if needed`
    }
  }
}; 