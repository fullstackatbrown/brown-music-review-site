"use client"
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { HomepageArticle } from "@/lib/types";

interface Page {
  name: string;
  path: string;
}

const pages: Page[] = [
  { name: "Home", path: "/" },
  { name: "Deep Dive", path: "/deepdive" },
  { name: "Narratives", path: "/narratives" },
  { name: "Hot Topics", path: "/hottopics" },
  { name: "Opinions", path: "/opinions" },
  { name: "About Us", path: "/about" },
];

function SearchOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<HomepageArticle[]>([]);
  const [results, setResults] = useState<HomepageArticle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all articles on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch {
        // silently fail
      }
    }
    void load();
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Filter articles as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults(articles);
      return;
    }
    const q = query.toLowerCase();
    const filtered = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.reviewer.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.typeLabel.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, articles]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Search header */}
      <div className="w-full max-w-2xl mx-auto pt-12 px-5">
        <div className="flex items-center gap-3 border-b border-white/30 pb-3">
          <Search size={18} className="text-white/60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-white text-lg font-light outline-none placeholder:text-white/40"
          />
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-white/40 text-xs mt-2 tracking-wide">
          {query.trim()
            ? `${results.length} result${results.length !== 1 ? "s" : ""}`
            : `${articles.length} articles`}
        </p>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto mt-4 px-5 pb-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {results.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              onClick={onClose}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              {/* Cover thumbnail */}
              <div className="w-12 h-12 rounded-md overflow-hidden bg-neutral-700 flex-shrink-0 relative">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-600 to-neutral-800" />
                )}
              </div>
              {/* Article info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base leading-snug group-hover:text-[#D20000] transition-colors truncate">
                  {article.title}
                </h3>
                <p className="text-white/50 text-xs mt-0.5 truncate">
                  {article.reviewer} &middot; {article.typeLabel}
                </p>
              </div>
              {/* Rating badge */}
              {article.ratingLabel && (
                <span
                  className="text-[0.65rem] tracking-wider uppercase px-2.5 py-0.5 rounded-full text-white flex-shrink-0"
                  style={{ backgroundColor: article.accentColor }}
                >
                  {article.ratingLabel}
                </span>
              )}
            </Link>
          ))}
          {results.length === 0 && query.trim() && (
            <p className="text-white/40 text-center py-10 text-base">
              No articles match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <div className="w-full bg-black relative overflow-hidden flex flex-col items-center">
        {/* Sizes here are written as explicit values rather than Tailwind's
            steps because every one of them is the previous size x1.3 — keeping
            the factor uniform makes the scaling checkable at a glance. */}
        <div className="w-full relative py-[2.275rem] px-[2.6rem]">
          {/* Search Icon */}
          <div className="absolute right-[2.6rem] bottom-[1.625rem] text-white">
            <button aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={26} strokeWidth={2.5} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center mb-[1.3rem]">
            {/* Helvetica Neue ships no face above Bold, so font-weight alone
                tops out at 700 and `font-extrabold` would render identically.
                The text stroke thickens the glyph outlines themselves, which
                is what actually reads as heavier — on Windows/Linux too, where
                this falls back to Arial and hits the same 700 ceiling. */}
            <div
              className="text-white text-[1.95rem] leading-[2.6rem] font-extrabold tracking-[0.18em] uppercase"
              style={{ WebkitTextStroke: "0.6px currentColor" }}
            >
              BROWN MUSIC REVIEW
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto w-[429px] max-w-full border-t-[2.6px] border-white opacity-80 mb-[0.975rem]" />

          {/* Navigation Links */}
          <div className="flex justify-center gap-[2.6rem] items-center">
            {pages.map((page) => (
              <Link
                href={page.path}
                key={page.name}
                className="text-white text-[1.1375rem] font-medium leading-[28.6px] hover:text-[#D20000] transition-colors"
              >
                {page.name}
              </Link>
            ))}
          </div>

          {/* Subscribe Button */}
          <Link
            href="/subscribe"
            className="absolute right-[2.6rem] top-[2.275rem] bg-[#D20000] px-[1.3rem] h-[44.2px] rounded-[0.65rem] shadow-sm flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <span className="text-white text-[0.975rem] leading-[1.3rem] font-medium">Subscribe</span>
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
