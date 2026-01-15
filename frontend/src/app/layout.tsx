import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "KetoVital Tracker",
    description: "Advanced Keto & Liver Health Tracker",
    manifest: "/manifest.json",
    // We will add manifest later
};

import { Providers } from "./providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <div className="min-h-screen bg-gray-50 pb-20">
                        {children}
                    </div>
                    <BottomNav />
                </Providers>
            </body>
        </html>
    );
}
