"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore'; 
import { db } from '@/lib/firebaseConfig';
import Link from 'next/link';

// 👇 IMPORT PDF LIBRARIES
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Pagination State
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [pageHistory, setPageHistory] = useState([]);
  
  const USERS_PER_PAGE = 20;

  useEffect(() => {
    fetchFirstPage();
  }, []);

  const fetchFirstPage = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("email"), limit(USERS_PER_PAGE));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setUsers(usersList);
      if (querySnapshot.docs.length > 0) {
        setFirstVisible(querySnapshot.docs[0]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      setIsFirstPage(true);
      setIsLastPage(querySnapshot.docs.length < USERS_PER_PAGE);
      setPageHistory([]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleNextPage = async () => {
     if (!lastVisible || isLastPage) return;
     setLoading(true);
     try {
       setPageHistory(prev => [...prev, firstVisible]);
       const q = query(collection(db, "users"), orderBy("email"), startAfter(lastVisible), limit(USERS_PER_PAGE));
       const querySnapshot = await getDocs(q);
       if (!querySnapshot.empty) {
         const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setUsers(usersList);
         setFirstVisible(querySnapshot.docs[0]);
         setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
         setIsFirstPage(false);
         setIsLastPage(querySnapshot.docs.length < USERS_PER_PAGE);
       } else {
         setIsLastPage(true);
       }
     } catch (error) {
       console.error("Error next page:", error);
     }
     setLoading(false);
  };

  const handlePrevPage = async () => {
    if (isFirstPage || pageHistory.length === 0) return;
    setLoading(true);
    try {
      const newHistory = pageHistory.slice(0, -1); // Remove last entry
      const q = query(collection(db, "users"), orderBy("email"), endBefore(firstVisible), limitToLast(USERS_PER_PAGE));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setFirstVisible(querySnapshot.docs[0]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setPageHistory(newHistory);
      setIsFirstPage(newHistory.length === 0);
      setIsLastPage(false);
    } catch (error) {
      console.error("Error prev page:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // ✅ NEW FUNCTION: Generate PDF
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // 1. Fetch ALL data
      const querySnapshot = await getDocs(collection(db, "users"));
      
      // 2. Initialize PDF
      const doc = new jsPDF();

      // 3. Add Title
      doc.setFontSize(18);
      doc.text("Anwesha 2025 - All Users Report", 14, 20);
      doc.setFontSize(11);
      doc.text(`Total Users: ${querySnapshot.size}`, 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

      // 4. Prepare Table Data
      const tableColumn = ["First Name", "Last Name", "Email", "Anwesha ID", "Role", "College"];
      const tableRows = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const rowData = [
          data.firstName || '',
          data.lastName || '',
          data.email || '',
          data.anweshaId || 'N/A',
          data.role || 'user',
          data.college?.name || 'N/A',
        ];
        tableRows.push(rowData);
      });

      // 5. Create Table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45, // Start table below title
        theme: 'grid', // 'striped', 'grid', or 'plain'
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] } // Green header color
      });

      // 6. Save PDF
      doc.save(`anwesha_users_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
    setDownloading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-9">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <div className="flex gap-2">
            {/* ✅ PDF BUTTON */}
            <button 
              onClick={handleDownloadPDF}
              disabled={downloading}
              className={`px-4 py-2 rounded text-sm font-bold transition flex items-center gap-2 ${
                downloading 
                  ? "bg-gray-400 cursor-not-allowed text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {downloading ? (
                <>Generating PDF...</> 
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Download PDF
                </>
              )}
            </button>
        </div>
      </div>
      
      {/* TABLE */}
      <div className="overflow-x-auto min-h-[400px]">
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
                  <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </td>
                <td className="p-4 font-mono text-gray-600">{user.anweshaId || "N/A"}</td>
                <td className="p-4 text-gray-600">{user.college?.name || "Unknown"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {(user.role || 'USER').toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                        <Link href={`/admin/users/${user.id}`}>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <span className="text-sm text-gray-500">Page: {pageHistory.length + 1}</span>
        <div className="flex gap-2">
            <button 
                onClick={handlePrevPage} 
                disabled={isFirstPage || loading}
                className={`px-4 py-2 text-sm font-medium rounded border ${isFirstPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
                Previous
            </button>
            <button 
                onClick={handleNextPage} 
                disabled={isLastPage || loading}
                className={`px-4 py-2 text-sm font-medium rounded border ${isLastPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
}