import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background-dark border-r border-primary-800">
      <div className="p-6">
        <h1 className="text-2xl font-secondary font-bold text-primary-100">Train with Jayanth</h1>
      </div>
      <nav className="mt-6">
        <NavLink
          to="/student/assignments"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-primary-100 hover:bg-primary-800 transition-colors ${
              isActive ? 'bg-primary-800' : ''
            }`
          }
        >
          <span className="font-secondary">Assignments</span>
        </NavLink>
        {/* Add more navigation links as needed */}
      </nav>
    </aside>
  );
} 