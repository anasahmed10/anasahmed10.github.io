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

const githubRepository = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const githubPagesBase =
  process.env.GITHUB_PAGES === "true" && githubRepository.length === 2
    ? new URL(`https://${githubRepository[0]}.github.io/${githubRepository[1]}/`)
    : undefined;

export const metadata: Metadata = {
  metadataBase: githubPagesBase,
  title: "Anas Ahmed — Enterprise Android Engineer",
  description:
    "Explore an interactive Enterprise Systems Campus featuring Android, device integration, automation, observability, and application-layer robotics.",
  openGraph: {
    title: "Anas Ahmed — Enterprise Android Engineer",
    description: "Explore the Enterprise Systems Campus: Android, device integration, automation, observability, and robotics applications.",
    type: "website",
    images: [{ url: "/og.png", width: 1664, height: 938, alt: "Anas Ahmed Enterprise Systems Campus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Ahmed — Enterprise Android Engineer",
    description: "Explore the Enterprise Systems Campus.",
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
