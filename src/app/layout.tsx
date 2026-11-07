import type { Metadata } from "next";
import { Anybody, Onest } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import "./globals.css";

// Titulares: Anybody con eje de ancho para la version condensada
const display = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody" });
// Texto: Onest
const body = Onest({ subsets: ["latin"], variable: "--font-onest" });

export const metadata: Metadata = {
  title: "GameTrack - Tu backlog de videojuegos",
  description: "Registra lo que juegas, tus horas, tu progreso y tu wishlist, con sincronización de Steam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="antialiased h-screen overflow-hidden flex flex-col">
        <SettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
