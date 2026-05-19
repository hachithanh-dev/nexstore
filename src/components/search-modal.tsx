"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "MacBook Pro",
  "iPhone 16",
  "AirPods Pro",
  "Samsung Galaxy",
  "Sony WH-1000XM5",
  "iPad Pro",
];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      // Small delay to ensure animation plays before focus
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const q = searchQuery.trim();
      if (q) {
        router.push(`/products?search=${encodeURIComponent(q)}`);
        onClose();
        setQuery("");
      }
    },
    [router, onClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] search-overlay-in"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl mx-4 search-input-in">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm, danh mục..."
              className="w-full h-16 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl pl-14 pr-14 text-lg outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.15)] transition-all text-foreground shadow-2xl"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Suggestions Panel */}
        <div className="mt-3 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Popular Searches */}
          <div className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <TrendingUp className="h-4 w-4" />
              Tìm kiếm phổ biến
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm bg-accent/50 hover:bg-accent text-foreground/80 hover:text-foreground transition-all border border-transparent hover:border-primary/20 hover:shadow-md"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-border/50 p-5">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Khám phá nhanh
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Laptop", href: "/products?category=Laptop" },
                { label: "Điện thoại", href: "/products?category=Smartphone" },
                { label: "Tai nghe", href: "/products?category=Audio" },
                { label: "Phụ kiện", href: "/products?category=Accessories" },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    router.push(link.href);
                    onClose();
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all group"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="border-t border-border/50 px-5 py-3 flex items-center justify-between text-xs text-muted-foreground/60">
            <span>Nhấn Enter để tìm kiếm</span>
            <kbd className="px-2 py-0.5 rounded border border-border bg-muted/50 text-[10px] font-mono">
              ESC
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
