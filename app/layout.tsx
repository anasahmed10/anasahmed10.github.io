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
    default: "Anas Ahmed — Enterprise Android Engineer & Product Builder",
    template: "%s · Anas Ahmed",
  },
  description:
    "Explore Anas Ahmed’s interactive 3D campus: enterprise Android, device systems, automation, observability, and products including TabTally.",
  openGraph: {
    title: "Anas Ahmed — Enterprise Android Engineer & Product Builder",
    description: "A vibrant 3D campus for enterprise systems, automation, and mobile products.",
    url: "https://anas-systems-campus.anas-ahmed10988004.chatgpt.site/",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "Anas Ahmed — Enterprise Android Engineer & Product Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Enterprise Android Engineer & Product Builder",
    description: "A vibrant 3D campus for enterprise systems, automation, and mobile products.",
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
