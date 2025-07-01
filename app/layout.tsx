import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import "./../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotesOrganizer | Beyond Note-Taking. Master Your Knowledge.",
  description: "The definitive hub for frameworks, guides, and AI-powered tools to transform your scattered notes into a structured, interconnected knowledge base.",
};

const GA_MEASUREMENT_ID = "G-T3JM54B7WM";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-dark text-gray-200`}>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        {children}
        <Analytics />
      </body>
    </html>
  );
} 