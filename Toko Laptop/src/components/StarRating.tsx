import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  value,
  className,
  showValue = false,
}: {
  value: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      data-testid="star-rating"
    >
      <Star className="h-3.5 w-3.5 fill-brand text-brand" />
      <span className="font-mono text-xs font-semibold text-zinc-200">
        {value.toFixed(1)}
      </span>
      {showValue && <span className="text-xs text-muted-foreground">/ 5</span>}
    </span>
  );
}
