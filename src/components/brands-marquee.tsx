"use client";

const BRANDS = [
  "Apple", "Samsung", "Sony", "LG", "Dell", "ASUS",
  "Lenovo", "HP", "Microsoft", "Google", "Bose", "JBL",
  "Razer", "Logitech", "Canon", "Xiaomi",
];

export function BrandsMarquee() {
  // Duplicate for seamless loop
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee items-center gap-12 w-max">
        {items.map((brand, i) => (
          <div
            key={`${brand}-${i}`}
            className="flex items-center justify-center px-6 py-3 rounded-xl text-lg font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors select-none whitespace-nowrap tracking-wide"
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  );
}
