import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroAgents | Smart Outgrower Management",
  description: "Agentic AI-driven platform bridging the agricultural credit gap using CAMARA APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-neutral-200 selection:text-neutral-900 bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
