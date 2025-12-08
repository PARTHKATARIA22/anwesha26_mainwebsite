"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
// import styles from "../../styles/nav.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuthUser, logoutUser } from "@/context/AuthUserContext";
import { useRouter, usePathname } from "next/navigation";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import {toast} from "react-hot-toast"

const host = process.env.NEXT_PUBLIC_HOST;
const STATE_MACHINE_NAME = "Basic State Machine";
const INPUT_NAME = "Switch";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Navigation() {
    const { currentUser, logoutUser } = useAuthUser();
    const router = useRouter();
    const pathname = usePathname();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [clickInputFired, setClickInputFired] = useState(false);
    const [isHome, setIsHome] = useState(pathname === "/");

    const { rive, RiveComponent } = useRive({
        src: "/navbar/hamburger-time.riv",
        autoplay: true,
        stateMachines: STATE_MACHINE_NAME,
    });

    const onClickInput = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        INPUT_NAME
    );

    const refNav = useRef(null);

    useEffect(() => {
        if (pathname) setIsHome(pathname === "/");
        closeDrawer();
    }, [pathname]);

    // click-outside logic
    useEffect(() => {
        if (drawerOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [drawerOpen]);

    const handleClickOutside = (event) => {
        if (refNav.current && !refNav.current.contains(event.target)) {
            closeDrawer();
            if (onClickInput) onClickInput.fire();
            setClickInputFired(true);
        }
    };

    useEffect(() => {
        if (onClickInput && clickInputFired) {
            onClickInput.fire();
            setClickInputFired(false);
        }
    }, [onClickInput, clickInputFired]);

    const closeDrawer = () => {
        const drawer = document.getElementById("drawer");
        const nav_div = document.getElementById("nav_div");
        if (!drawer) return;

        drawer.style.opacity = 0;
        setTimeout(() => {
            drawer.style.display = "none";
            if (nav_div) nav_div.style.backgroundColor = "";
        }, 300);

        setDrawerOpen(false);
    };

    const toggleDrawer = () => {
        const drawer = document.getElementById("drawer");
        const nav_div = document.getElementById("nav_div");
        if (!drawer || !nav_div) return;

        if (!drawerOpen) {
            drawer.style.display = "block";
            setTimeout(() => {
                drawer.style.opacity = 1;
                nav_div.style.backgroundColor = "#000000";
            }, 300);
        } else {
            closeDrawer();
        }

        setDrawerOpen(!drawerOpen);
        onClickInput?.fire();
    };

    const handleLogout = async () => {
        await logoutUser();
        // router.push("/login");
        closeDrawer();
        toast.success("Logged out!");
    };
    return (
        <>
            <div
                id="nav_div"
                className={styles.mainNav}
                style={{ color: isHome ? "white" : "black" }}
                ref={refNav}
            >
                {/* Hamburger */}
                <div className={styles.hamburger}>
                    <RiveComponent onClick={toggleDrawer} />
                </div>

                {/* Logo */}
                <Link
                    href="/"
                    onClick={() => drawerOpen && onClickInput?.fire()}
                    className={styles.navLogo}
                >
                    <Image
                        src="/navbar/logo_no_bg.svg"
                        alt="logo"
                        width={108}
                        height={45}
                    />
                </Link>

                {/* Desktop Nav */}
                <div className={styles.navLinks}>
                    <ul>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/events"
                                style={pathname === "/events" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/multicity"
                                style={pathname === "/multicity" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Multicity
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/gallery"
                                style={pathname === "/gallery" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/team"
                                style={pathname === "/team" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Team
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/sponsors"
                                style={pathname === "/sponsors" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Sponsors
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/about"
                                style={pathname === "/about" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/contact"
                                style={pathname === "/contact" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                href="/campus-ambassador"
                                style={pathname === "/campus-ambassador" ? { color: "rgb(80, 255, 0)" } : null}
                            >
                                Campus Ambassador
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Buttons */}
                <div className={styles.navEnds}>
                    <button
                        className={cn(styles.sexy_button, styles.sexy_button_small)}
                        onClick={() => router.push("/anweshapass")}
                    >
                        GET PASSES
                    </button>

                    <button
                        onClick={() => {
                            if (currentUser) {
                                router.push("/profile");  // logged in → go to profile
                            } else {
                                router.push(`/login?from=${encodeURIComponent(pathname)}`);
                                // not logged in → go to login
                            }
                            closeDrawer(); // optional close drawer if open
                        }}
                        className={cn(styles.sexy_button, styles.sexy_button_small)}
                    >
                        {!currentUser ? "LOGIN" : "PROFILE"}
                    </button>


                    {currentUser && (
                        <button
                            className={cn(styles.sexy_button, styles.sexy_button_small)}
                            onClick={handleLogout}
                        >
                            LOGOUT
                        </button>
                    )}
                </div>
            </div>

            {/* Drawer */}
            <div id="drawer" className={styles.nav_drawer}>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>

                    {currentUser && (
                        <li>
                            <Link href="/profile" onClick={toggleDrawer}>
                                Profile
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link href="/events" onClick={toggleDrawer}>
                            Events
                        </Link>
                    </li>
                    <li>
                        <Link href="/gallery" onClick={toggleDrawer}>
                            Gallery
                        </Link>
                    </li>
                    <li>
                        <Link href="/ourteam" onClick={toggleDrawer}>
                            Teams
                        </Link>
                    </li>
                    <li>
                        <Link href="/oursponsors" onClick={toggleDrawer}>
                            Sponsors
                        </Link>
                    </li>
                    <li>
                        <Link href="/aboutus" onClick={toggleDrawer}>
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" onClick={toggleDrawer}>
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/campus-ambassador" onClick={toggleDrawer}>
                            Campus Ambassador
                        </Link>
                    </li>
                    <li>
                        <Link href="/anweshapass" onClick={toggleDrawer}>
                            getPasses
                        </Link>
                    </li>

                    <li>
                        {currentUser ? (
                            <div className={styles.user_container}>
                                <Link
                                    className={styles.user_info}
                                    href="/profile"
                                    onClick={toggleDrawer}
                                >
                                    <div>
                                        <span className={styles.user_name}>
                                            {currentUser?.personal?.fullName}
                                        </span>
                                        <span className={styles.user_id}>
                                            {currentUser?.anweshaId}
                                        </span>
                                    </div>
                                </Link>
                                <Image
                                    src="/assets/logout.svg"
                                    className={styles.logout}
                                    height={40}
                                    width={40}
                                    alt="logout"
                                    onClick={handleLogout}
                                />
                            </div>
                        ) : (
                            <Link href="/login" onClick={toggleDrawer}>
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Navigation;
