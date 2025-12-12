"use client";

import { useAuthUser } from "@/context/AuthUserContext";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { currentUser, loading } = useAuthUser();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    const q = query(
      collection(db, "payments"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setOrders(list);
    });

    return () => unsubscribe();
  }, [currentUser, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-400 text-lg">No orders yet.</p>
      )}

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="border border-gray-700 p-5 rounded-lg shadow-md bg-gray-900">
      <h2 className="text-xl font-bold">Order ID: {order.orderId}</h2>

      <p className="text-sm text-gray-400">
        Payment ID: {order.paymentId}
      </p>

      <p className="text-sm text-gray-400">
        Date: {formatDate(order.createdAt)}
      </p>

      <p className="mt-2 text-lg font-semibold">
        Total: ₹{order.totalAmount}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-lg">Items:</h3>
        <ul className="list-disc ml-6">
          {order.items?.map((item, i) => (
            <li key={i}>
              {item.name} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded-md text-sm ${
            order.status === "paid" ? "bg-green-600" : "bg-yellow-500"
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}
