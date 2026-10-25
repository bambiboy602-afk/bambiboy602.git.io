/**
 * Gemini Skills & Maestro v1.3 Transition Utility
 *
 * Provides bridge utilities that dynamically translate and replace legacy
 * 'Google Gems' interface terminology with the canonical 'Gemini Skills'
 * and 'Maestro v1.3 Universal Runtime' architecture while keeping the UI shell intact.
 */

import {
  GEMINI_SKILLS_COLLECTION,
  GeminiSkillDefinition,
  SkillModeId,
  OFFICIAL_TOM_SKILL_URL,
  BAMBI_SKILL_URL,
  GROWER_SKILL_URL,
  MASTER_VAULT_SKILL_URL,
} from '../data/geminiSkillsData';

export const MAESTRO_RUNTIME_VERSION = '1.3';
export const MAESTRO_RUNTIME_TITLE = 'Maestro v1.3 Universal Runtime';
export const GEMINI_SKILLS_HUB_TITLE = 'Gemini Skills Hub';

/**
 * Replaces legacy "Google Gems" text in UI strings, logs, or search tags
 * with modern "Gemini Skills" and "Maestro v1.3" terminology.
 */
export function translateLegacyGemsText(text: string): string {
  if (!text) return text;
  return text
    .replace(/Google Gems Architecture/gi, 'Gemini Skills Architecture')
    .replace(/Google Gemini Gems/gi, 'Gemini Skills & Maestro v1.3')
    .replace(/Google Gems/gi, 'Gemini Skills')
    .replace(/Gem Prompts/gi, 'Skills Hub')
    .replace(/Gem Flow/gi, 'Skills Flow')
    .replace(/Gem 1/gi, 'Skill 1')
    .replace(/Gem 2/gi, 'Skill 2')
    .replace(/Gem 3/gi, 'Skill 3')
    .replace(/Gem 4/gi, 'Skill 4')
    .replace(/Gem 5/gi, 'Skill 5')
    .replace(/Gem 0\/99/gi, 'Skill 0/99');
}

/**
 * Maps any mode string (legacy gemMode or skillMode) to a validated SkillModeId.
 */
export function migrateGemModeToSkillMode(rawMode?: string): SkillModeId {
  const normalized = (rawMode || '').toLowerCase().trim();
  switch (normalized) {
    case 'bambi':
    case 'bambi-rsm':
      return 'bambi';
    case 'bambi-diagnostic':
      return 'bambi-diagnostic';
    case 'the-grower':
    case 'grower':
      return 'the-grower';
    case 'master-vault':
    case 'knowledge-vault':
    case 'vault':
      return 'master-vault';
    case 'maestro':
    case 'orchestrator':
      return 'maestro';
    case 'tom-core':
    case 'tom-identity':
    default:
      return 'tom-core';
  }
}

/**
 * Returns user-facing label for a skill mode.
 */
export function getSkillLabel(mode: string): string {
  const skillId = migrateGemModeToSkillMode(mode);
  const found = GEMINI_SKILLS_COLLECTION.find((s) => s.id === skillId);
  return found ? found.title : 'Tom Companion Identity';
}

/**
 * Returns short badge label (e.g. "Skill #1", "Skill 0/99").
 */
export function getSkillBadgeLabel(mode: string): string {
  const skillId = migrateGemModeToSkillMode(mode);
  const found = GEMINI_SKILLS_COLLECTION.find((s) => s.id === skillId);
  if (!found) return 'Skill #1';
  return typeof found.skillNumber === 'number'
    ? `Skill #${found.skillNumber}`
    : `Skill ${found.skillNumber}`;
}

/**
 * Returns the direct URL for a given skill.
 */
export function getSkillDirectUrl(mode: string): string {
  const skillId = migrateGemModeToSkillMode(mode);
  switch (skillId) {
    case 'bambi':
    case 'bambi-diagnostic':
      return BAMBI_SKILL_URL;
    case 'the-grower':
      return GROWER_SKILL_URL;
    case 'master-vault':
      return MASTER_VAULT_SKILL_URL;
    case 'maestro':
    case 'tom-core':
    default:
      return OFFICIAL_TOM_SKILL_URL;
  }
}

/**
 * Interface config descriptor for UI headers, modals, and buttons.
 */
export const GEMINI_SKILLS_UI_CONFIG = {
  navButtonText: 'Gemini Skills',
  navMobileButtonText: 'Skills',
  navButtonTitle: 'Gemini Skills Architecture & Maestro v1.3 Runtime',
  modalHeaderTitle: 'TOM Peer-Support Engine & Gemini Skills Hub',
  modalSubHeader: 'Gemini Skills Architecture • Maestro Runtime v1.3 Universal',
  modalBadgeText: 'Runtime v1.3 Universal',
  selectorPrefix: 'Skill:',
  inspectorTitle: 'Gemini Skills Architecture',
  activeVersion: 'v1.3',
};
