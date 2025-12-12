"use client";

import styles from './all-multicity.module.css';
import Image from 'next/image';
import Head from 'next/head';
import { useState } from "react";
import MulticityItem from '../../../components/MulticityItem';
import { useAuthUser } from "@/context/AuthUserContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Multicity = () => {

    const { currentUser } = useAuthUser();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const openConfirm = async (event) => {
        if (!currentUser) return toast.error("Login required");

        setSelectedEvent(event); 
    };

    const events_temp = [
        {
            key: 1,
            city: 'BHU',
            date: '08/10/23',
            venue: 'ISI Kolkata',
            cost: 999,
            poster: '/multicity/MulticityPosterKolkata.webp',
            registration_deadline: '06/10/23',
            registration_fee: 'Free',
            timings: '09:00 AM - 06:00 PM',
            contact: [
                { name: 'Akhilesh', phone: '9404549742' },
                { name: 'Raaj Harsh', phone: '7050277123' },
            ],
            completed: false,
        },
    ];


    return (
        <div className={styles.container}>
            <Head>
                <title>Anwesha 2024</title>
                <meta name="description" content="Multicity-Anwesha 2024" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>

            <div className={styles.topmargin} />

            <img
                loading="lazy"
                src={'/multicity/MulticityHeroImage.webp'}
                className={styles.heroImage}
            />

            <div className={styles.title}>
                <img src={'/multicity/MulticityAuditions.svg'} />
                <p className={styles.about}>
                    Anwesha, the CULTURAL FEST at IIT Patna gives a huge
                    opportunity and a massive platform to showcase your
                    extravagant talent. Conducting Multicity Auditions in
                    various cities, brings our extraordinary participants
                    together and gives them a platform to exhibit their
                    diversified skills...
                </p>
            </div>

            <div className={styles.section}>
                <img src={'/multicity/Perks.svg'} />
                <p className={styles.about}>
                    <li>Multicity winner Certificate certified by IITP.</li>
                    <li>Exclusive merchandise for winners.</li>
                    <li>Free registration for Anwesha finals.</li>
                    <li>Winners featured on social media.</li>
                </p>
            </div>

            <div className={styles.title}>
                <img src={'/multicity/Rewards and Recognition.svg'} />
                <p className={styles.about}>
                    <li>Direct selection for finals.</li>
                    <li>Perform before renowned judges.</li>
                    <li>Exciting prizes & vouchers.</li>
                </p>
            </div>

            {/* ⭐ Event Cards Section */}
            <div className={styles.content}>
                {events_temp.map((event) => (
                    <MulticityItem
                        key={event.key}
                        event={{
                            ...event,
                            openConfirm, // Passing popup callback
                        }}
                    />
                ))}
            </div>

            {selectedEvent && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h3>Confirm Registration?</h3>
                        <p className="font-bold">{selectedEvent.city}</p>

                        <div className={styles.modalActions}>
                            <button
                                onClick={confirmRegistration}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                Yes, Register
                            </button>

                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="bg-gray-300 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 
            <Image alt="IIT Patna" src="/multicity/school.png" width={200} height={200} style={{ transform: 'translateX(-170px)' }} />
            <Image alt="road" src="/multicity/road.png" width={470} height={831} />
            <Image alt="road" src="/multicity/road.png" width={470} height={831} style={{ transform: 'scaleX(-1) translateY(-10px)' }} />
            
            <div className={styles.mandala} style={{ top: '35%' }}>
                <Image alt="mandala" src="/multicity/mandala.png" width={500} height={800} />
                <Image alt="mandala" src="/multicity/mandala.png" width={500} height={800} style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div className={styles.mandala} style={{ top: '135%' }}>
                <Image alt="mandala" src="/multicity/mandala.png" width={500} height={800} />
                <Image alt="mandala" src="/multicity/mandala.png" width={500} height={800} style={{ transform: 'scaleX(-1)' }} />
            </div>
            */}
        </div>
    )
}

export default Multicity
