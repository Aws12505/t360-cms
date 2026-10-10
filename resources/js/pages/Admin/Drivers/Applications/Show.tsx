// resources/js/pages/Admin/Drivers/Applications/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { ApplicationDetail, type ApplicationFull } from '@/components/drivers/application-detail';
import { type ApplicationStatus } from '@/components/drivers/shared';
import { type BreadcrumbItem } from '@/types';

interface Props {
  application: ApplicationFull;
  statusLabels: Record<ApplicationStatus, string>;
}

export default function ApplicationShow({ application, statusLabels }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Applications', href: '/admin/driver-applications' },
    { title: application.full_name, href: '#' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${application.full_name} · Application`} />
      <FlashMessage />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 md:p-6">
        <Button asChild variant="ghost" size="sm" className="self-start">
          <Link href={route('admin.driver-applications.index')}><ArrowLeft /> All applications</Link>
        </Button>
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
          <ApplicationDetail application={application} statusLabels={statusLabels} />
        </div>
      </div>
    </AppLayout>
  );
}
