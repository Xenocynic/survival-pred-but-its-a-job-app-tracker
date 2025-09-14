import { useMemo, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Mail, Phone, Globe } from "lucide-react";

// Map kinds → colors
const KIND_META: Record<
  "rejection" | "interview_invite" | "offer" | "followup" | "other",
  { label: string; bg: string; ring: string; text: string }
> = {
  rejection: { label: "Rejection", bg: "bg-purple-100", ring: "ring-purple-200", text: "text-purple-800" },
  interview_invite: { label: "Interview", bg: "bg-green-100", ring: "ring-green-200", text: "text-green-800" },
  offer: { label: "Offer", bg: "bg-blue-100", ring: "ring-blue-200", text: "text-blue-800" },
  followup: { label: "Received / Follow-up", bg: "bg-teal-100", ring: "ring-teal-200", text: "text-teal-800" },
  other: { label: "Other", bg: "bg-gray-100", ring: "ring-gray-200", text: "text-gray-800" },
};

// Channel → icon
function ChannelIcon({ channel }: { channel: "email" | "call" | "portal" }) {
  if (channel === "email") return <Mail size={16} />;
  if (channel === "call") return <Phone size={16} />;
  return <Globe size={16} />;
}

export default function FeedPage() {
  const { events, apps } = useAppStore();

  // filter state (all on by default)
  const [filters, setFilters] = useState<Record<keyof typeof KIND_META, boolean>>({
    rejection: true,
    interview_invite: true,
    offer: true,
    followup: true,
    other: true,
  });

  // toggle a kind
  function toggle(kind: keyof typeof KIND_META) {
    setFilters(prev => ({ ...prev, [kind]: !prev[kind] }));
  }

  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [events]
  );

  const filtered = useMemo(
    () => sorted.filter(e => (filters as any)[e.kind] !== false),
    [sorted, filters]
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Feed</h1>
          <p className="text-sm text-gray-600">Latest communications and status updates scraped from email.</p>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border bg-white p-3 mb-4">
        <div className="text-xs text-gray-500 mb-2">Filter by type</div>
        <div className="flex flex-wrap gap-2">
          {(
            Object.keys(KIND_META) as Array<keyof typeof KIND_META>
          ).map((k) => {
            const m = KIND_META[k];
            const on = filters[k];
            return (
              <button
                key={k}
                onClick={() => toggle(k)}
                className={[
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ring-1 transition",
                  on ? `${m.bg} ${m.text} ${m.ring}` : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    k === "rejection" ? "bg-purple-500" :
                    k === "interview_invite" ? "bg-green-500" :
                    k === "offer" ? "bg-blue-500" :
                    k === "followup" ? "bg-teal-500" :
                    "bg-gray-400",
                  ].join(" ")}
                />
                {m.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-600">
            No events match your filters.
          </div>
        )}

        {filtered.map((ev) => {
          const meta = KIND_META[ev.kind] ?? KIND_META.other;
          const app = ev.applicationId ? apps.find(a => a.id === ev.applicationId) : undefined;

          return (
            <article
              key={ev.id}
              className={[
                "rounded-2xl border p-4 ring-1",
                "bg-white",
                meta.ring,
              ].join(" ")}
              aria-label={`${meta.label} event`}
            >
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={[
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs",
                    meta.bg, meta.text
                  ].join(" ")}>
                    <ChannelIcon channel={ev.channel} />
                    {meta.label}
                  </span>
                </div>
                <time className="text-xs text-gray-500">
                  {new Date(ev.at).toLocaleString()}
                </time>
              </header>

              {/* Context line (company / role) */}
              {(app?.company || app?.role) && (
                <div className="mt-2 text-sm text-gray-700">
                  {app?.role ? <span className="font-medium">{app.role}</span> : null}
                  {app?.company ? <span className="text-gray-500">{app?.role ? " @ " : ""}{app.company}</span> : null}
                </div>
              )}

              {/* Snippet */}
              {ev.snippet && (
                <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                  {ev.snippet}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
