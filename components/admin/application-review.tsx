"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS, getApplicationRole } from "@/lib/community/applications";
import type { ApplicationStatus, StaffApplication } from "@/types";

const STATUSES: ApplicationStatus[] = ["pending", "reviewing", "accepted", "rejected"];

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  pending: "text-zn-parchment/60",
  reviewing: "text-zn-lightGold",
  accepted: "text-zn-emerald",
  rejected: "text-zn-danger"
};

export function ApplicationReview({ initial }: { initial: StaffApplication[] }) {
  const router = useRouter();
  const [applications, setApplications] = useState<StaffApplication[]>(initial);

  async function update(id: string, status: ApplicationStatus, adminNotes: string) {
    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes })
    });
    if (!response.ok) return;
    const payload = await response.json();
    setApplications((prev) => prev.map((application) => (application.id === id ? (payload.data as StaffApplication) : application)));
    router.refresh();
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <UserCheck className="mx-auto h-10 w-10 text-zn-gold" />
          <p className="mt-3 font-display text-lg tracking-wide text-zn-lightGold">No applications yet</p>
          <p className="mt-1 text-sm text-zn-parchment/55">Submissions from the /apply page will appear here for review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationRow key={application.id} application={application} onUpdate={update} />
      ))}
    </div>
  );
}

function ApplicationRow({
  application,
  onUpdate
}: {
  application: StaffApplication;
  onUpdate: (id: string, status: ApplicationStatus, notes: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(application.adminNotes);
  const [saving, setSaving] = useState<ApplicationStatus | null>(null);
  const roleConfig = getApplicationRole(application.role);

  async function apply(status: ApplicationStatus) {
    setSaving(status);
    await onUpdate(application.id, status, notes);
    setSaving(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roleConfig?.title ?? application.role}</CardTitle>
        <span className={`text-xs font-bold uppercase tracking-wide ${STATUS_STYLE[application.status]}`}>
          {APPLICATION_STATUS_LABELS[application.status]}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-zn-parchment/55">
          {application.websiteUsername ? <Badge>{application.websiteUsername}</Badge> : <Badge>Guest</Badge>}
          {application.discordUsername ? <span>Discord: <span className="text-zn-parchment/80">{application.discordUsername}</span></span> : null}
          {application.minecraftUsername ? <span>MC: <span className="text-zn-parchment/80">{application.minecraftUsername}</span></span> : null}
          <span>· {timeAgo(application.createdAt)}</span>
        </div>

        <div className="space-y-3">
          {(roleConfig?.questions ?? Object.keys(application.answers).map((key) => ({ key, label: key }))).map((question) => (
            <div key={question.key}>
              <p className="text-xs font-bold uppercase tracking-wide text-zn-lightGold">{question.label}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-zn-parchment/75">{application.answers[question.key] || "—"}</p>
            </div>
          ))}
        </div>

        <label className="block text-sm font-bold text-zinc-300">Admin notes
          <textarea
            className="mt-2 w-full rounded border border-zn-line bg-black/40 px-3 py-2 text-sm font-normal text-zn-parchment outline-none transition focus:border-zn-gold/60"
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Internal notes (not shown to the applicant)"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={application.status === status ? "primary" : "outline"}
              disabled={saving !== null}
              onClick={() => apply(status)}
            >
              {saving === status ? "Saving…" : APPLICATION_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
