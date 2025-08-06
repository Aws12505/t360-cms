// resources/js/Pages/Admin/Header/Edit.tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout          from '@/layouts/app-layout';
import { Button }         from '@/components/ui/button';
import { Label }          from '@/components/ui/label';
import { Input }          from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message'; // Add this import

interface Props {
  header: {
    logo_image: string | null;
    favicon: string | null;
    btn1_name: string;
    btn1_link: string;
    btn2_name: string;
    btn2_link: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Header Settings', href: '/admin/header' },
];

export default function HeaderEdit({ header }: Props) {
  const { data, setData, post, progress, processing, errors } = useForm({
    _method:    'put',
    logo_image: null as File | null,
    favicon:    null as File | null,
    btn1_name:  header.btn1_name ?? '',
    btn1_link:  header.btn1_link ?? '',
    btn2_name:  header.btn2_name ?? '',
    btn2_link:  header.btn2_link ?? '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.header.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Header Settings" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <FlashMessage />

        {/* Center the form card and let it grow to a comfortable width */}
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">

          <form onSubmit={submit} className="space-y-8">
            {/* logo */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="logo_image">Logo</Label>
              <Input
                type="file"
                id="logo_image"
                onChange={e => setData('logo_image', e.target.files?.[0] ?? null)}
              />
              {errors.logo_image && (
                <p className="text-sm text-red-500">{errors.logo_image}</p>
              )}
            </div>

            {/* favicon */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="favicon">Favicon</Label>
              <Input
                type="file"
                id="favicon"
                onChange={e => setData('favicon', e.target.files?.[0] ?? null)}
              />
              {errors.favicon && (
                <p className="text-sm text-red-500">{errors.favicon}</p>
              )}
            </div>

            {/* buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Button 1 Name</Label>
                <Input
                  value={data.btn1_name}
                  onChange={e => setData('btn1_name', e.target.value)}
                />
                {errors.btn1_name && (
                  <p className="text-sm text-red-500">{errors.btn1_name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button 1 Link</Label>
                <Input
                  value={data.btn1_link}
                  onChange={e => setData('btn1_link', e.target.value)}
                />
                {errors.btn1_link && (
                  <p className="text-sm text-red-500">{errors.btn1_link}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button 2 Name</Label>
                <Input
                  value={data.btn2_name}
                  onChange={e => setData('btn2_name', e.target.value)}
                />
                {errors.btn2_name && (
                  <p className="text-sm text-red-500">{errors.btn2_name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button 2 Link</Label>
                <Input
                  value={data.btn2_link}
                  onChange={e => setData('btn2_link', e.target.value)}
                />
                {errors.btn2_link && (
                  <p className="text-sm text-red-500">{errors.btn2_link}</p>
                )}
              </div>
            </div>

            {/* progress bar */}
            {progress && (
              <div className="w-full rounded bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            )}

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
