// -------------------------------------------------
// localStorage-backed mock API
// Swap to real backend later without changing pages
// -------------------------------------------------
import type { Application, Resume, CommEvent, Stage } from '../types';


const LS = {
apps: 'apps',
resumes: 'resumes',
events: 'events',
};


function read<T>(key: string, fallback: T): T {
try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write<T>(key: string, val: T) { localStorage.setItem(key, JSON.stringify(val)); }


function uid(prefix = 'id'): string { return `${prefix}_${Math.random().toString(36).slice(2, 9)}`; }


// Seed once
(function seed() {
const seeded = read<Application[]>(LS.apps, []);
if (seeded.length) return;
const now = new Date();
const iso = (d: Date) => d.toISOString();
const master: Resume = { id: 'r_master', name: 'Master Resume', blocks: [{ kind: 'summary', text: 'Driven developer…' }], lastEdited: iso(now) };
write<Resume[]>(LS.resumes, [master]);
const apps: Application[] = [
{ id: 'a1', role: 'Frontend Engineer', company: 'Twitch', stage: 'applied', createdAt: iso(new Date(now.getTime()-7*864e5)), resumeId: master.id, timeline: [{ stage: 'applied', at: iso(new Date(now.getTime()-7*864e5)) }] },
{ id: 'a2', role: 'Data Analyst', company: 'Big Pharma', stage: 'interview', createdAt: iso(new Date(now.getTime()-10*864e5)), resumeId: master.id, timeline: [{ stage: 'applied', at: iso(new Date(now.getTime()-10*864e5)) }, { stage: 'interview', at: iso(new Date(now.getTime()-3*864e5)) }] },
{ id: 'a3', role: 'ML Engineer', company: 'Big Milk', stage: 'offer', createdAt: iso(new Date(now.getTime()-20*864e5)), resumeId: master.id, timeline: [{ stage: 'applied', at: iso(new Date(now.getTime()-20*864e5)) }, { stage: 'interview', at: iso(new Date(now.getTime()-12*864e5)) }, { stage: 'offer', at: iso(new Date(now.getTime()-2*864e5)) }] },
{ id: 'a4', role: 'Backend Developer', company: 'Hopoo Games', stage: 'rejected', createdAt: iso(new Date(now.getTime()-5*864e5)), resumeId: master.id, timeline: [{ stage: 'applied', at: iso(new Date(now.getTime()-5*864e5)) }] },
];
write<Application[]>(LS.apps, apps);
write<CommEvent[]>(LS.events, []);
})();


export const api = {
  // --- reads ---
  listApps(): Application[] {
    return read<Application[]>(LS.apps, []);
  },
  listResumes(): Resume[] {
    return read<Resume[]>(LS.resumes, []);
  },
  listEvents(): CommEvent[] {
    return read<CommEvent[]>(LS.events, []);
  },

  // --- creates ---
  createApp(
    partial: Pick<Application, 'role' | 'company'> & { stage?: Stage }
  ): Application {
    const apps = api.listApps();
    const resumes = api.listResumes();
    const master =
      resumes.find((r) => r.id === 'r_master') ??
      api.createResume({ name: 'Master Resume' });

    const a: Application = {
      id: uid('a'),
      role: partial.role,
      company: partial.company,
      stage: partial.stage ?? 'applied',
      createdAt: new Date().toISOString(),
      resumeId: master.id,
      timeline: [{ stage: 'applied', at: new Date().toISOString() }],
    };

    apps.unshift(a);
    write(LS.apps, apps);
    return a;
  },

  // --- updates ---
    moveApp(id: string, to: Stage): Application | null {
    const apps = api.listApps();
    const i = apps.findIndex(a => a.id === id);
    if (i < 0) return null;

    const app = { ...apps[i] };
    app.stage = to;

    if (to !== 'rejected') {
        app.timeline = [
        ...app.timeline,
        { stage: to as Exclude<Stage, 'rejected'>, at: new Date().toISOString() },
        ];
    }

    apps[i] = app;
    write(LS.apps, apps);
    return app;
    },

  // --- helpers that were missing ---
  getApp(id: string): Application | null {
    return api.listApps().find((a) => a.id === id) ?? null;
  },

  getResume(id: string): Resume | null {
    return api.listResumes().find((r) => r.id === id) ?? null;
  },

  createResume({
    name,
    parentId,
    blocks,
  }: {
    name: string;
    parentId?: string;
    blocks?: Resume['blocks'];
  }): Resume {
    const resumes = api.listResumes();
    const r: Resume = {
      id: uid('r'),
      name,
      parentId,
      blocks: blocks ?? [],
      lastEdited: new Date().toISOString(),
    };
    resumes.unshift(r);
    write(LS.resumes, resumes);
    return r;
  },

  cloneResume(id: string, name?: string): Resume | null {
    const src = api.getResume(id);
    if (!src) return null;
    return api.createResume({
      name: name ?? `${src.name} (clone)`,
      parentId: src.id,
      blocks: src.blocks,
    });
  },

  attachResume(appId: string, resumeId: string): void {
    const apps = api.listApps();
    const i = apps.findIndex((a) => a.id === appId);
    if (i < 0) return;
    apps[i] = { ...apps[i], resumeId };
    write(LS.apps, apps);
  },

  logEvent(e: Omit<CommEvent, 'id' | 'at'> & { at?: string }): CommEvent {
    const events = api.listEvents();
    const ev: CommEvent = {
      id: uid('ev'),
      at: e.at ?? new Date().toISOString(),
      ...e,
    } as CommEvent;
    events.unshift(ev);
    write(LS.events, events);
    return ev;
  },

  // --- deletions ---

  deleteApp(id: string): void {
  const apps = api.listApps().filter(a => a.id !== id);
  write(LS.apps, apps);

  // also remove related comm events
  const events = api.listEvents().filter(e => e.applicationId !== id);
  write(LS.events, events);
},
};
