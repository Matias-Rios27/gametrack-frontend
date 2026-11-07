import { AuthGuard } from "@/components/layout/AuthGuard";
import { GameWallBackground } from "@/components/layout/GameWallBackground";
import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Enlace para saltar la navegacion con teclado */}
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-semibold text-primary-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <GameWallBackground />
      <Navbar />
      <main id="contenido" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
        <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-8">
          <AuthGuard>{children}</AuthGuard>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
