// resources/js/pages/Admin/Drivers/Page/Edit.tsx
import { Head, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Field, ImageField, ObjectListEditor, Panel, StringListEditor } from '@/components/drivers/shared';
import { type BreadcrumbItem } from '@/types';

type WhyItem = { icon: string; title: string; description: string };
type Step = { title: string; description: string };

interface PageData {
  hero_eyebrow: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_primary_btn: string | null;
  hero_secondary_btn: string | null;
  recruiter_phone: string | null;
  trust_chips: string[] | null;
  positions_title: string | null;
  positions_subtitle: string | null;
  empty_state: string | null;
  why_title: string | null;
  why_subtitle: string | null;
  why_items: WhyItem[] | null;
  feature_title: string | null;
  feature_body: string | null;
  feature_image_url: string | null;
  steps_title: string | null;
  steps: Step[] | null;
  form_title: string | null;
  form_subtitle: string | null;
  availability_options: string[] | null;
  success_message: string | null;
  cta_title: string | null;
  cta_body: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
}

interface Props {
  page: PageData;
  websiteUrl: string;
}

const ICONS = [
  { value: 'route', label: 'Route' },
  { value: 'dollar', label: 'Pay' },
  { value: 'shield', label: 'Safety' },
  { value: 'headset', label: 'Support' },
  { value: 'home', label: 'Home time' },
  { value: 'truck', label: 'Truck' },
  { value: 'calendar', label: 'Schedule' },
  { value: 'star', label: 'Star' },
  { value: 'users', label: 'Team' },
  { value: 'clock', label: 'Clock' },
];

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Drivers', href: '/admin/driver-applications' },
  { title: 'Drivers Page', href: '/admin/drivers-page' },
];

export default function DriversPageEdit({ page, websiteUrl }: Props) {
  const { data, setData, post, processing, errors, transform, isDirty } = useForm({
    hero_eyebrow: page.hero_eyebrow ?? '',
    hero_title: page.hero_title ?? '',
    hero_subtitle: page.hero_subtitle ?? '',
    hero_primary_btn: page.hero_primary_btn ?? '',
    hero_secondary_btn: page.hero_secondary_btn ?? '',
    recruiter_phone: page.recruiter_phone ?? '',
    trust_chips: page.trust_chips ?? [],
    positions_title: page.positions_title ?? '',
    positions_subtitle: page.positions_subtitle ?? '',
    empty_state: page.empty_state ?? '',
    why_title: page.why_title ?? '',
    why_subtitle: page.why_subtitle ?? '',
    why_items: (page.why_items ?? []) as WhyItem[],
    feature_title: page.feature_title ?? '',
    feature_body: page.feature_body ?? '',
    steps_title: page.steps_title ?? '',
    steps: (page.steps ?? []) as Step[],
    form_title: page.form_title ?? '',
    form_subtitle: page.form_subtitle ?? '',
    availability_options: page.availability_options ?? [],
    success_message: page.success_message ?? '',
    cta_title: page.cta_title ?? '',
    cta_body: page.cta_body ?? '',
    seo_title: page.seo_title ?? '',
    seo_description: page.seo_description ?? '',
    hero_image: null as File | null,
    remove_hero_image: false as boolean,
    feature_image: null as File | null,
    remove_feature_image: false as boolean,
    og_image: null as File | null,
    remove_og_image: false as boolean,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    transform((d) => ({ ...d, _method: 'put' }));
    post(route('admin.drivers-page.update'), { preserveScroll: true, forceFormData: true });
  };

  const tabError = (keys: string[]) => Object.keys(errors).some((k) => keys.some((key) => k.startsWith(key)));
  const dot = <span className="ml-1 size-1.5 rounded-full bg-red-500" />;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Drivers Page" />
      <FlashMessage />
      <form onSubmit={submit} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Drivers page</h1>
            <p className="text-sm text-muted-foreground">Content of the /drivers landing page. Positions and FAQs are managed separately.</p>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
            <Button asChild variant="outline" size="sm">
              <a href={`${websiteUrl}/drivers`} target="_blank" rel="noreferrer"><ExternalLink /> View page</a>
            </Button>
            <Button type="submit" size="sm" disabled={processing}>{processing ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="gap-6">
          <TabsList className="flex h-auto w-full flex-wrap justify-start">
            <TabsTrigger value="hero">Hero {tabError(['hero_', 'recruiter', 'trust']) && dot}</TabsTrigger>
            <TabsTrigger value="positions">Positions {tabError(['positions_', 'empty']) && dot}</TabsTrigger>
            <TabsTrigger value="why">Why us {tabError(['why_']) && dot}</TabsTrigger>
            <TabsTrigger value="feature">Feature {tabError(['feature_']) && dot}</TabsTrigger>
            <TabsTrigger value="steps">How it works {tabError(['steps']) && dot}</TabsTrigger>
            <TabsTrigger value="form">Application form {tabError(['form_', 'availability', 'success']) && dot}</TabsTrigger>
            <TabsTrigger value="cta">Final CTA {tabError(['cta_']) && dot}</TabsTrigger>
            <TabsTrigger value="seo">SEO {tabError(['seo_', 'og_']) && dot}</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Hero" description="The first screen drivers see.">
              <Field label="Eyebrow" htmlFor="hero_eyebrow" error={errors.hero_eyebrow} hint="Small badge above the headline.">
                <Input id="hero_eyebrow" value={data.hero_eyebrow} onChange={(e) => setData('hero_eyebrow', e.target.value)} placeholder="Now hiring · CDL-A drivers" />
              </Field>
              <Field label="Headline" htmlFor="hero_title" error={errors.hero_title} hint="Wrap words in *asterisks* to highlight them in red." counter={{ value: data.hero_title.length, max: 160, ideal: [10, 70] }}>
                <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
              </Field>
              <Field label="Subheadline" htmlFor="hero_subtitle" error={errors.hero_subtitle}>
                <Textarea id="hero_subtitle" rows={3} value={data.hero_subtitle} onChange={(e) => setData('hero_subtitle', e.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary button" htmlFor="hero_primary_btn" error={errors.hero_primary_btn} hint="Opens the application form.">
                  <Input id="hero_primary_btn" value={data.hero_primary_btn} onChange={(e) => setData('hero_primary_btn', e.target.value)} placeholder="Apply Now" />
                </Field>
                <Field label="Secondary button" htmlFor="hero_secondary_btn" error={errors.hero_secondary_btn} hint="Calls the recruiter phone.">
                  <Input id="hero_secondary_btn" value={data.hero_secondary_btn} onChange={(e) => setData('hero_secondary_btn', e.target.value)} placeholder="Call a Recruiter" />
                </Field>
              </div>
              <Field label="Recruiter phone" htmlFor="recruiter_phone" error={errors.recruiter_phone} hint="Leave empty to use the phone number from the Footer settings.">
                <Input id="recruiter_phone" value={data.recruiter_phone} onChange={(e) => setData('recruiter_phone', e.target.value)} placeholder="(555) 123-4567" />
              </Field>
              <Field label="Trust chips" hint="Short proof points under the buttons (max 6).">
                <StringListEditor value={data.trust_chips} onChange={(v) => setData('trust_chips', v)} placeholder="e.g. Weekly pay" addLabel="Add chip" max={6} />
              </Field>
            </Panel>
            <Panel title="Background image" description="Shown behind the logo and headline.">
              <ImageField currentUrl={page.hero_image_url} file={data.hero_image} onFile={(f) => setData('hero_image', f)} removed={data.remove_hero_image} onRemove={(r) => setData('remove_hero_image', r)} aspect="aspect-[4/5]" hint="Tall photo with open sky at the top works best. Empty = default truck photo." />
              {errors.hero_image && <p className="text-sm text-red-500">{errors.hero_image}</p>}
            </Panel>
          </TabsContent>

          <TabsContent value="positions">
            <Panel title="Open positions section">
              <Field label="Section title" htmlFor="positions_title" error={errors.positions_title}>
                <Input id="positions_title" value={data.positions_title} onChange={(e) => setData('positions_title', e.target.value)} />
              </Field>
              <Field label="Section subtitle" htmlFor="positions_subtitle" error={errors.positions_subtitle}>
                <Textarea id="positions_subtitle" rows={2} value={data.positions_subtitle} onChange={(e) => setData('positions_subtitle', e.target.value)} />
              </Field>
              <Field label="Message when there are no open positions" htmlFor="empty_state" error={errors.empty_state} hint="Drivers can still send a general application.">
                <Textarea id="empty_state" rows={3} value={data.empty_state} onChange={(e) => setData('empty_state', e.target.value)} />
              </Field>
            </Panel>
          </TabsContent>

          <TabsContent value="why">
            <Panel title="Why drive with us" description="Benefit cards (4 look best).">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Section title" htmlFor="why_title" error={errors.why_title}>
                  <Input id="why_title" value={data.why_title} onChange={(e) => setData('why_title', e.target.value)} />
                </Field>
                <Field label="Section subtitle" htmlFor="why_subtitle" error={errors.why_subtitle}>
                  <Input id="why_subtitle" value={data.why_subtitle} onChange={(e) => setData('why_subtitle', e.target.value)} />
                </Field>
              </div>
              <Field label="Cards">
                <ObjectListEditor<WhyItem>
                  value={data.why_items}
                  onChange={(v) => setData('why_items', v)}
                  empty={{ icon: 'star', title: '', description: '' }}
                  fields={[
                    { key: 'icon', placeholder: 'Icon', label: 'Icon', options: ICONS },
                    { key: 'title', placeholder: 'Title' },
                    { key: 'description', placeholder: 'Short description', textarea: true },
                  ]}
                  columns="140px minmax(0,1fr)"
                  addLabel="Add card"
                  max={8}
                />
              </Field>
            </Panel>
          </TabsContent>

          <TabsContent value="feature" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Feature section" description="Image + text block in the middle of the page.">
              <Field label="Title" htmlFor="feature_title" error={errors.feature_title}>
                <Input id="feature_title" value={data.feature_title} onChange={(e) => setData('feature_title', e.target.value)} />
              </Field>
              <Field label="Text" error={errors.feature_body}>
                <QuillEditorAdvanced value={data.feature_body} onChange={(v) => setData('feature_body', v)} height="220px" />
              </Field>
            </Panel>
            <Panel title="Feature image">
              <ImageField currentUrl={page.feature_image_url} file={data.feature_image} onFile={(f) => setData('feature_image', f)} removed={data.remove_feature_image} onRemove={(r) => setData('remove_feature_image', r)} aspect="aspect-[4/5]" hint="Empty = default driver photo." />
              {errors.feature_image && <p className="text-sm text-red-500">{errors.feature_image}</p>}
            </Panel>
          </TabsContent>

          <TabsContent value="steps">
            <Panel title="How it works" description="Numbered steps (3 look best).">
              <Field label="Section title" htmlFor="steps_title" error={errors.steps_title}>
                <Input id="steps_title" value={data.steps_title} onChange={(e) => setData('steps_title', e.target.value)} />
              </Field>
              <ObjectListEditor<Step>
                value={data.steps}
                onChange={(v) => setData('steps', v)}
                empty={{ title: '', description: '' }}
                fields={[{ key: 'title', placeholder: 'Step title' }, { key: 'description', placeholder: 'Short description', textarea: true }]}
                columns="minmax(0,1fr)"
                addLabel="Add step"
                max={6}
              />
            </Panel>
          </TabsContent>

          <TabsContent value="form">
            <Panel title="Application form" description="Fields: first & last name, email, phone, preferred positions, availability, CDL-A and experience.">
              <Field label="Form title" htmlFor="form_title" error={errors.form_title}>
                <Input id="form_title" value={data.form_title} onChange={(e) => setData('form_title', e.target.value)} />
              </Field>
              <Field label="Form subtitle" htmlFor="form_subtitle" error={errors.form_subtitle}>
                <Textarea id="form_subtitle" rows={2} value={data.form_subtitle} onChange={(e) => setData('form_subtitle', e.target.value)} />
              </Field>
              <Field label="Availability options" hint="Choices in the “When can you start?” dropdown.">
                <StringListEditor value={data.availability_options} onChange={(v) => setData('availability_options', v)} placeholder="e.g. Within 2 weeks" addLabel="Add option" max={10} />
              </Field>
              <Field label="Success message" htmlFor="success_message" error={errors.success_message} hint="Shown after submitting. {first_name} is replaced with the driver's name.">
                <Textarea id="success_message" rows={3} value={data.success_message} onChange={(e) => setData('success_message', e.target.value)} />
              </Field>
            </Panel>
          </TabsContent>

          <TabsContent value="cta">
            <Panel title="Final call to action" description="Gradient band at the bottom of the page.">
              <Field label="Title" htmlFor="cta_title" error={errors.cta_title}>
                <Input id="cta_title" value={data.cta_title} onChange={(e) => setData('cta_title', e.target.value)} />
              </Field>
              <Field label="Text" htmlFor="cta_body" error={errors.cta_body}>
                <Textarea id="cta_body" rows={2} value={data.cta_body} onChange={(e) => setData('cta_body', e.target.value)} />
              </Field>
            </Panel>
          </TabsContent>

          <TabsContent value="seo" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Panel title="Search engines" description="How /drivers appears on Google and when shared.">
              <div className="rounded-lg border bg-white p-4 shadow-xs dark:bg-zinc-950">
                <p className="truncate text-xs text-[#202124] dark:text-zinc-300">{websiteUrl.replace(/^https?:\/\//, '')} › drivers</p>
                <p className="mt-1 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{data.seo_title || data.hero_title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#4d5156] dark:text-zinc-400">{data.seo_description || data.hero_subtitle}</p>
              </div>
              <Field label="SEO title" htmlFor="seo_title" error={errors.seo_title} counter={{ value: data.seo_title.length, max: 255, ideal: [0, 60] }}>
                <Input id="seo_title" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} />
              </Field>
              <Field label="Meta description" htmlFor="seo_description" error={errors.seo_description} counter={{ value: data.seo_description.length, max: 320, ideal: [0, 160] }}>
                <Textarea id="seo_description" rows={3} value={data.seo_description} onChange={(e) => setData('seo_description', e.target.value)} />
              </Field>
            </Panel>
            <Panel title="Social share image" description="1200×630 recommended.">
              <ImageField currentUrl={page.og_image_url} file={data.og_image} onFile={(f) => setData('og_image', f)} removed={data.remove_og_image} onRemove={(r) => setData('remove_og_image', r)} aspect="aspect-[1200/630]" hint="Empty = hero image." />
            </Panel>
          </TabsContent>
        </Tabs>

        <p className="text-sm text-muted-foreground">
          FAQs for this page are managed under <strong>Global → FAQs</strong> on the “Drivers” tab.
        </p>
      </form>
    </AppLayout>
  );
}
