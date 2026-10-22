# ParakeetAI — 100% Free & Priceless AI Assistant

> **Zero Paywalls • No Subscriptions • Unlimited Usage • Lifetime 100% Free for All Users**

A high-fidelity, production-grade reconstruction of **ParakeetAI** ([https://www.parakeet-ai.com](https://www.parakeet-ai.com)), made completely free and priceless for candidates worldwide.

---

## 🔍 Reverse-Engineering Summary (REA MCP)

This project was reverse-engineered using the **REA (Reverse Engineer Anything) MCP Suite**:
1. **CDP Scenario Capture (`capture_browser_scenario`)**:
   - Launched native Chromium/Edge runtime against `https://www.parakeet-ai.com`.
   - Captured production DOM, layout geometry, CSS tokens, and font specifications (`Inter Tight`, `Bricolage Grotesque`, `JetBrains Mono`).
2. **Web Scripts & Chunks Extraction (`export_web_scripts`)**:
   - Recovered client bundles and static chunks from `/_next/static/immutable/chunks/`.
   - Decoded route hierarchies, application paths (`/dashboard`, `/callSession`, `/mock-interview`, `/question-bank`, `/resume-maker`, `/headshots`), and telemetry channels (`meetingDetector`, `auto_extend_prompt`, `silence_detected`, `lock_taken_over`).
3. **JavaScript Application Graph Analysis (`analyze_javascript_application`)**:
   - Parsed 25 production JavaScript bundles (720,458 bytes, 212,945 AST nodes).
   - Mapped 54,649 data-flow relationships, 5,791 object-flow candidates, and 3,219 call-flow edges.

---

## 🚀 Key Features Reconstructed

### 1. **Live AI Interview Assistant Studio (`/callSession`)**
- **Dual-Channel Audio Ingestion**: Separate tracking for Interviewer Speaker vs. Candidate Microphone.
- **Sub-150ms Answer Streaming**: Real-time guidance generation matching conversational flow.
- **Four Dynamic Response Modes**:
  - **Glancable Bullets**: Quick, concise bullet points designed to be read while maintaining natural eye contact.
  - **STAR Method**: Situation, Task, Action, Result structured responses with concrete metrics.
  - **Coding & Algorithms**: Clean code syntax, Big-O Time & Space complexity analysis, and edge case highlights.
  - **System Design**: Architectural blueprints, scalability tradeoffs, and failure recovery strategies.
- **Predictive Follow-Up Drilldown**: Predicts the next 3 questions the interviewer is likely to ask.
- **Screen Snapper & Problem Solver**: Captures LeetCode, HackerRank, or CoderPad problem statements directly from your screen and produces idiomatic solutions.
- **Post-Call Debrief & Summary**: Auto-generates interview notes, scorecards, and a recruiter thank-you email draft.

### 2. **Undetectable Stealth Floating Overlay**
- Floating mini-widget designed for use alongside Zoom, Teams, Google Meet, or Webex.
- **Customizable Opacity Slider** (30% to 100%) for discreet positioning.
- Global hotkey toggle (`Ctrl + Space`).
- One-click screen snapper and live microphone mute controls.

### 3. **Authentic Question Bank (`/question-bank`)**
- 10,000+ real interview questions from **Google, Meta, Amazon, Stripe, and Microsoft**.
- Filter by Company, Role, Difficulty, and Category.
- Frequency ratings (e.g., *98% Recurrence in last 30 days*).
- Full code solutions and ideal talking points with direct links to practice in the Live Assistant.

### 4. **Interactive AI Voice Mock Interviewer (`/mock-interview`)**
- Voice synthesis (Text-to-Speech) for realistic interviewer speech.
- Multi-turn conversation with intelligent follow-up questions.
- Performance scorecard evaluating **Technical Depth, Communication Clarity, STAR Structure, and Confidence**.

### 5. **ATS Resume Maker & Optimizer (`/resume-maker`)**
- Real-time **ATS Score Calculator** (0–100%) comparing your resume against target job descriptions.
- **AI Bullet Point Enhancer**: Transforms weak, passive statements into quantified business impact achievements.
- Print & PDF export layout.

### 6. **AI Headshots Studio (`/headshots`)**
- Studio portrait generator with lighting and wardrobe presets (*Executive Navy Suit, Tech Founder Casual, Editorial Studio, Creative Contemporary*).
- Live Before-and-After preview.

### 7. **Candidate Command Center (`/dashboard`)**
- Historical session transcripts, topic tags, and performance analytics.
- Knowledge Base Vault for uploading resumes, project notes, and company cheat sheets.
- AI Model configuration (**Gemini 2.5 Flash, Claude 3.5 Sonnet, GPT-4o**).
- Stealth emergency hotkeys and silence threshold adjustments.

---

## 🛠️ Technology Stack

- **Framework**: Vite + React 19
- **Icons**: Lucide React
- **Animations**: CSS Keyframe Engines (`pk-beam`, `pk-breathe`, `pk-float`, `pk-glow`)
- **Audio & Vision**: Web Speech API (`SpeechRecognition`), Web Audio API (`AudioContext` FFT frequency analyzer), `getDisplayMedia` screen grabber
- **Effects**: Canvas Confetti

---

## 💻 Running Locally

The local development server runs on port 3000:

```bash
# Start the Vite development server
npm run dev

# Or build for production
npm run build
npm run preview
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
