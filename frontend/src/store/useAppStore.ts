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
import { api } from "../api/mock"; // keep mock for now; swap later

type State = {
  // data
  apps: Application[];
  resumes: Resume[];
  events: CommEvent[];

  // board actions
  refresh: () => void;
  move: (id: string, to: Stage) => void;
  createApp: (role: string, company: string) => void;
  remove: (id: string) => void;

  // selectors
  getApp: (id: string) => Application | undefined;
  getResumeById: (id: string) => Resume | undefined;
  getMasterResume: () => Resume;

  // editor actions
  saveResume: (resume: Resume) => void;
  cloneAndAttachToApp: (appId: string, baseResumeId: string, name?: string) => Resume | null;
  attachResume: (appId: string, resumeId: string) => void;
  updateApp: (id: string, patch: Partial<Pick<Application, "role" | "company">>) => void;
};


export const useAppStore = create<State>((set, get) => ({
  // --- initial state ---
  apps: api.listApps(),
  resumes: api.listResumes(),
  events: api.listEvents(),

  // --- common refresh ---
  refresh: () =>
    set({
      apps: api.listApps(),
      resumes: api.listResumes(),
      events: api.listEvents(),
    }),

  // --- board actions ---
  move: (id, to) => {
    api.moveApp(id, to);
    set({ apps: api.listApps() });
  },

  createApp: (role, company) => {
    api.createApp({ role, company });
    set({ apps: api.listApps() });
  },

  remove: (id) => {
    api.deleteApp(id);
    set({ apps: api.listApps(), events: api.listEvents() });
  },

  // --- selectors (read from in-memory state when possible) ---
  updateApp: (id, patch) => { api.updateApp(id, patch); set({ apps: api.listApps() }); },
  getApp: (id) => api.listApps().find(a => a.id === id),
  getResumeById: (id) => get().resumes.find((r) => r.id === id),
  getMasterResume: () => {
    // prefer seeded id; fall back to API helper
    const local = get().resumes.find((r) => r.id === "r_master");
    return local ?? api.getMasterResume();
  },

  // --- editor actions ---
  saveResume: (resume) => {
    api.updateResume(resume);
    set({ resumes: api.listResumes() });
  },

  cloneAndAttachToApp: (appId, baseResumeId, name) => {
    const clone = api.cloneResume(baseResumeId, name);
    if (!clone) return null;

    // Optional: if you want to copy current edited blocks, do it in the page before calling saveResume
    api.attachResume(appId, clone.id);

    set({
      apps: api.listApps(),
      resumes: api.listResumes(),
    });

    return clone;
  },

  attachResume: (appId, resumeId) => {
    api.attachResume(appId, resumeId);
    set({ apps: api.listApps() });
  },
}));
