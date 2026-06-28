import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message';

interface Feature {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  icon_url: string | null;
  order: number;
  created_at: string;
}

interface Props {
  features: Feature[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Why Choose Us Features', href: '/admin/why-choose-us-features' },
];

export default function WhyChooseUsFeaturesIndex({ features }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      router.delete(route('admin.why-choose-us-features.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Why Choose Us Features" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />

        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Why Choose Us Features</h1>
            <Button asChild>
              <Link href={route('admin.why-choose-us-features.create')}>
                Create Feature
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {features.length === 0 ? (
              <p className="text-muted-foreground">No features found.</p>
            ) : (
              features.map((feature) => (
                <div
                  key={feature.id}
                  className="p-4 border rounded-lg bg-card flex gap-4"
                >
                  {/* Icon thumbnail */}
                  {feature.icon_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={feature.icon_url}
                        alt={feature.title}
                        className="w-16 h-16 object-contain rounded-md border bg-white p-1"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Order: {feature.order}</span>
                        {feature.icon && <span>• Has Icon</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.why-choose-us-features.edit', feature.id)}>
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
