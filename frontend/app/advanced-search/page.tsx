"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**Types for filtersssss*/
type SearchBy = "Any" | "Title" | "Author" | "Subject" | "ISBN" | "Genre";
type Condition = "Contains" | "Contains exact phrase" | "Starts with";
type MaterialType = "All items" | "Articles" | "Books" | "Journals";
type Sort = "relevance" | "newest" | "price-asc" | "price-desc";

type Listing = {
  id: number;
  title: string;
  author?: string | null;
  subject?: string | null;
  isbn?: string | null;
  genre?: string | null;
  material_type: "book" | "journal" | "article";
  trade_type: "buy" | "trade" | "borrow";
  price: number;
  created_at?: string | null;
};

/** Helpers */
const mtLabelToValue = (m: MaterialType) =>
  m === "Books" ? "book" : m === "Journals" ? "journal" : m === "Articles" ? "article" : undefined;

const toPattern = (cond: Condition, term: string) => {
  if (!term) return "%";
  if (cond === "Starts with") return `${term}%`;
  if (cond === "Contains exact phrase") return `%${term}%`; // we still use ilike, exact phrase handled for ISBN with eq below
  return `%${term}%`;
};

const debounce = <T extends (...a: any[]) => void>(fn: T, delay = 350) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

export default function AdvancedSearchPage() {
  /** ----- UI / filters stateeee */
  const [showFilters, setShowFilters] = useState(true); // toggled by Advanced Search button
  const [term, setTerm] = useState("");
  const [searchBy, setSearchBy] = useState<SearchBy>("Any");
  const [condition, setCondition] = useState<Condition>("Contains");
  const [materialType, setMaterialType] = useState<MaterialType>("All items");
  const [sort, setSort] = useState<Sort>("relevance");

  /** ----- Data & paging ----- */
  const [items, setItems] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  /** ----- Status ----- */
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /** ----- Debounced search term for live typing ----- */
  const [debounced, setDebounced] = useState("");
  const debouncer = useMemo(() => debounce(setDebounced, 400), []);
  useEffect(() => debouncer(term), [term]); // live type → debounce

  /** ----- Build & run query (core logic the button triggers) ----- */
  async function runQuery(activeTerm: string) {
    // Friendly error if env is wrong (prevents "Invalid API key" spam)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setErr(
        "Search is not configured. yet"
      );
      setItems([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setErr(null);

    let q = supabase
      .from("listings")
      .select(
        "id,title,author,subject,isbn,genre,material_type,trade_type,price,created_at",
        { count: "exact" }
      )
      .range((page - 1) * pageSize, page * pageSize - 1);

    // material type
    const mt = mtLabelToValue(materialType);
    if (mt) q = q.eq("material_type", mt);

    // searchBy + condition
    const trimmed = activeTerm.trim();
    if (trimmed) {
      const pat = toPattern(condition, trimmed);
      if (searchBy === "Any") {
        q = q.or(
          [
            `title.ilike.${pat}`,
            `author.ilike.${pat}`,
            `subject.ilike.${pat}`,
            `isbn.ilike.${pat}`,
            `genre.ilike.${pat}`,
          ].join(",")
        );
      } else if (searchBy === "Title") q = q.ilike("title", pat);
      else if (searchBy === "Author") q = q.ilike("author", pat);
      else if (searchBy === "Subject") q = q.ilike("subject", pat);
      else if (searchBy === "Genre") q = q.ilike("genre", pat);
      else if (searchBy === "ISBN") {
        q = condition === "Contains exact phrase" ? q.eq("isbn", trimmed) : q.ilike("isbn", pat);
      }
    }

    // sort
    if (sort === "newest") q = q.order("created_at", { ascending: false });
    if (sort === "price-asc") q = q.order("price", { ascending: true, nullsFirst: true });
    if (sort === "price-desc") q = q.order("price", { ascending: false, nullsFirst: true });

    const { data, error, count } = await q;

    if (error) {
      setErr(error.message);
      setItems([]);
      setTotal(0);
    } else {
      setItems((data as Listing[]) ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }

  /** ----- Trigger rules -----
   *  - Typing (debounced)
   *  - Any filter change
   *  - Clicking Advanced Search (immediate)
   */
  const prevKey = useRef("");
  useEffect(() => {
    const key = JSON.stringify({ searchBy, condition, debounced, materialType, sort, page, pageSize });
    const changed = prevKey.current && prevKey.current !== key;
    prevKey.current = key;
    // Auto-search on change (debounced typing)
    runQuery(debounced);
    // Reset to page 1 whenever a non-page control changes
    if (changed) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBy, condition, debounced, materialType, sort, page, pageSize]);

  // Button: open/close panel and run an immediate search (no debounce)
  function onAdvancedClick() {
    setShowFilters((s) => !s);
    runQuery(term);
    // scroll to results
    requestAnimationFrame(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Enter key in the main search
  function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setPage(1);
      runQuery(term);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  /** ===== RENDER  ===== */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-950 via-green-900 to-black text-white">
      {/* Header (unchanged look) */}
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

      <main className="mx-auto max-w-6xl p-6">
        {/* Top search row */}
        <div className="mb-6 flex gap-3">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Search"
            className="w-full rounded-2xl border border-yellow-500/50 bg-white/10 text-yellow-50 placeholder-yellow-200/70 px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400/60 backdrop-blur-md"
          />
          <button
            onClick={onAdvancedClick}
            className="rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 text-black font-semibold px-6 py-3 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all"
          >
            Advanced Search
          </button>
        </div>

        {/* Filters card (same layout, just wired) */}
        {showFilters && (
          <section className="mb-4 rounded-2xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-4 shadow">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm">Search by</label>
                <select
                  className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as SearchBy)}
                >
                  {(["Any","Title","Author","Subject","ISBN","Genre"] as SearchBy[]).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  {(["Contains","Contains exact phrase","Starts with"] as Condition[]).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={onEnter}
                placeholder="Search term"
                className="min-w-[220px] flex-1 rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2"
              />

              <div className="flex items-center gap-2">
                <label className="text-sm">Material Type</label>
                <select
                  className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                >
                  {(["All items","Articles","Books","Journals"] as MaterialType[]).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm">Sort</label>
                <select
                  className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                >
                  <option value="relevance">Best match</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        <section id="results" className="rounded-2xl border border-yellow-400/40 bg-white/5 backdrop-blur-lg p-5 shadow">
          {loading ? (
            <p className="text-yellow-300">Loading results…</p>
          ) : err ? (
            <div className="text-red-400">{err}</div>
          ) : items.length === 0 ? (
            <div className="text-yellow-100">No results. Try a different term or broaden filters.</div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <li key={r.id} className="rounded-xl border border-yellow-300/40 bg-gradient-to-br from-emerald-950/70 to-black/80 p-4 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-yellow-300 font-semibold">{r.trade_type}</span>
                    <span className="font-bold text-yellow-400">${r.price}</span>
                  </div>
                  <div className="mt-2 text-base font-semibold text-yellow-100">{r.title}</div>
                  <div className="text-sm text-yellow-200/80">{r.author}</div>
                  <div className="mt-2 text-xs uppercase text-yellow-400/80 tracking-wider">{r.material_type}</div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination  */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span>Page size</span>
              <select
                className="rounded-xl border border-yellow-400/50 bg-white/10 px-2 py-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[12,24,48].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2 disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm">Page {page} / {Math.max(1, Math.ceil(total / pageSize))}</span>
              <button
                className="rounded-xl border border-yellow-400/50 bg-white/10 px-3 py-2 disabled:opacity-40"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pageCount}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-10 bg-emerald-950/80 text-yellow-400 text-center py-4 backdrop-blur-md border-t border-yellow-500/30 shadow-inner">
        <p className="text-sm">
          Powered by Supabase & Next.js · George Mason University © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
