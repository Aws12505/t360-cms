/* resources/js/Pages/Admin/Articles/Create.tsx */
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import QuillEditor from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Articles', href: '/admin/articles' },
  { title: 'Create', href: '/admin/articles/create' },
];

export default function ArticlesCreate() {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    featured_image: null as File | null,
    custom_date: '',
    content: '',
    is_active: false,
    extra_images: [] as File[],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.articles.store'));
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('extra_images', files);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Article" />

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
                rows={3}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Featured Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => setData('featured_image', e.target.files?.[0] || null)}
                />
                {errors.featured_image && <p className="text-sm text-red-500">{errors.featured_image}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Custom Date</Label>
                <Input
                  type="date"
                  value={data.custom_date}
                  onChange={e => setData('custom_date', e.target.value)}
                />
                {errors.custom_date && <p className="text-sm text-red-500">{errors.custom_date}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <QuillEditor
                value={data.content}
                onChange={content => setData('content', content)}
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Additional Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImages}
              />
              <p className="text-xs text-muted-foreground">
                Select multiple images to add to this article
              </p>
              {data.extra_images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {data.extra_images.length} image(s) selected
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={data.is_active}
                onCheckedChange={checked => setData('is_active', !!checked)}
              />
              <Label htmlFor="is_active">Active Article</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating…' : 'Create Article'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.articles.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
