import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QuillEditor from '@/components/QuillEditor';
import FlashMessage from '@/components/flash-message';

interface Props {
  dashboard360: {
    title: string;
    description: string;
    video: string | null;
    btn_text: string | null;
    btn_link: string | null;
  };
}

export default function Dashboard360Edit({ dashboard360 }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    title: dashboard360.title,
    description: dashboard360.description,
    video: null as File | null,
    btn_text: dashboard360.btn_text || '',
    btn_link: dashboard360.btn_link || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.dashboard360.update'));
  };

  return (
    <AppLayout>
      <Head title="Dashboard360 Edit" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />
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
              <Label>Description (HTML)</Label>
              <QuillEditor
                value={data.description}
                onChange={desc => setData('description', desc)}
                placeholder="Enter description (HTML)"
                height="200px"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="video">Dashboard Video</Label>
              <Input
                type="file"
                id="video"
                accept="video/*"
                onChange={e => setData('video', e.target.files?.[0] ?? null)}
              />
              {errors.video && <p className="text-sm text-red-500">{errors.video}</p>}
              {dashboard360.video && (
                <video controls src={`/storage/${dashboard360.video}`} className="mt-2 w-72 rounded shadow" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Button Text</Label>
              <Input
                value={data.btn_text}
                onChange={e => setData('btn_text', e.target.value)}
              />
              {errors.btn_text && <p className="text-sm text-red-500">{errors.btn_text}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Button Link</Label>
              <Input
                value={data.btn_link}
                onChange={e => setData('btn_link', e.target.value)}
              />
              {errors.btn_link && <p className="text-sm text-red-500">{errors.btn_link}</p>}
            </div>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
