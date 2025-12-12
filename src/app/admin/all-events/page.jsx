"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; 
import { db } from '@/lib/firebaseConfig'; 
import Link from 'next/link';

export default function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Delete Function
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", id));
        setEvents(events.filter(event => event.id !== id)); // Remove from UI
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading events...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Events ({events.length})</h2>
        <Link href="/admin/add-event" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          + Add New Event
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-sm uppercase text-gray-600">
              <th className="p-4">Event Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Venue</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{event.name}</td>
                <td className="p-4 text-gray-600">{event.date}</td>
                <td className="p-4 text-gray-600">{event.venue}</td>
                <td className="p-4 text-right space-x-2">
                  {/* EDIT BUTTON: Links to the dynamic page we are about to create */}
                  <Link 
                    href={`/admin/events/${event.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium px-2"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800 font-medium px-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}