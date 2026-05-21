import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { TripProvider } from "@/context/TripProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Miami Family Hub",
  description: "Central de coordenação da viagem em família para Miami",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Miami Hub",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#c45c3e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased">
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
