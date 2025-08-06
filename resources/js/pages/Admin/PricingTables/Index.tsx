/* resources/js/Pages/Admin/PricingTables/Index.tsx */
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface PricingTable {
  id: number;
  title: string;
  contents_count: number;
  created_at: string;
}

interface Props {
  tables: PricingTable[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Tables', href: '/admin/pricing-tables' },
];

export default function PricingTablesIndex({ tables }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this table and all its contents?')) {
      router.delete(route('admin.pricing-tables.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pricing Tables" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Pricing Tables</h1>
            <Button asChild>
              <Link href={route('admin.pricing-tables.create')}>
                Create Table
              </Link>
            </Button>
          </div>

          {tables.length === 0 ? (
            <p className="text-muted-foreground">No pricing tables found.</p>
          ) : (
            <div className="grid gap-4">
              {tables.map((table) => (
                <div key={table.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{table.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {table.contents_count} content{table.contents_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.pricing-tables.edit', table.id)}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(table.id)}
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
