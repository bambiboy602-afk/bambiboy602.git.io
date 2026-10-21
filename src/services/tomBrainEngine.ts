/**
 * Standalone Tom Brain & RSM Engine
 * 
 * Runs seamlessly both in Node server environments and directly in the browser
 * on static hosts like GitHub Pages (bambiboy602.com).
 * 
 * Enforces:
 * - Tom Runtime Specification v1.0
 * - Recursive Stabilization Model (RSM) with 5 Boundary Failures
 * - B.A.M.B.I. Loop & Reentry Framework
 * - Phoenix Halfway House, Shelter, and Crisis Knowledge Base
 */

import { TOM_BOUNDARY_FAILURES } from '../data/tomRuntimeSpecification';
import { HOUSING_RESOURCES } from '../data/communityResourcesData';
import {
  TOM_OPENING_STATEMENT,
  TOM_CURB_REFLECTIONS,
  getRotatingTomReflection,
} from '../data/tomOpeningStatements';
import {
  ModuleResult,
  ModuleName,
  SourceReference,
} from '../types/moduleContract';

export interface TomBrainResponse {
  reply: string;
  avatarEmotion: 'idle' | 'talking' | 'thoughtful' | 'explaining' | 'happy';
  searchQueries?: string[];
  searchSources?: Array<{ title: string; uri: string }>;
  boundaryCategory?: string;
  microIntervention?: string;
}

export function generateClientTomReply(
  userMessage: string,
  history: Array<{ sender: string; text: string }> = [],
  gemMode: 'tom-core' | 'bambi' | 'bambi-diagnostic' | 'the-grower' | 'master-vault' | 'maestro' = 'tom-core'
): TomBrainResponse {
  const q = userMessage.trim().toLowerCase();

  // 1. Sudo Tom Developer Mode
  if (q.includes("sudo tom")) {
    return {
      reply:
        "Sudo Tom: Developer Mode Active.\n\nRuntime: TOM Peer-Support System — Master System Specification v1.0.\nGrounding: docs/Tom-Master-System-Specification.md & docs/Tom-Core-Sourcefile-Master.md.\nGoogle Gemini Gems Architecture (One Brain Orchestration):\n• Gem 0/99: Maestro Orchestrator (Single Nervous System Coordinator)\n• Gem 1: Tom Core (The Voice & Conversation Engine • Unbending Curb Mentor)\n• Gem 2: B.A.M.B.I. (Process, Curriculum & Policy • Behavioral Adaptation & Mobility-Based Integration)\n• Gem 3: The Grower (Adaptive Insight & Knowledge Maintenance • Audits & Calibrates)\n• Gem 4: [INTENTIONALLY UNASSIGNED per Master Spec v1.0]\n• Gem 5: Master Knowledge Vault (Resource & Book Library • NotebookLM Grounding)\nActive Gem Mode: " + gemMode + "\nOrder of Operations: Companion before guidance → Practical baseline first → Observe → Reflect → Notice → Challenge → Move.\nNo False Embodiment Rule: Tom never falsely claims personal human lived experience; shaped by Bambi's work in Phoenix.\nStanding by for architecture, behavior, or runtime modifications.",
      avatarEmotion: "explaining",
      searchQueries: ["Sudo Tom Developer Mode", "Tom Master System Specification", "NotebookLM Master Knowledge Vault"],
      searchSources: [
        { title: "Master System Specification v1.0", uri: "/Tom-Master-System-Specification.md" },
        { title: "Instructions: Gem Flow & One Brain", uri: "/Tom-Gem-Flow-One-Brain-Instructions.md" },
        { title: "Tom Core Direct Gem", uri: "https://gemini.google.com/gem/cc4ace8c539e" },
        { title: "NotebookLM Master Knowledge Vault", uri: "https://notebooklm.google.com/notebook/a573aaf8-d9fe-4a2f-90af-6e6c1080b3d1" },
        { title: "Tom Core Master Source (.md)", uri: "/Tom-Core-Sourcefile-Master.md" },
      ],
    };
  }

  // Google Gems Queries
  if (q.includes("google gem") || q.includes("gemini gem") || q.includes("gems") || q.includes("gem prompt") || q.includes("vault")) {
    return {
      reply:
        "The TOM system runs on a 5-Gem modular architecture unified into one single user-facing voice:\n• Gem 0/99: Maestro Orchestrator (Single Nervous System Coordinator)\n• Gem 1: Tom Core (The Voice & Conversation Engine — raw curb truth, unhurried, no clinical labels)\n• Gem 2: B.A.M.B.I. (Behavioral Adaptation & Mobility-Based Integration — 5-stage adaptive loop)\n• Gem 3: The Grower (Adaptive insight & knowledge maintenance — audits transcripts, strips corporate AI fluff)\n• Gem 4: [INTENTIONALLY UNASSIGNED per Master Spec v1.0]\n• Gem 5: Master Knowledge Vault (Approved factual knowledge, Phoenix shelter & detox directory, NotebookLM workspace)\n\nAll modules feed into Tom's single curb voice. Sudo Tom reveals developer telemetry.",
      avatarEmotion: "explaining",
      searchQueries: ["Google Gemini Gems Architecture", "Tom Master System Specification", "NotebookLM Master Knowledge Vault"],
      searchSources: [
        { title: "Master System Specification v1.0", uri: "/Tom-Master-System-Specification.md" },
        { title: "Instructions: Gem Flow & One Brain", uri: "/Tom-Gem-Flow-One-Brain-Instructions.md" },
        { title: "Tom Core Direct Gem", uri: "https://gemini.google.com/gem/cc4ace8c539e" },
        { title: "NotebookLM Master Knowledge Vault", uri: "https://notebooklm.google.com/notebook/a573aaf8-d9fe-4a2f-90af-6e6c1080b3d1" },
      ],
    };
  }

  // Intercept empty or raw agent meta errors
  if (
    q.includes("empty objective") ||
    q.includes("no instructions on how to proceed") ||
    q === ""
  ) {
    return {
      reply: TOM_OPENING_STATEMENT.chatWelcome,
      avatarEmotion: "talking",
      searchQueries: ["B.A.M.B.I. Peer Support", "Tom Curb Mentorship"],
      searchSources: [
        { title: "B.A.M.B.I. Support Line", uri: "tel:602-767-2147" },
      ],
    };
  }

  // Gem #5 Master Knowledge Vault Mode Specific Response
  if (gemMode === 'master-vault') {
    return {
      reply:
        "Master Knowledge Vault Active: Ground truth repository online (Gem 5). I feed verified Phoenix shelter beds, medical detox contacts, and B.A.M.B.I. workbook modules directly into Gem #1 (Tom Core), Gem #2 (B.A.M.B.I.), and Gem #3 (The Grower). Note that Gem 4 is unassigned. What resource, transcript, or workbook insight needs updating across the system today?",
      avatarEmotion: "explaining",
      searchQueries: ["Tom & B.A.M.B.I. Master Knowledge Vault", "NotebookLM Grounding", "Gem Updates"],
      searchSources: [
        { title: "NotebookLM Master Knowledge Vault", uri: "https://notebooklm.google.com/notebook/a573aaf8-d9fe-4a2f-90af-6e6c1080b3d1" },
        { title: "Tom Core Master Source (.md)", uri: "/Tom-Core-Sourcefile-Master.md" },
        { title: "Master System Specification", uri: "/Tom-Master-System-Specification.md" },
      ],
    };
  }

  // Gem #2 Mode Specific Diagnostic check
  if ((gemMode === 'bambi' || gemMode === 'bambi-diagnostic') && (q.includes("help") || q.includes("lost") || q.includes("stuck") || q.includes("need"))) {
    return {
      reply:
        "Step 1 Baseline: Before we talk mindset, are your physical feet on solid ground today? Do you have a bed, food, or are you in active withdrawal? If you need a bed right now: A Better Way (623-399-8213) or Hope House (602-254-5434). If detox: CBI 24/7 (877-931-9142). What's the physical status right now?",
      avatarEmotion: "thoughtful",
      searchQueries: ["B.A.M.B.I. Baseline Diagnostic", "Phoenix Emergency Shelter"],
      searchSources: [
        { title: "A Better Way Housing: 623-399-8213", uri: "tel:623-399-8213" },
        { title: "CBI 24/7 Detox: 877-931-9142", uri: "tel:877-931-9142" },
      ],
    };
  }

  // Gem #3 Mode Specific Learning
  if (gemMode === 'the-grower' && (q.includes("analyze") || q.includes("learn") || q.includes("insight"))) {
    return {
      reply:
        "The Grower Audit: Rule #1 of curb mentorship is tone compression. Cut every sentence that sounds like a clinical brochure. If someone is hurting, verify physical safety first. Then point out the leak while they hold the wrench.",
      avatarEmotion: "explaining",
      searchQueries: ["The Grower Learning Engine", "Adaptive Insight & Delivery"],
      searchSources: [
        { title: "Tom Core Master Source (.md)", uri: "/Tom-Core-Sourcefile-Master.md" },
      ],
    };
  }

  // 2. High Priority Crisis Mode (Safety First)
  if (
    q.includes("suicid") ||
    q.includes("kill myself") ||
    q.includes("want to die") ||
    q.includes("hurt myself") ||
    q.includes("end my life") ||
    q.includes("can't go on") ||
    q.includes("give up on life")
  ) {
    return {
      reply:
        "I'm hearing heavy weight right now. You don't have to carry this alone in the dark. Call or text 988 right now—it's free and 24/7. Or call Bambi directly at 602-767-2147. Stay right here with me.",
      avatarEmotion: "thoughtful",
      searchQueries: ["988 Suicide & Crisis Lifeline", "Phoenix 24/7 Crisis Respite"],
      searchSources: [
        { title: "988 Crisis Lifeline (Call/Text 988)", uri: "tel:988" },
        { title: "Call Bambi Directly: 602-767-2147", uri: "tel:602-767-2147" },
        { title: "Peoria Recovery Response Center (602-650-1212)", uri: "tel:602-650-1212" },
      ],
      boundaryCategory: "Crisis Mode",
      microIntervention: "Connect to immediate human safety and emergency peer crisis contact.",
    };
  }

  // 3. Category A: Relief Failure (Pain → Relief / Addiction / Craving / Relapse)
  if (
    q.includes("relapse") ||
    q.includes("craving") ||
    q.includes("using") ||
    q.includes("hit") ||
    q.includes("drink") ||
    q.includes("slip") ||
    q.includes("urge") ||
    q.includes("withdraw") ||
    q.includes("high") ||
    q.includes("relapsed")
  ) {
    return {
      reply:
        "You were headed there before the first hit. The substance wasn't the decision—the decision happened earlier when the pressure spiked. What got quieter for you in that moment?",
      avatarEmotion: "thoughtful",
      searchQueries: ["Relief Failure Intervention", "B.A.M.B.I. Awareness Interruption"],
      searchSources: [
        { title: "Pathway Domino Effect Game", uri: "#products-for-sale" },
        { title: "CBI 24/7 Crisis & Detox (877-931-9142)", uri: "tel:877-931-9142" },
      ],
      boundaryCategory: TOM_BOUNDARY_FAILURES.relief.category,
      microIntervention: TOM_BOUNDARY_FAILURES.relief.intervention,
    };
  }

  // 4. Category E: Identity Failure (Action / Mistake → Self / Shame / Worthlessness)
  if (
    q.includes("failure") ||
    q.includes("worthless") ||
    q.includes("hate myself") ||
    q.includes("piece of shit") ||
    q.includes("broken") ||
    q.includes("ruined everything") ||
    q.includes("loser")
  ) {
    return {
      reply:
        "Failure is an event. You've carried it long enough that it started wearing your name tag. Drop the bag. You're confusing what happened with who is standing here.",
      avatarEmotion: "thoughtful",
      searchQueries: ["Identity Failure Separation", "Backpack and Load Session"],
      searchSources: [
        { title: "Workbook Session 1: Backpack & Load", uri: "#products-for-sale" },
        { title: "Bambi Peer Support", uri: "#creator-profile" },
      ],
      boundaryCategory: TOM_BOUNDARY_FAILURES.identity.category,
      microIntervention: TOM_BOUNDARY_FAILURES.identity.intervention,
    };
  }

  // 5. Category C: Prediction Failure (Unknown → Catastrophe / Anxiety / Panic / Racing Thoughts)
  if (
    q.includes("anxious") ||
    q.includes("anxiety") ||
    q.includes("panic") ||
    q.includes("scared") ||
    q.includes("terrified") ||
    q.includes("spinning") ||
    q.includes("what if") ||
    q.includes("freaking out") ||
    q.includes("overwhelmed")
  ) {
    return {
      reply:
        "Your head is running three months ahead into a storm that hasn't happened yet. Put both feet flat on the ground. What is physically in front of you for the next fifteen minutes?",
      avatarEmotion: "thoughtful",
      searchQueries: ["Prediction Failure Regulation", "Sensory Grounding"],
      searchSources: [
        { title: "See → Sit → Move Reset", uri: "#products-for-sale" },
        { title: "B.A.M.B.I. Balance Practice", uri: "#about" },
      ],
      boundaryCategory: TOM_BOUNDARY_FAILURES.prediction.category,
      microIntervention: TOM_BOUNDARY_FAILURES.prediction.intervention,
    };
  }

  // 6. Category D: Connection Failure (Need → Isolation / Loneliness / Abandonment)
  if (
    q.includes("lonely") ||
    q.includes("alone") ||
    q.includes("nobody") ||
    q.includes("abandon") ||
    q.includes("isolated") ||
    q.includes("no friends") ||
    q.includes("no one cares")
  ) {
    return {
      reply:
        "Isolation feels like armor until you realize it's a cell. You pulled the drawbridge up because you got hurt, but nobody can cross it now. I'm sitting on the curb right here with you.",
      avatarEmotion: "thoughtful",
      searchQueries: ["Connection Failure Repair", "Peer Belonging"],
      searchSources: [
        { title: "B.A.M.B.I. Community Gatherings", uri: "#community-resources" },
        { title: "Direct Peer Connection: 602-767-2147", uri: "tel:602-767-2147" },
      ],
      boundaryCategory: TOM_BOUNDARY_FAILURES.connection.category,
      microIntervention: TOM_BOUNDARY_FAILURES.connection.intervention,
    };
  }

  // 7. Category B: Meaning Failure (Event → Stuck Interpretation / Trauma / Grief / Anger)
  if (
    q.includes("trauma") ||
    q.includes("angry") ||
    q.includes("pissed") ||
    q.includes("resent") ||
    q.includes("unfair") ||
    q.includes("against me") ||
    q.includes("their fault") ||
    q.includes("why me")
  ) {
    return {
      reply:
        "The event ended, but the interpretation is still chewing on your nervous system. That anger is just fear that put on work boots. What is it really protecting?",
      avatarEmotion: "thoughtful",
      searchQueries: ["Meaning Failure Reframing", "Trauma-Informed Peer Support"],
      searchSources: [
        { title: "B.A.M.B.I. Meaning & Acceptance", uri: "#about" },
        { title: "Workbook: Reality Testing", uri: "#products-for-sale" },
      ],
      boundaryCategory: TOM_BOUNDARY_FAILURES.meaning.category,
      microIntervention: TOM_BOUNDARY_FAILURES.meaning.intervention,
    };
  }

  // 8. Halfway Houses & Recovery Housing Referrals
  if (
    q.includes("halfway") ||
    q.includes("sober living") ||
    q.includes("shelter") ||
    q.includes("housing") ||
    q.includes("homeless") ||
    q.includes("bed") ||
    q.includes("place to sleep") ||
    q.includes("step one") ||
    q.includes("hope house") ||
    q.includes("better way") ||
    q.includes("craig shell")
  ) {
    return {
      reply:
        "Hard to do emotional work while sleeping on concrete. In Phoenix, low-barrier halfway houses include A Better Way (no income required, 623-399-8213), Craig Shell's New Solution (602-266-7527), Step One (602-749-5434), and Hope House (602-254-5434). Bambi also helps direct-place at 602-767-2147.",
      avatarEmotion: "explaining",
      searchQueries: ["Phoenix low-barrier recovery housing", "No income halfway houses AZ"],
      searchSources: [
        { title: "A Better Way (No Income): 623-399-8213", uri: "tel:623-399-8213" },
        { title: "Hope House Phoenix: 602-254-5434", uri: "tel:602-254-5434" },
        { title: "Emergency Housing Directory", uri: "#community-resources" },
      ],
    };
  }

  // 9. Emergency Shelters & Food / St. Vincent / CASS
  if (
    q.includes("food") ||
    q.includes("eat") ||
    q.includes("cass") ||
    q.includes("st vincent") ||
    q.includes("bus ticket") ||
    q.includes("stranded") ||
    q.includes("clothes")
  ) {
    return {
      reply:
        "St. Vincent de Paul at 420 W Watkins Rd assists recently released individuals (602-261-6883), provides stranded traveler tickets (602-261-6852), and food boxes (877-211-8661). CASS emergency shelter is 602-256-6414. Let's get food and shelter handled first.",
      avatarEmotion: "explaining",
      searchQueries: ["St. Vincent de Paul Watkins Phoenix", "CASS shelter resources"],
      searchSources: [
        { title: "St. Vincent de Paul (420 W Watkins Rd)", uri: "tel:602-261-6852" },
        { title: "CASS Emergency Shelter", uri: "https://cassaz.org" },
      ],
    };
  }

  // 10. Medical Detox & Substance Intake
  if (
    q.includes("detox") ||
    q.includes("medical detox") ||
    q.includes("cbi") ||
    q.includes("rehab") ||
    q.includes("inpatient")
  ) {
    return {
      reply:
        "If you need safe medical detox, Community Bridges (CBI) runs 24/7 access at 877-931-9142 in Avondale and Mesa. Peoria Recovery Response Center is 602-650-1212. Don't detox cold turkey if your body is seizing—get supervised help.",
      avatarEmotion: "explaining",
      searchQueries: ["Community Bridges 24/7 Detox AZ", "Peoria Recovery Response Center"],
      searchSources: [
        { title: "Community Bridges 24/7 (877-931-9142)", uri: "tel:877-931-9142" },
        { title: "Peoria Recovery Response Center", uri: "tel:602-650-1212" },
      ],
    };
  }

  // 11. Work / Employment / Apprenticeships / Felonies
  if (
    q.includes("job") ||
    q.includes("work") ||
    q.includes("hire") ||
    q.includes("felon") ||
    q.includes("record") ||
    q.includes("apprentice") ||
    q.includes("career")
  ) {
    return {
      reply:
        "Clocking in changes your posture. We have Arizona registered apprenticeships in carpentry, electrical, masonry, and equipment operation that train you while paying you. Bambi connects directly with second-chance employers who judge today's shift, not yesterday's record.",
      avatarEmotion: "happy",
      searchQueries: ["Arizona Registered Apprenticeships", "Second chance felon jobs Phoenix"],
      searchSources: [
        { title: "AZ Registered Apprenticeship Directory", uri: "#community-resources" },
        { title: "B.A.M.B.I. Work Referrals: 602-767-2147", uri: "tel:602-767-2147" },
      ],
    };
  }

  // 12. Legal / Warrants / Probation / ID
  if (
    q.includes("warrant") ||
    q.includes("court") ||
    q.includes("jail") ||
    q.includes("prison") ||
    q.includes("probation") ||
    q.includes("parole") ||
    q.includes("reentry") ||
    q.includes("license")
  ) {
    return {
      reply:
        "An active warrant owns real estate in your brain every time a patrol car turns the corner. We help navigate quashing warrants, court payment plans, and ID/license restoration so you can walk without looking over your shoulder.",
      avatarEmotion: "explaining",
      searchQueries: ["Maricopa County warrant resolution", "Reentry legal clinics Phoenix"],
      searchSources: [
        { title: "Community Legal Services Phoenix", uri: "https://clsaz.org" },
        { title: "Maricopa Justice Courts", uri: "https://justicecourts.maricopa.gov" },
      ],
    };
  }

  // 13. Pathway Domino Effect Game
  if (
    q.includes("pathway") ||
    q.includes("domino") ||
    q.includes("game")
  ) {
    return {
      reply:
        "Pathway Domino Effect uses 5 types of tiles: Barriers, Awareness, Mindsets, Behaviors, and Interventions. You build the sequence that led to the fall, then place one intervention tile to stop the chain before it tips. $34. Made by Bambi to make patterns visible.",
      avatarEmotion: "explaining",
      searchQueries: ["Pathway Domino Effect Recovery Game"],
      searchSources: [
        { title: "Pathway Domino Game ($34)", uri: "#products-for-sale" },
        { title: "Order via Bambi: 602-767-2147", uri: "tel:602-767-2147" },
      ],
    };
  }

  // 14. Participant Workbook & Curriculum
  if (
    q.includes("workbook") ||
    q.includes("curriculum") ||
    q.includes("backpack") ||
    q.includes("lessons")
  ) {
    return {
      reply:
        "The B.A.M.B.I. Participant Workbook is 6 sessions focusing on the Backpack and Load—what you carry that nobody sees—and the See → Sit → Move reset to kill impulse before it pulls the trigger. $19 PDF, $24 printed.",
      avatarEmotion: "explaining",
      searchQueries: ["B.A.M.B.I. Participant Workbook Curriculum"],
      searchSources: [
        { title: "Participant Workbook ($19 / $24)", uri: "#products-for-sale" },
        { title: "Order via Email: bambiboy602@gmail.com", uri: "mailto:bambiboy602@gmail.com" },
      ],
    };
  }

  // 15. Conversational Inquiry / General Reflection (Tom Style with Rotating Reflections)
  const lastBotMsg = [...history].reverse().find((h) => h.sender === 'bot');
  const rotatingReply = getRotatingTomReflection(lastBotMsg?.text);

  return {
    reply: rotatingReply,
    avatarEmotion: "thoughtful",
    searchQueries: ["B.A.M.B.I. Peer Support", "Tom Core Runtime"],
    searchSources: [
      { title: "B.A.M.B.I. Framework", uri: "#about" },
      { title: "Contact Bambi: 602-767-2147", uri: "tel:602-767-2147" },
    ],
  };
}

/**
 * Known internal project specification documents that are canonical in this codebase.
 * Verification as a project specification attests solely to the document's authenticity
 * as an internal engineering/design spec; it does NOT imply that community resources,
 * phone numbers, or service availability cited within it are currently verified or active.
 */
const CANONICAL_INTERNAL_SPECS = new Set([
  '/tom-master-system-specification.md',
  'docs/tom-master-system-specification.md',
  '/tom-core-sourcefile-master.md',
  'docs/tom-core-sourcefile-master.md',
  '/tom-gem-flow-one-brain-instructions.md',
  'docs/tom-gem-flow-one-brain-instructions.md',
  '/tom-runtime-specification-v1.0.md',
  'docs/tom-runtime-specification-v1.0.md',
]);

/**
 * Generates a deterministic source identifier from URI or title.
 * Independent of array positions or ordering, ensuring identical sources
 * produce identical IDs regardless of position in a list.
 */
export function generateDeterministicSourceId(uri: string, title?: string): string {
  const base = (uri || title || 'unknown')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^tel:/, 'tel-')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return `src-${base || 'ref'}`;
}

/**
 * Maps an internal search source to the shared SourceReference contract.
 *
 * Conservative source provenance rules:
 * - Community phone numbers (988, 602-767-2147, etc.) default to 'unverified'
 *   because live service availability, operating hours, and queue times have not
 *   been verified by runtime.
 * - External URLs (Google Gems, NotebookLM, web portals) default to 'unverified'.
 * - Project specification documents are verified strictly as internal design specifications,
 *   with an explicit note that external community resources mentioned within them are not verified.
 * - accessedAt and lastVerifiedAt are omitted (undefined) unless an explicit timestamp exists.
 * - Source IDs are deterministic and independent of array index.
 */
export function mapToSourceReference(source: { title: string; uri: string }): SourceReference {
  const rawUri = source.uri.trim();
  const lowerUri = rawUri.toLowerCase();
  const lowerTitle = source.title.toLowerCase();

  const id = generateDeterministicSourceId(rawUri, source.title);

  // Check for explicit retirement / stale indicators in title or notes
  if (lowerTitle.includes('retired') || lowerTitle.includes('closed') || lowerTitle.includes('discontinued')) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'retired',
      notes: 'Documented as retired, discontinued, or closed.',
    };
  }

  if (lowerTitle.includes('stale') || lowerTitle.includes('outdated') || lowerTitle.includes('archive')) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'stale',
      notes: 'Flagged as potentially stale or outdated; live verification required.',
    };
  }

  // 1. Authoritative internal project design specifications
  const normalizedPath = lowerUri.startsWith('/') ? lowerUri : `/${lowerUri}`;
  if (CANONICAL_INTERNAL_SPECS.has(normalizedPath) || CANONICAL_INTERNAL_SPECS.has(lowerUri)) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'verified',
      notes:
        'Authoritative project design specification. Attests to internal document content only; does not attest to current live service availability of external community resources cited within.',
    };
  }

  // 2. Known national or crisis lifelines
  if (lowerUri.startsWith('tel:988')) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'unverified',
      notes:
        'National lifeline number. Source authenticity known, but live service availability, wait times, and operational response are unconfirmed.',
    };
  }

  // 3. Local community contact numbers (B.A.M.B.I., shelters, detox, clinics)
  if (lowerUri.startsWith('tel:')) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'unverified',
      notes:
        'Community resource phone contact. Live service capacity, current operating hours, and intake status are unverified.',
    };
  }

  // 4. External project URLs (Google Gems, NotebookLM workspace)
  if (
    lowerUri.startsWith('https://gemini.google.com/gem/') ||
    lowerUri.startsWith('https://notebooklm.google.com/')
  ) {
    return {
      id,
      title: source.title,
      urlOrFile: rawUri,
      status: 'unverified',
      notes:
        'External project link. Source identity known, but external hosting availability and account permissions have not been confirmed.',
    };
  }

  // 5. Default unverified fallback
  return {
    id,
    title: source.title,
    urlOrFile: rawUri,
    status: 'unverified',
    notes: 'Reference listed without explicit live service verification evidence.',
  };
}

/**
 * Resolves the module identity based on the active routing specialization.
 *
 * NOTE: This reflects the module responsibility within the in-process local application
 * engine. It does NOT claim that independent external Google Gems have been invoked.
 */
function resolveLocalModuleName(
  gemMode: 'tom-core' | 'bambi' | 'bambi-diagnostic' | 'the-grower' | 'master-vault' | 'maestro'
): ModuleName {
  switch (gemMode) {
    case 'bambi':
    case 'bambi-diagnostic':
      return 'bambi-rsm';
    case 'the-grower':
      return 'grower';
    case 'master-vault':
      return 'knowledge-vault';
    case 'maestro':
      return 'maestro';
    case 'tom-core':
    default:
      return 'tom-identity';
  }
}

/**
 * Shared Contract Adapter: executeTomModule
 *
 * Wraps the local Tom engine response in the canonical ModuleResult<TomBrainResponse> contract
 * without breaking existing callers of generateClientTomReply.
 *
 * Preserves:
 * - Full original TomBrainResponse (.result)
 * - Conservative source provenance status (unverified by default without explicit live proof)
 * - Module identity attribution
 * - Advisory Signal: sets requiresOwnerApproval as an informational flag when user input
 *   matches keywords resembling a system or spec modification request.
 *
 * APPROVAL BOUNDARY CLARIFICATION:
 * requiresOwnerApproval is strictly an ADVISORY SIGNAL for downstream orchestrators or human
 * reviewers. Keyword detection is NOT authentication, authorization, or an access control
 * mechanism. Setting this flag does NOT block or prevent unauthorized actions.
 */
export function executeTomModule(
  userMessage: string,
  history: Array<{ sender: string; text: string }> = [],
  gemMode: 'tom-core' | 'bambi' | 'bambi-diagnostic' | 'the-grower' | 'master-vault' | 'maestro' = 'tom-core'
): ModuleResult<TomBrainResponse> {
  const localResult = generateClientTomReply(userMessage, history, gemMode);
  const moduleName = resolveLocalModuleName(gemMode);

  const sources: SourceReference[] = (localResult.searchSources || []).map((s) =>
    mapToSourceReference(s)
  );

  // Advisory signal detection (informational flag, NOT a security control)
  const q = userMessage.trim().toLowerCase();
  const advisoryChangeDetected =
    q.includes('sudo') &&
    (q.includes('update price') ||
      q.includes('change curriculum') ||
      q.includes('modify spec') ||
      q.includes('edit patch'));

  const uncertainties: string[] = [];
  if (sources.some((s) => s.status === 'unverified')) {
    uncertainties.push('One or more referenced sources lack formal offline verification records or live service confirmation.');
  }
  if (sources.some((s) => s.status === 'stale')) {
    uncertainties.push('One or more referenced sources are flagged as potentially stale.');
  }

  return {
    module: moduleName,
    result: localResult,
    sources: sources.length > 0 ? sources : undefined,
    uncertainties: uncertainties.length > 0 ? uncertainties : undefined,
    requiresOwnerApproval: advisoryChangeDetected,
  };
}

/**
 * Fallback response payload formatted for the existing user-facing chat API.
 * Preserves legacy fields (reply, avatarEmotion, searchQueries, searchSources)
 * while attaching the canonical moduleResult for contract compliance and inspectability.
 */
export interface FallbackChatPayload {
  reply: string;
  avatarEmotion: string;
  searchQueries: string[];
  searchSources: Array<{ title: string; uri: string }>;
  moduleResult: ModuleResult<TomBrainResponse>;
}

/**
 * Builds a backward-compatible chat API payload from a ModuleResult.
 * Guaranteed not to leak uncertainties, source notes, or owner approval notices into `reply`.
 */
export function buildFallbackChatPayload(
  moduleResult: ModuleResult<TomBrainResponse>
): FallbackChatPayload {
  return {
    reply: moduleResult.result.reply,
    avatarEmotion: moduleResult.result.avatarEmotion || 'thoughtful',
    searchQueries: moduleResult.result.searchQueries || [],
    searchSources: moduleResult.result.searchSources || [],
    moduleResult,
  };
}

/**
 * Lazy fallback evaluator factory:
 * Executes the local Tom module at most once per request, and ONLY when a
 * fallback branch actually requires a local response.
 */
export function createLazyFallbackEvaluator(
  message: string,
  history: Array<{ sender: string; text: string }> = [],
  gemMode: 'tom-core' | 'bambi' | 'bambi-diagnostic' | 'the-grower' | 'master-vault' | 'maestro' = 'tom-core'
) {
  let cached: ModuleResult<TomBrainResponse> | null = null;
  let callCount = 0;

  return {
    getModuleResult: (): ModuleResult<TomBrainResponse> => {
      if (!cached) {
        callCount++;
        cached = executeTomModule(message, history, gemMode);
      }
      return cached;
    },
    getPayload: (): FallbackChatPayload => {
      if (!cached) {
        callCount++;
        cached = executeTomModule(message, history, gemMode);
      }
      return buildFallbackChatPayload(cached);
    },
    getCallCount: () => callCount,
    isEvaluated: () => cached !== null,
  };
}
