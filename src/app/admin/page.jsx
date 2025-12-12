"use client";
import Link from 'next/link';

export default function AdminDashboard() {
  //dummy data
  const stats = [
    { label: "Total Users", value: "1,200", color: "bg-blue-500", icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    )},
    { label: "Total Events", value: "8", color: "bg-purple-500", icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    )},
    { label: "Registrations", value: "450", color: "bg-green-500", icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )},
    { label: "Pending Issues", value: "3", color: "bg-red-500", icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
    )},
  ];

  const recentActivity = [
    { id: 1, user: "Sparsh Choudhary", action: "registered for", target: "Hackathon 2025", time: "2 mins ago" },
    { id: 2, user: "Anwesha Admin", action: "created new event", target: "Cultural Night", time: "1 hour ago" },
    { id: 3, user: "John Doe", action: "updated profile", target: "", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-6 mt-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
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
        
        {/* Recent Activity Column (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Column (Takes up 1/3 space) */}
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
            <button className="block w-full text-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">
              Download Reports
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-blue-800 font-semibold mb-1">System Status</h3>
            <div className="flex items-center text-sm text-blue-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All systems operational
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}