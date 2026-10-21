/**
 * Tom's Opening Statements & Curb Mentor Voice Bank
 * 
 * Single Source of Truth for Tom's initial greetings, avatar click lines,
 * and conversational curb reflections.
 * 
 * Edit this file to update what Tom says when the chat loads or when you tap his avatar.
 */

export const TOM_OPENING_STATEMENT = {
  // Initial message text displayed in the chat window on first load
  chatWelcome: `I'm Tom. chilling. No lectures, no hurry. whats going on with you today?`,

  // Spoken aloud when tapping Tom's animated avatar face
  avatarTapGreeting: `Hey! I'm Tom, Bambi's peer mentor. Sitting on the curb. No lectures, no hurry. Tap the mic or type anytime.`,

  // Spoken aloud when testing voice settings in the customizer
  voiceTestPhrase: `Hey, what's up. Real recovery happens one day, one moment at a time. I'm right here with you.`,

  // Sound preset confirmation voice line
  soundPresetPhrase: (presetName: string) => `Sound profile set to ${presetName}. Grounded and ready on the curb.`,
};

/**
 * Varied pool of authentic street-mentor responses for when AI is offline or API key is being rotated.
 * Prevents Tom from ever repeating a single phrase on an infinite loop.
 */
export const TOM_CURB_REFLECTIONS: string[] = [
  "I'm sitting right here on the curb with you. What part of this feels heaviest right now?",
  "That wound still owns real estate in your head. You've survived this before—different clothes, same monster. What does the next hour look like?",
  "Every hard chapter has a turning point. Where does the chain feel like it's pulling you today?",
  "That sounds like a lot of noise in your head. What's one small thing you have control over in the next hour?",
  "Most people try to fix the whole roof at once. What's the one leak in front of you right now?",
  "Failure is an event, not your identity tag. You've carried it long enough that it started wearing your name. Drop the bag for a minute.",
  "You were headed there before the first hit. The substance wasn't the decision—the decision happened earlier when pressure spiked. What got quieter?",
  "Maybe everybody else is the problem. But if they're the only problem, you have zero leverage. Where is your piece of ground today?",
  "Put both feet flat on the pavement. Take one slow breath. We don't have to fix your whole life today. Just the next fifteen minutes.",
  "I hear you. When was the last time you felt steady, even for sixty seconds?",
];

/**
 * Helper to get a dynamic curb reflection that avoids repeating the previous response.
 */
export function getRotatingTomReflection(previousText?: string): string {
  const available = previousText
    ? TOM_CURB_REFLECTIONS.filter((r) => r.toLowerCase().trim() !== previousText.toLowerCase().trim())
    : TOM_CURB_REFLECTIONS;
  const pool = available.length > 0 ? available : TOM_CURB_REFLECTIONS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
