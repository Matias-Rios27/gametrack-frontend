import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface SectionHeaderProps {
  id: string
  title: string
  action?: { label: string; href: string }
}

// Titulo de seccion con barra de acento y enlace "ver todo" a la derecha
export function SectionHeader({ id, title, action }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 id={id} className="display-title flex items-center gap-3 text-2xl md:text-[1.75rem]">
        <span aria-hidden="true" className="h-6 w-1 shrink-0 rounded-full bg-primary" />
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex min-h-11 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-text"
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
            {action.label}
          </span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
