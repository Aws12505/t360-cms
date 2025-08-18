// resources/js/Pages/Admin/Faqs/Create.tsx
import { Head, useForm }      from '@inertiajs/react';
import AppLayout              from '@/layouts/app-layout';
import { Button }             from '@/components/ui/button';
import { Label }              from '@/components/ui/label';
import { Input }              from '@/components/ui/input';
import { Textarea }           from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface Props {
  selectedPage: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'FAQs',      href: '/admin/faqs' },
  { title: 'Create',    href: '/admin/faqs/create' },
];

export default function FaqCreate({ selectedPage }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    title:       '',
    description: '',
    page:        selectedPage,
    order:       0,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.faqs.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create FAQ" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
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
                rows={4}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Page</Label>
              <Select value={data.page} onValueChange={value => setData('page', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="pricing">Pricing Page</SelectItem>
                  <SelectItem value="why-t360">Why T360?</SelectItem>
                </SelectContent>
              </Select>
              {errors.page && <p className="text-sm text-red-500">{errors.page}</p>}
            </div>

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

            <div className="flex gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating…' : 'Create FAQ'}
              </Button>
              <Button variant="outline" asChild>
                <a href={route('admin.faqs.index', { page: data.page })}>Cancel</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
