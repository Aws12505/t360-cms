// resources/js/pages/Admin/Drivers/Applications/Index.tsx
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Inbox, Mail, Phone, Search, Sparkles, Users, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApplicationDetail, type ApplicationFull } from '@/components/drivers/application-detail';
import { APPLICATION_STATUS_STYLES, ApplicationStatusPill, formatDate, timeAgo, type ApplicationStatus } from '@/components/drivers/shared';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

interface ApplicationRow {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  availability: string | null;
  has_cdl_a: boolean;
  experience_years: string | null;
  status: ApplicationStatus;
  read_at: string | null;
  created_at: string;
  position_rows: { id: number; driver_position_id: number | null; position_title: string }[];
}

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  total: number;
  prev_page_url: string | null;
  next_page_url: string | null;
}

interface Filters {
  status: 'all' | ApplicationStatus;
  position: string | null;
  q: string | null;
  from: string | null;
  to: string | null;
}

interface Props {
  applications: Paginated<ApplicationRow>;
  filters: Filters;
  counts: Record<'all' | ApplicationStatus, number>;
  stats: { last30: number; unread: number; openPositions: number };
  positions: { id: number; title: string; status: string; deleted_at: string | null }[];
  statusLabels: Record<ApplicationStatus, string>;
  selected: ApplicationFull | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Drivers', href: '/admin/driver-applications' },
  { title: 'Applications', href: '/admin/driver-applications' },
];

const STATUS_TABS: ('all' | ApplicationStatus)[] = ['all', 'new', 'contacted', 'hired', 'not_a_fit'];

const cleanParams = (params: Record<string, unknown>): Record<string, string | number> =>
  Object.fromEntries(Object.entries(params).filter(([k, v]) => v !== null && v !== '' && v !== undefined && v !== 'all' && !(k === 'page' && v === 1))) as Record<string, string | number>;

export default function ApplicationsIndex({ applications, filters, counts, stats, positions, statusLabels, selected }: Props) {
  const [search, setSearch] = useState(filters.q ?? '');
  const [checked, setChecked] = useState<number[]>([]);
  const firstRender = useRef(true);

  const visit = (overrides: Partial<Filters & { view: number | null; page: number }>, opts: { only?: string[] } = {}) => {
    const params = cleanParams({ ...filters, page: applications.current_page, view: selected?.id ?? null, ...overrides });
    router.get(route('admin.driver-applications.index'), params, { preserveState: true, preserveScroll: true, replace: true, ...opts });
  };

  // Debounced search
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => visit({ q: search || null, page: 1, view: null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => setChecked([]), [applications.current_page, filters.status, filters.position, filters.q]);

  const openRow = (id: number) => visit({ view: id });
  const closeSheet = () => visit({ view: null });

  const allChecked = applications.data.length > 0 && checked.length === applications.data.length;
  const bulk = (status: ApplicationStatus) => {
    router.post(route('admin.driver-applications.bulk-status'), { ids: checked, status }, {
      preserveScroll: true,
      onSuccess: () => setChecked([]),
    });
  };

  const exportUrl = useMemo(
    () => route('admin.driver-applications.export', cleanParams({ ...filters }) as Record<string, string>),
    [filters],
  );

  const hasFilters = !!(filters.position || filters.q || filters.from || filters.to);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Applications" />
      <FlashMessage />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
            <p className="text-sm text-muted-foreground">Everyone who applied through the /drivers pages. Click a row to see details, update the status and add notes.</p>
          </div>
          <Button asChild variant="outline">
            <a href={exportUrl}><Download /> Export CSV</a>
          </Button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Unread', value: stats.unread, icon: Sparkles, tone: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
            { label: 'Last 30 days', value: stats.last30, icon: Inbox, tone: 'text-[#2e368f] bg-indigo-50 dark:bg-indigo-500/10' },
            { label: 'Hired', value: counts.hired, icon: Users, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Open positions', value: stats.openPositions, icon: Users, tone: 'text-[#e93232] bg-red-50 dark:bg-red-500/10', href: route('admin.driver-positions.index') },
          ].map((kpi) => {
            const body = (
              <>
                <span className={cn('rounded-lg p-2', kpi.tone)}><kpi.icon className="size-4" /></span>
                <div>
                  <p className="text-2xl font-semibold tabular-nums leading-none">{kpi.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{kpi.label}</p>
                </div>
              </>
            );
            return kpi.href ? (
              <Link key={kpi.label} href={kpi.href} className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 transition hover:shadow-sm dark:border-sidebar-border">{body}</Link>
            ) : (
              <div key={kpi.label} className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">{body}</div>
            );
          })}
        </div>

        <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
          {/* Status tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-sidebar-border/70 px-3 pt-2 dark:border-sidebar-border">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => visit({ status: s, page: 1, view: null })}
                className={cn(
                  '-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition',
                  filters.status === s ? 'border-[#2e368f] text-foreground dark:border-white' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {s !== 'all' && <span className={cn('size-2 rounded-full', APPLICATION_STATUS_STYLES[s].dot)} />}
                {s === 'all' ? 'All' : statusLabels[s]}
                <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{counts[s]}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-sidebar-border/70 p-3 dark:border-sidebar-border">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or phone…" className="pl-8" />
            </div>
            <select
              aria-label="Filter by position"
              value={filters.position ?? ''}
              onChange={(e) => visit({ position: e.target.value || null, page: 1, view: null })}
              className="h-9 max-w-[240px] rounded-md border border-input bg-transparent px-3 text-sm shadow-xs dark:bg-input/30"
            >
              <option value="">All positions</option>
              <option value="any">Open to any position</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>{p.title}{p.deleted_at ? ' (deleted)' : p.status !== 'published' ? ` (${p.status})` : ''}</option>
              ))}
            </select>
            <div className="flex items-center gap-1.5">
              <Input type="date" aria-label="From date" value={filters.from ?? ''} onChange={(e) => visit({ from: e.target.value || null, page: 1 })} className="w-[150px]" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" aria-label="To date" value={filters.to ?? ''} onChange={(e) => visit({ to: e.target.value || null, page: 1 })} className="w-[150px]" />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); visit({ position: null, q: null, from: null, to: null, page: 1, view: null }); }}>
                <X /> Clear
              </Button>
            )}
          </div>

          {/* Bulk bar */}
          {checked.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-sidebar-border/70 bg-muted/40 px-3 py-2 text-sm dark:border-sidebar-border">
              <span className="font-medium">{checked.length} selected</span>
              <span className="text-muted-foreground">· Mark as</span>
              {(Object.keys(statusLabels) as ApplicationStatus[]).map((s) => (
                <Button key={s} variant="outline" size="sm" className="h-7" onClick={() => bulk(s)}>
                  <span className={cn('size-2 rounded-full', APPLICATION_STATUS_STYLES[s].dot)} /> {statusLabels[s]}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={() => setChecked([])}>Cancel</Button>
            </div>
          )}

          {applications.data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <div className="rounded-full bg-muted p-3"><Inbox className="size-6 text-muted-foreground" /></div>
              <p className="font-medium">{hasFilters || filters.status !== 'all' ? 'No applications match these filters' : 'No applications yet'}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {hasFilters || filters.status !== 'all' ? 'Try a different status or clear the filters.' : 'When drivers apply on the website they will show up here, and the team gets an email.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      aria-label="Select all"
                      checked={allChecked}
                      onCheckedChange={(v) => setChecked(v ? applications.data.map((a) => a.id) : [])}
                    />
                  </TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Positions</TableHead>
                  <TableHead className="hidden lg:table-cell">CDL-A</TableHead>
                  <TableHead className="hidden lg:table-cell">Availability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.data.map((a) => {
                  const unread = !a.read_at;
                  const titles = a.position_rows.map((p) => p.position_title);
                  return (
                    <TableRow
                      key={a.id}
                      data-state={checked.includes(a.id) || selected?.id === a.id ? 'selected' : undefined}
                      onClick={() => openRow(a.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          aria-label={`Select ${a.full_name}`}
                          checked={checked.includes(a.id)}
                          onCheckedChange={(v) => setChecked(v ? [...checked, a.id] : checked.filter((id) => id !== a.id))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className={cn('size-2 shrink-0 rounded-full', unread ? 'bg-blue-500' : 'bg-transparent')} aria-label={unread ? 'Unread' : undefined} />
                          <div className="min-w-0">
                            <p className={cn('truncate', unread ? 'font-semibold' : 'font-medium')}>{a.full_name}</p>
                            <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Mail className="size-3" />{a.email}</span>
                              <span className="inline-flex items-center gap-1"><Phone className="size-3" />{a.phone}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[260px] md:table-cell">
                        {titles.length ? (
                          <div className="flex flex-wrap gap-1">
                            {titles.slice(0, 2).map((t) => <span key={t} className="truncate rounded-md bg-muted px-1.5 py-0.5 text-xs">{t}</span>)}
                            {titles.length > 2 && <span className="text-xs text-muted-foreground">+{titles.length - 2}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Open to any</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-xs lg:table-cell">
                        {a.has_cdl_a ? <span className="font-medium text-emerald-700 dark:text-emerald-400">Yes</span> : <span className="text-red-600">No</span>}
                        {a.experience_years && <span className="text-muted-foreground"> · {a.experience_years} yrs</span>}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{a.availability ?? '—'}</TableCell>
                      <TableCell><ApplicationStatusPill status={a.status} /></TableCell>
                      <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground" title={formatDate(a.created_at, true)}>
                        {timeAgo(a.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {applications.total > 0 && (
            <div className="flex items-center justify-between gap-2 border-t border-sidebar-border/70 px-4 py-3 text-sm text-muted-foreground dark:border-sidebar-border">
              <span>{applications.from}–{applications.to} of {applications.total}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="size-8" disabled={!applications.prev_page_url} onClick={() => visit({ page: applications.current_page - 1, view: null })} aria-label="Previous page">
                  <ChevronLeft />
                </Button>
                <Button variant="outline" size="icon" className="size-8" disabled={!applications.next_page_url} onClick={() => visit({ page: applications.current_page + 1, view: null })} aria-label="Next page">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{selected.full_name}</SheetTitle>
                <SheetDescription>Application details</SheetDescription>
              </SheetHeader>
              <ApplicationDetail application={selected} statusLabels={statusLabels} compact />
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
