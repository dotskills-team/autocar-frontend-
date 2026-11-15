"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

/**
 * Styled dropdown for the home vehicle search (native <select> lists can't be styled).
 * Label + value in the box, scrollable list with a filter field for long lists, keyboard friendly.
 */
export function HeroSelect({
  id,
  label,
  placeholder,
  filterPlaceholder,
  value,
  options,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  filterPlaceholder: string;
  value: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const showFilter = options.length > 8;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const selected = options.find((o) => o.value === value);

  function openList() {
    if (disabled) return;
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function choose(o: Option) {
    onChange(o.value);
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option in view
  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "flex h-full w-full items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-left transition",
          open ? "border-brand ring-2 ring-brand/15" : "border-line hover:border-ink/30",
          "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 disabled:hover:border-line",
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-ink">{label}</span>
          <span className={cn("block truncate text-sm", selected ? "font-semibold text-ink" : "text-muted")}>{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink transition", open && "rotate-180 text-brand")} aria-hidden />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-1.5 min-w-48 overflow-hidden rounded-lg border border-line bg-white shadow-[var(--shadow-card-hover)]">
          {showFilter && (
            <div className="border-b border-line p-2">
              <div className="flex items-center gap-2 rounded-md bg-surface px-2.5">
                <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder={filterPlaceholder}
                  aria-label={filterPlaceholder}
                  className="h-9 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                />
              </div>
            </div>
          )}
          <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 && <li className="px-3 py-2.5 text-sm text-muted">—</li>}
            {filtered.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(o)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm",
                    i === active ? "bg-brand-50 text-brand" : "text-ink",
                    isSelected && "font-bold",
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-brand" aria-hidden />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
