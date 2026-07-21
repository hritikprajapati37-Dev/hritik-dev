import type { Metadata } from "next";
import { Anton, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display face — condensed, poster-like, used sparingly for kinetic headlines.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

// Body face — clean geometric sans, does the reading work.
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

// Utility face — for scene labels / timecodes, reinforces the "film slate" motif.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Hritik Prajapati — Aspiring Full-Stack Web Developer",
  description:
    "Portfolio of Hritik Prajapati, an aspiring full-stack web developer building responsive, interactive web applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${sora.variable} ${mono.variable}`}>
      <body className="bg-void text-bone font-body antialiased">
        {children}
      </body>
    </html>
  );
}
