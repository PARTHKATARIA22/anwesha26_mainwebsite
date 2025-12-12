"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; 
import { db } from '@/lib/firebaseConfig'; 
import Link from 'next/link';

export default function AllEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm("Delete this event? This action cannot be undone.")) {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter(event => event.id !== id));
      if(selectedEvent?.id === id) setSelectedEvent(null);
    }
  };

  const getBadgeStyle = (cat) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border";
    switch(cat?.toLowerCase()) {
      case 'tech': return `${base} bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]`;
      case 'cultural': return `${base} bg-pink-500/10 text-pink-400 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.5)]`;
      case 'sports': return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]`;
      default: return `${base} bg-gray-500/10 text-gray-400 border-gray-500/50`;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    // FIX: Using negative margins (-m-8) to expand outward over the white padding
    // Added matching padding (p-8) so the content stays centered and neat
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500 selection:text-white pb-20 -m-8 p-8 w-[calc(100%+4rem)]">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-slate-900 py-20 px-6 sm:px-12 mb-12 border-b border-white/10 -mx-8">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white animate-gradient">
            FEST<span className="text-white">VERSE</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-xl leading-relaxed">
            Explore the timeline. Witness the energy. The biggest cultural phenomenon of IIT starts here.
          </p>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="w-full max-w-[1600px] mx-auto px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        {events.map((event) => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] cursor-pointer"
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={event.img_src || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                alt={event.Name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 right-4">
                <span className={getBadgeStyle(event.category)}>{event.category}</span>
              </div>
            </div>

            <div className="p-6 relative -mt-10">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">{event.Name}</h3>
                <span className="text-lg font-bold text-emerald-400">{event.Price === '0' ? 'Free' : event.Price}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <span>🗓</span> {event.Date}
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span> {event.Venue}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{event.type} Event</span>
                <button 
                  onClick={(e) => handleDelete(e, event.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ADD EVENT CARD */}
        <Link 
            href="/admin/add-event"
            className="group relative h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 hover:border-violet-500 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
        >
            <div className="w-20 h-20 rounded-full bg-violet-600/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 transition-all duration-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <svg className="w-10 h-10 text-violet-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Initialize New Event</h3>
            <p className="text-sm text-slate-400 text-center max-w-[200px]">Add a new competition or show to the fest timeline</p>
        </Link>

      </div>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedEvent(null)} />
          
          <div className="relative bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300 scrollbar-hide">
            
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white/70 hover:text-white hover:bg-red-500 transition-all backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto min-h-[400px]">
                <img src={selectedEvent.img_src} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-6 left-6 right-6">
                   <span className={getBadgeStyle(selectedEvent.category)}>{selectedEvent.category}</span>
                   <h2 className="text-4xl font-black text-white mt-3 leading-tight">{selectedEvent.Name}</h2>
                </div>
              </div>

              <div className="p-8 space-y-6 flex flex-col justify-center">
                <p className="text-slate-300 text-lg leading-relaxed">{selectedEvent.Description}</p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                  <InfoItem label="Date" value={selectedEvent.Date} icon="📅" />
                  <InfoItem label="Time" value={`${selectedEvent.Timings} (${selectedEvent.Duration})`} icon="⏰" />
                  <InfoItem label="Venue" value={selectedEvent.Venue} icon="📍" />
                  <InfoItem label="Team Size" value={selectedEvent["Team Size"]} icon="👥" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="block text-sm text-slate-500 uppercase tracking-widest">Entry Fee</span>
                    <span className="text-3xl font-bold text-emerald-400">{selectedEvent.Price}</span>
                  </div>
                  <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-violet-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <div>
    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">{label}</span>
    <span className="text-slate-200 font-medium flex items-center gap-2"><span>{icon}</span> {value}</span>
  </div>
);