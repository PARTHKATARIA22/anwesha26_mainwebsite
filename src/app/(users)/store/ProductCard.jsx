"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ id, name, cost, img_src }) {
  const { cart, addToCart, removeFromCart } = useCart();

  const quantity = cart.find(i => i.id === id)?.quantity || 0;

  return (
    <div className="p-4 rounded-xl w-[22rem] bg-gray-900 shadow-md">
      <div className="relative h-[20rem] rounded-xl overflow-hidden">
        <Image src={img_src} alt={name} fill className="object-cover" />
      </div>

      <h2 className="text-xl font-bold mt-3">{name}</h2>
      <p className="text-lg">₹{cost}</p>

      <div className="mt-4 flex items-center gap-4">
        {quantity > 0 ? (
          <>
            <button onClick={() => removeFromCart(id)} className="btn-white">-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart({ id, name, cost, img_src,type: "store" })} className="btn-white">+</button>
          </>
        ) : (
          <button onClick={() => addToCart({ id, name, cost, img_src ,type: "store" })} className="btn-white">
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
