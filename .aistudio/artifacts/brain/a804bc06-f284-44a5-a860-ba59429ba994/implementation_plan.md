# Sudo Mode Interface Cleanup & Developer Inspector Architecture

A revised implementation plan to clean up the user interface by removing all unnecessary technical selectors, developer modal triggers, gem mode switchers, and architecture widgets across the site—revealing them only when `sudo mode` is activated.

> [!IMPORTANT]
> **User Review & Confirmed Revisions**
> - **Page Cleanup & Selector Purge**: Remove all unnecessary technical selectors, gem switchers, telemetry chips, and developer buttons from the standard user interface.
> - **Sudo Mode Controlled Visibility**:
>   - **When Sudo Mode is OFF (Default / Normal Mode)**:
>     - The UI is clean, warm, and focused on Bambi's peer recovery story, the 4 Pillars of Community Resources, the Domino Effect game & workbook, recovery videos, and Tom's conversational peer support.
>     - Unnecessary selectors removed: Google Gems tab row, Look/Sound customizer buttons, SMS gateway triggers, GitHub deploy triggers, technical architecture cards, and search grounding chips.
>   - **When Sudo Mode is ON (Active Developer Mode)**:
>     - Activates via the floating discrete switch at the bottom of the chat or by typing `sudo tom`.
>     - Unlocks the collapsible slide-down developer inspector in Tom Bot Card (Gemini 3.8 Flash specs, fallback engines, active 4-Gem architecture, and NotebookLM grounding sources).
>     - Reveals advanced controls: Gem mode switcher (#1 Tom Core, #2 BAMBI, #3 The Grower, #4 Master Vault), Look & Sound voice customizer, SMS telemetry, and grounding data on chat bubbles.

---

### 1. Overview & Core Concept

- **What It Does**: Establishes a unified `sudoMode` state across the application. When deactivated, it strips out all developer noise, technical jargon, and multi-gem selector bars, leaving an uncluttered, human-first peer support experience. When toggled on, it gracefully unlocks the complete developer cockpit and engine specifications.
- **Target Audience / Persona**: Individuals seeking recovery support without technical distraction, alongside Bambi/administrators needing direct access to system prompts, gem synchronizations, and model telemetry.
- **Key Value**: Radically simplifies page hierarchy and adheres to the Universal Frontend Design Constitution (zero pseudo-technical clutter, zero pill badges, clean typography, intentional affordances).

---

### 2. User Experience & Visual Design

#### A. Clean Standard User Experience (Sudo Mode: OFF)
- **Top Navigation (`Navbar.tsx`)**:
  - Retains essential links only: Brand wordmark, Profile, 4 Pillars Resources, Tom Bot, Store, Videos, Contact, and Dark mode toggle.
  - Strips out technical buttons: "Google Gems (3)", "SMS App (Text Tom)", and "Deploy bambiboy602.com".
- **Profile Section (`ProfileHeader.tsx`)**:
  - Displays Bambi's story, credential badges, and the 4 Pillar resource cards (Housing, Health, Work, Legal).
  - Hides the dense "Official Google Gemini Gems AI Architecture" card and developer links.
- **Tom Bot Card (`TomBotCard.tsx`)**:
  - Header displays Tom's avatar, mute/unmute, and hands-free voice toggle.
  - Strips out: Look & Sound customizer drawer toggle, SMS button, Google Gems button, NotebookLM external pill, and the `#1 Tom Core / #2 BAMBI / #3 Grower / #4 Master Vault` tab bar.
  - Chat feed displays clean, readable messages without raw Google search queries or URL tags.
  - Bottom footer features a discrete floating toggle switch: `sudo tom: OFF`.

#### B. Developer Cockpit Experience (Sudo Mode: ON)
- **Trigger**: Click the discrete floating toggle switch at the bottom of the chat, or send the message `sudo tom`.
- **Slide-Down Developer Inspector**:
  - Animates open smoothly beneath Tom's avatar.
  - **Engine Runtime**: Displays active model (`gemini-3.8-flash` with Grounding Search, `gemini-3.1-flash-lite` fallback, and local RSM engine), token parameters, and 7 core patches.
  - **4-Gem Unified Architecture**: Live selectors for Gem #1 (Tom Core), Gem #2 (B.A.M.B.I.), Gem #3 (The Grower), and Gem #4 (Master Vault in NotebookLM).
  - **Grounding Repositories**: Direct links to `Tom-Core-Sourcefile-Master.md`, the NotebookLM Master Vault, and the 89 verified Arizona community resources.
- **Chat Feed Telemetry**: Unlocks live web search source links and grounding query tags on assistant responses.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Global vs Local Sudo State**
  - *Chosen Approach*: Lift `isSudoMode` to `App.tsx` (persisted in `localStorage` under `bambi_sudo_mode`) and pass it down to `Navbar`, `ProfileHeader`, and `TomBotCard`.
  - *Why*: Ensures the entire site—navbar, profile cards, and chat card—synchronously honors the clean presentation.
- **Decision 2: Floating Switch Placement**
  - *Chosen Approach*: Docked cleanly at the bottom right/center footer beneath the chat input bar in `TomBotCard.tsx`.
  - *Why*: Exactly matches the user's confirmed choice ("Floating discrete switch at bottom of chat"), keeping it immediately accessible without intruding on the conversation.
- **Decision 3: Seamless Conversational Override**
  - *Chosen Approach*: Submitting `sudo tom` in the chat input automatically flips `isSudoMode` to `true` and opens the inspector panel.
  - *Why*: Provides natural command-line/chat ergonomics for power users.

---

### 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│  State: isSudoMode (persisted in localStorage 'bambi_sudo_mode')       │
│  Handler: toggleSudoMode()                                             │
└──────┬───────────────────────────────┬──────────────────────────┬──────┘
       │                               │                          │
       ▼                               ▼                          ▼
┌──────────────┐             ┌────────────────────┐     ┌─────────────────┐
│  Navbar.tsx  │             │ ProfileHeader.tsx  │     │ TomBotCard.tsx  │
│              │             │                    │     │                 │
│ If Sudo OFF: │             │ If Sudo OFF:       │     │ If Sudo OFF:    │
│ - Clean nav  │             │ - Hide Gems Card   │     │ - Clean curb UI │
│ - No dev     │             │ - Story & 4 Pillars│     │ - No gem tabs   │
│   modals     │             │                    │     │ - No search tags│
│              │             │ If Sudo ON:        │     │                 │
│ If Sudo ON:  │             │ - Reveal 4-Gem     │     │ If Sudo ON:     │
│ - Show Gems  │             │   Architecture     │     │ - Slide-down    │
│   & SMS apps │             │   diagnostic card  │     │   Inspector     │
│              │             │                    │     │ - Gem switchers │
└──────────────┘             └────────────────────┘     │ - Grounding tags│
                                                        │ - Voice config  │
                                                        └────────┬────────┘
                                                                 │
                                                        ┌────────▼────────┐
                                                        │ Bottom Footer:  │
                                                        │ Floating Switch │
                                                        │ [sudo tom: OFF] │
                                                        └─────────────────┘
```

#### Detailed Execution Plan:
1. **`src/App.tsx`**:
   - Add `isSudoMode` state with `localStorage` persistence.
   - Pass `isSudoMode` and `setIsSudoMode` to `Navbar`, `ProfileHeader`, and `TomBotCard`.
2. **`src/components/TomBotCard.tsx`**:
   - Add the floating discrete toggle switch at the bottom of the chat.
   - Build the collapsible slide-down Developer Inspector panel (`framer-motion`) containing:
     - Engine runtime status (`gemini-3.8-flash`, `gemini-3.1-flash-lite`, standalone RSM).
     - 4-Gem architecture selectors and direct links.
     - Grounding sources (`Tom-Core-Sourcefile-Master.md`, NotebookLM Vault, 89 Community Resources).
   - Gate the top Look/Sound customizer, SMS button, Google Gems button, NotebookLM pill, and Gem tab bar behind `{isSudoMode && ...}`.
   - Gate message search queries and source links behind `{isSudoMode && ...}`.
   - Detect `sudo tom` in user messages to automatically activate sudo mode.
3. **`src/components/Navbar.tsx` & `src/components/ProfileHeader.tsx`**:
   - Conditionally render Google Gems, SMS App, and GitHub Deploy triggers based on `isSudoMode`.
   - Conditionally render the 4-Gem Architecture Card in `ProfileHeader.tsx`.
4. **Verification**:
   - Verify that default page view is completely clean of technical selectors and dev buttons.
   - Toggle `sudo tom` switch (and type `sudo tom`) to verify smooth reveal of developer inspector, gem selectors, and grounding data.
   - Run `compile_applet` and `lint_applet` to confirm zero errors.
