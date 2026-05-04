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

export const metadata: Metadata = {
  title: "LegalAI - Indian Judiciary Case Analysis System",
  description: "AI-powered legal case analysis platform for identifying wrongful convictions, prosecutorial misconduct, and bias patterns in the Indian judiciary system.",
  keywords: ["legal analysis", "AI", "judiciary", "case analysis", "wrongful conviction", "legal tech", "India"],
  authors: [{ name: "LegalAI Team" }],
  openGraph: {
    title: "LegalAI - Indian Judiciary Case Analysis System",
    description: "AI-powered legal case analysis platform for the Indian judiciary system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {children}
      </body>
    </html>
  );
}
