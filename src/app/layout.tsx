import type { Metadata } from "next";
import { DynaPuff, Chewy } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";


const dynaPuff = DynaPuff({
  variable: "--font-dyna-puff",
  subsets: ["latin"],
});

const chewy = Chewy({
  variable: "--font-chewy",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Tofu's World", template: "%s | Tofu's World" },
  description: "Tofu's World: an online homes for Tofu's projects and musings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dynaPuff.variable} ${chewy.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
