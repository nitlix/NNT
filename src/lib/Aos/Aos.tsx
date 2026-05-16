"use client";

import "./Aos.css";
import Aos from "nitlix-aos";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function () {
    const pathname = usePathname();

    useEffect(() => {
        Aos.init({
            duration: 1000,
            easing: "ease-in-out",
        });
    }, [pathname]);
    return <></>;
}
