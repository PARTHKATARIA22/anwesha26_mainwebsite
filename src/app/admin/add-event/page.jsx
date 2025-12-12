"use client";
import { useState } from 'react';
import { db } from '@/lib/firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 

export default function AddEventPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    Name: '', Date: '', Description: '', Duration: '', Price: '',
    "Team Size": '', Timings: '', Venue: '', category: 'tech',
    img_src: '', type: 'Solo', visibility: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), { ...formData, createdAt: serverTimestamp() });
      
      alert("Event successfully created! Returning to All Events...");
      
      // ✅ UPDATED: Redirects to the specific admin/all-events page
      router.push('/admin/all-events'); 
      
    } catch (error) { 
      console.error(error); 
      alert("Error adding event."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop" 
          alt="background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen py-12 px-4 sm:px-6">
        
        {/* --- NAVIGATION --- */}
        <div className="w-full max-w-5xl mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
           {/* ✅ UPDATED: Points to the specific admin/all-events page */}
           <Link 
             href="/admin/all-events" 
             className="inline-flex items-center gap-3 text-slate-400 hover:text-white transition-all duration-300 group"
           >
             <div className="p-3 rounded-full border border-slate-700 bg-slate-900/50 group-hover:bg-violet-600 group-hover:border-violet-500 transition-all shadow-lg">
               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
             </div>
             <div>
                <span className="block text-xs font-bold tracking-widest uppercase text-slate-500 group-hover:text-violet-300">Go Back</span>
                <span className="block text-lg font-bold text-slate-300 group-hover:text-white">All Events List</span>
             </div>
           </Link>
        </div>

        {/* MAIN FORM CARD */}
        <div className="w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 duration-500">
          
          <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
             <div>
               <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Initialize Event</h2>
               <p className="text-violet-200/60 text-sm font-medium">Add new entry to the Fest Schedule</p>
             </div>
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Database Active</span>
             </div>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* SECTION A: Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InputGroup label="Event Name" name="Name" value={formData.Name} onChange={handleChange} placeholder="e.g. Neon Nights Concert" />
                <InputGroup label="Banner Image URL" name="img_src" value={formData.img_src} onChange={handleChange} placeholder="https://..." />
              </div>

              {/* SECTION B: Logistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <InputGroup label="Date" name="Date" value={formData.Date} onChange={handleChange} placeholder="DD/MM/YYYY" />
                <InputGroup label="Time" name="Timings" value={formData.Timings} onChange={handleChange} placeholder="HH:MM AM/PM" />
                <InputGroup label="Duration" name="Duration" value={formData.Duration} onChange={handleChange} placeholder="e.g. 2 Hours" />
                <InputGroup label="Venue" name="Venue" value={formData.Venue} onChange={handleChange} placeholder="e.g. Main Auditorium" />
              </div>

              {/* SECTION C: Specifics */}
              <div className="p-8 rounded-2xl bg-black/20 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 hover:border-white/10 transition-colors">
                 <InputGroup label="Price (Fee)" name="Price" value={formData.Price} onChange={handleChange} placeholder="Rs. 500" />
                 <InputGroup label="Team Size" name="Team Size" value={formData["Team Size"]} onChange={handleChange} placeholder="e.g. 3-5 Members" />
                 
                 <div className="relative group">
                   <label className="block text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 group-hover:text-violet-300 transition-colors">Category</label>
                   <select name="category" value={formData.category} onChange={handleChange} 
                     className="w-full appearance-none bg-slate-800/50 border-b border-slate-600 py-2.5 text-white font-medium focus:outline-none focus:border-violet-500 focus:bg-slate-800 transition-all cursor-pointer">
                     <option value="tech" className="bg-slate-900">Technical</option>
                     <option value="cultural" className="bg-slate-900">Cultural</option>
                     <option value="sports" className="bg-slate-900">Sports</option>
                     <option value="gaming" className="bg-slate-900">Gaming</option>
                   </select>
                   <div className="absolute right-0 bottom-3.5 pointer-events-none text-slate-500 group-hover:text-violet-400 transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                   <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-violet-500 transition-all duration-300 group-focus-within:w-full"></div>
                 </div>
              </div>

              {/* SECTION D: Description */}
              <div className="relative group">
                <label className="block text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 group-focus-within:text-violet-300 transition-colors">Description</label>
                <textarea name="Description" value={formData.Description} onChange={handleChange} rows="5" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none shadow-inner"
                  placeholder="Describe the event, rules, and vibes..." required />
              </div>

              {/* SECTION E: Submit Area */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
                 <label className="flex items-center gap-4 cursor-pointer group select-none p-2 rounded-lg hover:bg-white/5 transition-colors">
                   <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ease-in-out ${formData.visibility ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}>
                     <div className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform duration-300 ${formData.visibility ? 'translate-x-7' : 'translate-x-0'}`} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white text-sm font-bold group-hover:text-emerald-300 transition-colors">Public Visibility</span>
                     <span className="text-xs text-slate-500">Show on timeline instantly</span>
                   </div>
                 </label>

                 <button type="submit" disabled={loading}
                   className="w-full md:w-auto relative overflow-hidden bg-white text-slate-950 px-12 py-4 rounded-xl font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group">
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          <span>SYNCING...</span>
                        </>
                     ) : (
                        <>
                          <span>🚀 PUBLISH EVENT</span>
                        </>
                     )}
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-white to-violet-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({ label, name, value, onChange, placeholder }) => (
  <div className="group relative">
    <label className="block text-xs font-bold text-violet-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-violet-300">{label}</label>
    <div className="relative">
      <input 
        type="text" name={name} value={value} onChange={onChange} required
        className="block w-full bg-transparent border-b border-slate-700 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:bg-white/5 transition-all font-medium"
        placeholder={placeholder}
      />
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-violet-500 shadow-[0_0_10px_#8b5cf6] transition-all duration-500 ease-out group-focus-within:w-full"></div>
    </div>
  </div>
);