// resources/js/pages/Admin/Drivers/Settings/Edit.tsx
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AlertTriangle, Mail, Send, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import QuillEditorAdvanced from '@/components/QuillEditorAdvanced';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Field, Panel } from '@/components/drivers/shared';
import { type BreadcrumbItem } from '@/types';

interface Settings {
  notify_enabled: boolean;
  notification_emails: string[] | null;
  admin_subject: string | null;
  confirmation_enabled: boolean;
  confirmation_subject: string | null;
  confirmation_body: string | null;
  reply_to: string | null;
}

interface Props {
  settings: Settings;
  mailer: string;
  fromAddress: string;
  userEmail: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Drivers', href: '/admin/driver-applications' },
  { title: 'Hiring Settings', href: '/admin/hiring-settings' },
];

const PLACEHOLDERS = ['{first_name}', '{last_name}', '{positions}'];

function EmailChips({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const parts = draft.split(/[,;\s]+/).map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return;
    const invalid = parts.find((p) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));
    if (invalid) {
      setError(`"${invalid}" is not a valid email`);
      return;
    }
    onChange(Array.from(new Set([...value, ...parts.map((p) => p.toLowerCase())])));
    setDraft('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input px-2 py-1.5 shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50">
        {value.map((email) => (
          <span key={email} className="inline-flex items-center gap-1 rounded-full bg-[#2e368f]/10 px-2.5 py-1 text-xs font-medium text-[#2e368f] dark:bg-white/10 dark:text-white">
            <Mail className="size-3" />{email}
            <button type="button" onClick={() => onChange(value.filter((e) => e !== email))} aria-label={`Remove ${email}`} className="rounded-full hover:text-red-600">
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
            if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
          placeholder={value.length ? 'Add another…' : 'hiring@trucking360solutions.com'}
          className="min-w-[180px] flex-1 bg-transparent px-1 text-sm outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function HiringSettingsEdit({ settings, mailer, fromAddress, userEmail }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    notify_enabled: settings.notify_enabled,
    notification_emails: settings.notification_emails ?? [],
    admin_subject: settings.admin_subject ?? '',
    confirmation_enabled: settings.confirmation_enabled,
    confirmation_subject: settings.confirmation_subject ?? '',
    confirmation_body: settings.confirmation_body ?? '',
    reply_to: settings.reply_to ?? '',
  });

  const test = useForm({ email: userEmail ?? '' });

  const emailErrors = Object.entries(errors).filter(([k]) => k.startsWith('notification_emails')).map(([, v]) => v);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hiring Settings" />
      <FlashMessage />
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hiring settings</h1>
          <p className="text-sm text-muted-foreground">Who gets notified about new applications, and what applicants receive.</p>
        </div>

        {mailer === 'log' && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              Email delivery is not configured yet (<code>MAIL_MAILER=log</code>). Emails are written to the server log instead of being sent.
              Ask your developer to add SMTP or API credentials in the CMS <code>.env</code>.
            </p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); put(route('admin.hiring-settings.update'), { preserveScroll: true }); }} className="flex flex-col gap-6">
          <Panel
            title="New application alerts"
            description="Sent to your team every time a driver applies. Reply to the email to reach the applicant."
            actions={
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox checked={data.notify_enabled} onCheckedChange={(v) => setData('notify_enabled', v === true)} /> Enabled
              </label>
            }
          >
            <Field label="Send to" error={emailErrors[0]} hint="Press Enter or comma after each address.">
              <EmailChips value={data.notification_emails} onChange={(v) => setData('notification_emails', v)} />
            </Field>
            <Field label="Subject" htmlFor="admin_subject" error={errors.admin_subject}>
              <Input id="admin_subject" value={data.admin_subject} onChange={(e) => setData('admin_subject', e.target.value)} placeholder="New driver application: {first_name} {last_name}" />
            </Field>
          </Panel>

          <Panel
            title="Applicant confirmation"
            description="Sent to the driver right after they apply."
            actions={
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox checked={data.confirmation_enabled} onCheckedChange={(v) => setData('confirmation_enabled', v === true)} /> Enabled
              </label>
            }
          >
            <Field label="Subject" htmlFor="confirmation_subject" error={errors.confirmation_subject}>
              <Input id="confirmation_subject" value={data.confirmation_subject} onChange={(e) => setData('confirmation_subject', e.target.value)} />
            </Field>
            <Field label="Message" error={errors.confirmation_body}>
              <QuillEditorAdvanced value={data.confirmation_body} onChange={(v) => setData('confirmation_body', v)} height="220px" />
            </Field>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              Placeholders:
              {PLACEHOLDERS.map((p) => (
                <code key={p} className="rounded bg-muted px-1.5 py-0.5 text-foreground">{p}</code>
              ))}
            </div>
            <Field label="Reply-to address" htmlFor="reply_to" error={errors.reply_to} hint={`Emails are sent from ${fromAddress}. Replies from drivers go to this address.`}>
              <Input id="reply_to" type="email" value={data.reply_to} onChange={(e) => setData('reply_to', e.target.value)} placeholder="hiring@trucking360solutions.com" />
            </Field>
          </Panel>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>{processing ? 'Saving…' : 'Save settings'}</Button>
          </div>
        </form>

        <Panel title="Send a test" description="Sends both emails with sample data so you can check how they look.">
          <form
            onSubmit={(e) => { e.preventDefault(); test.post(route('admin.hiring-settings.test'), { preserveScroll: true }); }}
            className="flex flex-wrap items-start gap-2"
          >
            <div className="min-w-[240px] flex-1">
              <Input type="email" value={test.data.email} onChange={(e) => test.setData('email', e.target.value)} placeholder="you@example.com" />
              {test.errors.email && <p className="mt-1 text-sm text-red-500">{test.errors.email}</p>}
            </div>
            <Button type="submit" variant="outline" disabled={test.processing}><Send /> Send test emails</Button>
          </form>
          <p className="text-xs text-muted-foreground">Save your changes first — the test uses the saved settings.</p>
        </Panel>
      </div>
    </AppLayout>
  );
}
