// resources/js/Pages/Admin/Footer/Edit.tsx
import { Head, useForm }     from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout.tsx';
import { Button }            from '@/components/ui/button';
import { Label }             from '@/components/ui/label';
import { Input }             from '@/components/ui/input';
import QuillEditor           from '@/components/QuillEditor';       // ← use the rich-text editor
import { type BreadcrumbItem } from '@/types';

interface Props {
  footer: {
    title: string;
    description: string;
    location: string;
    phone: string;
    email: string;
    linkedin_url: string | null;
    facebook_url: string | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard',       href: '/dashboard' },
  { title: 'Footer Settings', href: '/admin/footer' },
];

export default function FooterEdit({ footer }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method:       'put',
    title:         footer.title,
    description:   footer.description,
    location:      footer.location,
    phone:         footer.phone,
    email:         footer.email,
    linkedin_url:  footer.linkedin_url ?? '',
    facebook_url:  footer.facebook_url ?? '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.footer.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Footer Settings" />

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

            {/* HTML editor replaces <Textarea /> */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <QuillEditor
                value={data.description}
                onChange={content => setData('description', content)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Location</Label>
                <Input
                  value={data.location}
                  onChange={e => setData('location', e.target.value)}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={data.linkedin_url}
                  onChange={e => setData('linkedin_url', e.target.value)}
                />
                {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Facebook URL</Label>
                <Input
                  value={data.facebook_url}
                  onChange={e => setData('facebook_url', e.target.value)}
                />
                {errors.facebook_url && <p className="text-sm text-red-500">{errors.facebook_url}</p>}
              </div>
            </div>

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
