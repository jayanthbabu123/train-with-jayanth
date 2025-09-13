# Technology Stack Documentation

## Frontend Framework
- **React 19.0.0** - Main frontend framework
- **Vite 6.2.0** - Build tool and development server

## UI Libraries & Styling
- **Ant Design 5.25.1** - Primary UI component library
- **Bootstrap 5.3.6** - CSS framework for layout and responsive design
- **React Icons 5.5.0** - Icon library for technology-specific icons
- **Ant Design Icons** - Icons for UI elements (buttons, navigation, etc.)

## State Management & Routing
- **React Router DOM 7.4.1** - Client-side routing
- **React Context API** - State management (AuthContext)

## Backend & Services
- **Firebase 11.7.1** - Backend-as-a-Service
  - Firestore - Database
  - Authentication - User management
  - Storage - File storage
  - Hosting - Static site hosting

## Development Tools
- **ESLint 9.21.0** - Code linting
- **TypeScript types** - Type definitions for React

## Additional Libraries
- **React Hot Toast 2.5.2** - Toast notifications
- **Date-fns 4.1.0** - Date manipulation
- **Framer Motion 12.10.5** - Animations
- **React Markdown 10.1.0** - Markdown rendering
- **Monaco Editor 4.7.0** - Code editor
- **CodeSandbox Sandpack 2.20.0** - In-browser code execution

## Important Notes for Developers

### CSS Framework Usage
- **Use Ant Design components** for UI elements (buttons, cards, forms, etc.)
- **Use Bootstrap classes** for layout and responsive design
- **Avoid Tailwind CSS** - It has been removed from the project
- **Use inline styles or custom CSS** for component-specific styling

### Styling Guidelines
1. **Primary UI Components**: Use Ant Design components
2. **Layout**: Use Bootstrap grid system and utilities
3. **Icons**: Use React Icons for technology icons, Ant Design Icons for UI icons
4. **Custom Styling**: Use inline styles or create CSS files for specific components

### Project Structure
- `/src/components/` - Reusable UI components
- `/src/pages/` - Page components
- `/src/contexts/` - React contexts for state management
- `/src/services/` - API and external service integrations
- `/src/styles/` - Global styles and theme files

### Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

### Key Dependencies to Remember
- **Ant Design** for UI components
- **Bootstrap** for layout
- **React Icons** for icons
- **Firebase** for backend services
