# 🌟 DrSetu (AI-Powered Virtual Clinic for Rural Healthcare)

**Hackathon Context:** IBM BOB Hacks '26 - Problem Statement 3

**Value Proposition:** Bridging the rural healthcare gap through AI-assisted triage, multi-LLM engine routing, offline resilience, and remote telemedicine. DrSetu empowers frontline health workers with instant medical reasoning and connects them seamlessly with remote doctors.

## 🚨 The Problem & Proposed Solution

**The Problem:**
Rural health centers often face a severe lack of daily available doctors, remote and inaccessible locations, and significant delays in emergency patient transfers. Frontline health workers are overwhelmed and often lack the immediate expert guidance needed to stabilize patients or make quick, accurate triage decisions.

**The Solution:**
DrSetu is a virtual clinic platform that empowers trained health workers with an AI-driven assistant. It provides AI triage, protocol-bound first-aid guidance, salt substitute analysis, and instant remote doctor video consultations. By utilizing a suite of specialized LLMs, DrSetu ensures that health workers receive high-speed, accurate, and multilingual support, ensuring critical care is not delayed even when a doctor is not physically present.

## 🔥 Core Features

*   **Multilingual Voice & Text Intake:** Seamlessly capture patient history and symptoms using Speech-to-Text in regional languages.
*   **Medical OCR & Injury Photo Analysis:** Upload patient records, lab reports, or injury photos for multimodal AI assessment.
*   **AI Patient Summary & Emergency Triage Risk Detection:** Automatically synthesize patient data into a concise summary and flag high-risk emergencies instantly.
*   **Instant AI Protocol Prescription:** Generate safe, protocol-bound first-aid guidance and prescriptions when a doctor is temporarily unavailable.
*   **Multilingual Prescription & Report Translator:** Break language barriers by translating complex medical reports and prescriptions for patients.
*   **Medicine Salt & Generic Substitute Analyzer:** Identify affordable and available generic medicine substitutes based on active salts.
*   **Integrated WebRTC Telemedicine:** A built-in high-quality video consultation hub connecting health workers and patients with remote doctors in real-time.

## ⚡ Multi-LLM API Architecture Matrix

Our solution meaningfully leverages advanced AI models to provide specialized value across different medical tasks. 

| Feature | Provider | Key Variable | Purpose & Advantage |
| :--- | :--- | :--- | :--- |
| Patient Triage & Summary | Google AI Studio (Gemini 2.0 Flash) | `GEMINI_API_KEY` | Multimodal analysis (Images + History + Vitals) |
| Instant AI Prescription | Cerebras Cloud (Llama 3.1) | `CEREBRAS_API_KEY` | Ultra-fast token inference (~2600+ tokens/sec) |
| Multilingual Translation | GroqCloud | `GROQ_API_KEY` | High-speed regional language conversion |
| Medicine Salt Substitute | OpenRouter | `OPENROUTER_API_KEY` | Specialized medical reasoning & model routing |

*(Note: While the project specification suggested `TRANSLATOR_API_KEY` and `SUBSTITUTE_API_KEY`, the implementation actively uses `GROQ_API_KEY` and `OPENROUTER_API_KEY` to route requests to the most performant models for these specific features.)*

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS (Clinical Teal/White Aesthetic), Lucide React, Shadcn UI
*   **Backend:** Next.js API Routes, Node.js, LangChain
*   **Database:** MongoDB Atlas (Mongoose Schemas)
*   **Auth:** Kinde Auth (with Google OAuth 2.0 Integration)
*   **Video / Telemedicine:** WebRTC / Daily.co

## 📂 Project Directory Structure

```text
Dr. Setu/
├── app/
│   ├── api/
│   │   ├── ai-prescription/
│   │   ├── ai-triage/
│   │   ├── auth/[kindeAuth]/
│   │   ├── medicine-substitutes/
│   │   ├── patient/
│   │   ├── patients/
│   │   ├── translate/
│   │   └── video-token/
│   ├── doctor-dashboard/
│   │   └── page.tsx
│   ├── fonts/
│   ├── login/
│   │   └── page.tsx
│   ├── worker-dashboard/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── sonner.tsx
│   │   └── toast.tsx
│   └── VideoCall.tsx
├── lib/
│   ├── langchain.ts
│   ├── mongodb.ts
│   ├── mongodbAuth.ts
│   ├── types.ts
│   └── utils.ts
├── models/
│   └── Patient.ts
├── middleware.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## ⚙️ Environment Configuration (`.env.local`)

Create a `.env.local` file in the root directory and populate it with the following keys. 

```env
# MongoDB Atlas
MONGODB_URI="your_mongodb_connection_string"

# 1. AI Summary & Assessment (Multimodal)
GEMINI_API_KEY="your_gemini_api_key"

# 2. Instant AI Prescription (Lightning fast inference)
CEREBRAS_API_KEY="your_cerebras_api_key"

# 3. Multilingual Translation
GROQ_API_KEY="your_groq_api_key"

# 4. Medicine Salt/Substitute Analyzer
OPENROUTER_API_KEY="your_openrouter_api_key"

# Daily.co API Key – for WebRTC video calls
DAILY_API_KEY="your_daily_api_key"

# Kinde Authentication (Handles Google OAuth 2.0)
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="your_kinde_issuer_url"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/doctor-dashboard"
```
*(Note: Kinde Auth is implemented in this workspace as a robust alternative to NextAuth.js. Google OAuth 2.0 setup is managed securely through the Kinde Dashboard.)*

## 🚀 Step-by-Step Local Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd "Dr. Setu"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Connection:**
    Ensure you have a MongoDB cluster running. Get your connection string and add it to `.env.local` under `MONGODB_URI`.

4.  **Google OAuth 2.0 Setup (via Kinde):**
    *   Create an account on Kinde and set up a new application.
    *   Navigate to **Authentication -> Social connections -> Google**.
    *   Provide your Google Cloud Console Client ID and Client Secret in Kinde.
    *   In Google Cloud Console, ensure the authorized redirect URI matches Kinde's callback URL (e.g., `https://<your_kinde_domain>/login/callback`).
    *   Update the `.env.local` with your Kinde credentials.

5.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📱 Demo Workflow & Dashboard Guide

*   **Health Worker Portal (`/worker-dashboard`):** 
    The command center for frontline health workers. Here they can input patient vitals, use voice intake for symptom description, upload injury photos, and run the AI triage to get an immediate risk assessment and suggested first-aid protocols.
    
*   **Remote Doctor Portal (`/doctor-dashboard`):** 
    The hub for specialized doctors. Doctors can view the live patient queue, receive urgent triage alerts, review the AI pre-assessment and synthesized summaries, and launch a WebRTC video consultation instantly to provide expert care.

## 🛡️ AI Safety & Clinical Guardrails

DrSetu strictly adheres to clinical safety standards. **The AI acts purely as a clinical decision support system, never replacing the doctor.** 
*   **Separation of Duties:** AI suggestions (such as first-aid protocols and salt substitutes) are clearly marked as advisory and require review by a certified medical professional or are limited to safe, non-invasive first-aid steps for health workers.
*   **Emergency Guardrails:** The triage system is programmed to flag critical symptoms aggressively. If a high-risk scenario is detected, the AI mandates an immediate hospital referral and bypasses standard wait queues.

## 🔮 Future Scope & Roadmap

*   **Offline LAN Synchronization:** Implementing local LLMs (like Ollama or Phi-3) to ensure continuous triage and protocol generation even during total internet blackouts.
*   **ABDM Integration:** Direct synchronization with the Ayushman Bharat Digital Mission (ABDM) to fetch and update national digital health records seamlessly.

---
*Built for IBM BOB Hacks '26*
