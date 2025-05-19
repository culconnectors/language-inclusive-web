import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PasswordProtection } from "./components/PasswordProtection";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Language Inclusive Web",
    description:
        "A web application for language inclusive events and workshops",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="light">
            <body
                suppressHydrationWarning
                className={`${inter.className} bg-white dark:bg-gray-900`}
            >
                <Providers>
                    <PasswordProtection>
                        {children}
                        <Footer />
                    </PasswordProtection>
                </Providers>
            </body>
        </html>
    );
}
