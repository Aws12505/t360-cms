// resources/js/Pages/Admin/Video/Edit.tsx
import { Head, useForm }     from '@inertiajs/react';
import AppLayout             from '@/layouts/app-layout';
import { Button }            from '@/components/ui/button';
import { Label }             from '@/components/ui/label';
import { Input }             from '@/components/ui/input';
import QuillEditor           from '@/components/QuillEditor';       // HTML editor
import { type BreadcrumbItem } from '@/types';

interface Props {
  video: {
    title: string;
    description: string;
    video: string | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Video Section', href: '/admin/video' },
];

export default function VideoEdit({ video }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method:     'put',
    title:       video.title,
    description: video.description,
    video:       null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.video.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Video Section" />

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

            {/* HTML editor for description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <QuillEditor
                value={data.description}
                onChange={content => setData('description', content)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="video">Video File</Label>
              <Input
                type="file"
                id="video"
                accept="video/*"
                onChange={e => setData('video', e.target.files?.[0] ?? null)}
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: MP4, AVI, MOV, WMV. Max size: 50MB
              </p>
              {errors.video && <p className="text-sm text-red-500">{errors.video}</p>}
            </div>

            {/* Show current video if exists */}
            {video.video && (
              <div className="flex flex-col gap-2">
                <Label>Current Video</Label>
                <video 
                  controls 
                  className="w-full max-w-md rounded-lg"
                  src={`/storage/${video.video}`}
                >
                  Your browser does not support the video tag.
                </video>
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
