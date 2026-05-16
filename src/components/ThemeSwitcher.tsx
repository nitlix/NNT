"use client";

import { useTheme } from "next-themes";
import { IoIosMoon } from "react-icons/io";
import { HiDesktopComputer } from "react-icons/hi";
import { MdWbSunny } from "react-icons/md";

export default function ThemeSwitcher() {
    const { setTheme } = useTheme();

    return (
        <div className="flex flex-row gap-[1rem] !px-[2rem] py-[1rem] rounded-full bg-neutral-100 dark:bg-neutral-900 items-center border-[1px] border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
            <MdWbSunny
                className="cursor-pointer"
                size="1.25rem"
                onClick={() => setTheme("light")}
            />
            <IoIosMoon
                className="cursor-pointer"
                size="1.25rem"
                onClick={() => setTheme("dark")}
            />
            <HiDesktopComputer
                className="cursor-pointer"
                size="1.25rem"
                onClick={() => setTheme("system")}
            />
        </div>
    );
}
