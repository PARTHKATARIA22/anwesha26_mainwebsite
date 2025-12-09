"use client";

import { useState } from "react";
import { useAuthUser } from "../../../context/AuthUserContext";
import toast from "react-hot-toast";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

export default function Step3({ next }) {
  const { currentUser, updateUser } = useAuthUser();

  const [disabled, setDisabled] = useState(false);

  const [collegeName, setCollegeName] = useState(
    currentUser?.college?.name || ""
  );
  const [passingYear, setPassingYear] = useState(
    currentUser?.college?.passingYear || ""
  );
  const [city, setCity] = useState(currentUser?.college?.city || "");

  /** Save College Info */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!currentUser) return toast.error("Login Required");

    if (passingYear.length !== 4)
      return toast.error("Invalid passing year (e.g., 2028)");

    try {
      setDisabled(true);

      const collegeDetails = {
        name: collegeName,
        passingYear,
        city,
      };

      await updateUser(currentUser.uid, {
        college: collegeDetails,
        status: "3",
      });

      toast.success("College details saved!");
      next();
    } catch (err) {
      toast.error("Unable to save details");
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div className="flex items-center justify-center mb-14 px-2">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-lg 
                      backdrop-blur-lg text-center bg-white/80 animate-fade-in">
        
        {/* Heading */}
        <h3 className="text-5xl font-extrabold mb-9 text-[#433D7F]">
          Step 3: College Details
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">

          {/* College Name */}
          <div className="relative">
            <GraduationCap
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter your college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 
                         outline-none border-2 border-transparent text-xl 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 
                         placeholder-gray-500"
              required
            />
          </div>

          {/* Passing Year */}
          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="number"
              placeholder="Passing Year e.g. 2028"
              value={passingYear}
              onChange={(e) => setPassingYear(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 
                         outline-none border-2 border-transparent text-xl
                         focus:border-green-400 focus:ring-2 focus:ring-green-200 
                         placeholder-gray-500"
              required
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              size={20}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/60 
                         outline-none border-2 border-transparent text-xl
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-200 
                         placeholder-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundImage: "url('/bg_2_cropped.jpg')" }}
            className="w-full text-2xl tracking-widest  
                       bg-cover bg-bottom rounded-xl text-white py-2 mb-4 hover:scale-102 
                       font-bold shadow-lg transition-all duration-300 transform
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {disabled ? "Processing..." : "Save & Next →"}
          </button>
        </form>
      </div>
    </div>
  );
}
