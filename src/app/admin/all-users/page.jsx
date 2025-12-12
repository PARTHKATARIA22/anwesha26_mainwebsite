"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '@/lib/firebaseConfig';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-9">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users ({users.length})</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          Download CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-sm uppercase text-gray-600">
              <th className="p-4">Name</th>
              <th className="p-4">Anwesha ID</th>
              <th className="p-4">College</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </td>
                <td className="p-4 font-mono text-gray-600">
                  {user.anweshaId || "N/A"}
                </td>
                <td className="p-4 text-gray-600">
                  {/* Access nested map safely */}
                  {user.college?.name || "Unknown College"}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {(user.role || 'USER').toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}