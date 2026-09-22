import { useState } from "react";
import { Link } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompare } from "@/context/CompareContext";
import { getProduct, type Product } from "@/data/products";
import { formatRupiah } from "@/lib/config";
import { cn } from "@/lib/utils";

function specValue(p: Product, label: string): string {
  return p.specs.find((s) => s.label === label)?.value ?? "—";
}

export default function CompareTray() {
  const { ids, remove, clear } = useCompare();
  const [open, setOpen] = useState(false);
  const products = ids
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  if (products.length === 0) return null;

  const cheapest = Math.min(...products.map((p) => p.price));
  const rows: {
    label: string;
    render: (p: Product) => string;
    highlightBest?: "low";
  }[] = [
    {
      label: "Harga",
      render: (p) => formatRupiah(p.price),
      highlightBest: "low",
    },
    { label: "Processor", render: (p) => specValue(p, "Processor") },
    { label: "GPU", render: (p) => specValue(p, "GPU") },
    { label: "RAM", render: (p) => specValue(p, "RAM") },
    { label: "Storage", render: (p) => specValue(p, "Storage") },
    { label: "Layar", render: (p) => specValue(p, "Layar") },
  ];

  return (
    <>
      <div
        data-testid="compare-tray"
        className="fixed bottom-5 left-1/2 z-40 flex w-[min(94vw,560px)] -translate-x-1/2 items-center gap-3 rounded-lg border border-brand/40 bg-popover/95 p-3 shadow-glow-red backdrop-blur-md"
      >
        <GitCompare className="hidden h-5 w-5 shrink-0 text-brand sm:block" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="relative shrink-0"
              data-testid={`compare-tray-item-${p.id}`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-11 w-14 rounded-sm border border-border object-cover"
              />
              <button
                onClick={() => remove(p.id)}
                data-testid={`compare-tray-remove-${p.id}`}
                aria-label={`Hapus ${p.name} dari perbandingan`}
                className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-border bg-background text-zinc-400 hover:text-brand"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 3 - products.length) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="h-11 w-14 shrink-0 rounded-sm border border-dashed border-border/70"
              />
            ),
          )}
        </div>
        <Button
          data-testid="compare-tray-open-button"
          onClick={() => setOpen(true)}
          className="h-9 shrink-0 font-mono text-[11px] font-bold uppercase tracking-wider"
        >
          Bandingkan ({products.length})
        </Button>
        <Button
          variant="ghost"
          size="icon"
          data-testid="compare-tray-clear-button"
          aria-label="Bersihkan perbandingan"
          onClick={clear}
          className="h-9 w-9 shrink-0 text-zinc-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading uppercase tracking-wide">
              Perbandingan Produk
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Produk</TableHead>
                  {products.map((p) => (
                    <TableHead key={p.id}>
                      <Link
                        to={`/produk/${p.id}`}
                        data-testid={`compare-table-link-${p.id}`}
                        className="flex items-center gap-2 hover:text-brand"
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="h-10 w-12 rounded-sm object-cover"
                        />
                        <span className="max-w-40 text-xs leading-tight">
                          {p.name}
                        </span>
                      </Link>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                      {row.label}
                    </TableCell>
                    {products.map((p) => (
                      <TableCell
                        key={p.id}
                        className={cn(
                          "text-xs text-zinc-300",
                          row.highlightBest === "low" &&
                            p.price === cheapest &&
                            "font-semibold text-brand",
                        )}
                      >
                        {row.render(p)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Rating
                  </TableCell>
                  {products.map((p) => (
                    <TableCell
                      key={p.id}
                      className="font-mono text-xs text-zinc-300"
                    >
                      {p.rating.toFixed(1)} / 5
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    Aksi
                  </TableCell>
                  {products.map((p) => (
                    <TableCell key={p.id}>
                      <Link
                        to={`/produk/${p.id}`}
                        onClick={() => setOpen(false)}
                        data-testid={`compare-table-detail-${p.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "h-7 font-mono text-[10px] uppercase",
                        })}
                      >
                        Lihat Detail
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
