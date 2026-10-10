// resources/js/pages/Admin/Drivers/Positions/Form.tsx
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, CircleAlert, Copy, ExternalLink, Lock, LockOpen, Star, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  formatPay,
  ImageField,
  ObjectListEditor,
  Panel,
  PositionStatusPill,
  StringListEditor,
  type PositionStatus,
} from '@/components/drivers/shared';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

type Location = { city: string; state: string; postal_code: string; street: string };
type Highlight = { label: string; value: string };

interface Position {
  id: number;
  title: string;
  slug: string;
  status: PositionStatus;
  public_status: PositionStatus;
  is_featured: boolean;
  order: number;
  summary: string | null;
  content: string | null;
  employment_type: string;
  route_type: string | null;
  home_time: string | null;
  schedule: string | null;
  equipment: string | null;
  pay_min: string | null;
  pay_max: string | null;
  pay_unit: string | null;
  pay_display: string | null;
  locations: Partial<Location>[] | null;
  requirements: string[] | null;
  benefits: string[] | null;
  highlights: Highlight[] | null;
  date_posted: string | null;
  valid_through: string | null;
  seo_title: string | null;
  seo_description: string | null;
  cover_image_url: string | null;
  og_image_url: string | null;
  applications_count: number;
}

interface Props {
  position: Position | null;
  options: { statuses: PositionStatus[]; employmentTypes: string[]; routeTypes: string[]; payUnits: string[] };
  websiteUrl: string;
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contractor (1099)',
  TEMPORARY: 'Temporary',
};
const PAY_UNIT_LABELS: Record<string, string> = { HOUR: 'per hour', DAY: 'per day', WEEK: 'per week', MONTH: 'per month', YEAR: 'per year' };

const slugify = (text: string) =>
  text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const selectClass = 'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30';

export default function PositionForm({ position, options, websiteUrl }: Props) {
  const isEdit = !!position;
  const [slugLocked, setSlugLocked] = useState(isEdit);

  const { data, setData, post, processing, errors, transform, isDirty } = useForm({
    title: position?.title ?? '',
    slug: position?.slug ?? '',
    status: position?.status ?? ('draft' as PositionStatus),
    is_featured: position?.is_featured ?? false,
    order: position?.order ?? 0,
    summary: position?.summary ?? '',
    content: position?.content ?? '',
    employment_type: position?.employment_type ?? 'FULL_TIME',
    route_type: position?.route_type ?? '',
    home_time: position?.home_time ?? '',
    schedule: position?.schedule ?? '',
    equipment: position?.equipment ?? '',
    pay_min: position?.pay_min ?? '',
    pay_max: position?.pay_max ?? '',
    pay_unit: position?.pay_unit ?? '',
    pay_display: position?.pay_display ?? '',
    locations: (position?.locations?.length ? position.locations : [{}]).map((l) => ({
      city: l.city ?? '', state: l.state ?? '', postal_code: l.postal_code ?? '', street: l.street ?? '',
    })) as Location[],
    requirements: position?.requirements?.length ? position.requirements : ['Valid Class A CDL', 'Current DOT medical card', 'Clean driving record'],
    benefits: position?.benefits ?? [],
    highlights: (position?.highlights ?? []) as Highlight[],
    date_posted: position?.date_posted ?? '',
    valid_through: position?.valid_through ?? '',
    seo_title: position?.seo_title ?? '',
    seo_description: position?.seo_description ?? '',
    cover_image: null as File | null,
    remove_cover_image: false as boolean,
    og_image: null as File | null,
    remove_og_image: false as boolean,
  });

  const save = (statusOverride?: PositionStatus) => {
    transform((d) => ({
      ...d,
      ...(statusOverride ? { status: statusOverride } : {}),
      ...(isEdit ? { _method: 'put' } : {}),
    }));
    const url = isEdit ? route('admin.driver-positions.update', position!.id) : route('admin.driver-positions.store');
    post(url, { preserveScroll: true, forceFormData: true });
  };

  const onTitle = (title: string) => {
    setData((d) => ({ ...d, title, slug: slugLocked ? d.slug : slugify(title) }));
  };

  // ----- Google preview + rich results checklist -----
  const firstLocation = data.locations.find((l) => l.city || l.state);
  const locationLabel = firstLocation ? [firstLocation.city, firstLocation.state].filter(Boolean).join(', ') : '';
  const pay = formatPay(data);
  const previewTitle = data.seo_title || [data.title || 'Position title', locationLabel].filter(Boolean).join(' – ') + ' | CDL-A Driver Job';
  const previewDescription =
    data.seo_description ||
    data.summary ||
    [pay, locationLabel, stripHtml(data.content || '')].filter(Boolean).join(' · ').slice(0, 160) ||
    'Add a summary to control how this job appears in search results.';
  const slug = data.slug || slugify(data.title) || 'position';

  const checks = useMemo(() => [
    { ok: !!data.title.trim(), label: 'Job title', required: true },
    { ok: stripHtml(data.content || '').length >= 100, label: 'Full description (100+ characters)', required: true },
    { ok: data.locations.some((l) => l.city && l.state), label: 'Location with city and state', required: true },
    { ok: !!data.employment_type, label: 'Employment type', required: false },
    { ok: !!(data.pay_min && data.pay_unit), label: 'Salary with a Google pay unit (hour/week/…)', required: false },
    { ok: data.locations.some((l) => l.postal_code), label: 'ZIP code', required: false },
    { ok: !!data.valid_through, label: 'Valid-through date', required: false },
    { ok: !!data.summary.trim(), label: 'Card summary', required: false },
  ], [data]);
  const requiredMissing = checks.filter((c) => c.required && !c.ok).length;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Positions', href: '/admin/driver-positions' },
    { title: isEdit ? position!.title : 'New position', href: '#' },
  ];

  const liveStatus = position?.public_status;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? `Edit · ${position!.title}` : 'New position'} />
      <FlashMessage />
      <form
        onSubmit={(e) => { e.preventDefault(); save(); }}
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6"
      >
        {/* Sticky action bar */}
        <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-b border-sidebar-border/70 bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 dark:border-sidebar-border">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href={route('admin.driver-positions.index')} aria-label="Back to positions"><ArrowLeft /></Link>
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold">{data.title || 'New position'}</h1>
              {isEdit && <PositionStatusPill status={liveStatus ?? data.status} />}
              {isDirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
            </div>
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                {position!.applications_count} application{position!.applications_count === 1 ? '' : 's'} ·{' '}
                <Link href={route('admin.driver-applications.index', { position: position!.id })} className="underline-offset-4 hover:underline">view applicants</Link>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isEdit && liveStatus === 'published' && (
              <Button asChild variant="outline" size="sm">
                <a href={`${websiteUrl}/drivers/${position!.slug}`} target="_blank" rel="noreferrer"><ExternalLink /> View live</a>
              </Button>
            )}
            {isEdit && (
              <Button type="button" variant="ghost" size="sm" onClick={() => router.post(route('admin.driver-positions.duplicate', position!.id))}>
                <Copy /> Duplicate
              </Button>
            )}
            {data.status !== 'published' || liveStatus === 'closed' ? (
              <>
                <Button type="submit" variant="outline" size="sm" disabled={processing}>
                  {data.status === 'closed' ? 'Save' : 'Save draft'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={processing || requiredMissing > 0}
                  title={requiredMissing > 0 ? 'Complete the required items in the checklist first' : undefined}
                  onClick={() => { setData('status', 'published'); save('published'); }}
                  className="bg-[#e93232] text-white hover:bg-[#d12a2a]"
                >
                  {liveStatus === 'closed' && isEdit ? 'Re-publish' : 'Publish'}
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" size="sm" disabled={processing} onClick={() => { setData('status', 'closed'); save('closed'); }}>
                  Close position
                </Button>
                <Button type="submit" size="sm" disabled={processing}>
                  {processing ? 'Saving…' : 'Update'}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ---------- Main column ---------- */}
          <div className="flex min-w-0 flex-col gap-6">
            <Panel title="Basics" description="What drivers see first on the job card and at the top of the page.">
              <Field label="Job title" htmlFor="title" error={errors.title} counter={{ value: data.title.length, max: 255, ideal: [10, 70] }}>
                <Input id="title" value={data.title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Regional CDL-A Driver – Home Weekly" className="text-base" />
              </Field>

              <Field label="Page URL" htmlFor="slug" error={errors.slug} hint={isEdit ? 'Changing the URL of a live job can break links already shared or indexed.' : 'Generated from the title. Unlock to customise.'}>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center overflow-hidden rounded-md border border-input shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50">
                    <span className="hidden border-r bg-muted px-3 py-2 text-xs text-muted-foreground sm:block">{websiteUrl.replace(/^https?:\/\//, '')}/drivers/</span>
                    <input
                      id="slug"
                      value={data.slug}
                      readOnly={slugLocked}
                      onChange={(e) => setData('slug', slugify(e.target.value))}
                      className={cn('h-9 flex-1 bg-transparent px-3 text-sm outline-none', slugLocked && 'text-muted-foreground')}
                    />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={() => setSlugLocked(!slugLocked)} aria-label={slugLocked ? 'Unlock URL' : 'Lock URL'}>
                    {slugLocked ? <Lock /> : <LockOpen />}
                  </Button>
                </div>
              </Field>

              <Field label="Card summary" htmlFor="summary" error={errors.summary} hint="One or two sentences for the job card and search results." counter={{ value: data.summary.length, max: 300, ideal: [80, 200] }}>
                <Textarea id="summary" rows={3} value={data.summary} onChange={(e) => setData('summary', e.target.value)} placeholder="Home every weekend, dedicated Amazon Freight Partner lanes out of Atlanta. Newer equipment, weekly pay." />
              </Field>

              <Field label="Highlights" hint="Short facts shown as chips on the card, e.g. Home time → Weekly.">
                <ObjectListEditor<Highlight>
                  value={data.highlights}
                  onChange={(v) => setData('highlights', v)}
                  empty={{ label: '', value: '' }}
                  fields={[{ key: 'label', placeholder: 'Label (e.g. Sign-on bonus)' }, { key: 'value', placeholder: 'Value (e.g. $2,500)' }]}
                  addLabel="Add highlight"
                  max={8}
                />
              </Field>
            </Panel>

            <Panel title="Job description" description="Write freely: add images, highlight boxes, buttons and stat rows from the Insert bar.">
              <QuillEditorAdvanced
                value={data.content}
                onChange={(content) => setData('content', content)}
                placeholder="Describe the route, the schedule, the equipment and what makes this job great…"
                height="420px"
                allowCustomBlocks
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </Panel>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel title="Requirements" description="Shown as a checklist. Press Enter to add the next one.">
                <StringListEditor value={data.requirements} onChange={(v) => setData('requirements', v)} placeholder="e.g. 1+ year CDL-A experience" addLabel="Add requirement" />
              </Panel>
              <Panel title="Benefits" description="Shown as a grid of perks.">
                <StringListEditor value={data.benefits} onChange={(v) => setData('benefits', v)} placeholder="e.g. Weekly direct deposit" addLabel="Add benefit" />
              </Panel>
            </div>

            <Panel title="Search appearance" description="How this job looks on Google. Leave blank to use the title and summary.">
              <div className="rounded-lg border bg-white p-4 text-left shadow-xs dark:bg-zinc-950">
                <p className="truncate text-xs text-[#202124] dark:text-zinc-300">{websiteUrl.replace(/^https?:\/\//, '')} › drivers › {slug}</p>
                <p className="mt-1 truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{previewTitle}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#4d5156] dark:text-zinc-400">{previewDescription}</p>
              </div>
              <Field label="SEO title" htmlFor="seo_title" error={errors.seo_title} counter={{ value: data.seo_title.length, max: 255, ideal: [0, 60] }}>
                <Input id="seo_title" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} placeholder={previewTitle} />
              </Field>
              <Field label="Meta description" htmlFor="seo_description" error={errors.seo_description} counter={{ value: data.seo_description.length, max: 320, ideal: [0, 160] }}>
                <Textarea id="seo_description" rows={2} value={data.seo_description} onChange={(e) => setData('seo_description', e.target.value)} placeholder="Defaults to the card summary." />
              </Field>
              <Field label="Social share image" hint="1200×630 recommended. Without one, a branded image with the title and pay is generated automatically.">
                <ImageField
                  currentUrl={position?.og_image_url}
                  file={data.og_image}
                  onFile={(f) => setData('og_image', f)}
                  removed={data.remove_og_image}
                  onRemove={(r) => setData('remove_og_image', r)}
                  aspect="aspect-[1200/630]"
                />
              </Field>
            </Panel>
          </div>

          {/* ---------- Side column ---------- */}
          <aside className="flex flex-col gap-6">
            <Panel title="Google Jobs readiness" description={requiredMissing ? `${requiredMissing} required item${requiredMissing > 1 ? 's' : ''} missing` : 'Ready for rich results'}>
              <ul className="space-y-2 text-sm">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-start gap-2">
                    {c.ok ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    ) : (
                      <CircleAlert className={cn('mt-0.5 size-4 shrink-0', c.required ? 'text-red-500' : 'text-amber-500')} />
                    )}
                    <span className={cn(!c.ok && 'text-muted-foreground')}>
                      {c.label}
                      {!c.ok && c.required && <span className="ml-1 text-xs text-red-500">required</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Publishing">
              <Field label="Status" htmlFor="status" error={errors.status}>
                <select id="status" className={selectClass} value={data.status} onChange={(e) => setData('status', e.target.value as PositionStatus)}>
                  <option value="draft">Draft — hidden</option>
                  <option value="published">Published — live on the website</option>
                  <option value="closed">Closed — position filled</option>
                </select>
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/40">
                <Checkbox checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v === true)} />
                <span className="flex-1 text-sm">
                  <span className="flex items-center gap-1.5 font-medium"><Star className="size-3.5 text-amber-500" /> Featured</span>
                  <span className="text-xs text-muted-foreground">Pinned to the top with a ribbon.</span>
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date posted" htmlFor="date_posted" error={errors.date_posted}>
                  <Input id="date_posted" type="date" value={data.date_posted} onChange={(e) => setData('date_posted', e.target.value)} />
                </Field>
                <Field label="Valid through" htmlFor="valid_through" error={errors.valid_through}>
                  <Input id="valid_through" type="date" value={data.valid_through} onChange={(e) => setData('valid_through', e.target.value)} />
                </Field>
              </div>
              <p className="text-xs text-muted-foreground">After the valid-through date the job automatically shows as closed and leaves Google Jobs. Date posted is set on first publish if left empty.</p>
              <Field label="Sort order" htmlFor="order" hint="Lower numbers show first.">
                <Input id="order" type="number" min={0} value={data.order} onChange={(e) => setData('order', Number(e.target.value))} />
              </Field>
            </Panel>

            <Panel title="Job details">
              <Field label="Employment type" htmlFor="employment_type" error={errors.employment_type}>
                <select id="employment_type" className={selectClass} value={data.employment_type} onChange={(e) => setData('employment_type', e.target.value)}>
                  {options.employmentTypes.map((t) => <option key={t} value={t}>{EMPLOYMENT_LABELS[t] ?? t}</option>)}
                </select>
              </Field>
              <Field label="Route type" htmlFor="route_type" error={errors.route_type}>
                <Input id="route_type" list="route-types" value={data.route_type} onChange={(e) => setData('route_type', e.target.value)} placeholder="Regional" />
                <datalist id="route-types">{options.routeTypes.map((t) => <option key={t} value={t} />)}</datalist>
              </Field>
              <Field label="Home time" htmlFor="home_time" error={errors.home_time}>
                <Input id="home_time" value={data.home_time} onChange={(e) => setData('home_time', e.target.value)} placeholder="Home weekly" />
              </Field>
              <Field label="Schedule" htmlFor="schedule" error={errors.schedule}>
                <Input id="schedule" value={data.schedule} onChange={(e) => setData('schedule', e.target.value)} placeholder="4 on / 3 off, nights" />
              </Field>
              <Field label="Equipment" htmlFor="equipment" error={errors.equipment}>
                <Input id="equipment" value={data.equipment} onChange={(e) => setData('equipment', e.target.value)} placeholder="2024 Kenworth T680, 53' dry van" />
              </Field>
            </Panel>

            <Panel title="Pay" description={pay ? `Shows as: ${pay}` : 'Jobs with pay get more clicks.'}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min" htmlFor="pay_min" error={errors.pay_min}>
                  <Input id="pay_min" type="number" step="0.01" min={0} value={data.pay_min} onChange={(e) => setData('pay_min', e.target.value)} placeholder="1500" />
                </Field>
                <Field label="Max" htmlFor="pay_max" error={errors.pay_max}>
                  <Input id="pay_max" type="number" step="0.01" min={0} value={data.pay_max} onChange={(e) => setData('pay_max', e.target.value)} placeholder="1900" />
                </Field>
              </div>
              <Field label="Per" htmlFor="pay_unit" error={errors.pay_unit}>
                <select id="pay_unit" className={selectClass} value={data.pay_unit} onChange={(e) => setData('pay_unit', e.target.value)}>
                  <option value="">—</option>
                  {options.payUnits.map((u) => <option key={u} value={u}>{PAY_UNIT_LABELS[u] ?? u}</option>)}
                </select>
              </Field>
              <Field label="Display text (optional)" htmlFor="pay_display" error={errors.pay_display} hint="Overrides the text on the site, e.g. “$0.68–0.72 CPM”. Google still receives min/max when a unit is set.">
                <Input id="pay_display" value={data.pay_display} onChange={(e) => setData('pay_display', e.target.value)} placeholder="$0.68–0.72 per mile" />
              </Field>
            </Panel>

            <Panel title="Locations" description="Where drivers are based or report. Add one row per terminal.">
              <ObjectListEditor<Location>
                value={data.locations}
                onChange={(v) => setData('locations', v)}
                empty={{ city: '', state: '', postal_code: '', street: '' }}
                fields={[
                  { key: 'city', placeholder: 'City' },
                  { key: 'state', placeholder: 'ST' },
                  { key: 'postal_code', placeholder: 'ZIP' },
                ]}
                columns="minmax(0,1.6fr) minmax(0,0.7fr) minmax(0,0.9fr)"
                addLabel="Add location"
                max={30}
              />
              {Object.keys(errors).some((k) => k.startsWith('locations')) && <p className="text-sm text-red-500">Check the location fields.</p>}
            </Panel>

            <Panel title="Cover image" description="Optional. Shown on the job card and page header.">
              <ImageField
                currentUrl={position?.cover_image_url}
                file={data.cover_image}
                onFile={(f) => setData('cover_image', f)}
                removed={data.remove_cover_image}
                onRemove={(r) => setData('remove_cover_image', r)}
              />
              {errors.cover_image && <p className="text-sm text-red-500">{errors.cover_image}</p>}
            </Panel>

            {isEdit && (
              <Button
                type="button"
                variant="ghost"
                className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
                onClick={() => {
                  if (confirm(`Delete "${position!.title}"? Applications for it are kept.`)) {
                    router.delete(route('admin.driver-positions.destroy', position!.id));
                  }
                }}
              >
                <Trash2 /> Delete position
              </Button>
            )}
          </aside>
        </div>
      </form>
    </AppLayout>
  );
}
