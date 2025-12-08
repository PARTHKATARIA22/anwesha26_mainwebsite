"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthUser } from "../../context/AuthUserContext.jsx";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("from"); // 👈 received here

  const { loginUser, currentUser, loading } = useAuthUser();

  const [checkedSession, setCheckedSession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (!loading) {
      setCheckedSession(true);

      if (currentUser) {
        toast.success("You are already logged in");

        // 🔥 Perfect redirect rule
        if (redirectTo && redirectTo !== "/login") {
          router.replace(redirectTo);
        } else {
          router.replace("/profile"); // fallback
        }
      }
    }
  }, [loading, currentUser, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      await loginUser(email, password);

      // 🔥 After successful login — go back where user came from
      if (redirectTo && redirectTo !== "/login") {
        router.replace(redirectTo);
      } else {
        router.replace("/dashboard");
      }
      
    } catch {
      setDisabled(false);
    }
  };

  if (!checkedSession) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Checking session…
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-[url('/tajmahal_bg.jpg')] bg-cover bg-center px-6">
      <div className="rounded-3xl shadow-2xl border border-white p-10 w-full max-w-md bg-white/80 text-center animate-fade-in">
        <h3 className="text-5xl font-extrabold mb-8">Welcome Back</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* EMAIL FIELD */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-xl rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
              required
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 text-xl py-3 rounded-xl text-black bg-white/60 outline-none border-2 border-transparent 
                         focus:border-green-400 focus:ring-2 focus:ring-green-200 placeholder-gray-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full text-2xl tracking-widest bg-[url('/bg_2_cropped.jpg')] bg-cover bg-bottom rounded-xl text-white py-2 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDisabled ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-lg text-gray-600">
          Don’t have an account?
          <span
            onClick={() => router.push("/register")}
            className="text-[#095DB7] font-semibold text-xl cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
