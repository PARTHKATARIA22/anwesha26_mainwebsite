"use client";

import { useCart } from "@/context/CartContext";
import { useAuthUser } from "@/context/AuthUserContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export default function CheckoutPage() {
    const { cart, totalPrice, emptyCart, removeFromCart,addToCart,deleteCartItem } = useCart();
    const { currentUser } = useAuthUser();
    const router = useRouter();

    const eventItems = cart.filter(i => i.type === "event");
    const isEvent = eventItems.length > 0;

    // ---------------------- PAYMENT HANDLER (unchanged logic) ----------------------
    const handlePayment = async () => {
        if (!currentUser?.uid) return toast.error("User not logged in!");
        if (!cart.length) return toast.error("Cart is empty!");

        if (totalPrice() === 0) {
            // await saveFreeRegistrations();
            // emptyCart();
            toast.success("Some Error !");
            return router.push("/orders");
        }

        if (!window.Razorpay) return toast.error("Payment SDK missing.");

        const res = await fetch("/api/razorpay/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalPrice() }),
        });

        if (!res.ok) return toast.error("Order creation failed");

        const order = await res.json();

        const razor = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount,
            currency: "INR",
            name: "Anwesha",
            description: isEvent ? "Event Registration" : "Store Checkout",
            order_id: order.id,

            handler: async (response) => {
                const verify = await fetch("/api/razorpay/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: currentUser?.uid,
                        items: cart,
                        totalAmount: totalPrice(),
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                });

                const data = await verify.json();

                if (data.success) {
                    await processItemsAfterPayment(cart, currentUser.uid, response.razorpay_order_id);
                    emptyCart();
                    toast.success("Payment Successful!");
                    return router.push("/orders");
                }
                toast.error("Payment verification failed.");
            },

            theme: { color: "#E63946" },
        });

        razor.open();
    };

    const processItemsAfterPayment = async (items, uid, orderId) => {
        await fetch("/api/razorpay/process-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, items, orderId }),
        });
    };

    // const saveFreeRegistrations = async (items, uid, orderId) => {
    //     await fetch("/api/razorpay/free-event-register", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ uid, items, orderId}),
    //     });
    // };

    // ---------------------- UI SECTION ----------------------
  return (
  <div className="min-h-screen bg-gradient-to-b mt-6 from-black to-[#0a0a0a] flex justify-center px-5 py-10 text-white">

    <div className="w-full max-w-4xl">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
        Checkout
      </h1>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-2xl">Your cart is empty.</p>
        </div>
      )}

      {/* CART ITEMS */}
      {cart.length > 0 && (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300"
            >
              {/* DUSTBIN TOP RIGHT */}
              <FaTrash
                onClick={() => deleteCartItem(item.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer text-lg"
              />

              {/* CONTENT */}
              <div className="flex justify-between items-center">

                {/* LEFT PART */}
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold">{item.name}</span>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 uppercase tracking-wide">
                      {item.type === "event" ? "Event" : "Store"}
                    </span>

                    <span className="text-yellow-400 font-semibold text-sm">
                      ₹{item.cost}
                    </span>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-xl font-bold transition"
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => addToCart(item)}
                      className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-xl font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE PRICE */}
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-400">
                    ₹{item.cost * item.quantity}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOTAL + PAY BUTTON */}
      {cart.length > 0 && (
        <div className="mt-10 bg-[#151515] p-6 rounded-xl border border-gray-700 shadow-xl">
          <div className="flex justify-between text-2xl font-semibold mb-6">
            <span>Total</span>
            <span>₹{totalPrice()}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-lg font-bold shadow-lg transition"
          >
            Proceed to Pay
          </button>
        </div>
      )}

    </div>
  </div>
);

}

