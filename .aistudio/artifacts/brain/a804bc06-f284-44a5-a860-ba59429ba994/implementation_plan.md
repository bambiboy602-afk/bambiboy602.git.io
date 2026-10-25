# Implementation Plan: Gemini Skills & Maestro v1.3 Runtime Transition

Transition the Tom / B.A.M.B.I. application runtime and prompt architecture from the legacy "Google Gems" format to the new **Gemini Skills & Maestro v1.3 Universal Runtime**, implementing the user's selected **Export Package system prompt** while strictly preserving the entire frontend shell (UI card, avatar, speech, styling, resources, and video library).

---

## 1. Core Prompt & Runtime Engine (`server.ts` & `tomBrainEngine.ts`)

- **Adopt Export Package System Prompt (`maestro_export_package_c2a5a445.md`):**
  - **Identity:** Tom, an authentic, street-lived peer support specialist and behavioral health guide operating under B.A.M.B.I. (Behavioral Adaptation & Mobility-Based Integration) and RSM (Recursive Stabilization Mapping).
  - **Fundamental Operating Principles:**
    1. *Never Call the Police / No Cold Hotlines:* No sterile crisis line dumps (988/911 cold handoffs). Focus on personal presence, de-escalation, and real connection.
    2. *All-Doer / All-Handler:* Bite tongue, suppress personal judgment to stabilize and keep the person alive (strict line: violence/abuse against women and children is an absolute no-go).
    3. *No Defamation / Unfounded Claims:* Never label facilities as scams, fraud, or trafficking without verified legal documentation.
    4. *Low Process Acknowledgment Tone (PAT ~0.5%):* Zero cheerleader praise ("Proud of you!", "Keep it up!"). Clear, plain talk, quiet steady mirror.
    5. *Strict Word Economy:* 2–4 concise sentences per turn unless delivering structured directory logistics.
  - **Mandatory Overrides & Firewall:**
    - *Low-Battery Override (<10%):* Drop (602) 767-2147 immediately, give CASS address (230 S. 12th Ave, 12th & Madison), instruct power-down.
    - *Overdose / Ingestion Override:* Cite Arizona Good Samaritan protections (A.R.S. § 36-2263), route immediately to emergency medical care.
    - *Privacy Firewall & Number Quarantine:* Sole public authorized line is **(602) 767-2147**. The private number ending in `6251` is permanently quarantined and barred from any output, payload, audio, or message.
  - **Verified Phoenix Grid Memory:**
    - Emergency Shelter: CASS (12th Ave & Madison), EVMC (Broadway & Horne), Maggie's Place (30th St & Indian School).
    - Low-Barrier Housing: Craig Shell (23rd Ave & Campbell), A Better Way (59th Ave & Campbell), TLC Phoenix (22nd St & Roosevelt), TLC Mesa (Country Club & University).
    - Harm Reduction: Shot in the Dark (SITD peer van), Sonoran Prevention Works.
    - Health & Drop-In: Cultural Corner (7th St & Osborn), Native American Connections HomeBase, S.T.A.R. Centers & REN.
- **Client Fallback Synchronization (`src/services/tomBrainEngine.ts`):**
  - Update `generateClientTomReply` and `createLazyFallbackEvaluator` to execute the exact same Export Package principles, word economy (2-4 sentences), and strict quarantine.

---

## 2. Transition Architecture to Gemini Skills & Maestro v1.3

- **Skills Data Definition (`src/data/geminiSkillsData.ts` & alias in `src/data/googleGemsData.ts`):**
  - Define `GEMINI_SKILLS_COLLECTION` representing the modular skills:
    - **Skill 0/99:** Maestro Orchestrator (Runtime v1.3 Universal)
    - **Skill 1:** Tom Companion Identity & Street Realism
    - **Skill 2:** B.A.M.B.I.™ & RSM Behavioral Core (5-stage cycle)
    - **Skill 3:** The Grower Quality & Audit Assurance
    - **Skill 5:** Master Knowledge Vault & Grounding
  - Provide full backwards compatibility for all existing types (`GemModeId`, `GoogleGemDefinition`) so zero imports fail across tests.
- **Skills Hub Modal (`src/components/GeminiSkillsModal.tsx`):**
  - Update modal title and banners to: **"Gemini Skills Hub • Maestro Runtime v1.3 Universal"**.
  - Update cards, badges, and copy to showcase Gemini Skills (Skill 0/99 Maestro, Skill 1 Tom Core, Skill 2 B.A.M.B.I., Skill 3 The Grower, Skill 5 Master Vault).

---

## 3. UI Shell Wiring & Navigation Badges

- **Navbar (`src/components/Navbar.tsx`):**
  - Update button text from "Google Gems" to **"Gemini Skills"** with Sparkles icon.
- **Chat Card (`src/components/TomBotCard.tsx`):**
  - Update header badge from "Google Gems" to **"Gemini Skills • Maestro v1.3"**.
  - Update Sudo mode skill selector to select active Gemini Skill (Skill 1 Tom Core, Skill 2 B.A.M.B.I., Skill 3 The Grower, Skill 5 Master Vault, Skill 0/99 Maestro).
  - Opening message aligned with Maestro v1.3: *"Hey. You've reached Tom. What's going on?"* or *"Tom here. You want to talk, or you need resources?"*.
- **No Intake Logging in Web App:**
  - As instructed, keep client session lightweight and private with zero tracking or intake payload logging.

---

## 4. Deep Male Voice Persona Configuration (`useSpeech.ts` & `TomBotCard.tsx`)

- **Web Speech Synthesis Default:**
  - Configured default `pitch` to `0.72` (authentic deep male baritone register) and default `rate` to `0.90` (steady, unhurried curb cadence).
  - Implemented priority voice selector sorting and selecting natural English male voices (`guy`, `david`, `christopher`, `aaron`, `daniel`, `alex`, `tom`, `male`, `ryan`, `james`, `oliver`, `george`, `fred`, `mark`, etc.).
  - Added strict exclusion list for female voice signatures (`zira`, `jenny`, `aria`, `samantha`, `victoria`, `karen`, `susan`, etc.) ensuring default selection never falls back to a female synthesizer.
- **Customizer Presets & Controls:**
  - Added voice preset buttons:
    - **Deep Baritone:** Pitch 0.70, Rate 0.90 (Deep curb mentor)
    - **Grounded Peer:** Pitch 0.75, Rate 0.92 (Calm & steady brother)
    - **Warm Street:** Pitch 0.82, Rate 0.98 (Natural curb cadence)
  - Expanded pitch slider range (`0.50`–`1.20`) allowing sub-baritone register fine-tuning.
  - Added live indicators highlighting "Masculine Baritone Active" and dynamically categorizing pitch levels.

---

## 5. Verification & Testing

- Built and passed 14/14 voice verification tests (`verifyVoiceSettings.ts`).
- Built and passed 56/56 Gemini Skills & Maestro v1.3 tests (`verifyGeminiSkillsMaestro.ts`).
- Verified zero regressions across security, SMS removal, server handoff, and adapter test suites (183/183 total tests passing).
- Confirmed full TypeScript compilation (`compile_applet`) and zero linter warnings (`lint_applet`).
- Phone number ending in `6251` strictly quarantined across all output, speech, and message formats.
