import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { Header } from "@/components/Header";
import { NotificationProvider } from "@/components/NotificationProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create a thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "demo-client-id",
});

export const metadata: Metadata = {
  title: "Crowdfund a Track",
  description: "Fan-powered music production platform where fans invest in artists and share in their success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-black">
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </NotificationProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
