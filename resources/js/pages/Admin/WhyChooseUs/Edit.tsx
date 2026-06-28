import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message';

interface Props {
  whyChooseUs: {
    title: string;
    subtitle: string;
    description: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Why Choose Us', href: '/admin/why-choose-us' },
];

export default function WhyChooseUsEdit({ whyChooseUs }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    title: whyChooseUs.title ?? '',
    subtitle: whyChooseUs.subtitle ?? '',
    description: whyChooseUs.description ?? '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.why-choose-us.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Why Choose Us" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                placeholder="Our Commitment to Excellence"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Subtitle</Label>
              <Input
                value={data.subtitle}
                onChange={e => setData('subtitle', e.target.value)}
                placeholder="Why Choose Us!"
              />
              {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                rows={6}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="Describe why clients should choose you..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save Why Choose Us'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
