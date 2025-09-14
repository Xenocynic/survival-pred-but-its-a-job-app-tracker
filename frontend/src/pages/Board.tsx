import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Application, Stage } from "../types";
import { useAppStore } from "../store/useAppStore";
import { AppCard } from "../components/AppCard";
import { Trash } from "../components/Trash";
import AppPanel from "../components/AppPanel"; 

function StageColumn({
  stage,
  apps,
  onDropApp,
  title,
  onOpenCard, 
}: {
  stage: Exclude<Stage, "rejected">;
  apps: Application[];
  onDropApp: (appId: string, to: Stage) => void;
  title: string;
  onOpenCard: (id: string) => void; 
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/app-id");
        if (id) onDropApp(id, stage);
      }}
      className="rounded-2xl border bg-gray-50 p-3 flex-1 min-h-[280px]"
      aria-label={`${title} column`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{title}</div>
      </div>
      <div className="space-y-3">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onOpen={() => onOpenCard(app.id)} />
        ))}
      </div>
    </div>
  );
}

function RejectionsLane({
  apps,
  onDropApp,
}: {
  apps: Application[];
  onDropApp: (appId: string, to: Stage) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/app-id");
        if (id) onDropApp(id, "rejected");
      }}
      className="mt-4 rounded-2xl border bg-purple-100 p-3"
      aria-label="Rejections lane"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-purple-700">Rejections</div>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onOpen={() => {}} />
        ))}
      </div>
    </div>
  );
}

export default function BoardPage() {
  // add updateApp + getApp so the panel can save & read the selected item
  const { apps, move, createApp, remove, updateApp, getApp } = useAppStore();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  // which panel is open?
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = openId ? getApp(openId) : undefined;

  const grouped = useMemo(
    () => ({
      applied: apps.filter((a) => a.stage === "applied"),
      interview: apps.filter((a) => a.stage === "interview"),
      offer: apps.filter((a) => a.stage === "offer"),
      rejected: apps.filter((a) => a.stage === "rejected"),
    }),
    [apps]
  );

  function onCreate() {
    if (!role || !company) return;
    createApp(role, company);
    setRole("");
    setCompany("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Board</h1>
          <p className="text-sm text-gray-600">
            Drag applications between stages. Click a card to view details. Drop into Rejections to archive.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={onCreate}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white font-medium animated-gradient hover:opacity-90"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 items-start">
        <StageColumn
          stage="applied"
          title="Applied"
          apps={grouped.applied}
          onDropApp={move}
          onOpenCard={(id) => setOpenId(id)}
        />
        <StageColumn
          stage="interview"
          title="Interview"
          apps={grouped.interview}
          onDropApp={move}
          onOpenCard={(id) => setOpenId(id)} 
        />
        <StageColumn
          stage="offer"
          title="Offer"
          apps={grouped.offer}
          onDropApp={move}
          onOpenCard={(id) => setOpenId(id)} 
        />
      </div>

      {/* Keep archive lane */}
      <RejectionsLane apps={grouped.rejected} onDropApp={move} />

      {/* Floating drag-to-DELETE bin (does not archive) */}
      <Trash onDropApp={(id) => remove(id)} label="Drop here to delete forever" />

      {/* Slide-over panel */}
      {opened && (
        <AppPanel
          app={opened}
          onClose={() => setOpenId(null)}
          onSave={(patch) => updateApp(opened.id, patch)}
        />
      )}
    </main>
  );
}
