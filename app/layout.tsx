import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "dialkit/styles.css";
import "./globals.css";
import { DevToolbar } from "@/components/site/DevToolbar";
import { EmailNudge } from "@/components/site/EmailNudge";
import { InteractionSounds } from "@/components/site/InteractionSounds";
import { ThemeSync } from "@/components/site/ThemeSync";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  title: "Atrium UI — Crafted primitives for AI-native interfaces",
  description:
    "A small library of extremely crafted, copy-paste components for chat agents, thinking states, human-in-the-loop approvals, and everything agents need to talk to humans beautifully.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  interactiveWidget: "resizes-visual",
};

const themeScript = `(function(){try{var t=localStorage.getItem("bui-theme");if(t&&["light","dark","warm","frost"].includes(t)){document.documentElement.dataset.mode=t}else{document.documentElement.dataset.mode="light"}}catch(e){document.documentElement.dataset.mode="light"}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <ThemeSync />
        <InteractionSounds />
        <EmailNudge />
        {children}
        <DevToolbar />
      </body>
    </html>
  );
}
