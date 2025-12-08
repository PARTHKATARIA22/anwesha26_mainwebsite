"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthUser } from "../../context/AuthUserContext";
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation";

export default function Step1EmailPassword({ next }) {
  const router = useRouter();
  const { registerUser } = useAuthUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // otp
  const [otp, setOtp] = useState("");
  const [isOtpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);
  const timerRef = useRef(null);
  const [remaining, setRemaining] = useState(0);

  /** 🔹 Send OTP */
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Enter email");
    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters");

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtp("");

    try {
      setDisabled(true);

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE,
        { otp: newOtp, email },
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
      );

      toast.success("OTP sent!");
      setOtpSent(true);
      setExpiryTime(Date.now() + 5 * 60 * 1000); // 5 mins
    } catch (err) {
      toast.error("Failed sending OTP");
    } finally {
      setDisabled(false);
    }
  };

  /** 🔹 Verify OTP & Register */
  const verifyOtp = async (e) => {
    e.preventDefault();

    if (Date.now() > expiryTime) {
      toast.error("OTP expired, resend.");
      return;
    }

    if (otp === generatedOtp) {
      toast.success("OTP Verified!");

      const userDoc = await registerUser(email, password);
      if (userDoc) next();
    } else {
      toast.error("Invalid OTP");
    }
  };

  /** 🔹 Timer effect */
  useEffect(() => {
    if (!expiryTime) return;
    timerRef.current = setInterval(() => {
      const diff = expiryTime - Date.now();
      setRemaining(diff > 0 ? Math.floor(diff / 1000) : 0);
      if (diff <= 0) clearInterval(timerRef.current);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [expiryTime]);

  const resendOtp = () => {
    setOtpSent(false);
    sendOtp({ preventDefault: () => {} });

  };

  return (
    <div className="flex items-center justify-center mb-12 px-4">
      <div className="rounded-3xl shadow-xl border p-10 w-full max-w-md bg-white/80 text-center animate-fade-in">
        <h2 className="text-4xl font-extrabold mb-8 bg-linear-to-r from-[#471b00] to-[#d79757] bg-clip-text text-transparent">
          Register for Anwesha
        </h2>

        {!isOtpSent ? (
          /** STEP 1 — Email + Password */
          <form onSubmit={sendOtp} className="flex flex-col gap-6">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-xl text-black bg-white/50 outline-none border-2 border-transparent 
                focus:border-blue-500 placeholder-gray-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl text-black bg-white/50 outline-none border-2 border-transparent 
                  focus:border-green-500 placeholder-gray-500"
                disabled={disabled}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <p className="text-sm text-left text-gray-800">
              Must be at least 6 characters.
            </p>

            <button
              type="submit"
              disabled={disabled}
              className="w-full text-xl tracking-wide bg-linear-to-r from-[#471b00] to-[#d79757] text-white
              rounded-xl py-3 font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {disabled ? "Sending..." : "Send OTP →"}
            </button>
          </form>
        ) : (
          /** STEP 2 — OTP */
          <form onSubmit={verifyOtp} className="flex flex-col gap-6">

            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full pl-12 py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent
                  focus:border-blue-500 placeholder-gray-500"
                required
              />
            </div>

            {remaining > 0 ? (
              <p className="text-sm text-gray-700">
                Expires in <span className="font-semibold">{remaining}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-blue-600 underline font-semibold"
              >
                Resend OTP
              </button>
            )}

            <button
              type="submit"
              className="w-full text-lg tracking-wide bg-linear-to-r from-[#471b00] to-[#d79757] text-white
                rounded-xl py-3 font-bold shadow-lg hover:scale-105 transition disabled:opacity-50"
              disabled={disabled}
            >
              Verify & Continue
            </button>
          </form>
        )}

        <p className="mt-6 text-lg text-gray-600">
          Already registered?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#095DB7] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
