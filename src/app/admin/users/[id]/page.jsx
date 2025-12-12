"use client";
import { useState, useEffect, use } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '@/lib/firebaseConfig'; // Ensure this path matches your setup
import { useRouter } from 'next/navigation';

export default function EditUserPage({ params }) {
  // Unwrap the params to get the User ID (Next.js 15+ standard)
  const { id: userId } = use(params);
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // State to hold the form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    anweshaId: '',
    role: 'user',
    collegeName: '' // We will flatten the nested college object for easier editing
  });

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            anweshaId: data.anweshaId || '',
            role: data.role || 'user',
            collegeName: data.college?.name || '' // Extract just the college name
          });
        } else {
          alert("User not found!");
          router.push('/admin/all-users');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router]);

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "users", userId);
      
      // We only update specific fields to avoid overwriting the whole document
      await updateDoc(docRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        anweshaId: formData.anweshaId,
        // Update the nested college name (merge with existing map is safer, but this works for simple updates)
        "college.name": formData.collegeName 
      });

      alert("User updated successfully!");
      router.push('/admin/all-users'); // Redirect back to list
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center">Loading user details...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit User Profile</h2>
        <span className="text-sm text-gray-500 font-mono">{userId}</span>
      </div>
      
      <form onSubmit={handleUpdate} className="space-y-5">
        
        {/* Row 1: Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Row 2: Email & Anwesha ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email (Read-only)</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Anwesha ID</label>
            <input
              type="text"
              name="anweshaId"
              value={formData.anweshaId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>
        </div>

        {/* Row 3: College */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">College Name</label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Row 4: Role Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="coordinator">Coordinator</option>
            <option value="campus_ambassador">Campus Ambassador</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            ⚠️ Be careful: Granting "Admin" access gives full control over this panel.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/all-users')}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}