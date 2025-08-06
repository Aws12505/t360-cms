import { Head, useForm }  from '@inertiajs/react';
import AppLayout          from '@/layouts/app-layout';
import { Button }         from '@/components/ui/button';
import { Label }          from '@/components/ui/label';
import { Input }          from '@/components/ui/input';
import { Textarea }       from '@/components/ui/textarea';
import { Checkbox }       from '@/components/ui/checkbox';
import QuillEditor        from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';

interface Feature {
  id: number;
  name: string;
  price: string;
}

interface PlanPayload {
  id: number;
  name: string;
  total_value: string | null;
  per_text: string | null;
  description: string;
  features: string | null;
  is_customizable: boolean;
  is_best_value: boolean;
  custom_features?: Feature[] | null;
}

interface Props {
  plan: PlanPayload;
  allFeatures?: Feature[] | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Plans', href: '/admin/pricing-plans' },
  { title: 'Edit',          href: '#' },
];

export default function PricingPlanEdit({ plan, allFeatures }: Props) {
  const featureList   = Array.isArray(allFeatures)      ? allFeatures      : [];
  const attachedIds   = Array.isArray(plan.custom_features)
    ? plan.custom_features.map(f => f.id)
    : [];

  const { data, setData, put, processing, errors } = useForm({
    name:            plan.name,
    total_value:     plan.total_value ?? '',
    per_text:        plan.per_text ?? '',
    description:     plan.description,
    features:        plan.features ?? '',
    is_customizable: plan.is_customizable,
    is_best_value:   plan.is_best_value,
    feature_ids:     attachedIds,
  });

  const toggleFeature = (id: number, checked: boolean) => {
    setData(
      'feature_ids',
      checked ? [...data.feature_ids, id] : data.feature_ids.filter(i => i !== id),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.pricing-plans.update', plan.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Plan: ${plan.name}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label>Plan Name</Label>
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Price fields */}
            {!data.is_customizable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Total Value</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.total_value}
                    onChange={e => setData('total_value', e.target.value)}
                  />
                  {errors.total_value && <p className="text-sm text-red-500">{errors.total_value}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Per Text</Label>
                  <Input
                    value={data.per_text}
                    onChange={e => setData('per_text', e.target.value)}
                    placeholder="month / year / etc."
                  />
                  {errors.per_text && <p className="text-sm text-red-500">{errors.per_text}</p>}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <QuillEditor
                value={data.description}
                onChange={html => setData('description', html)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-2">
              <Label>Feature Summary (small text)</Label>
              <Textarea
                rows={3}
                value={data.features}
                onChange={e => setData('features', e.target.value)}
                placeholder="Brief feature description..."
              />
              {errors.features && <p className="text-sm text-red-500">{errors.features}</p>}
            </div>

            {/* Flags */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_customizable"
                  checked={data.is_customizable}
                  onCheckedChange={checked => {
                    setData('is_customizable', !!checked);
                    if (checked) {
                      setData('total_value', '');
                      setData('per_text',  '');
                    }
                  }}
                />
                <Label htmlFor="is_customizable">Customizable Plan</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_best_value"
                  checked={data.is_best_value}
                  onCheckedChange={checked => setData('is_best_value', !!checked)}
                />
                <Label htmlFor="is_best_value">Best Value Plan</Label>
              </div>
            </div>

            {/* Feature selection */}
            <div className="flex flex-col gap-2">
              <Label>Select Features</Label>
              {featureList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No features available.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-2">
                  {featureList.map(f => (
                    <div key={f.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feat-${f.id}`}
                        checked={data.feature_ids.includes(f.id)}
                        onCheckedChange={checked => toggleFeature(f.id, !!checked)}
                      />
                      <Label
                        htmlFor={`feat-${f.id}`}
                        className="cursor-pointer select-none flex-1"
                      >
                        {f.name}
                        {data.is_customizable && (
                          <span className="text-xs text-muted-foreground">&nbsp;— ${f.price}</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {errors.feature_ids && <p className="text-sm text-red-500">{errors.feature_ids}</p>}
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating…' : 'Update Plan'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.pricing-plans.index')}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
