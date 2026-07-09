interface HeaderProps {
  contactUrl: string
}

export function Header({ contactUrl }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0F1E]/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <PolarLogo />
        <a
          href={contactUrl}
          className="rounded-full bg-[#4F6EF7] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6B85FF] transition-colors"
        >
          Get in touch
        </a>
      </div>
    </header>
  )
}

function PolarLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="8" fill="#4F6EF7" />
        <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M11 17C11 15.343 12.343 14 14 14C15.657 14 17 15.343 17 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="20" r="1.5" fill="white" />
      </svg>
      <span className="text-white font-bold text-lg tracking-tight">Polar</span>
    </div>
  )
}
