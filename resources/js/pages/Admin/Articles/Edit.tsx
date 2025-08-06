/* resources/js/Pages/Admin/Articles/Edit.tsx */
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import { type BreadcrumbItem } from '@/types';

interface ArticleImage {
  id: number;
  image_path: string;
  alt_text: string | null;
}

interface Props {
  article: {
    id: number;
    title: string;
    description: string;
    featured_image: string | null;
    custom_date: string | null;
    content: string;
    is_active: boolean;
    images: ArticleImage[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Articles', href: '/admin/articles' },
  { title: 'Edit', href: '#' },
];

export default function ArticlesEdit({ article }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    title: article.title,
    description: article.description,
    featured_image: null as File | null,
    custom_date: article.custom_date || '',
    content: article.content,
    is_active: article.is_active,
    extra_images: [] as File[],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.articles.update', article.id));
  };

  const handleExtraImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('extra_images', files);
  };

  const deleteImage = (imageId: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      router.delete(route('admin.article-images.destroy', imageId));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Article: ${article.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8 space-y-8">
          
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
                {article.featured_image && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                    <img
                      src={`/storage/${article.featured_image}`}
                      alt="Current featured"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
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
              <QuillEditorAdvanced
                value={data.content}
                onChange={content => setData('content', content)}
                placeholder="Write your article content here..."
                height="500px"
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Add More Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraImages}
              />
              <p className="text-xs text-muted-foreground">
                Select additional images to add to this article
              </p>
              {data.extra_images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {data.extra_images.length} new image(s) selected
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
                {processing ? 'Updating…' : 'Update Article'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.articles.index')}>Cancel</a>
              </Button>
            </div>
          </form>

          {/* Existing Images */}
          {article.images.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Existing Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {article.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={`/storage/${image.image_path}`}
                      alt={image.alt_text || 'Article image'}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteImage(image.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
