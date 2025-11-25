"use client";

// ================================
// Backbone
//
// Designed to superpower your app
// silently and efficiently.
//
// with love, by Nitlix
// ================================

import { useEffect, useState, createContext } from "react";
import "./Backbone.scss";

// Massive props to Studio Freight for creating Lenis.
import Lenis from "lenis";
import { useRouter } from "next/navigation";
import { LenisScrolltoProperties } from "@/var/types";

// ================================
// Navigation Context
// ================================

type NavigationContextType = {
    navigating: boolean;
    setNavigating: React.Dispatch<React.SetStateAction<boolean>>;
    navigate: (url: string, scroll?: boolean) => void;
    transitionActive: boolean;
    setTransitionActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NavigationContext = createContext<NavigationContextType>(
    null as any
);

// =================================================
// SP Context
// -> Using Lenis, a native scroll solution.
// -> Using NParallax, a native parallax solution.
// =================================================
type Scroll = Lenis;

type SPContextType = {
    scroll: Scroll | null;
    SPController: SPController;
    setSPController: React.Dispatch<React.SetStateAction<SPController>>;
    // Parallax stuff
    // getParallax: () => NParallax | null; // Get it directly
    // parallax: NParallax | null; // When you want to listen
    // setParallax: React.Dispatch<React.SetStateAction<NParallax | null>>;
};

type SPController = "ALLOWINIT" | "DISABLE" | "ENABLE" | "IDLE";

export const SPContext = createContext<SPContextType>(null as any);

type BackboneProps = {
    children: React.ReactNode;
    className?: string;
};

export default function ({ children, className = "" }: BackboneProps) {
    //================================
    // SP Section
    // Feel free to edit/remove this.
    //================================
    const [scroll, setScroll] = useState<Lenis | null>(null);
    // const [parallax, setParallax] = useState<NParallax | null>(null);
    const [SPController, setSPController] = useState<SPController>("ALLOWINIT");

    function onResize() {
        if (window.innerWidth < 1024) {
            setSPController("DISABLE");
        } else {
            setSPController("ENABLE");
        }
    }

    function getScroll(): Lenis | null {
        return scroll;
    }

    // function getParallax(): NParallax | null {
    //     return parallax;
    // }

    // SP Main Controller
    useEffect(() => {
        function initSP() {
            const ls = new Lenis({
                lerp: 0.15,
            });

            // const np = new NParallax();

            function raf(time: number) {
                ls.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            setScroll(ls);
            // setParallax(np);
        }

        function destroySP() {
            getScroll()?.destroy();
            // getParallax()?.destroy();
        }

        switch (SPController) {
            case "ALLOWINIT":
                if (window.innerWidth > 1024) {
                    setSPController("ENABLE");
                }
                break;
            case "DISABLE":
                destroySP();
                break;
            case "ENABLE":
                initSP();
                break;
        }

        return () => {
            destroySP();
        };
    }, [SPController]);

    useEffect(() => {
        window.addEventListener("resize", onResize);
    }, []);
    //==============
    // End of SP
    //==============

    //=============================================
    // Navigation Section
    // Feel free to edit/remove this.
    //=============================================
    const [navigating, setNavigating] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const router = useRouter();

    async function navigate(
        url: string,
        scroll = false,
        scrolltoProperties: LenisScrolltoProperties = {
            offset: -200,
        }
    ) {
        const currentPage = window.location.pathname.split("#")[0];
        const newPage = url.split("#")[0];
        const newLocation = url.split("#").length > 1 ? url.split("#")[1] : "";

        if (currentPage == newPage) {
            // Refresh only if no new location

            if (newLocation) {
                // Try to scroll to it with Lenis, if not scroll default

                if (SPController == "ENABLE" && scroll) {
                    getScroll()?.scrollTo(
                        `#${newLocation}`,
                        scrolltoProperties
                    );
                } else {
                    const el = document.getElementById(newLocation);
                    if (el) {
                        el.scrollIntoView();
                    }
                }
                return;
            }
            // Refresh
            window.location.reload();
            return;
        } else {
            setNavigating(true);
            setTransitionActive(true);
            setTimeout(() => {
                router.push(url, {
                    scroll: false,
                });

                setTimeout(() => {
                    if (newLocation) {
                        // Attempt to scroll
                        if (SPController == "ENABLE" && scroll) {
                            getScroll()?.scrollTo(
                                newLocation,
                                scrolltoProperties
                            );
                        } else {
                            if (scroll) {
                                // Try to get element
                                const el = document.getElementById(
                                    newLocation.replace("#", "")
                                );
                                if (el) {
                                    el.scrollIntoView();
                                } else {
                                    // Fall back to the top
                                    window.scrollTo(0, 0);
                                }
                            }
                        }
                    } else {
                        if (SPController == "ENABLE" && scroll) {
                            getScroll()?.scrollTo(0, scrolltoProperties);
                        } else {
                            if (scroll) {
                                window.scrollTo(0, 0);
                            }
                        }
                    }
                }, 500);
            }, 250);
        }
    }

    return (
        <body className={className} suppressHydrationWarning>
            <NavigationContext.Provider
                value={{
                    navigating,
                    setNavigating,
                    navigate,
                    transitionActive,
                    setTransitionActive,
                }}
            >
                <SPContext.Provider
                    value={{
                        scroll,
                        SPController,
                        setSPController,
                        // parallax,
                        // setParallax,
                        // getParallax,
                    }}
                >
                    {children}
                </SPContext.Provider>
            </NavigationContext.Provider>
        </body>
    );
}
