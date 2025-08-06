/* resources/js/Pages/Admin/Articles/Index.tsx */
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface Article {
  id: number;
  title: string;
  description: string;
  featured_image: string | null;
  custom_date: string | null;
  is_active: boolean;
  images_count: number;
  created_at: string;
}

interface Props {
  articles: Article[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Articles', href: '/admin/articles' },
];

export default function ArticlesIndex({ articles }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      router.delete(route('admin.articles.destroy', id));
    }
  };

  const toggleStatus = (id: number, currentStatus: boolean) => {
    router.patch(route('admin.articles.update', id), {
      is_active: !currentStatus
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Articles" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Articles</h1>
            <Button asChild>
              <Link href={route('admin.articles.create')}>
                Create Article
              </Link>
            </Button>
          </div>

          {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles found.</p>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <div key={article.id} className="p-6 border rounded-lg bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {article.featured_image && (
                        <img
                          src={`/storage/${article.featured_image}`}
                          alt={article.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{article.title}</h3>
                          <Badge variant={article.is_active ? 'default' : 'secondary'}>
                            {article.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {article.custom_date && (
                            <span>Date: {new Date(article.custom_date).toLocaleDateString()}</span>
                          )}
                          <span>{article.images_count} additional images</span>
                          <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(article.id, article.is_active)}
                      >
                        {article.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.articles.edit', article.id)}>
                          Edit
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
