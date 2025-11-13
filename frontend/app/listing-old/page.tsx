"use client";
import React from "react";

export default function listing({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-950 via-green-900 to-black text-white">

      
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-emerald-950/70 border-b border-yellow-600 shadow-lg">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/gmu-logo.jpg"
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
                className="rounded-full border border-yellow-400/70 bg-yellow-500/10 
                hover:bg-yellow-400/20 px-4 py-1 text-yellow-300 
                font-medium transition-all shadow-sm backdrop-blur-md"
              >
                {btn}
              </button>
            ))}
          </nav>
        </div>
      </header>

      
      <main className="mx-auto max-w-6xl p-6">
        {children}
        <div className="flex justify-start mt-0">
            <img src="/strawberry.png" className="rounded-2xl shadow-lg w-100 h-100" />
        </div>
        <div>
    <h1 className="text-2xl font-bold text-yellow-300 mb-2">Strawberry</h1>
    <p className="text-yellow-200">
        ISBN:
        AUTHOR:
      info n shit
    </p>
  </div>
      </main>
        
      
      <footer className="mt-10 bg-emerald-950/80 text-yellow-400 text-center py-4 backdrop-blur-md border-t border-yellow-500/30 shadow-inner">
        <p className="text-sm">
          Powered by Supabase & Next.js · George Mason University © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
