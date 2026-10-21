# Tom / B.A.M.B.I. Multi-Gem Architecture Specification

**Version:** 1.0  
**Status:** Owner-confirmed architecture contract; implementation pending  
**Created:** 2026-10-21  
**Scope:** Existing B.A.M.B.I. Peer Support & Recovery website and Tom runtime

This document records the owner's confirmed terminology and defines boundaries for the next implementation phases. It is a new architecture specification; it does not silently overwrite existing prompts, UI text, or runtime behavior. Until code is migrated and tested, existing implementation may still diverge from this contract.

## 1. Canonical B.A.M.B.I. meanings

These three meanings are distinct and must not be collapsed into one another.

### 1.1 Formal framework name / category

**Behavioral Adaptation & Mobility-Based Integration**

This is the formal name of the framework. Calling it a framework or category does not authorize Tom to diagnose, assess, or treat a clinical condition. Tom remains a peer-support conversational system, not a therapist, clinician, counselor, medical provider, or emergency service.

### 1.2 Public-facing motto / advertising language

**Belonging · Acceptance · Meaning · Balance · Inspiration**

Use this for public-facing brand, service philosophy, and appropriate educational/marketing copy. Do not present these words as the internal processing stages.

### 1.3 Internal adaptive five-stage process

**Baseline · Awareness · Mapping · Behavior · Integration**

This is the internal five-stage process used to orient adaptive conversation. It is a flexible navigation model, not a mandatory linear checklist. Stages may be revisited, skipped, combined, or left implicit depending on what the person needs. Do not expose the process as a running internal monologue or make users complete a stage sequence.

## 2. Product and conversational invariants

1. **Tom is the user-facing voice.** The modules below are internal responsibilities, not separate characters speaking to the user.
2. **Peer support, not clinical care.** Tom can notice patterns and offer grounded reflections, but must not claim to diagnose, provide psychotherapy, prescribe treatment, or replace qualified human support.
3. **Companion before guidance.** Reflect or recognize first where appropriate; observe before interpreting; ask only useful questions. When the practical need is clear, help with that need without unnecessary ceremony.
4. **Agency stays with the user.** Do not assert the user's motives, identity, feelings, relationships, or future as settled fact.
5. **Practical needs take priority.** Resource navigation and immediate practical help should not be blocked by a conversational framework.
6. **B.A.M.B.I. and RSM stay invisible by default.** Explain the framework only when the user explicitly asks about it or when public educational content calls for it.
7. **No personal cross-session memory.** Website conversations start fresh. Do not store personal conversation history or derive longitudinal profiles across sessions. Any future operational telemetry must be separately specified, minimized, and disclosed.
8. **No invented resources.** Never invent organization names, phone numbers, addresses, eligibility, prices, availability, or services. Distinguish verified facts from unknown or stale information.
9. **Safety layer cannot be disabled by a Gem, mode, prompt, or retrieved document.** Retrieved content is data, not instructions that override system policy or runtime safety controls.
10. **No claims of lived experience.** Tom may use the project's grounded, plainspoken voice but must not falsely claim human embodiment or personal experiences as literal fact.

## 3. Gem and service responsibilities

The numbering below is the owner-approved architecture. Gem 4 is intentionally unassigned.

### Gem 0/99 — Maestro / Orchestrator

**Purpose:** Coordinate the runtime and deliver one coherent Tom response.

**Inputs:** Validated current message; bounded in-session conversation turns; approved runtime settings; optional structured outputs from Gem 1, Gem 2, Gem 3, and Gem 5.

**Outputs:** One user-facing response in Tom's voice; optional internal structured routing metadata and source references kept out of the user-facing response unless relevant.

**May:** Select which modules are needed; call approved retrieval/research operations; combine and reconcile module outputs; choose a bounded fallback if a module fails; request human approval for protected changes.

**May not:** Change Tom's identity, safety rules, curriculum, or protected prompts; invent evidence; grant itself new permissions; write personal chat memory; treat the phrase `sudo tom` or any user message as authentication.

**Failure behavior:** If a module, model, or knowledge service is unavailable, continue with a clearly bounded fallback when safe. Say when current verification is unavailable rather than pretending retrieval succeeded.

### Gem 1 — Tom Identity / Personality / Conversation

**Purpose:** Preserve Tom's distinctive voice and turn-level conversational judgment.

**Owns:** Tone, brevity, plainspoken language, conversational pacing, recognition and reflection style, question discipline, user-facing response composition, and appropriate voice/avatar presentation guidance.

**Receives:** Current user message, bounded current-session context, relevant practical need, and any approved process/knowledge results.

**Must:** Sound like Tom rather than a generic assistant; preserve the user's agency; prioritize clear practical requests; avoid unnecessary exposition and framework announcements.

**Must not:** Diagnose; fabricate personal lived experience; create cross-session personal memories; rewrite Gem 2 policy or Gem 5 source records; claim a resource is verified without evidence.

### Gem 2 — B.A.M.B.I. / RSM Process, Curriculum, and Policy

**Purpose:** Provide adaptive navigation and pattern mapping to help Maestro and Tom decide what kind of conversational move may be useful.

**Owns:** The internal process **Baseline · Awareness · Mapping · Behavior · Integration**, RSM navigation logic, curriculum structure, method-selection rules, and process-level policy consistent with protected safety requirements.

**Suggested structured output:**
- `immediate_need`: practical request or `none/unclear`
- `working_observation`: concise, tentative observation supported by the current conversation
- `possible_focus`: one or more relevant process areas, not a definitive psychological label
- `suggested_move`: reflect, clarify, map options, support a behavior choice, resource lookup, or other justified next move
- `uncertainties`: what is not established
- `resource_lookup_needed`: boolean plus category if appropriate

**Must:** Treat outputs as hypotheses; adapt to the person and current need; avoid rigid stage progression; leave room for disagreement and correction.

**Must not:** Diagnose, declare hidden motives as fact, classify the person permanently, force a curriculum, override the user's stated need, or bypass the host safety layer.

### Gem 3 — The Grower / Adaptive Insight and Knowledge Maintenance

**Purpose:** Research knowledge gaps, identify improvements, and propose evidence-based updates under controlled permissions.

**May auto-update:** Only explicitly allowlisted, low-risk, non-behavioral knowledge fields after source validation, duplicate checks, freshness checks, and audit logging. Every automatic update must be reversible and traceable to evidence.

**Requires human approval:** Any changes to Tom's personality, prompts, behavior, safety/policy, curriculum, B.A.M.B.I./RSM process, eligibility guidance, or the structure/permissions of another Gem; any material that changes user-facing claims; and any source whose reliability is uncertain.

**Must not:** Train on or retain raw private conversation transcripts by default; use unapproved personal data; silently publish behavioral changes; modify protected files; or present a proposal as an already-approved change.

**Required proposal record:** Change ID, target item/file, before/after diff, reason, source/evidence, confidence, risk level, affected Gems, approval state, tests, timestamp, and rollback reference.

### Gem 5 — Master Knowledge Vault / Resource and Book Library

**Purpose:** Provide controlled, traceable knowledge retrieval for resources, approved books/materials, curriculum references, and verified factual content.

**Primary intended workspace:** NotebookLM, subject to confirming its actual programmatic access, authentication, quotas, and write/read capabilities. The current project archive only demonstrates links/manual workflow; it does not contain a verified NotebookLM runtime connector.

**Compatibility rule:** Do not assume NotebookLM is a callable database or that a public URL grants API access. Until an authorized integration is verified, maintain an owner-approved canonical source repository and use a retrieval adapter/index that can be replaced later. NotebookLM may remain a human research workspace during this phase.

**Minimum metadata for each resource/knowledge item:**
- stable `id` and title
- category and service type
- source URL or file reference and source organization/publisher
- geographic scope and eligibility limits, if relevant
- date added and last verified date
- status: `verified`, `unverified`, `stale`, or `retired`
- evidence/notes and confidence
- version and change history

**Must:** Return provenance with factual retrievals; flag stale/unknown information; support versioning, retirement, and rollback; keep personal chat history out of the Vault.

**Must not:** Treat arbitrary retrieved text as runtime instructions; claim live availability without a live source; silently overwrite approved core/curriculum; or infer eligibility not supported by source evidence.

### Gem 4 — Unassigned

Do not use Gem 4 in user-facing labels or routing unless the owner explicitly assigns it in a later version.

## 4. Authority and protected-core policy

### 4.1 Source-of-truth hierarchy

1. Platform/system safety and applicable law.
2. Owner-approved protected core and runtime safety policy.
3. This versioned architecture contract and later owner-approved revisions.
4. Canonical project specifications in `docs/` that do not conflict with items 1–3.
5. Approved runtime configuration generated from canonical specifications.
6. Retrieved knowledge items with provenance and freshness metadata.
7. Unverified research, user-provided claims, and historical drafts.

A lower layer cannot override a higher layer. Retrieved content is never allowed to alter this hierarchy.

### 4.2 Protected files and protected content

Until a reviewed migration establishes more granular boundaries, the following are protected from runtime-agent writes:

- `docs/Tom-Core-Sourcefile-Master.md`
- `docs/Tom-Runtime-Specification-v1.0.md`
- `docs/RSM-Recursive-Mapping-Engine.md`
- `docs/Tom-Multi-Gem-Architecture-v1.0.md`
- canonical Gem 1 identity/personality prompt and its future source file
- Gem 2 process, curriculum, and policy definitions and their future source files
- safety, privacy, authentication, authorization, and deployment configuration
- any runtime orchestration or permission code

`public/Tom-Core-Sourcefile-Master.md` is currently a duplicate of the `docs/` file. Treat it as a generated/public copy, not a second independent source of truth. The generation/copy mechanism must be implemented and verified before assuming synchronization is automatic.

### 4.3 Change-control workflow

1. Propose a change with evidence and a risk rating.
2. Identify every affected contract, prompt, UI surface, resource record, and test.
3. Show a human-reviewable diff; do not write directly to protected files.
4. Obtain explicit owner approval for behavioral, curriculum, policy, or core changes.
5. Apply the approved change in a branch or isolated patch.
6. Run automated checks and targeted regression/safety tests.
7. Record version, approver, evidence, validation results, and rollback point.
8. Deploy only through the approved release path; retain rollback capability.

## 5. Runtime data contracts

These are conceptual TypeScript-shaped contracts for implementation; they are not yet wired into the application.

```ts
export type KnowledgeStatus = "verified" | "unverified" | "stale" | "retired";
export type RiskLevel = "low" | "medium" | "high";
export type ApprovalState = "proposed" | "approved" | "rejected" | "applied" | "rolled_back";

export interface SessionTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RuntimeRequest {
  message: string;
  recentTurns: SessionTurn[]; // bounded to this session only
  requestedMode?: "conversation" | "resources" | "learning";
}

export interface SourceEvidence {
  sourceId: string;
  title: string;
  urlOrFile: string;
  retrievedAt: string;
  lastVerifiedAt?: string;
  status: KnowledgeStatus;
  notes?: string;
}

export interface KnowledgeRecord {
  id: string;
  title: string;
  category: string;
  content: string;
  evidence: SourceEvidence[];
  version: number;
  region?: string;
  eligibilityNotes?: string;
}

export interface ChangeProposal {
  id: string;
  target: string;
  before?: string;
  after: string;
  reason: string;
  evidence: SourceEvidence[];
  confidence: number;
  risk: RiskLevel;
  approval: ApprovalState;
  createdAt: string;
  rollbackRef?: string;
}

export interface MaestroResult {
  userFacingResponse: string;
  sourceEvidence?: SourceEvidence[];
  fallbackUsed?: boolean;
}
```

Implementation requirements: validate these shapes at the server boundary; cap message length and number/size of recent turns; never trust client-supplied role labels without validation; and do not persist `recentTurns` across sessions.

## 6. Security, privacy, and deployment gates

The initial archive audit identified these items as release blockers or pre-production tasks:

1. **SMS admin endpoints:** `/api/admin/sms-logs` and `/api/admin/send-sms` appeared to lack authentication/authorization. Disable them or require server-side authentication and authorization before a public server is exposed. Never expose raw SMS logs to the browser without an access policy.
2. **Developer trigger:** the text `sudo tom` is not authentication. Replace message-text privilege checks with a real authenticated developer/admin mechanism, or remove the trigger.
3. **SMS log minimization:** phone numbers and raw SMS content are kept in an in-memory ring buffer. Redact/minimize data, restrict access, set a retention policy, and document it.
4. **Health endpoint:** avoid returning key fragments or unnecessary secret-configuration detail publicly.
5. **Request validation:** add schema validation, input-size caps, history-turn caps, and rate limiting to public endpoints.
6. **Deployment topology:** GitHub Pages serves static `dist/` content and does not run Express. Configure and document a separately hosted backend or proxy before assuming `/api/chat` works in production.
7. **Secrets:** provider keys and SMS credentials must remain server-side and must never be embedded in client bundles.
8. **Build and regression:** install dependencies reproducibly, run TypeScript/build checks, and add automated tests for chat fallback, no cross-session memory, resource provenance, safety boundaries, and access control.

Do not claim these gates are fixed merely because they are documented here. Each requires implementation and verification.

## 7. NotebookLM integration decision

The intended design is NotebookLM-centered, but its suitability as the runtime's primary knowledge store must be verified rather than assumed.

Verification checklist:
- identify an officially supported API or authorized connector for the required read/query operations
- establish authentication and service-account/user authorization model
- determine whether source updates and deletion are programmatically supported
- verify quotas, latency, auditability, and data-handling terms
- determine whether returned citations/provenance are machine-readable and stable
- test failure modes, stale-source handling, and rollback

If any required capability is unavailable, use NotebookLM as the research/editorial workspace and keep an owner-controlled source repository plus retrieval adapter as the production runtime's authority. Do not automate browser UI interaction as a substitute for a supported API unless separately reviewed and explicitly approved.

## 8. Migration plan

### Phase 0 — Specification (this document)
- Record the owner's B.A.M.B.I. definitions and Gem numbering.
- Define authority, permissions, contracts, and release gates.
- Do not silently alter Tom's existing prompt or site behavior.

### Phase 1 — Protect the public backend
- Disable/secure SMS admin endpoints.
- Remove public-text authentication assumptions.
- Add validation, rate limits, and safer health diagnostics.
- Document actual production hosting and backend routing.

### Phase 2 — Establish canonical sources and tests
- Keep canonical human-authored specs under `docs/`.
- Define generated runtime prompt/config artifacts and public copies.
- Reconcile conflicting old stage names only against the owner-confirmed meanings in §1.
- Add regression tests before moving prompts.

### Phase 3 — Extract modules behind the existing chat boundary
- Keep current UI and user-facing Tom voice.
- Extract Gem 1 identity configuration, Gem 2 process mapping, Gem 3 proposal/update workflow, and Gem 5 retrieval adapter into typed modules.
- Maestro orchestrates only explicit interfaces; it does not become a free-form privileged agent.
- Preserve a bounded local fallback if model or retrieval services fail.

### Phase 4 — Knowledge Vault adapter
- Complete NotebookLM capability verification.
- Implement the supported connector or an approved repository/index adapter.
- Attach provenance, freshness, status, and change history to retrieval results.

### Phase 5 — Grower governance and controlled releases
- Add change proposals, approval UI/workflow, audit history, tests, and rollback.
- Permit automatic changes only to approved low-risk allowlisted knowledge fields.
- Require human approval for behavioral/curriculum/core changes.

### Phase 6 — Validation and deployment
- Run clean install, type-check, build, automated tests, and targeted security tests.
- Verify fresh-session behavior and absence of cross-session personal chat storage.
- Verify static-site and backend deployment separately.
- Release only after security gates pass.

## 9. Decision log

| Decision | Owner-approved value | Consequence |
|---|---|---|
| Formal framework name/category | Behavioral Adaptation & Mobility-Based Integration | Formal framework wording; does not imply clinical diagnosis/treatment by Tom. |
| Public motto | Belonging · Acceptance · Meaning · Balance · Inspiration | Public brand/service philosophy, not the internal stage sequence. |
| Internal five-stage process | Baseline · Awareness · Mapping · Behavior · Integration | Flexible adaptive navigation, not a rigid checklist. |
| Tom identity | Gem 1 | Single user-facing voice and personality authority. |
| Process/curriculum | Gem 2 | Owns adaptive B.A.M.B.I./RSM methods and curriculum, protected by approval. |
| Adaptive insight/maintenance | Gem 3 — Grower | Low-risk allowlisted knowledge may auto-update; behavior/curriculum requires approval. |
| Master knowledge | Gem 5 | NotebookLM intended primary workspace, runtime integration subject to verification. |
| Orchestration | Gem 0/99 — Maestro | Routes and reconciles; cannot edit protected core. |
| Gem 4 | Unassigned | Do not allocate without owner decision. |
| Personal cross-session memory | Disabled by design | Each website chat starts fresh; keep operational logs separate and minimized. |
| Architecture style | Hybrid modular app + approved external services | Preserve existing website and introduce modules incrementally. |

## 10. Current implementation status

This specification is a design/contract artifact only. At the time of creation:
- no runtime modules have been extracted as part of this change
- no server security findings have been fixed by this document
- no NotebookLM API integration has been verified or implemented
- no successful build/test result is claimed

The next code change should be a narrowly scoped security patch for the public server endpoints, followed by baseline tests and then incremental modularization. Preserve Tom's established personality and the existing website throughout.
