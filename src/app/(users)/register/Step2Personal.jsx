"use client";

import { useState } from "react";
import { useAuthUser } from "../../../context/AuthUserContext";
import toast from "react-hot-toast";
import { User, Calendar, Phone, MapPin } from "lucide-react";

export default function Step2Personal({ next }) {
  const { currentUser, updateUser } = useAuthUser();
  const [disabled, setDisabled] = useState(false);

  const [localData, setLocalData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
  });

  /** Input Handler */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // phone validation — numeric + 10 digits only
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setLocalData({ ...localData, [name]: value });
  };

  /** Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return toast.error("Login Required");

    if (localData.phone.length !== 10) {
      return toast.error("Phone must be 10 digits");
    }

    try {
      setDisabled(true);

      await updateUser(currentUser.uid, {
        personal: {
          firstName: localData.firstName,
          lastName: localData.lastName,
          dob: localData.dob,
          gender: localData.gender,
        },
        contact: {
          phone: localData.phone,
          address: localData.address,
        },
        status: "2",
      });

      toast.success("Personal details saved!");
      next();
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-center mb-14 px-2">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-lg bg-white/80 backdrop-blur-lg text-center animate-fade-in">

        {/* Heading */}
        <h3 className="text-[3rem] font-extrabold text-[#433D7F] mb-8">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">

          {/* First Name + Last Name */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                name="firstName"
                value={localData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full pl-12 py-3 rounded-xl bg-white/60 text-black outline-none border-2 border-transparent focus:border-blue-400 placeholder-gray-500"
                required
              />
            </div>

            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                name="lastName"
                value={localData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full pl-12 py-3 rounded-xl bg-white/60 text-black outline-none border-2 border-transparent focus:border-blue-400 placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* DOB */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
            <input
              type={localData.dob ? "date" : "text"}
              name="dob"
              placeholder="Date of Birth"
              value={localData.dob}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!localData.dob) e.target.type = "text";
              }}
              onChange={handleChange}
              className="w-full pl-12 py-3 rounded-xl bg-white/60 text-black outline-none border-2 border-transparent focus:border-blue-400 placeholder-gray-500"
              required
            />
          </div>

          {/* Gender */}
          <select
            name="gender"
            value={localData.gender}
            onChange={handleChange}
            className="w-full pl-4 py-3 rounded-xl bg-white/60 text-gray-700 outline-none border-2 border-transparent focus:border-blue-400"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (10 digits)"
              value={localData.phone}
              onChange={handleChange}
              className="w-full pl-12 py-3 rounded-xl bg-white/60 text-black outline-none border-2 border-transparent focus:border-blue-400 placeholder-gray-500"
              required
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute left-4 top-3 text-gray-700" size={20} />
            <textarea
              name="address"
              placeholder="Address"
              value={localData.address}
              onChange={handleChange}
              rows={3}
              className="w-full pl-12 py-3 rounded-xl bg-white/60 text-black outline-none border-2 border-transparent focus:border-blue-400 placeholder-gray-500 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled}
            style={{ backgroundImage: "url('/bg_2_cropped.jpg')" }}
            className="w-full text-2xl  bg-cover bg-bottom font-bold text-white rounded-xl py-3 shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {disabled ? "Processing..." : "Save & Next →"}
          </button>
        </form>
      </div>
    </div>
  );
}
