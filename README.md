<div align="center">

# 🌟 DrSetu

### AI-Powered Virtual Clinic for Rural Healthcare

*Bridging the rural healthcare gap through AI-assisted triage, multi-LLM engine routing, and remote telemedicine.*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#-license)
[![Hackathon](https://img.shields.io/badge/IBM_BOB_Hacks-2026-blue?style=flat-square)](#-overview)

**Built for IBM BOB Hacks '26 — Problem Statement 3**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem & Solution](#-the-problem--solution)
- [Core Features](#-core-features)
- [Multi-LLM Architecture](#-multi-llm-api-architecture-matrix)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-directory-structure)
- [Getting the Code](#-getting-the-code)
- [Environment Configuration](#-environment-configuration-envlocal)
- [Local Setup & Installation](#-local-setup--installation)
- [Usage Guide](#-usage-guide)
- [AI Safety & Clinical Guardrails](#-ai-safety--clinical-guardrails)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔎 Overview

DrSetu is a virtual clinic platform that empowers trained health workers with an AI-driven assistant. It provides AI triage, protocol-bound first-aid guidance, salt substitute analysis, and instant remote doctor video consultations — ensuring critical care is not delayed even when a doctor is not physically present.

## 🚨 The Problem & Solution

| | |
|---|---|
| **The Problem** | Rural health centers often face a severe lack of daily available doctors, remote and inaccessible locations, and significant delays in emergency patient transfers. Frontline health workers are overwhelmed and often lack the immediate expert guidance needed to stabilize patients or make quick, accurate triage decisions. |
| **The Solution** | DrSetu empowers health workers with a suite of specialized LLMs, ensuring high-speed, accurate, and multilingual support — so critical care is never delayed. |

---

## 🔥 Core Features

| Feature | Description |
|---|---|
| 🗣️ **Multilingual Voice & Text Intake** | Seamlessly capture patient history and symptoms using Speech-to-Text in regional languages. |
| 📄 **Medical OCR & Injury Photo Analysis** | Upload patient records, lab reports, or injury photos for multimodal AI assessment. |
| 🧠 **AI Patient Summary & Emergency Triage** | Automatically synthesize patient data into a concise summary and flag high-risk emergencies instantly. |
| 💊 **Instant AI Protocol Prescription** | Generate safe, protocol-bound first-aid guidance when a doctor is temporarily unavailable. |
| 🔬 **Medicine Salt/Substitute Analyzer** | Identify affordable, available generic substitutes based on active salts. |
| 📹 **Integrated WebRTC Telemedicine** | High-quality video consultation hub connecting health workers and remote doctors in real time. |

---

## ⚡ AI Architecture Matrix

DrSetu leverages Gemini AI models across different medical tasks:

| Feature | Provider | Key Variable | Purpose & Advantage |
|---|---|---|---|
| Patient Triage & Summary | Google AI Studio (Gemini 3.5 Flash) | `GEMINI_API_KEY` | Multimodal analysis (Images + History + Vitals) |
| Instant AI Prescription | Google AI Studio (Gemini 3.5 Flash) | `GEMINI_API_KEY` | Fast and accurate inference for medical protocols |
| Medicine Salt Substitute | Google AI Studio (Gemini 3.5 Flash) | `GEMINI_API_KEY` | Specialized medical reasoning and substitute matching |

---

## 🛠️ Tech Stack

<table>
<tr><td><b>Frontend</b></td><td>Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Shadcn UI</td></tr>
<tr><td><b>Backend</b></td><td>Next.js API Routes, Node.js, LangChain</td></tr>
<tr><td><b>Database</b></td><td>MongoDB Atlas (Mongoose Schemas)</td></tr>
<tr><td><b>Auth</b></td><td>Kinde Auth (Google OAuth 2.0)</td></tr>
<tr><td><b>Telemedicine</b></td><td>WebRTC / Daily.co</td></tr>
</table>

---

## 📂 Project Directory Structure

```
Dr. Setu/
├── app/
│   ├── api/
│   │   ├── ai-prescription/
│   │   ├── ai-triage/
│   │   ├── auth/[kindeAuth]/
│   │   ├── medicine-substitutes/
│   │   ├── patient/
│   │   ├── patients/
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

---

## 📥 Getting the Code

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Clone the Repository

> Replace `<repository_url>` below with the actual GitHub URL of this project (e.g. `https://github.com/<your-username>/dr-setu.git`).

```bash
git clone <repository_url>
cd "Dr. Setu"
```

<details>
<summary><b>Don't have a remote repo yet? Push a local project instead</b></summary>

```bash
cd "Dr. Setu"
git init
git add .
git commit -m "Initial commit - DrSetu virtual clinic platform"
git remote add origin <repository_url>
git branch -M main
git push -u origin main
```

</details>

<details>
<summary><b>Keeping your local copy up to date</b></summary>

```bash
git pull origin main
```

</details>

---

## ⚙️ Environment Configuration (`.env.local`)

Create a `.env.local` file in the project root and populate it with the following keys:

```env
# MongoDB Atlas
MONGODB_URI="your_mongodb_connection_string"

# AI API Key (Used for Triage, Prescriptions, and Substitutes)
GEMINI_API_KEY="your_gemini_api_key"

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

> **Note:** Kinde Auth is implemented as a robust alternative to NextAuth.js. Google OAuth 2.0 setup is managed securely through the Kinde Dashboard.

---

## 🚀 Local Setup & Installation

| Step | Command / Action |
|---|---|
| 1. Install dependencies | `npm install` |
| 2. Configure database | Add your MongoDB connection string to `.env.local` under `MONGODB_URI` |
| 3. Set up Google OAuth via Kinde | See details below |
| 4. Run the dev server | `npm run dev` |

**Google OAuth 2.0 Setup (via Kinde):**

1. Create an account on [Kinde](https://kinde.com/) and set up a new application.
2. Navigate to **Authentication → Social connections → Google**.
3. Provide your Google Cloud Console Client ID and Client Secret in Kinde.
4. In Google Cloud Console, ensure the authorized redirect URI matches Kinde's callback URL (e.g., `https://<your_kinde_domain>/login/callback`).
5. Update `.env.local` with your Kinde credentials.

Once configured, start the app:

```bash
npm run dev
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 📱 Usage Guide

### 🏥 Health Worker Portal — `/worker-dashboard`
The command center for frontline health workers. Input patient vitals, use voice intake for symptom description, upload injury photos, and run AI triage to get an immediate risk assessment and suggested first-aid protocols.

### 👨‍⚕️ Remote Doctor Portal — `/doctor-dashboard`
The hub for specialized doctors. View the live patient queue, receive urgent triage alerts, review AI pre-assessments and synthesized summaries, and launch a WebRTC video consultation instantly.

---

## 🛡️ AI Safety & Clinical Guardrails

DrSetu strictly adheres to clinical safety standards. The AI acts purely as a **clinical decision support system** — it never replaces the doctor.

- **Separation of Duties** — AI suggestions (first-aid protocols, salt substitutes) are clearly marked as advisory and require review by a certified medical professional, or are limited to safe, non-invasive first-aid steps.
- **Emergency Guardrails** — The triage system aggressively flags critical symptoms. High-risk scenarios trigger a mandatory immediate hospital referral, bypassing standard wait queues.

---

## 🔮 Roadmap

- [ ] **Offline LAN Synchronization** — Local LLMs (Ollama / Phi-3) for continuous triage during internet blackouts.
- [ ] **ABDM Integration** — Direct sync with the Ayushman Bharat Digital Mission for national digital health records.

---

## 🤝 Contributing

Contributions are welcome. To propose a change:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

---

## 📄 License

This project was built for **IBM BOB Hacks '26**. Licensing details to be added by the project maintainers.

---

<div align="center">

**Built with ❤️ for IBM BOB Hacks '26**

</div>
