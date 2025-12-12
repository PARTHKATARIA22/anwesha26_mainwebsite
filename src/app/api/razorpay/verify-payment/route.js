import crypto from "crypto";
import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../../../../lib/firebaseConfig";

export async function POST(req) {
  try {
    const body = await req.json();

    //  Verify Razorpay Signature
    const hash = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.razorpay_order_id + "|" + body.razorpay_payment_id)
      .digest("hex");

    if (hash !== body.razorpay_signature) {
      console.error("Signature mismatch");
      return Response.json({ success: false });
    }

    await setDoc(doc(db, "payments", body.razorpay_payment_id), {
      userId: body.uid,
      items: body.items,
      totalAmount: body.totalAmount,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      createdAt: serverTimestamp(),
      status: "paid"
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error("Error:", err);
    return Response.json({ success: false });
  }
}
