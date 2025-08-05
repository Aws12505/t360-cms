/* resources/js/Pages/Admin/PricingTables/Create.tsx */
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Pricing Tables', href: '/admin/pricing-tables' },
  { title: 'Create', href: '/admin/pricing-tables/create' },
];

export default function PricingTablesCreate() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.pricing-tables.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Pricing Table" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Table Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating…' : 'Create Table'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.pricing-tables.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
