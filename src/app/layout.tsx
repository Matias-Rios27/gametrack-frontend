import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GameTrack - Tu Backlog de Videojuegos",
  description: "Sistema de gestión de videojuegos, progreso, reseñas y más.",
};

import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased h-screen overflow-hidden flex flex-col`}>
        <SettingsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
