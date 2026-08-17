import type { Metadata } from "next";
import { Playfair_Display, Lora, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Our Memory Book",
  description: "A shared gallery of our cherished moments",
};

import { AudioProvider } from "@/context/AudioContext";
import AudioPlayer from "@/components/AudioPlayer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} ${greatVibes.variable} antialiased font-lora`}>
        <AudioProvider>
          {children}
          <AudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
