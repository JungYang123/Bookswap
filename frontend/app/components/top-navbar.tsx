export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-emerald-950/70 border-b border-yellow-600 shadow-lg">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/gmu-logo.jpg?v=2"
            alt="George Mason University"
            className="h-10 w-auto rounded-md shadow-[0_0_10px_rgba(255,215,0,0.6)] hover:scale-110 transition-transform"
          />
          <span className="text-3xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg">
            GMUBookSwap
          </span>
        </div>
        <nav className="flex gap-3">
          {["Borrow", "Trade", "Buy", "Sell"].map((btn) => (
            <button
              key={btn}
              className="rounded-full border border-yellow-400/70 bg-yellow-500/10 hover:bg-yellow-400/20 px-4 py-1 text-yellow-300 font-medium transition-all shadow-sm backdrop-blur-md"
            >
              {btn}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

