// components/drivers/shared.tsx
// Small building blocks shared by the Drivers admin pages.
import { type ReactNode, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type ApplicationStatus = 'new' | 'contacted' | 'hired' | 'not_a_fit';
export type PositionStatus = 'draft' | 'published' | 'closed';

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, { label: string; className: string; dot: string }> = {
  new: { label: 'New', className: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300', dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', className: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300', dot: 'bg-amber-500' },
  hired: { label: 'Hired', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300', dot: 'bg-emerald-500' },
  not_a_fit: { label: 'Not a fit', className: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-300', dot: 'bg-zinc-400' },
};

export const POSITION_STATUS_STYLES: Record<PositionStatus, { label: string; className: string; dot: string }> = {
  draft: { label: 'Draft', className: 'bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-500/10 dark:text-zinc-300', dot: 'bg-zinc-400' },
  published: { label: 'Published', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300', dot: 'bg-emerald-500' },
  closed: { label: 'Closed', className: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300', dot: 'bg-red-500' },
};

export function StatusPill({ label, className, dot }: { label: string; className: string; dot: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap', className)}>
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}

export function ApplicationStatusPill({ status }: { status: ApplicationStatus }) {
  return <StatusPill {...(APPLICATION_STATUS_STYLES[status] ?? APPLICATION_STATUS_STYLES.new)} />;
}

export function PositionStatusPill({ status }: { status: PositionStatus }) {
  return <StatusPill {...(POSITION_STATUS_STYLES[status] ?? POSITION_STATUS_STYLES.draft)} />;
}

/** A titled card section used on the editor pages. */
export function Panel({ title, description, children, className, actions }: { title: string; description?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn('rounded-xl border border-sidebar-border/70 bg-background shadow-xs dark:border-sidebar-border', className)}>
      <header className="flex items-start justify-between gap-4 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

export function Field({ label, htmlFor, error, hint, children, counter }: { label: ReactNode; htmlFor?: string; error?: string; hint?: ReactNode; children: ReactNode; counter?: { value: number; max: number; ideal?: [number, number] } }) {
  const counterClass = counter
    ? counter.value > counter.max
      ? 'text-red-600'
      : counter.ideal && (counter.value < counter.ideal[0] || counter.value > counter.ideal[1])
        ? 'text-amber-600'
        : 'text-muted-foreground'
    : '';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {counter && <span className={cn('text-xs tabular-nums', counterClass)}>{counter.value}/{counter.max}</span>}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/** Editable list of strings (requirements, benefits, trust chips…). */
export function StringListEditor({ value, onChange, placeholder, addLabel = 'Add item', max = 30 }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; addLabel?: string; max?: number }) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (value.length < max) onChange([...value.slice(0, i + 1), '', ...value.slice(i + 1)]);
              }
            }}
          />
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up"><ArrowUp /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Move down"><ArrowDown /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-red-600" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label="Remove"><Trash2 /></Button>
        </div>
      ))}
      {value.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ''])}>
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}

/** Generic editor for lists of small objects (locations, highlights, steps…). */
export function ObjectListEditor<T extends Record<string, string>>({
  value, onChange, fields, empty, addLabel = 'Add', max = 20, columns,
}: {
  value: T[];
  onChange: (v: T[]) => void;
  fields: { key: keyof T & string; placeholder: string; label?: string; textarea?: boolean; options?: { value: string; label: string }[] }[];
  empty: T;
  addLabel?: string;
  max?: number;
  columns?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <div className="grid flex-1 gap-1.5" style={{ gridTemplateColumns: columns ?? `repeat(${fields.length}, minmax(0, 1fr))` }}>
            {fields.map((field) => {
              const set = (v: string) => onChange(value.map((r, idx) => (idx === i ? { ...r, [field.key]: v } : r)));
              if (field.options) {
                return (
                  <select
                    key={field.key}
                    aria-label={field.label ?? field.placeholder}
                    value={row[field.key] ?? ''}
                    onChange={(e) => set(e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs"
                  >
                    {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                );
              }
              return field.textarea ? (
                <textarea
                  key={field.key}
                  aria-label={field.label ?? field.placeholder}
                  value={row[field.key] ?? ''}
                  placeholder={field.placeholder}
                  rows={2}
                  onChange={(e) => set(e.target.value)}
                  className="col-span-full min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              ) : (
                <Input key={field.key} aria-label={field.label ?? field.placeholder} value={row[field.key] ?? ''} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />
              );
            })}
          </div>
          <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0 text-muted-foreground hover:text-red-600" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label="Remove row">
            <Trash2 />
          </Button>
        </div>
      ))}
      {value.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, { ...empty }])}>
          <Plus /> {addLabel}
        </Button>
      )}
    </div>
  );
}

/** Image upload with preview and remove. `currentUrl` is the saved image; `file` is a newly picked one. */
export function ImageField({ currentUrl, file, onFile, removed, onRemove, aspect = 'aspect-video', hint }: {
  currentUrl?: string | null;
  file: File | null;
  onFile: (f: File | null) => void;
  removed?: boolean;
  onRemove?: (removed: boolean) => void;
  aspect?: string;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview ?? (!removed ? currentUrl : null);

  return (
    <div className="space-y-2">
      <label className={cn('group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition hover:border-primary', aspect)}>
        {shown ? (
          <img src={shown} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="size-6" />
            Click to upload
          </span>
        )}
        {shown && <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">Replace image</span>}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            onFile(e.target.files?.[0] ?? null);
            onRemove?.(false);
          }}
        />
      </label>
      <div className="flex items-center justify-between gap-2">
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        {shown && onRemove && (
          <Button type="button" variant="ghost" size="sm" className="ml-auto h-7 text-red-600 hover:text-red-700" onClick={() => { onFile(null); onRemove(true); }}>
            <Trash2 /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}

export const formatPay = (p: { pay_min: number | string | null; pay_max: number | string | null; pay_unit: string | null; pay_display: string | null }) => {
  if (p.pay_display) return p.pay_display;
  const min = p.pay_min !== null && p.pay_min !== '' ? Number(p.pay_min) : null;
  const max = p.pay_max !== null && p.pay_max !== '' ? Number(p.pay_max) : null;
  if (min === null && max === null) return null;
  const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
  const unit = p.pay_unit ? ` / ${p.pay_unit.toLowerCase()}` : '';
  if (min !== null && max !== null && max !== min) return `${fmt(min)}–${fmt(max)}${unit}`;
  return `${fmt((min ?? max) as number)}${unit}`;
};

export const formatDate = (iso: string | null | undefined, withTime = false) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', withTime
    ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
};

export const timeAgo = (iso: string) => {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [[60, 'second'], [60, 'minute'], [24, 'hour'], [7, 'day'], [4.345, 'week'], [12, 'month'], [Infinity, 'year']];
  let value = -seconds;
  for (const [step, unit] of units) {
    if (Math.abs(value) < step) return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.round(value), unit);
    value /= step;
  }
  return '';
};
