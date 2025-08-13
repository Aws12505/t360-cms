// resources/js/Pages/Admin/PricingPlans/Create.tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout         from '@/layouts/app-layout';
import { Button }        from '@/components/ui/button';
import { Label }         from '@/components/ui/label';
import { Input }         from '@/components/ui/input';
import { Textarea }      from '@/components/ui/textarea';
import { Checkbox }      from '@/components/ui/checkbox';
import QuillEditor       from '@/components/QuillEditor';
import { type BreadcrumbItem } from '@/types';

interface Feature {
  id: number;
  name: string;
  price: string;
}

interface Props {
  allFeatures?: Feature[] | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Pricing Plans', href: '/admin/pricing-plans' },
  { title: 'Create',        href: '/admin/pricing-plans/create' },
];

export default function PricingPlanCreate({ allFeatures }: Props) {
  const featureList = Array.isArray(allFeatures) ? allFeatures : [];

  const { data, setData, post, processing, errors } = useForm({
    name:            '',
    total_value:     '',
    per_text:        '',
    description:     '',
    features:        '',
    is_customizable: false,
    is_best_value:   false,
    order:           0,
    feature_ids:     [] as number[],
    button_link:     '',
    button_text:     '',
    highlighted_text: '',
    button_bg_color: '#3B82F6',
    total_value_bg_color: '#F3F4F6',
  });

  const toggleFeature = (id: number, checked: boolean) => {
    setData(
      'feature_ids',
      checked ? [...data.feature_ids, id] : data.feature_ids.filter(i => i !== id),
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.pricing-plans.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Pricing Plan" />

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

            {/* Color fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Total Value Background Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={data.total_value_bg_color}
                    onChange={e => setData('total_value_bg_color', e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={data.total_value_bg_color}
                    onChange={e => setData('total_value_bg_color', e.target.value)}
                    placeholder="#F3F4F6"
                    className="flex-1"
                  />
                </div>
                {errors.total_value_bg_color && <p className="text-sm text-red-500">{errors.total_value_bg_color}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Background Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={data.button_bg_color}
                    onChange={e => setData('button_bg_color', e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={data.button_bg_color}
                    onChange={e => setData('button_bg_color', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
                {errors.button_bg_color && <p className="text-sm text-red-500">{errors.button_bg_color}</p>}
              </div>
            </div>

            {/* Button fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Button Text</Label>
                <Input
                  value={data.button_text}
                  onChange={e => setData('button_text', e.target.value)}
                  placeholder="Get Started"
                />
                {errors.button_text && <p className="text-sm text-red-500">{errors.button_text}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input
                  value={data.button_link}
                  onChange={e => setData('button_link', e.target.value)}
                  placeholder="https://example.com/signup"
                />
                {errors.button_link && <p className="text-sm text-red-500">{errors.button_link}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <QuillEditor
                value={data.description}
                onChange={html => setData('description', html)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Highlighted Text */}
            <div className="flex flex-col gap-2">
              <Label>Highlighted Text (HTML)</Label>
              <QuillEditor
                value={data.highlighted_text}
                onChange={html => setData('highlighted_text', html)}
              />
              {errors.highlighted_text && <p className="text-sm text-red-500">{errors.highlighted_text}</p>}
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

            {/* Order */}
            <div className="flex flex-col gap-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={data.order}
                onChange={e => setData('order', parseInt(e.target.value) || 0)}
                min="0"
              />
              {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
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
                {processing ? 'Creating…' : 'Create Plan'}
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
