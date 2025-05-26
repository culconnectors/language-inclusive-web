import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { PasswordProtection } from "./components/PasswordProtection";
import Footer from "./components/Footer";
import "./globals.css";

/** Initialize Inter font with Latin subset */
const inter = Inter({ subsets: ["latin"] });

/**
 * Root layout component that wraps all pages
 * Provides font, providers, password protection, and footer
 * @param children - Child components to be rendered
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body suppressHydrationWarning className={inter.className}>
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
