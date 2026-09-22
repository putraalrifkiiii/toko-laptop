import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, Zap, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, CATEGORY_LABEL } from "@/data/products";
import { formatRupiah } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Beranda" },
  { to: "/kategori/laptop", label: "Laptop" },
  { to: "/kategori/pc-gaming", label: "PC Gaming" },
  { to: "/kategori/komponen", label: "Komponen PC" },
  { to: "/kategori/monitor", label: "Monitor" },
  { to: "/kategori/periferal", label: "Periferal" },
  { to: "/rekomendasi", label: "Rekomendasi", accent: true },
  { to: "/promo", label: "Promo" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5", className)}
      data-testid="navbar-logo"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white shadow-glow-red">
        <Zap className="h-4.5 w-4.5" strokeWidth={2.5} />
      </span>
      <span className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
        Tech<span className="text-brand">Store</span>
      </span>
    </Link>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        CATEGORY_LABEL[p.category].toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const go = (id: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/produk/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-20 translate-y-0 gap-0 p-0"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Cari produk</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            data-testid="search-dialog-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onOpenChange(false);
                navigate(`/produk?q=${encodeURIComponent(query.trim())}`);
                setQuery("");
              }
            }}
            placeholder="Cari laptop, GPU, monitor..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {query && (
            <button
              data-testid="search-dialog-clear-button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Bersihkan pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Tidak ada produk yang cocok dengan “{query}”.
            </p>
          )}
          {!query && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Ketik untuk mencari produk — misalnya “ROG”, “RTX 4060”, atau
              “monitor”.
            </p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              data-testid={`search-result-${p.id}`}
              onClick={() => go(p.id)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <img
                src={p.image}
                alt=""
                className="h-10 w-12 rounded-sm object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {p.name}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.brand} · {CATEGORY_LABEL[p.category]}
                </span>
              </span>
              <span className="font-mono text-xs text-brand">
                {formatRupiah(p.price)}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "whitespace-nowrap text-[13px] font-medium tracking-wide transition-colors",
      isActive ? "text-brand" : "text-zinc-300 hover:text-foreground",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="hidden min-w-0 flex-1 items-center gap-5 xl:flex"
          data-testid="navbar-links-desktop"
        >
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={linkCls}
            >
              {l.accent && <Zap className="mr-1 inline h-3 w-3" />}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 xl:ml-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cari produk"
            data-testid="navbar-search-button"
            onClick={() => setSearchOpen(true)}
            className="text-zinc-300 hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Link
            to="/keranjang"
            aria-label="Keranjang belanja"
            data-testid="navbar-cart-link"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "relative text-zinc-300 hover:text-foreground",
            })}
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 font-mono text-[10px] font-bold text-white shadow-glow-red"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Buka menu"
            data-testid="navbar-menu-button"
            className="text-zinc-300 hover:text-foreground xl:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* garis aksen merah tipis di bawah navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72 border-border bg-card">
          <SheetHeader className="border-b border-border">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav
            className="flex flex-col gap-1 p-4"
            data-testid="navbar-links-mobile"
          >
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-zinc-300 hover:bg-accent hover:text-foreground",
                    l.accent && "text-brand",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/keranjang"
              onClick={() => setMobileOpen(false)}
              className={buttonVariants({
                variant: "default",
                className: "mt-3",
              })}
              data-testid="mobile-cart-link"
            >
              Keranjang {count > 0 ? `(${count})` : ""}
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
