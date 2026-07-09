export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E] py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill="#4F6EF7" />
            <path d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M11 17C11 15.343 12.343 14 14 14C15.657 14 17 15.343 17 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="20" r="1.5" fill="white" />
          </svg>
          <span className="text-white font-bold text-sm">Polar Analytics</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#8892a4]">
          <a href="https://www.polaranalytics.com/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="https://www.polaranalytics.com/legal/terms" className="hover:text-white transition-colors">Terms</a>
          <span>© {new Date().getFullYear()} Polar Analytics</span>
        </div>
      </div>
    </footer>
  )
}
