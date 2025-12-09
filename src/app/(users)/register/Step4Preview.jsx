"use client";

import { ClipboardList } from "lucide-react";
import { useAuthUser } from "../../../context/AuthUserContext";
import toast from "react-hot-toast";

export default function Step4({ next }) {
  const { currentUser, finalizeRegistration, updateUser } = useAuthUser();

  async function handleSubmit() {
    try {
      if (!currentUser?.uid) {
        toast.error("Login Required");
        return;
      }

      const anweshaId = await finalizeRegistration(currentUser.uid);

      await updateUser(currentUser.uid, { status: "successful" });

      toast.success("Registration Completed!");
      next(anweshaId);
    } catch (err) {
      toast.error("Submission failed");
    }
  }

  return (
    <div className="flex items-center justify-center mb-14 px-6">
      <div className="rounded-3xl shadow-2xl border p-10 w-full max-w-lg 
                      text-center animate-fade-in bg-white/80 backdrop-blur-lg">

        {/* Heading */}
        <h3 className="text-5xl text-[#433D7F] font-extrabold mb-12">
          Confirm Your Details
        </h3>

        {/* Details Preview */}
        <div className="text-left space-y-6">

          {/* Personal */}
          <div>
            <h4 className="font-semibold text-gray-800 text-2xl border-b pb-1">
              Personal Details
            </h4>
            <p className="text-gray-800 mt-2 text-xl">
              <b>Name:</b> {currentUser.personal?.firstName}{" "}
              {currentUser.personal?.lastName}
            </p>
            <p className="text-gray-800 mt-1 text-xl">
              <b>Gender:</b> {currentUser.personal?.gender}
            </p>
          </div>

          {/* College */}
          <div>
            <h4 className="font-semibold text-gray-800 text-2xl border-b pb-1">
              College Details
            </h4>
            <p className="text-gray-800 mt-2 text-xl">
              <b>College:</b> {currentUser.college?.name}
            </p>
            <p className="text-gray-800 mt-1 text-xl">
              <b>City:</b> {currentUser.college?.city}
            </p>
            <p className="text-gray-800 mt-1 text-xl">
              <b>Passing Year:</b> {currentUser.college?.passingYear}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 text-2xl border-b pb-1">
              Contact Details
            </h4>
            <p className="text-gray-800 mt-2 text-xl">
              <b>Phone:</b> {currentUser.contact?.phone}
            </p>
            <p className="text-gray-800 mt-1 text-xl">
              <b>Address:</b> {currentUser.contact?.address}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{ backgroundImage: "url('/bg_2_cropped.jpg')" }}
          className="mt-8 px-6 py-3 w-full text-2xl tracking-widest 
                      bg-cover bg-bottom 
                     rounded-xl text-white font-bold shadow-lg 
                     hover:scale-105 transition-all duration-300"
        >
          Submit & Get Anwesha ID
        </button>
      </div>
    </div>
  );
}
