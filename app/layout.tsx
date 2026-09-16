import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./public-site.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anasahmed10.github.io/"),
  title: {
    default: "Anas Ahmed — Android Engineering & Products",
    template: "%s · Anas Ahmed",
  },
  description:
    "Explore Anas Ahmed’s clay campus for enterprise Android, connected vehicles, scanner automation, SplitDish, SmartShopper, and Highlight Corner, a live NFL highlights product.",
  openGraph: {
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "An eight-landmark clay project campus for enterprise Android, connected vehicles, automation, SplitDish, SmartShopper, and Highlight Corner.",
    url: "https://anasahmed10.github.io/",
    type: "website",
    images: [{
      url: "https://anasahmed10.github.io/og.png",
      width: 1672,
      height: 941,
      alt: "Anas Ahmed’s handcrafted clay campus illustration with colorful project buildings and cream walking paths",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "An eight-landmark clay project campus for enterprise Android, connected vehicles, automation, SplitDish, SmartShopper, and Highlight Corner.",
    images: ["https://anasahmed10.github.io/og.png"],
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
        {children}
      </body>
    </html>
  );
}
