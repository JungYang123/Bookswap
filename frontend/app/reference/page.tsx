"use client";

import { useEffect, useState } from "react";
import ListingCard from "../components/listing-card";
import type { Book } from "../components/listing-card";  


export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/books/");
      
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          <button
            onClick={fetchBooks}
            className="mt-4 rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8">
          Available Books
        </h1>
        
        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No books available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <ListingCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}