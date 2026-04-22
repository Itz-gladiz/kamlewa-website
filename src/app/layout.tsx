import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAMLEWA Technologies - Cyber Safety & Digital Inclusion",
  description: "Foster Technology-driven development and empower communities through cybersecurity advocacy, digital inclusion, and knowledge sharing. Cyber Space where everyone feels safe, empowered, and connected.",
  icons: {
    icon: '/images/KAMLEWA_LOGO.png',
    shortcut: '/images/KAMLEWA_LOGO.png',
    apple: '/images/KAMLEWA_LOGO.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
