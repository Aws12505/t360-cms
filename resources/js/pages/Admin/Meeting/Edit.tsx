// resources/js/Pages/Admin/Meeting/Edit.tsx
import { Head, useForm }     from '@inertiajs/react';
import AppLayout             from '@/layouts/app-layout';
import { Button }            from '@/components/ui/button';
import { Label }             from '@/components/ui/label';
import { Input }             from '@/components/ui/input';
import { Textarea }          from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

interface Props {
  meeting: {
    title: string;
    description: string;
    btn_name: string;
    btn_link: string;
    image: string | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard',      href: '/dashboard' },
  { title: 'Meeting Section', href: '/admin/meeting' },
];

export default function MeetingEdit({ meeting }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method:     'put',
    title:       meeting.title,
    description: meeting.description,
    btn_name:    meeting.btn_name,
    btn_link:    meeting.btn_link,
    image:       null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.meeting.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Meeting Section" />

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
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Button Name</Label>
                <Input
                  value={data.btn_name}
                  onChange={e => setData('btn_name', e.target.value)}
                />
                {errors.btn_name && <p className="text-sm text-red-500">{errors.btn_name}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input
                  value={data.btn_link}
                  onChange={e => setData('btn_link', e.target.value)}
                />
                {errors.btn_link && <p className="text-sm text-red-500">{errors.btn_link}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Meeting Image</Label>
              <Input
                type="file"
                id="image"
                onChange={e => setData('image', e.target.files?.[0] ?? null)}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            {/* Show current image if exists */}
            {meeting.image && (
              <div className="flex flex-col gap-2">
                <Label>Current Image</Label>
                <img 
                  src={`/storage/${meeting.image}`}
                  alt="Meeting image"
                  className="w-full max-w-md rounded-lg"
                />
              </div>
            )}

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
