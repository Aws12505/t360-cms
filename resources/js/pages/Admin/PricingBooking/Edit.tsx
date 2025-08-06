/* resources/js/Pages/Admin/PricingBooking/Edit.tsx */
import { Head, useForm } from '@inertiajs/react';
import AppLayout         from '@/layouts/app-layout';
import { Button }        from '@/components/ui/button';
import { Label }         from '@/components/ui/label';
import { Input }         from '@/components/ui/input';
import { Textarea }      from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import FlashMessage from '@/components/flash-message'; // Add this import

interface Props {
  booking: {
    title: string;
    description: string;
    btn_name: string;
    btn_link: string;
  };
}

const breadcrumbs:BreadcrumbItem[]=[
  {title:'Pricing Booking',href:'/admin/pricing-booking'},
];

export default function PricingBookingEdit({ booking }: Props) {
  const { data,setData,post,processing,errors } = useForm({
    _method:'put',
    title:       booking.title,
    description: booking.description,
    btn_name:    booking.btn_name,
    btn_link:    booking.btn_link,
  });

  const submit = (e:React.FormEvent) => { e.preventDefault(); post(route('admin.pricing-booking.update')); };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pricing Booking" />
      <div className="flex flex-col p-4 gap-4 h-full">
              <FlashMessage />
        <div className="border rounded-xl p-8 bg-background max-w-4xl mx-auto space-y-8">
          <form onSubmit={submit} className="space-y-6">

            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={data.title} onChange={e=>setData('title',e.target.value)} />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea rows={4} value={data.description} onChange={e=>setData('description',e.target.value)} />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Button Name</Label>
                <Input value={data.btn_name} onChange={e=>setData('btn_name',e.target.value)} />
                {errors.btn_name && <p className="text-sm text-red-500">{errors.btn_name}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Button Link</Label>
                <Input value={data.btn_link} onChange={e=>setData('btn_link',e.target.value)} />
                {errors.btn_link && <p className="text-sm text-red-500">{errors.btn_link}</p>}
              </div>
            </div>

            <Button type="submit" disabled={processing}>{processing?'Saving…':'Save'}</Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
