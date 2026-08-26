import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { pickProduct, type Pick } from "@/content/situations";
import { cn } from "@/lib/utils";

import { Button } from "./kit";

/**
 * A board rendered as a folder. Hover (or tap) tilts the folder open and
 * the saved products pop out; clicking a product opens its detail dialog.
 * Adapted from the 21st.dev "3d-folder" idea, restyled for apt: greyscale
 * folder chrome, flat 420ms motion, no bounce, no glow.
 */
export function BoardFolder({
  title,
  picks,
  cartIds,
  onSelect,
}: {
  title: string;
  picks: readonly Pick[];
  cartIds: ReadonlySet<string>;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  const cardMotion = [
    { x: -52, rotate: -10 },
    { x: 0, rotate: 0 },
    { x: 52, rotate: 10 },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-2xl border bg-card px-4 pt-2 pb-5 transition-[border-color,box-shadow] duration-[240ms] ease-[var(--ease-out)]",
        open
          ? "border-border-strong shadow-[var(--shadow-raise)]"
          : "border-border shadow-[var(--shadow-card)]",
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => {
        // Hover owns open/close where hover exists; tap toggles elsewhere.
        if (!window.matchMedia("(hover: hover)").matches) setOpen((state) => !state);
      }}
    >
      <div className="relative h-44 w-full" style={{ perspective: "900px" }}>
        {/* Folder back */}
        <div className="pointer-events-none absolute bottom-7 left-1/2 h-20 w-28 -translate-x-1/2 rounded-md bg-grey-4" />
        <div className="pointer-events-none absolute bottom-[104px] left-1/2 h-3 w-10 -translate-x-[52px] rounded-t-sm bg-grey-4" />

        {/* Saved products */}
        {picks.map((pick, index) => {
          const product = pickProduct(pick);
          const inCart = cartIds.has(pick.productId);
          const motion = cardMotion[index] ?? cardMotion[1]!;
          return (
            <button
              key={pick.productId}
              type="button"
              tabIndex={open ? undefined : -1}
              aria-hidden={!open}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(index);
              }}
              className="absolute bottom-9 left-1/2 z-10 w-16 cursor-pointer overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-raise)] transition-[transform,opacity] duration-[420ms] ease-[var(--ease-out)] focus-visible:z-30"
              style={{
                transitionDelay: open ? `${index * 60}ms` : "0ms",
                transform: open
                  ? `translate(calc(-50% + ${motion.x}px), -58px) rotate(${motion.rotate}deg)`
                  : "translate(-50%, 0) scale(0.75)",
                opacity: open ? 1 : 0,
              }}
            >
              <img
                src={product.image}
                alt={product.alt}
                width={800}
                height={1066}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
              {inCart ? (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-signal-deep">
                  <Check size={10} strokeWidth={3} aria-hidden />
                </span>
              ) : null}
              <span className="sr-only">
                {product.name}, ${product.price}
                {inCart ? ", in cart" : ""}
              </span>
            </button>
          );
        })}

        {/* Folder front — tilts toward the viewer when open */}
        <div
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 h-20 w-28 -translate-x-1/2 rounded-md border border-grey-4 bg-grey-3 transition-transform duration-[420ms] ease-[var(--ease-out)]"
          style={{
            transformOrigin: "bottom center",
            transform: open ? "translateX(-50%) rotateX(28deg)" : "translateX(-50%) rotateX(0deg)",
          }}
        />
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((state) => !state);
        }}
        onFocus={() => setOpen(true)}
        className="flex cursor-pointer flex-col items-center rounded-md focus-visible:outline-none"
      >
        <span className="text-[15px] font-semibold tracking-[-0.012em]">{title}</span>
        <span className="mt-0.5 text-[12px] text-muted-foreground tabular-nums">
          {picks.length} picks · {open ? "tap one to open" : "hover to peek"}
        </span>
      </button>
    </div>
  );
}

/**
 * Product detail dialog opened from a board folder. Escape, backdrop
 * click, and the close button all dismiss it; focus moves in on open
 * and returns to the opener on close.
 */
export function ProductDetail({
  pick,
  inCart,
  onToggleCart,
  onClose,
}: {
  pick: Pick;
  inCart: boolean;
  onToggleCart: () => void;
  onClose: () => void;
}) {
  const product = pickProduct(pick);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close product details"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-grey-10/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        tabIndex={-1}
        className="rise-in relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sheet)] focus-visible:outline-none"
      >
        <img
          src={product.image}
          alt={product.alt}
          width={800}
          height={1066}
          className="aspect-[4/3] w-full object-cover"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card/95 text-secondary-foreground transition-colors hover:text-foreground"
        >
          <X size={16} aria-hidden />
        </button>
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[16px] font-semibold tracking-[-0.012em]">{product.name}</p>
            <p className="shrink-0 text-[14px] text-secondary-foreground tabular-nums">
              ${product.price}
            </p>
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{product.store}</p>
          <p className="mt-3 text-[14px] leading-[1.55] text-secondary-foreground">{pick.reason}</p>
          <div className="mt-4 flex gap-2">
            <Button variant={inCart ? "outline" : "agent"} onClick={onToggleCart}>
              {inCart ? "Remove from cart" : "Add to cart"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
