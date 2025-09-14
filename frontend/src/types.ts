export type Stage = 'applied' | 'interview' | 'offer' | 'rejected';

// we can customize all of this, this is just for the sake of having it done

// whatever is inside a Resume
export type ResumeBlock =
| { kind: 'summary'; text: string }
| { kind: 'experience'; entries: { company: string; role: string; bullets: string[]; dates?: string }[] }
| { kind: 'projects'; entries: { name: string; desc: string; tech: string[] }[] }
| { kind: 'skills'; items: string[] }
| { kind: 'education'; entries: { school: string; credential: string; dates?: string }[] };

// Resume ties to Applications
export type Resume = {
id: string;
name: string;
blocks: ResumeBlock[];
lastEdited: string; // ISO
parentId?: string;
meta?: ResumeMeta;
};

// the Application object
export type Application = {
id: string;
role: string;
company: string;
logoUrl?: string;
stage: Stage;
createdAt: string; // ISO
resumeId: string;
timeline: { stage: Exclude<Stage, 'rejected'>; at: string }[];
links?: { jd?: string; portal?: string };
};

// Classifying types of communication too
export type CommEvent = {
id: string;
applicationId?: string;
channel: 'email' | 'call' | 'portal';
kind: 'interview_invite' | 'rejection' | 'offer' | 'followup' | 'other';
at: string; // ISO
snippet: string;
};

export type ResumeMeta = {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: { label: string; url: string }[];
};

