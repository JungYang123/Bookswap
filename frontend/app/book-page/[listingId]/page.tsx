"use client";
import React from "react";
import { useParams } from "next/navigation"

export default function BookPage({
    
    children,
}: {
    children: React.ReactNode;
}) {
    const { listingId } = useParams(); 
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


            <main className="mx-auto max-w-6xl p-6 space-y-8">
                {children}

                {/* Book Listing Card */}
                <div className="flex items-center gap-8 bg-emerald-900/40 border border-yellow-600/40 rounded-2xl shadow-xl p-6 hover:bg-emerald-800/40 transition-all">
                    {/* Image */}
                    <img
                        src="/strawberry.png"
                        alt="Strawberry Book Cover"
                        className="w-100 h-100 object-cover rounded-xl shadow-md border border-yellow-500/30"
                    />

                    {/* Book Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-yellow-300 mb-2">Strawberry</h1>
                        <p className="text-yellow-200 mb-2">
                            <span className="font-semibold text-yellow-400">ISBN:</span> 978-1234567890
                        </p>
                        <p className="text-yellow-200 mb-2">
                            <span className="font-semibold text-yellow-400">Database ID:</span> listingId
                        </p>
                        <p className="text-yellow-200 mb-2">
                            <span className="font-semibold text-yellow-400">Author:</span> Ur Mom
                        </p>
                        <p className="text-yellow-200 mb-2">
                            <span className="font-semibold text-yellow-400">Condition:</span> fresh
                        </p>
                        <p className="text-yellow-200 mb-4">
                            <span className="font-semibold text-yellow-400">Price:</span> $100
                        </p>
                        <p className="text-yellow-100 leading-relaxed mb-4">
                            Description
                        </p>
                         <p className="text-yellow-200">
                        {["Buy"].map((btn) => (
                            <button
                                key={btn}
                                 onClick={() => console.log("Listing ID:", listingId)}
                                className="rounded-full border border-yellow-400/70 bg-yellow-500/10 
                hover:bg-yellow-400/20 px-4 py-1 text-yellow-300 
                font-medium transition-all shadow-sm backdrop-blur-md"
                            >
                                {btn}
                            </button>
                        ))}
                        </p>
                    </div>
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
