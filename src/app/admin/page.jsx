"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig'; // Ensure this matches your path

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  // State for the Stats Cards
  const [statsData, setStatsData] = useState({
    users: 0,
    events: 0,
    orders: 0,
    products: 0
  });

  // State for Recent Activity
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Define Collections
        const usersColl = collection(db, "users");
        const eventsColl = collection(db, "events");
        const ordersColl = collection(db, "orders"); // From your screenshot
        const productsColl = collection(db, "products"); // From your screenshot

        // 2. Fetch Counts in Parallel (Fast & Cheap)
        const [userSnap, eventSnap, orderSnap, productSnap] = await Promise.all([
          getCountFromServer(usersColl),
          getCountFromServer(eventsColl),
          getCountFromServer(ordersColl),
          getCountFromServer(productsColl)
        ]);

        // 3. Fetch Recent Activity (Last 5 registered users)
        // We order by 'createdAt' (descending) to get the newest first
        const q = query(usersColl, orderBy("createdAt", "desc"), limit(5));
        const recentSnap = await getDocs(q);
        
        const recentList = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 4. Update State
        setStatsData({
          users: userSnap.data().count,
          events: eventSnap.data().count,
          orders: orderSnap.data().count,
          products: productSnap.data().count
        });
        setRecentUsers(recentList);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format Helper for Timestamps (handles Firestore Timestamp or Number)
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Define the Stats Cards configuration using real data
  const stats = [
    { 
      label: "Total Users", 
      value: statsData.users.toLocaleString(), 
      color: "bg-blue-500", 
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> 
    },
    { 
      label: "Total Events", 
      value: statsData.events.toLocaleString(), 
      color: "bg-purple-500", 
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
    },
    { 
      label: "Total Orders", 
      value: statsData.orders.toLocaleString(), 
      color: "bg-green-500", 
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
    },
    { 
      label: "Total Products", 
      value: statsData.products.toLocaleString(), 
      color: "bg-red-500", 
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg> 
    },
  ];

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6 mt-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin! Here's your real-time overview.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-white px-4 py-2 rounded shadow text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
            <div className={`p-4 rounded-full ${stat.color} shadow-lg mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Column */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Newest Registrations</h2>
            <Link href="/admin/all-users" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
                <p className="text-gray-400 text-sm">No recent activity found.</p>
            ) : (
                recentUsers.map((user) => (
                <div key={user.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                    <p className="text-sm text-gray-800">
                        <span className="font-semibold">{user.firstName} {user.lastName}</span> joined Anwesha from <span className="font-semibold text-blue-600">{user.college?.name || "Unknown College"}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {user.email} • {formatTime(user.createdAt)}
                    </p>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href="/admin/add-event" 
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              + Create New Event
            </Link>
            <Link 
              href="/admin/all-users" 
              className="block w-full text-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Manage Users
            </Link>
            {/* You can add a route for this later if needed */}
            <button className="block w-full text-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition opacity-50 cursor-not-allowed">
              Download Reports (Soon)
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-blue-800 font-semibold mb-1">System Status</h3>
            <div className="flex items-center text-sm text-blue-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected to Firebase
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}