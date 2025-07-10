import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { TONELAB_POSTER_URL } from "@/constants/global";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tonelab Studio",
  description: "Audio Processing and Creation Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div 
          className="background-wrapper"
          style={{
            backgroundImage: `url(${TONELAB_POSTER_URL})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right',
            backgroundAttachment: 'fixed',
            backgroundColor: 'var(--background)',
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        />
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <main className="page-content">
          {children}
        </main>
      </body>
    </html>
  );
}
