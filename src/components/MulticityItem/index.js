"use client";

import { useState, useEffect } from "react";
import styles from "./multicityitem.module.css";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/context/AuthUserContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function MulticityItem({ event }) {

  const router = useRouter();
  const { currentUser } = useAuthUser();
  const { addToCart } = useCart();

  const [showPopup, setShowPopup] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!currentUser) return;
    };

    checkRegistration();
  }, [currentUser]);

  const handleRegister = () => {
    if (!currentUser) {
      return router.push(`/login?from=${encodeURIComponent("/multicity")}`);
    }

    setShowPopup(true);
  };

  const confirmRegister = () => {
    if (!currentUser) return toast.error("Login required");

    const eventId = `event-${event.city}-${event.date}`;

    addToCart({
      id: eventId,
      name: `Multicity - ${event.city}`,
      cost: event.cost,
      img_src: event.poster,
      type: "event",
      eventCategory: "multicity",
      city: event.city,
      date: event.date
    });

    toast.success("Added to cart!");

    setAlreadyRegistered(true);
    setShowPopup(false);

    router.push("/checkout");
  };

  return (
    <>
      <div className={styles.eventCard}>
        <div className={styles.eventImageWrapper}>
          <div className={styles.eventImageWrapper_dot} />
          <img loading="lazy" src={event.poster} className={styles.eventImageWrapper_box} />
        </div>

        <div className={styles.eventBody}>
          <p className={styles.eventTitle}>{event.city}</p>

          <div className={styles.eventDetails}>
            <p><b>Date:</b>&nbsp;{event.date}</p>
            <p><b>Venue:</b>&nbsp;{event.venue}</p>
            <p><b>Registration Deadline:</b>&nbsp;{event.registration_deadline}</p>
            <p><b>Registration Fee:</b>&nbsp;{event.registration_fee}</p>
            <p><b>Timings:</b>&nbsp;{event.timings}</p>
          </div>

          <div className={styles.eventLinks}>
            <button
              disabled={event.completed || alreadyRegistered}
              className={
                event.completed
                  ? styles.rulebookLink
                  : alreadyRegistered
                  ? styles.registeredBtn
                  : styles.registerLink
              }
              onClick={handleRegister}
            >
              <p>
                {event.completed
                  ? "Conducted"
                  : "Register"}
              </p>
            </button>

            <a className={styles.rulebookLink} href={event.rulebook_link} target="_blank">
              <p>Rulebook</p>
            </a>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Confirm Registration</h2>

            <p>Register for <b>{event.city}</b> multicity round?</p>

            <div className="mt-5 flex justify-center gap-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => setShowPopup(false)}>
                Cancel
              </button>

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={confirmRegister}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
