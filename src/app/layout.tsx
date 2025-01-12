import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer, Bounce } from "react-toastify";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react"

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
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white font-poppins w-full">
            <Header />
            <Suspense>
              <main className="flex-grow">
                {children}
                {/* <Analytics /> */}
              </main>
            </Suspense>
            <footer className="bg-gray-100 py-6 w-full">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>&copy; 2025 Socialytics. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
          />
        </body>
      </AuthProvider>
    </html>
  );
}
