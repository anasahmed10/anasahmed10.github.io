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
    "Explore Anas Ahmed’s clay campus for enterprise Android, connected vehicles, scanner automation, TabTally, and SmartShopper AI research.",
  openGraph: {
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "A seven-landmark clay project campus for enterprise Android, connected vehicles, automation, TabTally, and SmartShopper.",
    url: "https://anasahmed10.github.io/",
    type: "website",
    images: [{
      url: "https://anasahmed10.github.io/og.png",
      width: 1672,
      height: 941,
      alt: "Anas Ahmed’s seven-landmark clay campus for Android engineering, products, and SmartShopper",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "A seven-landmark clay project campus for enterprise Android, connected vehicles, automation, TabTally, and SmartShopper.",
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
