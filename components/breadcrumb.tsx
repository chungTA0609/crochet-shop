import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />}

              {!isLast && item.href ? (
                <Link href={item.href} className="hover:text-pink-500 transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              ) : (
                <span className={`${isLast ? "text-foreground font-medium" : ""} whitespace-nowrap`}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
