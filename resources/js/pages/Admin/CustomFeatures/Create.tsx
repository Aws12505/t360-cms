// resources/js/Pages/Admin/CustomFeatures/Create.tsx
import { Head, useForm }      from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { Label }              from '@/components/ui/label';
import { Input }              from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Plans',   href: '/admin/pricing-plans' },
  { title: 'Custom Features', href: '/admin/custom-features' },
  { title: 'Create',          href: '/admin/custom-features/create' },
];

export default function CustomFeatureCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name:  '',
    price: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.custom-features.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Custom Feature" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            <div className="flex flex-col gap-2">
              <Label>Feature Name</Label>
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="e.g., Dispatch, HR, Hiring"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={data.price}
                onChange={e => setData('price', e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating…' : 'Create Feature'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.custom-features.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
