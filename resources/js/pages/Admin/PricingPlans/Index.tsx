// resources/js/Pages/Admin/PricingPlans/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { Badge }              from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface PricingPlan {
  id: number;
  name: string;
  total_value: number | null;
  per_text: string | null;
  description: string;
  features: string | null;
  is_customizable: boolean;
  is_best_value: boolean;
  created_at: string;
}

interface Props {
  plans: PricingPlan[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Plans', href: '/admin/pricing-plans' },
];

export default function PricingPlansIndex({ plans }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this pricing plan?')) {
      router.delete(route('admin.pricing-plans.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pricing Plans" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Pricing Plans</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={route('admin.custom-features.index')}>
                  Manage Features
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('admin.pricing-plans.create')}>
                  Create Plan
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.length === 0 ? (
              <p className="text-muted-foreground col-span-full">No pricing plans found.</p>
            ) : (
              plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="p-6 border rounded-lg bg-card relative"
                >
                  {plan.is_best_value && (
                    <Badge className="absolute -top-2 left-4">Best Value</Badge>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      {plan.is_customizable ? (
                        <Badge variant="secondary">Customizable</Badge>
                      ) : (
                        <div className="text-2xl font-bold">
                          ${plan.total_value}
                          {plan.per_text && (
                            <span className="text-sm font-normal text-muted-foreground">
                              /{plan.per_text}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {plan.features && (
                      <p className="text-sm text-muted-foreground">{plan.features}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.pricing-plans.edit', plan.id)}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
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
