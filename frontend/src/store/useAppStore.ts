import { create } from 'zustand';
import type { Application, CommEvent, Resume, Stage } from '../types';
import { api } from '../api/mock.ts';


type State = {
apps: Application[];
resumes: Resume[];
events: CommEvent[];
refresh: () => void;
move: (id: string, to: Stage) => void;
createApp: (role: string, company: string) => void;
remove: (id: string) => void; 
};


export const useAppStore = create<State>((set) => ({
  apps: api.listApps(),
  resumes: api.listResumes(),
  events: api.listEvents(),
  refresh: () => set({ apps: api.listApps(), resumes: api.listResumes(), events: api.listEvents() }),
  move: (id, to) => { api.moveApp(id, to); set({ apps: api.listApps() }); },
  createApp: (role, company) => { api.createApp({ role, company }); set({ apps: api.listApps() }); },
  remove: (id) => { api.deleteApp(id); set({ apps: api.listApps() }); },   
}));

