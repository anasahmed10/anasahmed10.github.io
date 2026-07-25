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
    default: "Anas Ahmed — Engineer and Product Builder",
    template: "%s · Anas Ahmed",
  },
  description:
    "Explore Anas Ahmed’s Enterprise Systems Campus, recruiter profile, and public products including TabTally.",
  openGraph: {
    title: "Anas Ahmed — Engineer and Product Builder",
    description: "Enterprise systems, recruiter experience, and public mobile products.",
    url: "https://anasahmed10.github.io/",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Anas Ahmed — Engineer and Product Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Engineer and Product Builder",
    description: "Enterprise systems, recruiter experience, and public mobile products.",
    images: ["/og.png"],
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
