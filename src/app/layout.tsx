// =====================
// Global CSS Imports
// =====================
import "./globals.css";
import "./animations.scss";

// =====================
// Theme CSS Imports
// =====================
import "@/backbone/themes.scss";

// =====================
// Google Font (Inter)
// =====================
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

// =====================
// Geist Font (By Vercel)
// =====================
import { GeistSans } from "geist/font/sans";

// =====================
// Custom Font (Neue Montreal)
// =====================
// import NeueMontreal from "@/fonts/NeueMontreal/NeueMontreal";

// =====================
// Metadata Export
// =====================
import { metaGen, setDefaults } from "nitlix-metagen";
setDefaults({
    title: "Nitlix Prebuilt App",
    description:
        "This is the default description for the NNT Next.JS template. Feel free to change it.",
});
export const metadata = metaGen();

// =====================
// Theme Provider
// =====================
import Backbone from "@/backbone/Backbone";
import Aos from "@/lib/Aos/Aos";
import { ThemeProvider } from "next-themes";
// =====================
// Layout Export
// =====================
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <Backbone className={GeistSans.className}>
                {/* Feel free to remove the code below if you don't wish to use AOS */}
                <Aos />
                <ThemeProvider defaultTheme="system">
                    <main className="_nitlix" data-scroll-container>
                        {children}
                    </main>
                </ThemeProvider>
            </Backbone>
        </html>
    );
}
