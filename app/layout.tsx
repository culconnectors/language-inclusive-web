import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { PasswordProtection } from "./components/PasswordProtection";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
