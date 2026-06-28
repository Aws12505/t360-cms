import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

interface Props {
  feature: {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
    icon_url: string | null;
    order: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Why Choose Us Features', href: '/admin/why-choose-us-features' },
  { title: 'Edit', href: '#' },
];

export default function WhyChooseUsFeatureEdit({ feature }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method: 'PUT',
    title: feature.title,
    description: feature.description ?? '',
    icon: null as File | null,
    order: feature.order,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.why-choose-us-features.update', feature.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Feature: ${feature.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="Describe this feature..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input
                type="file"
                id="icon"
                accept="image/*"
                onChange={e => setData('icon', e.target.files?.[0] ?? null)}
              />
              {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}

              {/* Show current icon if exists */}
              {feature.icon_url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Current Icon:</p>
                  <img
                    src={feature.icon_url}
                    alt={feature.title}
                    className="max-w-[6rem] max-h-24 object-contain rounded-md border bg-white p-1"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={data.order}
                onChange={e => setData('order', parseInt(e.target.value) || 0)}
                min="0"
              />
              {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
            </div>

            {progress && (
              <div className="w-full rounded bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating…' : 'Update Feature'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.why-choose-us-features.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
