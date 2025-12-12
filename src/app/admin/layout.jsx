"use client";
import ProtectedRoute from "@/components/ProtectedRoute"; // Your existing import
import AdminSidebar from "@/components/AdminSidebar"; // Import the sidebar we just made

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-100">
        
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </ProtectedRoute>
  );
}