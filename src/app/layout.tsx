import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated metadata for GameEvents
export const metadata: Metadata = {
  title: "GameEvents - Gaming Release Calendar by Ridwan Ali",
  description: "🎮 Your ultimate gaming calendar & release tracker. Discover upcoming games, trending titles, and recent releases with real-time countdown timers.",
  keywords: ["gaming", "game releases", "gaming calendar", "upcoming games", "IGDB", "Next.js", "DevOps"],
  authors: [{ name: "Sovereign97" }],
  creator: "Sovereign97",
  publisher: "GameEvents",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gameevents.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GameEvents - Gaming Release Calendar by Ridwan Ali",
    description: "🎮 Your ultimate gaming calendar & release tracker with real-time countdown timers",
    url: "https://gameevents.vercel.app",
    siteName: "GameEvents",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GameEvents - Gaming Release Calendar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameEvents - Gaming Release Calendar by Ridwan Ali",
    description: "🎮 Your ultimate gaming calendar & release tracker with real-time countdown timers",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        {children}
      </body>
    </html>
  );
}
