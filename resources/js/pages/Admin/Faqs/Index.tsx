// resources/js/Pages/Admin/Faqs/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';

interface Faq {
  id: number;
  title: string;
  description: string;
  page: string;
  order: number;
  created_at: string;
}

interface Props {
  faqs: Faq[];
  currentPage: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'FAQs',      href: '/admin/faqs' },
];

export default function FaqsIndex({ faqs, currentPage }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      router.delete(route('admin.faqs.destroy', id));
    }
  };

  const handleTabChange = (page: string) => {
    router.get(route('admin.faqs.index'), { page }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="FAQs" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">FAQs</h1>
            <Button asChild>
              <Link href={route('admin.faqs.create', { page: currentPage })}>
                Create FAQ
              </Link>
            </Button>
          </div>

          <Tabs value={currentPage} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Page</TabsTrigger>
            </TabsList>

            <TabsContent value={currentPage}>
              <div className="grid gap-4">
                {faqs.length === 0 ? (
                  <p className="text-muted-foreground">No FAQs found for this page.</p>
                ) : (
                  faqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{faq.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {faq.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Order: {faq.order}</span>
                            <span>•</span>
                            <span className="capitalize">{faq.page} Page</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.faqs.edit', faq.id)}>
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(faq.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
