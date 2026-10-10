// components/drivers/application-detail.tsx
// Applicant card + status switcher + notes timeline. Used in the inbox side sheet and the full page.
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
  ArrowUpRight, BadgeCheck, CalendarClock, Check, Copy, Globe, Mail, MailCheck, MessageSquareText,
  Phone, RefreshCw, Trash2, Truck, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { APPLICATION_STATUS_STYLES, formatDate, timeAgo, type ApplicationStatus } from '@/components/drivers/shared';
import { cn } from '@/lib/utils';

export interface ApplicationNote {
  id: number;
  type: 'note' | 'status_change' | 'email';
  body: string;
  created_at: string;
  user: { id: number; name: string } | null;
}

export interface ApplicationFull {
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
  created_at: string;
  source_url: string | null;
  utm: Record<string, string> | null;
  position_titles: string[];
  position_rows: { id: number; position_title: string; position: { id: number; title: string; slug: string; status: string; deleted_at: string | null } | null }[];
  source_position: { id: number; title: string; slug: string } | null;
  notes: ApplicationNote[];
}

const NOTE_ICONS = { note: MessageSquareText, status_change: RefreshCw, email: MailCheck } as const;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        await navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
    </Button>
  );
}

export function ApplicationDetail({ application, statusLabels, compact = false }: { application: ApplicationFull; statusLabels: Record<ApplicationStatus, string>; compact?: boolean }) {
  const note = useForm({ body: '' });
  const initials = `${application.first_name[0] ?? ''}${application.last_name[0] ?? ''}`.toUpperCase();
  const telHref = `tel:${application.phone.replace(/[^0-9+]/g, '')}`;

  const setStatus = (status: ApplicationStatus) => {
    if (status === application.status) return;
    router.patch(route('admin.driver-applications.status', application.id), { status }, { preserveScroll: true, preserveState: true });
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.data.body.trim()) return;
    note.post(route('admin.driver-applications.notes.store', application.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => note.reset(),
    });
  };

  const removeNote = (id: number) => {
    if (confirm('Delete this note?')) {
      router.delete(route('admin.driver-application-notes.destroy', id), { preserveScroll: true, preserveState: true });
    }
  };

  const facts = [
    { icon: Truck, label: 'Positions', value: application.position_titles.join(', ') },
    { icon: CalendarClock, label: 'Availability', value: application.availability ?? '—' },
    { icon: BadgeCheck, label: 'Valid CDL-A', value: application.has_cdl_a ? 'Yes' : 'No', tone: application.has_cdl_a ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600' },
    { icon: BadgeCheck, label: 'CDL-A experience', value: application.experience_years ? `${application.experience_years} years` : '—' },
  ];

  return (
    <div className={cn('flex flex-col gap-6', compact ? 'p-6' : '')}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2e368f] to-[#e93232] text-lg font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold">{application.full_name}</h2>
          <p className="text-sm text-muted-foreground" title={formatDate(application.created_at, true)}>
            Applied {timeAgo(application.created_at)} · {formatDate(application.created_at, true)}
          </p>
        </div>
        {compact && (
          <Button asChild variant="ghost" size="sm">
            <Link href={route('admin.driver-applications.show', application.id)}>Full page <ArrowUpRight /></Link>
          </Button>
        )}
      </div>

      {/* Contact */}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Phone className="size-4 text-muted-foreground" />
          <a href={telHref} className="flex-1 truncate font-medium hover:underline">{application.phone}</a>
          <CopyButton value={application.phone} label="phone" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Mail className="size-4 text-muted-foreground" />
          <a href={`mailto:${application.email}`} className="flex-1 truncate font-medium hover:underline">{application.email}</a>
          <CopyButton value={application.email} label="email" />
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button asChild className="flex-1 bg-[#2e368f] text-white hover:bg-[#252c75]"><a href={telHref}><Phone /> Call</a></Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={`mailto:${application.email}?subject=${encodeURIComponent('Your Trucking 360 driver application')}`}><Mail /> Email</a>
          </Button>
        </div>
      </div>

      {/* Status */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Application status">
          {(Object.keys(statusLabels) as ApplicationStatus[]).map((s) => {
            const active = application.status === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStatus(s)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition',
                  active ? cn('ring-2 ring-offset-1 ring-offset-background', APPLICATION_STATUS_STYLES[s].className, 'ring-current') : 'text-muted-foreground hover:bg-muted',
                )}
              >
                <span className={cn('size-2 rounded-full', APPLICATION_STATUS_STYLES[s].dot)} />
                {statusLabels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Facts */}
      <dl className="grid gap-3 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="flex items-start gap-2.5">
            <f.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className={cn('text-sm font-medium', f.tone)}>{f.value}</dd>
            </div>
          </div>
        ))}
        {(application.source_position || application.source_url) && (
          <div className="flex items-start gap-2.5 sm:col-span-2">
            <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">Applied from</dt>
              <dd className="truncate text-sm">
                {application.source_position ? (
                  <Link href={route('admin.driver-positions.edit', application.source_position.id)} className="font-medium hover:underline">{application.source_position.title}</Link>
                ) : (
                  <span className="font-medium">Drivers page</span>
                )}
                {application.utm && Object.keys(application.utm).length > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {Object.entries(application.utm).map(([k, v]) => `${k.replace('utm_', '')}: ${v}`).join(' · ')}
                  </span>
                )}
              </dd>
            </div>
          </div>
        )}
      </dl>

      {/* Notes */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes & activity</p>
        <form onSubmit={addNote} className="space-y-2">
          <Textarea
            value={note.data.body}
            onChange={(e) => note.setData('body', e.target.value)}
            placeholder="Add a note — e.g. “Left voicemail, try again Thursday”"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(e);
            }}
          />
          {note.errors.body && <p className="text-sm text-red-500">{note.errors.body}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ctrl + Enter to save</span>
            <Button type="submit" size="sm" disabled={note.processing || !note.data.body.trim()}>Add note</Button>
          </div>
        </form>

        <ol className="relative mt-5 space-y-4 border-l border-sidebar-border/70 pl-5 dark:border-sidebar-border">
          {application.notes.map((n) => {
            const Icon = NOTE_ICONS[n.type] ?? MessageSquareText;
            return (
              <li key={n.id} className="relative">
                <span className={cn(
                  'absolute -left-[31px] flex size-6 items-center justify-center rounded-full border bg-background',
                  n.type === 'note' ? 'text-[#2e368f]' : 'text-muted-foreground',
                )}>
                  <Icon className="size-3" />
                </span>
                <div className={cn('rounded-lg', n.type === 'note' ? 'border bg-background p-3' : 'py-0.5')}>
                  <p className={cn('whitespace-pre-wrap text-sm', n.type !== 'note' && 'text-muted-foreground')}>{n.body}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span title={formatDate(n.created_at, true)}>{timeAgo(n.created_at)}</span>
                    {n.user && <span>· {n.user.name}</span>}
                    {n.type === 'note' && (
                      <button type="button" onClick={() => removeNote(n.id)} className="ml-auto inline-flex items-center gap-1 hover:text-red-600">
                        <Trash2 className="size-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          <li className="relative">
            <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border bg-background text-emerald-600">
              <Check className="size-3" />
            </span>
            <p className="py-0.5 text-sm text-muted-foreground">Application received</p>
            <p className="text-xs text-muted-foreground">{formatDate(application.created_at, true)}</p>
          </li>
        </ol>
      </div>

      {/* Danger zone */}
      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => router.patch(route('admin.driver-applications.unread', application.id), {}, { preserveScroll: true })}
        >
          <EyeOff /> Mark unread
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto text-red-600 hover:text-red-700"
          onClick={() => {
            if (confirm(`Delete the application from ${application.full_name}? This can't be undone from the dashboard.`)) {
              router.delete(route('admin.driver-applications.destroy', application.id));
            }
          }}
        >
          <Trash2 /> Delete application
        </Button>
      </div>
    </div>
  );
}
