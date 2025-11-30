"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Listing = {
  id: number | string;
  title: string;
  author?: string | null;
  isbn?: string | null;
  genre?: string | null;
  material_type?: string | null;
  trade_type?: string | null;
  price?: number | null;
  condition?: string | null;
  description?: string | null;
  image_url?: string | null;
};

export default function BookPage() {
  const params = useParams<{ listingID: string }>();
  const listingID = params?.listingID;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingID) {
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    async function fetchListing() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8000/books/${listingID}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Listing not found." : "Failed to load listing.");
        }

        const data = await response.json();
        if (!ignore) {
          setListing(data);
        }
      } catch (err) {
        if (!ignore) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setListing(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchListing();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [listingID]);

  const priceLabel = useMemo(() => {
    if (typeof listing?.price === "number") {
      return `$${listing.price.toFixed(2)}`;
    }
    if (listing?.price) {
      return `$${listing.price}`;
    }
    return "Contact seller";
  }, [listing?.price]);

  const coverImage = listing?.image_url || "/strawberry.png";
  const title = listing?.title || (loading ? "Loading…" : "Unknown Title");
  const isbn = listing?.isbn || "Not provided";
  const author = listing?.author || "Unknown";
  const condition = listing?.condition || "Not specified";
  const description = listing?.description || "No description available.";

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
        {/* Book Listing Card */}
        <div className="flex items-center gap-8 bg-emerald-900/40 border border-yellow-600/40 rounded-2xl shadow-xl p-6 hover:bg-emerald-800/40 transition-all">
          <img
            src={coverImage}
            alt={`${title} Cover`}
            className="w-100 h-100 object-cover rounded-xl shadow-md border border-yellow-500/30"
          />

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-yellow-300 mb-2">{title}</h1>
            <p className="text-yellow-200 mb-2">
              <span className="font-semibold text-yellow-400">ISBN:</span> {isbn}
            </p>
            {/* <p className="text-yellow-200 mb-2">
              <span className="font-semibold text-yellow-400">Database ID:</span> {listing?.id ?? listingID}
            </p> */}
            <p className="text-yellow-200 mb-2">
              <span className="font-semibold text-yellow-400">Author:</span> {author}
            </p>
            <p className="text-yellow-200 mb-2">
              <span className="font-semibold text-yellow-400">Condition:</span> {condition}
            </p>
            <p className="text-yellow-200 mb-4">
              <span className="font-semibold text-yellow-400">Price:</span> {priceLabel}
            </p>
            <p className="text-yellow-100 leading-relaxed mb-4">{description}</p>
            <p className="text-yellow-200">
              <button
                onClick={() => console.log("Listing ID:", listing?.id ?? listingID)}
                disabled={loading || !!error}
                className="rounded-full border border-yellow-400/70 bg-yellow-500/10 
                hover:bg-yellow-400/20 px-4 py-1 text-yellow-300 
                font-medium transition-all shadow-sm backdrop-blur-md disabled:opacity-40"
              >
                {listing?.trade_type ? `Request to ${listing.trade_type}` : "Buy"}
              </button>
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-4 text-yellow-200">
            Loading listing details…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-900/40 backdrop-blur-lg p-4 text-red-200">
            {error}
          </div>
        )}
      </main>

      {/* <footer className="mt-10 bg-emerald-950/80 text-yellow-400 text-center py-4 backdrop-blur-md border-t border-yellow-500/30 shadow-inner">
        <p className="text-sm">
          Powered by Supabase & Next.js · George Mason University © {new Date().getFullYear()}
        </p>
      </footer> */}
    </div>
  );
}