import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import { venueConfig } from "@/config/venue";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: venueConfig.name,
  description: venueConfig.shortDescription,
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <BackgroundSlideshow />
        <SessionProvider>
          <div className="navbar-wrapper">
            <Navbar />
          </div>
          <main className="page-content">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
