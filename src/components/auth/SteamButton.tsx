import { buttonVariants } from "@/components/ui/Button"
import { SteamIcon } from "@/components/ui/SteamIcon"

interface SteamButtonProps {
  label: string
  loading: boolean
}

// Separador "o" y boton para entrar con Steam (OpenID)
export function SteamButton({ label, loading }: SteamButtonProps) {
  return (
    <>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />o<span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      {loading ? (
        <p role="status" className={buttonVariants({ variant: "outline", className: "w-full pointer-events-none opacity-70" })}>
          <SteamIcon className="h-5 w-5" />
          Verificando con Steam
        </p>
      ) : (
        <a href="/api/auth/steam" className={buttonVariants({ variant: "outline", className: "w-full" })}>
          <SteamIcon className="h-5 w-5" />
          {label}
        </a>
      )}
    </>
  )
}
