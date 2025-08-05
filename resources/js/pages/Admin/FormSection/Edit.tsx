// resources/js/Pages/Admin/FormSection/Edit.tsx
import { Head, useForm }     from '@inertiajs/react';
import AppLayout             from '@/layouts/app-layout';
import { Button }            from '@/components/ui/button';
import { Label }             from '@/components/ui/label';
import { Input }             from '@/components/ui/input';
import QuillEditor           from '@/components/QuillEditor';       // HTML editor
import { type BreadcrumbItem } from '@/types';

interface Props {
  formSection: {
    title: string;
    description: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard',    href: '/dashboard' },
  { title: 'Form Section', href: '/admin/form-section' },
];

export default function FormSectionEdit({ formSection }: Props) {
  const { data, setData, post, processing, errors, progress } = useForm({
    _method:     'put',
    title:       formSection.title,
    description: formSection.description,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.form-section.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Form Section" />

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
