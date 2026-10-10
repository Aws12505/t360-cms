// resources/js/pages/Admin/Drivers/Positions/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { BriefcaseBusiness, Copy, ExternalLink, MapPin, MoreHorizontal, Pencil, Plus, Star, Trash2, Users, Wallet } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatPay, PositionStatusPill, type PositionStatus } from '@/components/drivers/shared';
import { type BreadcrumbItem } from '@/types';

interface Position {
  id: number;
  title: string;
  slug: string;
  status: PositionStatus;
  public_status: PositionStatus;
  is_featured: boolean;
  summary: string | null;
  route_type: string | null;
  employment_type: string;
  pay_min: string | null;
  pay_max: string | null;
  pay_unit: string | null;
  pay_display: string | null;
  locations: { city?: string; state?: string }[] | null;
  date_posted: string | null;
  valid_through: string | null;
  applications_count: number;
  cover_image_url: string | null;
  updated_at: string;
}

interface Props {
  positions: Position[];
  currentStatus: string;
  counts: Record<'all' | PositionStatus, number>;
  websiteUrl: string;
  acceptGeneral: boolean;
  openCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Drivers', href: '/admin/driver-applications' },
  { title: 'Positions', href: '/admin/driver-positions' },
];

const locationText = (locations: Position['locations']) => {
  const list = (locations ?? []).map((l) => [l.city, l.state].filter(Boolean).join(', ')).filter(Boolean);
  if (!list.length) return null;
  return list.length > 2 ? `${list.slice(0, 2).join(' · ')} +${list.length - 2} more` : list.join(' · ');
};

export default function PositionsIndex({ positions, currentStatus, counts, websiteUrl, acceptGeneral, openCount }: Props) {
  const setStatus = (position: Position, status: PositionStatus) => {
    router.patch(route('admin.driver-positions.status', position.id), { status }, { preserveScroll: true });
  };

  const destroy = (position: Position) => {
    if (confirm(`Delete "${position.title}"? Applications for it are kept.`)) {
      router.delete(route('admin.driver-positions.destroy', position.id), { preserveScroll: true });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Positions" />
      <FlashMessage />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Positions</h1>
            <p className="text-sm text-muted-foreground">
              Job openings shown on <a href={`${websiteUrl}/drivers`} target="_blank" rel="noreferrer" className="font-medium text-foreground underline-offset-4 hover:underline">/drivers</a>. Each published position gets its own page and appears in Google Jobs.
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.driver-positions.create')}><Plus /> New position</Link>
          </Button>
        </div>

        {openCount === 0 && (
          <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm ${acceptGeneral ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200' : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'}`}>
            <p>
              <strong>No open positions.</strong>{' '}
              {acceptGeneral
                ? 'The website tells drivers there are no openings but still lets them fill out an application.'
                : 'Applications are switched off: the website shows a “no openings” message and nobody can apply.'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={route('admin.drivers-page.edit')}>Change this</Link>
            </Button>
          </div>
        )}

        <Tabs value={currentStatus} onValueChange={(status) => router.get(route('admin.driver-positions.index'), status === 'all' ? {} : { status }, { preserveState: true, preserveScroll: true })}>
          <TabsList>
            {(['all', 'published', 'draft', 'closed'] as const).map((s) => (
              <TabsTrigger key={s} value={s} className="gap-1.5 capitalize">
                {s} <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{counts[s]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-3"><BriefcaseBusiness className="size-6 text-muted-foreground" /></div>
            <div>
              <p className="font-medium">No positions here yet</p>
              <p className="text-sm text-muted-foreground">Create your first opening — it can stay a draft until you're ready.</p>
            </div>
            <Button asChild size="sm"><Link href={route('admin.driver-positions.create')}><Plus /> New position</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {positions.map((position) => {
              const pay = formatPay(position);
              const where = locationText(position.locations);
              const expired = position.status === 'published' && position.public_status === 'closed';
              return (
                <article key={position.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-sidebar-border/70 bg-background transition hover:shadow-md dark:border-sidebar-border">
                  <div className="flex items-start gap-4 p-5">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#141a4d] to-[#2e368f]">
                      {position.cover_image_url ? (
                        <img src={position.cover_image_url} alt="" className="size-full object-cover" />
                      ) : (
                        <BriefcaseBusiness className="absolute inset-0 m-auto size-6 text-white/80" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <PositionStatusPill status={expired ? 'closed' : position.status} />
                        {expired && <span className="text-xs text-red-600">Expired {formatDate(position.valid_through)}</span>}
                        {position.is_featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                            <Star className="size-3 fill-current" /> Featured
                          </span>
                        )}
                        {position.route_type && <span className="text-xs text-muted-foreground">{position.route_type}</span>}
                      </div>
                      <Link href={route('admin.driver-positions.edit', position.id)} className="mt-1.5 block truncate text-base font-semibold hover:underline">
                        {position.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">/drivers/{position.slug}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" aria-label="Position actions"><MoreHorizontal /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild><Link href={route('admin.driver-positions.edit', position.id)}><Pencil /> Edit</Link></DropdownMenuItem>
                        {position.public_status === 'published' && (
                          <DropdownMenuItem asChild><a href={`${websiteUrl}/drivers/${position.slug}`} target="_blank" rel="noreferrer"><ExternalLink /> View live</a></DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => router.post(route('admin.driver-positions.duplicate', position.id))}><Copy /> Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Set status</DropdownMenuLabel>
                        {(['published', 'draft', 'closed'] as const).filter((s) => s !== position.status || expired).map((s) => (
                          <DropdownMenuItem key={s} onSelect={() => setStatus(position, s)} className="capitalize">
                            {s === 'published' ? (expired ? 'Re-publish' : 'Publish') : s === 'closed' ? 'Close (filled)' : 'Move to drafts'}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => destroy(position)} className="text-red-600 focus:text-red-600"><Trash2 /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <dl className="mt-auto grid grid-cols-3 divide-x divide-sidebar-border/70 border-t border-sidebar-border/70 text-xs dark:divide-sidebar-border dark:border-sidebar-border">
                    <div className="flex items-center gap-1.5 px-4 py-3" title="Location">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                      <dd className="truncate">{where ?? <span className="text-amber-600">No location</span>}</dd>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-3" title="Pay">
                      <Wallet className="size-3.5 shrink-0 text-muted-foreground" />
                      <dd className="truncate">{pay ?? <span className="text-muted-foreground">No pay set</span>}</dd>
                    </div>
                    <Link href={route('admin.driver-applications.index', { position: position.id })} className="flex items-center gap-1.5 px-4 py-3 hover:bg-muted/50" title="Applications">
                      <Users className="size-3.5 shrink-0 text-muted-foreground" />
                      <dd><span className="font-semibold tabular-nums">{position.applications_count}</span> applicant{position.applications_count === 1 ? '' : 's'}</dd>
                    </Link>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
