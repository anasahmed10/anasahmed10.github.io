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
  metadataBase: new URL("https://anas-systems-campus.anas-ahmed10988004.chatgpt.site/"),
  title: {
    default: "Anas Ahmed — Android Engineering & Products",
    template: "%s · Anas Ahmed",
  },
  description:
    "Explore Anas Ahmed’s clay campus for self-service retail, connected-vehicle mobile work, scanner automation, and TabTally.",
  openGraph: {
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "A clay project campus for enterprise Android, connected vehicles, automation, and TabTally.",
    url: "https://anas-systems-campus.anas-ahmed10988004.chatgpt.site/",
    type: "website",
    images: [{
      url: "https://anas-systems-campus.anas-ahmed10988004.chatgpt.site/og.png",
      width: 1672,
      height: 941,
      alt: "Anas Ahmed’s clay campus for Android engineering and products",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Android Engineering for Real Devices",
    description: "A clay project campus for enterprise Android, connected vehicles, automation, and TabTally.",
    images: ["https://anas-systems-campus.anas-ahmed10988004.chatgpt.site/og.png"],
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
