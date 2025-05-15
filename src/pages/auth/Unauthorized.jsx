import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link
          to="/login"
          className="bg-[#0284c7] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0369a1] transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
} 