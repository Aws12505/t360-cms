import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message';

interface Props {
  mission: {
    text: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Mission', href: '/admin/mission' },
];

export default function MissionEdit({ mission }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    text: mission.text,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.mission.update'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mission" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <FlashMessage />
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background p-8">
          <form onSubmit={submit} className="space-y-8">
            
            <div className="flex flex-col gap-2">
              <Label>Mission Statement</Label>
              <Textarea
                rows={10}
                value={data.text}
                onChange={e => setData('text', e.target.value)}
                placeholder="Enter your mission statement here..."
              />
              {errors.text && <p className="text-sm text-red-500">{errors.text}</p>}
            </div>

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Save Mission'}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
