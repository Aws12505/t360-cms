// resources/js/Pages/Admin/Sliders/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Slider {
  id: number;
  title: string;
  description: string | null;
  features: string | null;
  order: number;
  created_at: string;
}

interface Props {
  sliders: Slider[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Sliders',   href: '/admin/sliders' },
];

export default function SlidersIndex({ sliders }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this slider?')) {
      router.delete(route('admin.sliders.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sliders" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sliders</h1>
            <Button asChild>
              <Link href={route('admin.sliders.create')}>
                Create Slider
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {sliders.length === 0 ? (
              <p className="text-muted-foreground">No sliders found.</p>
            ) : (
              sliders.map((slider) => (
                <div 
                  key={slider.id} 
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{slider.title}</h3>
                      {slider.features && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {slider.features}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Order: {slider.order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.sliders.edit', slider.id)}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(slider.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
