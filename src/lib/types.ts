export interface Vitals {
  temp: number;
  bp: string;
  pulse: number;
  spO2: number;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  language: string;
  contact: string;
  symptoms: string[];
  symptomDuration: string;
  vitals: Vitals;
  aiSummary: string;
  firstAidGuidance: string;
  aiPrescription?: string;
  doctorNotes?: string;
  requiresDoctor: boolean;
  triageLevel: "RED" | "YELLOW" | "GREEN";
  status: string;
  imageUrl?: string;
  createdAt: string;
  waitTime: string;
  videoRoomUrl?: string;
}

export interface TriageResult {
  triageLevel: "RED" | "YELLOW" | "GREEN";
  requiresDoctor: boolean;
  aiSummary: string;
  firstAidGuidance: string;
  aiPrescription?: string;
  doctorNotes?: string;
}
