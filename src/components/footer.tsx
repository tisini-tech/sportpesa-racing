export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-brand-navy-deep px-6 py-8 text-[#b8c4ef]/75 sm:px-10 md:px-14">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img
            src="/sport-pesa-racing-logo-white.png"
            alt="SportPesa Racing"
            className="h-8 w-auto opacity-90"
          />
        </div>
        <p className="text-sm">© {year} SportPesa Racing.</p>
      </div>
    </footer>
  )
}
