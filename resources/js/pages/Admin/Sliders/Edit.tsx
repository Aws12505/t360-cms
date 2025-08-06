// resources/js/Pages/Admin/Sliders/Edit.tsx
import { Head, useForm }      from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { Label }              from '@/components/ui/label';
import { Input }              from '@/components/ui/input';
import { Textarea }           from '@/components/ui/textarea';
import QuillEditor            from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';

interface Props {
  slider: {
    id: number;
    title: string;
    description: string | null;
    features: string | null;
    order: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Sliders',   href: '/admin/sliders' },
  { title: 'Edit',      href: '#' },
];

export default function SliderEdit({ slider }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    title:       slider.title,
    description: slider.description ?? '',
    features:    slider.features ?? '',
    order:       slider.order,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.sliders.update', slider.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Slider: ${slider.title}`} />

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
              <Label>Description (optional)</Label>
              <QuillEditor
                value={data.description}
                onChange={content => setData('description', content)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Features (optional)</Label>
              <Textarea
                rows={3}
                value={data.features}
                onChange={e => setData('features', e.target.value)}
                placeholder="Small text describing features..."
              />
              {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
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

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating…' : 'Update Slider'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.sliders.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
