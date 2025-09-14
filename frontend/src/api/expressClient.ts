import type { Application, Stage } from "../types";

const BASE = import.meta.env.VITE_API_URL;

// ----- field mapping helpers -----
function toStage(status: string | null | undefined): Stage {
  const s = (status ?? "").toLowerCase();
  if (s === "Applied") return "Applied";
  if (s === "Interview") return "Interview";
  if (s === "Offer" || s === "Accepted") return "Offer";
  if (s === "Rejected") return "Rejected";
  // default fallback
  return "Applied";
}

function toStatus(stage: Stage): string {
  // if your backend prefers "accepted" you could special-case
  return stage; // "applied" | "interview" | "offer" | "rejected"
}

type ApiApp = {
  id: string | number;
  company: string;
  position: string;
  status: string | null;
  date_applied: string | null;
  notes?: string | null;
  // ...anything else the backend returns
};

function mapFromApi(a: ApiApp): Application {
  return {
    id: String(a.id),
    company: a.company,
    role: a.position,
    stage: toStage(a.status),
    createdAt: a.date_applied ?? new Date().toISOString(),
    resumeId: "r_master", // until resumes are wired to backend
    timeline: [],         // backend doesn’t provide timeline (yet)
    links: {},
  };
}

function mapToApiPatch(patch: Partial<Pick<Application,"role"|"company"|"stage">>) {
  const apiPatch: any = {};
  if (patch.role !== undefined) apiPatch.position = patch.role;
  if (patch.company !== undefined) apiPatch.company = patch.company;
  if (patch.stage !== undefined) apiPatch.status = toStatus(patch.stage);
  return apiPatch;
}

// small JSON helper that unwraps your backend envelope
async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = await res.json();
  return body as T;
}

export const client = {
  async listApps(): Promise<Application[]> {
    const res = await fetch(`${BASE}/applications`);
    const body = await json<{ success: boolean; applications: ApiApp[] }>(res);
    return (body.applications ?? []).map(mapFromApi);
  },

  async createApp({ role, company, stage }: { role: string; company: string; stage?: Stage }): Promise<Application> {
    const payload = {
      company,
      position: role,
      status: stage ? toStatus(stage) : "Applied",
      date_applied: new Date().toISOString(),
      notes: null,
    };
    const res = await fetch(`${BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await json<{ success: boolean; application: ApiApp }>(res);
    return mapFromApi(body.application);
  },

  // generic PATCH used for both “edit info” and “move”
  async patchApp(id: string, patch: Partial<Pick<Application,"role"|"company"|"stage">>): Promise<Application> {
    const res = await fetch(`${BASE}/applications/${id}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapToApiPatch(patch)),
    });
    const body = await json<{ success: boolean; application: ApiApp }>(res);
    return mapFromApi(body.application);
  },

  // convenience: move is just a stage change via patch
  async moveApp(id: string, to: Stage): Promise<Application> {
    return client.patchApp(id, { stage: to });
  },

  async deleteApp(id: string): Promise<void> {
    const res = await fetch(`${BASE}/applications/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
  },
};
