// components/editor/editor-dialogs.tsx
// Dialogs used by QuillEditorAdvanced to insert and edit images, buttons and stat rows.
import { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CtaValue, FigureSize, FigureValue, StatItem } from '@/lib/quill-blots';
import { altFromFilename, uploadEditorImage } from '@/lib/upload-image';

interface BaseProps<T> {
  open: boolean;
  initial?: T;
  onClose: () => void;
  onSubmit: (value: T) => void;
  onDelete?: () => void;
}

const SIZE_OPTIONS: { value: FigureSize; label: string; hint: string }[] = [
  { value: 'full', label: 'Full', hint: 'Content width' },
  { value: 'wide', label: 'Wide', hint: 'Breaks out a little' },
  { value: 'half', label: 'Half', hint: 'Centered, 50%' },
  { value: 'small', label: 'Small', hint: 'Centered, 33%' },
];

function Footer({ onDelete, onClose, submitLabel, disabled }: { onDelete?: () => void; onClose: () => void; submitLabel: string; disabled?: boolean }) {
  return (
    <DialogFooter className="gap-2 sm:justify-between">
      <div>
        {onDelete && (
          <Button type="button" variant="ghost" className="text-red-600 hover:text-red-700" onClick={onDelete}>
            <Trash2 /> Remove
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={disabled}>{submitLabel}</Button>
      </div>
    </DialogFooter>
  );
}

export function FigureDialog({ open, initial, onClose, onSubmit, onDelete, showLayoutOptions }: BaseProps<FigureValue> & { showLayoutOptions: boolean }) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [size, setSize] = useState<FigureSize>('full');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setSrc(initial?.src ?? '');
    setAlt(initial?.alt ?? '');
    setCaption(initial?.caption ?? '');
    setSize(initial?.size ?? 'full');
    setTab(initial?.src ? 'url' : 'upload');
    setError(null);
  }, [open, initial]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadEditorImage(file);
      setSrc(uploaded.url);
      if (!alt) setAlt(altFromFilename(file.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // dialogs are portalled but React still bubbles submit to the page form
    if (!/^(https?:\/\/|\/)/i.test(src.trim())) {
      setError('Upload an image or enter a full image URL (https://…).');
      return;
    }
    if (!alt.trim()) {
      setError('Describe the image in the alt text — it helps Google and screen-reader users.');
      return;
    }
    onSubmit({ src: src.trim(), alt: alt.trim(), caption: caption.trim(), size });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{initial ? 'Edit image' : 'Insert image'}</DialogTitle>
            <DialogDescription>Images are uploaded to the CMS and optimized for the website.</DialogDescription>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as 'upload' | 'url')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 px-4 py-8 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
              >
                {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
                {uploading ? 'Uploading…' : 'Click or drop an image (JPG, PNG, WebP, GIF · max 8 MB)'}
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </TabsContent>
            <TabsContent value="url" className="space-y-2 pt-3">
              <Label htmlFor="fig-src">Image URL</Label>
              <Input id="fig-src" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://…" />
            </TabsContent>
          </Tabs>

          {src && (
            <div className="overflow-hidden rounded-lg border bg-muted/40">
              <img src={src} alt="" className="mx-auto max-h-48 object-contain" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fig-alt">Alt text <span className="text-red-500">*</span></Label>
            <Input id="fig-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Blue Kenworth tractor at an Amazon facility" />
          </div>

          {showLayoutOptions && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fig-caption">Caption (optional)</Label>
                <Input id="fig-caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSize(option.value)}
                      className={`rounded-md border px-2 py-2 text-left text-xs transition ${size === option.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                    >
                      <span className="block font-medium">{option.label}</span>
                      <span className="text-muted-foreground">{option.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Footer onDelete={onDelete} onClose={onClose} submitLabel={initial ? 'Update image' : 'Insert image'} disabled={uploading} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

const LINK_PRESETS = [
  { label: 'Open application form', href: '#apply' },
  { label: 'All open positions', href: '/drivers' },
  { label: 'Contact page', href: '/contact-us' },
];

export function CtaDialog({ open, initial, onClose, onSubmit, onDelete }: BaseProps<CtaValue>) {
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('#apply');
  const [style, setStyle] = useState<'primary' | 'outline'>('primary');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLabel(initial?.label ?? 'Apply now');
    setHref(initial?.href ?? '#apply');
    setStyle(initial?.style ?? 'primary');
    setError(null);
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // dialogs are portalled but React still bubbles submit to the page form
    if (!label.trim()) return setError('Button text is required.');
    if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href.trim())) {
      return setError('Link must start with https://, /, #, mailto: or tel:');
    }
    onSubmit({ label: label.trim(), href: href.trim(), style });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{initial ? 'Edit button' : 'Insert button'}</DialogTitle>
            <DialogDescription>A call-to-action button inside the content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cta-label">Button text</Label>
            <Input id="cta-label" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-href">Link</Label>
            <Input id="cta-href" value={href} onChange={(e) => setHref(e.target.value)} />
            <div className="flex flex-wrap gap-1.5">
              {LINK_PRESETS.map((preset) => (
                <button key={preset.href} type="button" onClick={() => setHref(preset.href)} className={`rounded-full border px-2.5 py-1 text-xs ${href === preset.href ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStyle('primary')} className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${style === 'primary' ? 'ring-2 ring-offset-2 ring-[#e93232]' : 'opacity-70'}`} style={{ background: '#e93232' }}>
                Solid
              </button>
              <button type="button" onClick={() => setStyle('outline')} className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${style === 'outline' ? 'ring-2 ring-offset-2 ring-[#2e368f]' : 'opacity-70'}`} style={{ borderColor: '#2e368f', color: '#2e368f' }}>
                Outline
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Footer onDelete={onDelete} onClose={onClose} submitLabel={initial ? 'Update button' : 'Insert button'} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StatsDialog({ open, initial, onClose, onSubmit, onDelete }: BaseProps<StatItem[]>) {
  const [rows, setRows] = useState<StatItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRows(initial?.length ? initial : [
      { value: '$1,800+', label: 'Avg. weekly pay' },
      { value: 'Home weekly', label: 'Home time' },
      { value: '2025+', label: 'Newer equipment' },
    ]);
    setError(null);
  }, [open, initial]);

  const update = (i: number, key: keyof StatItem, value: string) =>
    setRows((current) => current.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // dialogs are portalled but React still bubbles submit to the page form
    const clean = rows.filter((r) => r.value.trim() && r.label.trim()).map((r) => ({ value: r.value.trim(), label: r.label.trim() }));
    if (!clean.length) return setError('Add at least one stat with a value and a label.');
    onSubmit(clean);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{initial ? 'Edit stats row' : 'Insert stats row'}</DialogTitle>
            <DialogDescription>Big numbers that catch the eye — pay, home time, bonuses.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground">
              <span>Value</span><span>Label</span><span className="w-9" />
            </div>
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input value={row.value} onChange={(e) => update(i, 'value', e.target.value)} placeholder="$1,800" maxLength={24} />
                <Input value={row.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Avg. weekly pay" maxLength={40} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setRows(rows.filter((_, idx) => idx !== i))} aria-label="Remove stat">
                  <Trash2 />
                </Button>
              </div>
            ))}
            {rows.length < 4 && (
              <Button type="button" variant="outline" size="sm" onClick={() => setRows([...rows, { value: '', label: '' }])}>
                <Plus /> Add stat
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Footer onDelete={onDelete} onClose={onClose} submitLabel={initial ? 'Update stats' : 'Insert stats'} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
