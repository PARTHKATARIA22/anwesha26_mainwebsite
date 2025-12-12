// src/components/AdminSidebar.jsx
import Link from 'next/link';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 sticky top-0">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link href="/admin" className="block p-3 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          
          {/* Users Section */}
          <li className="text-gray-400 text-sm font-semibold mt-4 mb-2 uppercase">Users</li>
          <li>
            <Link href="/admin/all-users" className="block p-3 hover:bg-gray-700 rounded">
              All Users
            </Link>
          </li>

          {/* Events Section */}
          <li className="text-gray-400 text-sm font-semibold mt-4 mb-2 uppercase">Events</li>
          <li>
            <Link href="/admin/all-events" className="block p-3 hover:bg-gray-700 rounded">
              All Events
            </Link>
          </li>
          <li>
            <Link href="/admin/add-event" className="block p-3 hover:bg-gray-700 rounded">
              Add Event
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;