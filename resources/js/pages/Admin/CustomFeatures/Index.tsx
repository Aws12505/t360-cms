// resources/js/Pages/Admin/CustomFeatures/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message'; // Add this import

interface CustomFeature {
  id: number;
  name: string;
  price: number;
  created_at: string;
}

interface Props {
  features: CustomFeature[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Plans',   href: '/admin/pricing-plans' },
  { title: 'Custom Features', href: '/admin/custom-features' },
];

export default function CustomFeaturesIndex({ features }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      router.delete(route('admin.custom-features.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Custom Features" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
              <FlashMessage />
        
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Custom Plan Features</h1>
            <Button asChild>
              <Link href={route('admin.custom-features.create')}>
                Create Feature
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {features.length === 0 ? (
              <p className="text-muted-foreground">No custom features found.</p>
            ) : (
              features.map((feature) => (
                <div 
                  key={feature.id} 
                  className="p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{feature.name}</h3>
                      <p className="text-lg font-bold text-primary">${feature.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.custom-features.edit', feature.id)}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(feature.id)}
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
