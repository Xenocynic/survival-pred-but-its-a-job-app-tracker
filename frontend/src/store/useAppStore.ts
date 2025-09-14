// THIS IS WHERE WE ADD ALL OUR SUPER CALL BACKEND CALLS

/* GUIDE: 

- move → POST /api/applications/:id/move

- createApp → POST /api/applications

- remove → DELETE /api/applications/:id

- saveResume → PATCH /api/resumes/:id

- cloneAndAttachToApp → POST /api/resumes/:id/clone then POST /api/applications/:appId/attach-resume

- attachResume → POST /api/applications/:id/attach-resume

- refresh → GET /api/applications + GET /api/resumes + GET /api/events */

import { create } from "zustand";
import type { Application, CommEvent, Resume, Stage } from "../types";

// Real backend for Applications:
import { client as expressClient } from "../api/expressClient";

// Keep mock for now for Resumes + Events:
import { api as mock } from "../api/mock";

type State = {
  // data
  apps: Application[];
  resumes: Resume[];
  events: CommEvent[];

  // board actions
  refresh: () => Promise<void>;
  createApp: (role: string, company: string) => Promise<void>;
  move: (id: string, to: Stage) => Promise<void>; // status change
  updateApp: (id: string, patch: Partial<Pick<Application, "role" | "company">>) => Promise<void>;
  remove: (id: string) => Promise<void>;

  // selectors
  getApp: (id: string) => Application | undefined;
  getResumeById: (id: string) => Resume | undefined;
  getMasterResume: () => Resume;

  // editor actions (still mock-backed)
  saveResume: (resume: Resume) => Promise<void>;
  cloneAndAttachToApp: (appId: string, baseResumeId: string, name?: string) => Promise<Resume | null>;
  attachResume: (appId: string, resumeId: string) => Promise<void>;
};

export const useAppStore = create<State>((set, get) => ({
  // Start empty; call refresh() on app mount
  apps: [],
  resumes: [],
  events: [],

  // -------- common refresh --------
  async refresh() {
    // Applications from Express, resumes + events from mock (for now)
    const [apps, resumes, events] = await Promise.all([
      expressClient.listApps(),
      Promise.resolve(mock.listResumes()),
      Promise.resolve(mock.listEvents()),
    ]);
    set({ apps, resumes, events });
  },

  // -------- board actions --------
  async createApp(role, company) {
    await expressClient.createApp({ role, company });
    const apps = await expressClient.listApps();
    set({ apps });
  },

  async move(id, to) {
    // optimistic update
    const prev = get().apps;
    const optimistic = prev.map(a =>
      a.id === id
        ? {
            ...a,
            stage: to,
            timeline:
              to !== "rejected"
                ? [...a.timeline, { stage: to as Exclude<Stage, "rejected">, at: new Date().toISOString() }]
                : a.timeline,
          }
        : a
    );
    set({ apps: optimistic });

    try {
      await expressClient.moveApp(id, to); // backend PATCH /applications/:id with {status}
      const apps = await expressClient.listApps();
      set({ apps });
    } catch (e) {
      console.error("Move failed:", e);
      set({ apps: prev }); // rollback
    }
  },

  async updateApp(id, patch) {
    // optimistic
    const prev = get().apps;
    set({ apps: prev.map(a => (a.id === id ? { ...a, ...patch } : a)) });

    try {
      await expressClient.patchApp(id, patch); // maps role/company to position/company
      const apps = await expressClient.listApps();
      set({ apps });
    } catch (e) {
      console.error("Update failed:", e);
      set({ apps: prev });
    }
  },

  async remove(id) {
    const prev = get().apps;
    set({ apps: prev.filter(a => a.id !== id) }); // optimistic
    try {
      await expressClient.deleteApp(id);
      const [apps, events] = await Promise.all([
        expressClient.listApps(),
        Promise.resolve(mock.listEvents()), // still mock events
      ]);
      set({ apps, events });
    } catch (e) {
      console.error("Delete failed:", e);
      set({ apps: prev });
    }
  },

  // -------- selectors (use in-memory state) --------
  getApp: (id) => get().apps.find(a => a.id === id),
  getResumeById: (id) => get().resumes.find(r => r.id === id),
  getMasterResume: () => {
    const local = get().resumes.find(r => r.id === "r_master");
    return local ?? mock.getMasterResume();
  },

  // -------- editor actions (mock for now) --------
  async saveResume(resume) {
    mock.updateResume(resume);
    set({ resumes: mock.listResumes() });
  },

  async cloneAndAttachToApp(appId, baseResumeId, name) {
    const clone = mock.cloneResume(baseResumeId, name);
    if (!clone) return null;
    mock.attachResume(appId, clone.id);
    set({ apps: mock.listApps(), resumes: mock.listResumes() });
    return clone;
  },

  async attachResume(appId, resumeId) {
    mock.attachResume(appId, resumeId);
    set({ apps: mock.listApps() });
  },
}));
