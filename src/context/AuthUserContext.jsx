"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // listen for firebase user change
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCurrentUser(snap.data());
      } else {
        // fallback minimal user
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          status: "1",
        });
      }

      setLoading(false);
    });
  }, []);

  // register
  const registerUser = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userDoc = {
        uid,
        email,
        emailVerified: true,
        status: "1",
        anweshaId: null,
        createdAt: Date.now(),
        personal: {},
        college: {},
        events: [],
        qrEnabled: false,
        qrTokenId: null,
      };

      await setDoc(doc(db, "users", uid), userDoc);
      setCurrentUser(userDoc);
      await auth.currentUser?.reload();

      toast.success("Account Created!");
      return userDoc;
    } catch (err) {
      console.log("REGISTER ERR", err);

      if (err.code === "auth/email-already-in-use") {
        return await loginUser(email, password);
      }

      toast.error(err.message);
      return null;
    }
  };

  // login
  const loginUser = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      await firebaseUser.reload(); // ensure fresh state

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        toast.error("User record not found. Contact Support.");
        throw new Error("Firestore user missing");
      }

      const userData = snap.data();

      if (userData.status !== "successful") {
        throw new Error("Please complete registration");
      }

      if (firebaseUser.emailVerified) {
        await updateDoc(ref, { emailVerified: true });
      }

      localStorage.setItem("uid", firebaseUser.uid);
      setCurrentUser(userData);

      toast.success("Login Successful");
      return userData;
    } catch (err) {
      toast.error(err.message || "Login failed");
      throw err;
    }
  };

  // logout
  const logoutUser = async () => {
    await signOut(auth);
    localStorage.removeItem("uid");
    setCurrentUser(null);
    toast.success("Logged Out");
  };

  // update firestore user
  const updateUser = async (uid, newData) => {
    await updateDoc(doc(db, "users", uid), newData);

    setCurrentUser((prev) => {
      if (!prev) return newData;
      return { ...prev, ...newData };
    });

    return { ...currentUser, ...newData };
  };

  // complete registration + assign AnweshaId
  const finalizeRegistration = async (uid, formData = {}) => {
    const anweshaId = `ANW-MUL-${Math.floor(100000 + Math.random() * 900000)}`;

    await updateUser(uid, {
      anweshaId,
      status: "successful",
      ...formData,
    });

    return anweshaId;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        finalizeRegistration,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook
export const useAuthUser = () => useContext(AuthContext);
