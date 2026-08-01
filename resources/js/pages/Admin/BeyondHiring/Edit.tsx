import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message';

interface Props {
  beyondHiring: {
    hero_title: string;
    hero_description: string;
    hero_btn_name: string;
    hero_btn_link: string;
    cta_title: string;
    cta_description: string;
    cta_btn_name: string;
    cta_btn_link: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Beyond Hiring', href: '/admin/beyond-hiring' },
];

export default function BeyondHiringEdit({ beyondHiring }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    hero_title: beyondHiring?.hero_title ?? '',
    hero_description: beyondHiring?.hero_description ?? '',
    hero_btn_name: beyondHiring?.hero_btn_name ?? '',
    hero_btn_link: beyondHiring?.hero_btn_link ?? '',
    cta_title: beyondHiring?.cta_title ?? '',
    cta_description: beyondHiring?.cta_description ?? '',
    cta_btn_name: beyondHiring?.cta_btn_name ?? '',
    cta_btn_link: beyondHiring?.cta_btn_link ?? '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.beyond-hiring.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Beyond Hiring" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-10">

            {/* Hero Section */}
            <section className="space-y-6">
              <h2 className="text-lg font-semibold border-b border-sidebar-border/70 pb-2">Hero Section</h2>

              <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input
                  value={data.hero_title}
                  onChange={e => setData('hero_title', e.target.value)}
                  placeholder="Need Help Beyond Driver Hiring?"
                />
                {errors.hero_title && <p className="text-sm text-red-500">{errors.hero_title}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <QuillEditorAdvanced
                  value={data.hero_description}
                  onChange={content => setData('hero_description', content)}
                  placeholder="Describe the services offered beyond driver hiring..."
                  height="200px"
                />
                {errors.hero_description && <p className="text-sm text-red-500">{errors.hero_description}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Text</Label>
                <Input
                  value={data.hero_btn_name}
                  onChange={e => setData('hero_btn_name', e.target.value)}
                  placeholder="Book a Free Consultation"
                />
                {errors.hero_btn_name && <p className="text-sm text-red-500">{errors.hero_btn_name}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input
                  value={data.hero_btn_link}
                  onChange={e => setData('hero_btn_link', e.target.value)}
                  placeholder="/booking"
                />
                {errors.hero_btn_link && <p className="text-sm text-red-500">{errors.hero_btn_link}</p>}
              </div>
            </section>

            {/* Final CTA */}
            <section className="space-y-6">
              <h2 className="text-lg font-semibold border-b border-sidebar-border/70 pb-2">Final CTA</h2>

              <div className="flex flex-col gap-2">
                <Label>Title</Label>
                <Input
                  value={data.cta_title}
                  onChange={e => setData('cta_title', e.target.value)}
                  placeholder="Let's Talk About Your Business"
                />
                {errors.cta_title && <p className="text-sm text-red-500">{errors.cta_title}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <QuillEditorAdvanced
                  value={data.cta_description}
                  onChange={content => setData('cta_description', content)}
                  placeholder="Invite visitors to get in touch..."
                  height="200px"
                />
                {errors.cta_description && <p className="text-sm text-red-500">{errors.cta_description}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Text</Label>
                <Input
                  value={data.cta_btn_name}
                  onChange={e => setData('cta_btn_name', e.target.value)}
                  placeholder="Book a Free Consultation"
                />
                {errors.cta_btn_name && <p className="text-sm text-red-500">{errors.cta_btn_name}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input
                  value={data.cta_btn_link}
                  onChange={e => setData('cta_btn_link', e.target.value)}
                  placeholder="/booking"
                />
                {errors.cta_btn_link && <p className="text-sm text-red-500">{errors.cta_btn_link}</p>}
              </div>
            </section>

            <p className="text-sm text-muted-foreground">
              FAQs for this page are managed under <strong>Global &rarr; FAQs</strong> on the &ldquo;Beyond Hiring&rdquo; tab.
            </p>

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save Beyond Hiring'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
