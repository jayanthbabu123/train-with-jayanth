import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-background-gradient font-primary">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background-gradient">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 