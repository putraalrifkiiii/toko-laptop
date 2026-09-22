export const SHOP_NAME = "TechStore";
export const SHOP_TAGLINE = "Toko Komputer & Gaming Premium";
export const WHATSAPP_NUMBER = "6281234567890";

export function formatRupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
