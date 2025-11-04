'use client';

import { useState } from "react";
export default function MainPage() {
    const options = ["Buy", "Sell", "Borrow", "Trade"];
    const [selected, setSelected] = useState("Buy");

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-950 via-green-900 to-black text-white">
            <header className="sticky top-0 z-10 backdrop-blur-lg bg-emerald-950/70 border-b border-yellow-600 shadow-lg">
                <div className="w-auto px-6 py-5 flex items-center justify-between">
                    {/*logo and title*/}
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
                    {/*navigation options*/}
                    <div className="flex gap-4 p-4 rounded-xl border border-yellow-500">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => setSelected(option)}
                                className={`px-4 py-2 rounded-lg border transition-colors duration-150
                                    ${
                                        selected === option
                                            ? "border-blue-500 bg-blue-100 text-black"
                                            : "border-transparent text-yellow-200 hover:bg-yellow-500/20 hover:text-yellow-50"
                                    }`}
                                >
                                {option}
                            </button>
                        ))}                              
                    </div>
                    {/*search bar*/}
                    <input
                            type="text"
                            placeholder="Search"
                            className="flex justify-end w-auto rounded-2xl border border-yellow-500/50 bg-white/10 text-yellow-50 placeholder-yellow-200/70 px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400/60 backdrop-blur-md"
                        />
                </div>
            </header>
        </div>
    );
}
