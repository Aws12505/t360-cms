import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import FlashMessage from '@/components/flash-message';

interface Props {
  president: {
    name: string;
    role: string;
    description: string;
    image: string | null;
  };
}

export default function PresidentShowcaseEdit({ president }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    name: president.name,
    role: president.role,
    description: president.description,
    image: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.president-showcase.update'));
  };

  return (
    <AppLayout>
      <Head title="President Showcase" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Input
                value={data.role}
                onChange={e => setData('role', e.target.value)}
              />
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description (HTML)</Label>
              <QuillEditorAdvanced
                value={data.description}
                onChange={desc => setData('description', desc)}
                placeholder="Write description (HTML)..."
                height="250px"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="image">President Image</Label>
              <Input
                type="file"
                id="image"
                onChange={e => setData('image', e.target.files?.[0] ?? null)}
                accept="image/*"
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              {president.image && (
                <img src={`/storage/${president.image}`} alt="President" className="mt-2 w-32 h-32 object-cover rounded" />
              )}
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
