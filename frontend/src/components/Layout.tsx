import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/events" className="flex items-center px-4 text-gray-700 hover:text-blue-600">
                Events
              </Link>
              <Link to="/my-events" className="flex items-center px-4 text-gray-700 hover:text-blue-600">
                My Events
              </Link>
              <Link to="/create-event" className="flex items-center px-4 text-gray-700 hover:text-blue-600">
                Create Event
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hello, {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}