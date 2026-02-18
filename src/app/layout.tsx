import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const runtime = 'edge';
import { getServerSession } from "@/lib/auth-safe";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Bhutan Hyundai Motors",
  description: "Excellence in Motion - Bhutan Hyundai Motors",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <Navbar user={session?.user} />
        <main className="flex-grow pt-28 container mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
