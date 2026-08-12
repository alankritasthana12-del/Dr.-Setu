// ============================================================
// DEMO FAIL-SAFE: Set USE_MOCK_DATA = true to always use mock
// data, or false to attempt real API calls with 2s timeout.
// ============================================================
export const USE_MOCK_DATA = false;

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
  requiresDoctor: boolean;
  triageLevel: "RED" | "YELLOW" | "GREEN";
  status: string;
  imageUrl?: string;
  createdAt: string;
  waitTime: string;
}

export interface TriageResult {
  triageLevel: "RED" | "YELLOW" | "GREEN";
  requiresDoctor: boolean;
  aiSummary: string;
  firstAidGuidance: string;
}

export const MOCK_PATIENTS: Patient[] = [
  {
    _id: "pt-001",
    name: "Ramesh Kumar",
    age: 58,
    gender: "Male",
    language: "Hindi",
    contact: "+91 98765 43210",
    symptoms: ["Chest pain", "Shortness of breath", "Dizziness", "Cold sweat"],
    symptomDuration: "3 hours",
    vitals: { temp: 99.1, bp: "158/98", pulse: 112, spO2: 89 },
    triageLevel: "RED",
    requiresDoctor: true,
    aiSummary:
      "Patient presents with acute chest pain accompanied by dyspnea, diaphoresis, and tachycardia. SpO2 critically low at 89%. Vitals indicate hypertensive emergency with possible ACS (Acute Coronary Syndrome). Immediate physician intervention required. Do NOT administer any medications without doctor approval.",
    firstAidGuidance:
      "🚨 EMERGENCY: Keep patient calm and seated upright. Do NOT allow exertion. Administer supplemental O₂ if available. Place on cardiac monitor. Prepare for immediate telemedicine consultation. Document time of symptom onset. If aspirin available and no allergy, hold until doctor confirms.",
    status: "waiting",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    waitTime: "12 min",
  },
  {
    _id: "pt-002",
    name: "Priya Devi",
    age: 34,
    gender: "Female",
    language: "Hindi",
    contact: "+91 87654 32109",
    symptoms: ["High fever", "Severe headache", "Neck stiffness", "Photophobia"],
    symptomDuration: "18 hours",
    vitals: { temp: 103.8, bp: "110/70", pulse: 98, spO2: 96 },
    triageLevel: "RED",
    requiresDoctor: true,
    aiSummary:
      "Patient presents with classic triad of meningeal irritation: high-grade fever, severe headache with neck stiffness, and photophobia. Clinical picture highly suspicious for bacterial meningitis. Time-critical condition requiring urgent physician evaluation and possible lumbar puncture. Isolation protocols recommended.",
    firstAidGuidance:
      "🚨 URGENT: Isolate patient in quiet, darkened room. Keep patient lying down. Monitor vitals every 15 minutes. Do NOT administer antipyretics alone — await doctor's order. Avoid any oral medications. Prepare IV access if possible. Document neurological status (GCS).",
    status: "waiting",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    waitTime: "28 min",
  },
  {
    _id: "pt-003",
    name: "Sunita Bai",
    age: 45,
    gender: "Female",
    language: "Hindi",
    contact: "+91 76543 21098",
    symptoms: ["Abdominal pain", "Nausea", "Vomiting", "Low-grade fever"],
    symptomDuration: "6 hours",
    vitals: { temp: 100.4, bp: "124/82", pulse: 88, spO2: 97 },
    triageLevel: "YELLOW",
    requiresDoctor: false,
    aiSummary:
      "Patient presents with acute-onset right lower quadrant abdominal pain, nausea, vomiting, and mild pyrexia. Symptoms pattern is consistent with early appendicitis or gastroenteritis. Vitals are stable. Requires physician evaluation within 1 hour to rule out surgical emergency.",
    firstAidGuidance:
      "⚠️ MODERATE: Keep patient NPO (nothing by mouth). Position of comfort — usually lying with knees drawn up. Monitor vitals every 20 minutes. Do NOT apply heat to abdomen. Mild IV hydration if patient is dehydrated. Await physician consultation before any pain medication.",
    status: "waiting",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    waitTime: "45 min",
  },
  {
    _id: "pt-004",
    name: "Arjun Singh",
    age: 12,
    gender: "Male",
    language: "Hindi",
    contact: "+91 65432 10987",
    symptoms: ["Laceration on forearm", "Minor bleeding", "Pain"],
    symptomDuration: "30 minutes",
    vitals: { temp: 98.6, bp: "110/65", pulse: 92, spO2: 99 },
    triageLevel: "GREEN",
    requiresDoctor: false,
    aiSummary:
      "Pediatric patient with a 3cm laceration on the left forearm from a fall. Bleeding is controlled. Vitals are within normal limits for age. No signs of arterial injury or bone involvement. Wound appears clean with no foreign body. Standard wound care protocol can be initiated by the health worker.",
    firstAidGuidance:
      "✅ LOW RISK: Clean wound with normal saline or clean water. Apply antiseptic (betadine or chlorhexidine). Close with steri-strips or adhesive bandage if wound edges are approximated. Apply sterile dressing. Update tetanus status — if >5 years since last dose, schedule booster. Monitor for signs of infection.",
    status: "waiting",
    imageUrl: "/mock-wound.jpg",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    waitTime: "8 min",
  },
  {
    _id: "pt-005",
    name: "Meera Sharma",
    age: 28,
    gender: "Female",
    language: "English",
    contact: "+91 54321 09876",
    symptoms: ["Rash on arms", "Itching", "Mild swelling"],
    symptomDuration: "2 days",
    vitals: { temp: 98.2, bp: "118/76", pulse: 72, spO2: 99 },
    triageLevel: "GREEN",
    requiresDoctor: false,
    aiSummary:
      "Patient presents with a bilateral erythematous maculopapular rash on both forearms with associated pruritus and mild edema. No signs of anaphylaxis, respiratory distress, or systemic involvement. Clinical picture consistent with contact dermatitis or allergic reaction. Not an emergency.",
    firstAidGuidance:
      "✅ LOW RISK: Apply cool compress for 10-15 minutes to relieve itching. OTC antihistamine (cetirizine 10mg once daily) can be started. Apply calamine lotion or 1% hydrocortisone cream to affected area. Avoid scratching. Instruct patient to avoid potential allergens. Follow up in 3 days if no improvement.",
    status: "waiting",
    imageUrl: undefined,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    waitTime: "5 min",
  },
];

export const MOCK_TRIAGE_RESULT: TriageResult = {
  triageLevel: "RED",
  requiresDoctor: true,
  aiSummary:
    "Based on the submitted vitals and symptoms, this patient presents with critical indicators requiring immediate medical attention. The combination of low SpO₂ (89%), elevated heart rate, and reported chest pain are hallmarks of a potential acute cardiac or pulmonary event. Immediate telemedicine consultation has been initiated.",
  firstAidGuidance:
    "🚨 EMERGENCY PROTOCOL ACTIVATED\n\n1. Keep patient seated upright — do NOT lay them flat.\n2. Ensure airway is clear and patient is breathing.\n3. Apply O₂ via nasal cannula at 2-4 L/min if available.\n4. Do NOT give food, water, or medications without doctor approval.\n5. Attach ECG leads if equipment is available.\n6. Initiate telemedicine call immediately.\n7. Be prepared for CPR if patient loses consciousness.\n8. Document exact time of symptom onset.",
};

// ============================================================
// Safe fetch wrapper — falls back to mock after 2 seconds
// ============================================================
export async function safeFetch<T>(
  url: string,
  options: RequestInit,
  mockData: T
): Promise<T> {
  if (USE_MOCK_DATA) return mockData;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    clearTimeout(timeoutId);
    console.warn(`[DEMO FALLBACK] ${url} failed — using mock data`);
    return mockData;
  }
}
