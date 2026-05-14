"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Inbox" },
  { href: "/rankings/want", label: "Want" },
  { href: "/rankings/must", label: "Must" },
  { href: "/rankings/urgency", label: "Urgency" },
  { href: "/matrix", label: "Matrix" },
  { href: "/archive", label: "Archive" },
]

export default function Navigation() {
  const pathname = usePathname()
  return (
    <nav className="bg-gray-900 border-b border-gray-800 overflow-x-auto">
      <div className="max-w-2xl mx-auto flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
              pathname === href
                ? "border-b-2 border-blue-400 text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
