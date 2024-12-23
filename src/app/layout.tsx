import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socialytics",
  description: "Social media analytics",
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
          <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white font-poppins">
            <Header />
            {children}
            <footer className="bg-gray-100 py-6 w-full">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>&copy; 2025 Social Analytics. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
      </html>
  );
}
