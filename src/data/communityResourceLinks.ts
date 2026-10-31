/**
 * 4 Pillars Community Resource Links & Editable Templates
 * 
 * Each of the 4 categories (Housing, Work, Treatment, Legal) contains exactly 4 links.
 * Use this file to fill in or update any template link with your real URLs, documents, or phone numbers.
 */

export interface ResourceLinkItem {
  id: string;
  title: string;
  url: string;
  isTemplate: boolean;
  badge?: string;
  description?: string;
  phone?: string;
  type?: 'pdf' | 'web' | 'phone' | 'template';
}

export interface CategoryResourceGroup {
  category: 'housing' | 'work' | 'treatment' | 'legal';
  title: string;
  badge: string;
  links: ResourceLinkItem[];
}

export const COMMUNITY_RESOURCE_CATEGORIES: Record<'housing' | 'work' | 'treatment' | 'legal', CategoryResourceGroup> = {
  housing: {
    category: 'housing',
    title: 'Housing Resources',
    badge: '4 Links Available',
    links: [
      {
        id: 'housing-link-1-template',
        title: '[Housing Template 1 / Fill In Here]',
        url: '#housing-template-1',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with your housing directory URL, application portal, or PDF upload.',
      },
      {
        id: 'housing-link-2-directory',
        title: 'Recovery Directory V2.pdf',
        url: '/Comprehensive_Recovery_Directory_V2.pdf',
        isTemplate: false,
        type: 'pdf',
        badge: 'Verified PDF',
        description: 'Comprehensive 44-page directory of Phoenix halfway houses, low-barrier beds & shelters.',
      },
      {
        id: 'housing-link-3-template',
        title: '[Housing Template 2 / Fill In Here]',
        url: '#housing-template-2',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with emergency shelter, crisis respite, or transitional housing link.',
      },
      {
        id: 'housing-link-4-template',
        title: '[Housing Template 3 / Fill In Here]',
        url: '#housing-template-3',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with affordable housing vouchers, rapid rehousing, or partner home link.',
      },
    ],
  },

  work: {
    category: 'work',
    title: 'Work & Apprenticeship Resources',
    badge: '4 Links Available',
    links: [
      {
        id: 'work-link-1-apprenticeships',
        title: 'Apprenticeship-Program-List.pdf',
        url: '/Registered-Apprenticeship-Program-List.pdf',
        isTemplate: false,
        type: 'pdf',
        badge: 'Verified PDF',
        description: 'Arizona DES 44-page official directory of paid registered trade apprenticeships.',
      },
      {
        id: 'work-link-2-template',
        title: '[Work Template 1 / Fill In Here]',
        url: '#work-template-1',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with job placement agency, second-chance employer, or labor hall link.',
      },
      {
        id: 'work-link-3-template',
        title: '[Work Template 2 / Fill In Here]',
        url: '#work-template-2',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with resume workshop, trade certification, or vocational training link.',
      },
      {
        id: 'work-link-4-template',
        title: '[Work Template 3 / Fill In Here]',
        url: '#work-template-3',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with work boots/tools fund, bus pass/transit program, or re-entry job portal.',
      },
    ],
  },

  treatment: {
    category: 'treatment',
    title: 'Treatment & Recovery Resources',
    badge: '4 Links Available',
    links: [
      {
        id: 'treatment-link-1-granite',
        title: 'Granite Mountain Behavioral',
        url: 'https://granitemountainbhc.com',
        phone: '(928) 756-0695',
        isTemplate: false,
        type: 'web',
        badge: 'Inpatient & Detox',
        description: 'Accredited inpatient residential recovery, medical detox, and dual-diagnosis behavioral health.',
      },
      {
        id: 'treatment-link-2-bambi',
        title: 'Bambi (602-767-2147)',
        url: 'tel:6027672147',
        phone: '602-767-2147',
        isTemplate: false,
        type: 'phone',
        badge: 'Direct Peer Line',
        description: 'Direct call/text peer intake and Valley-wide detox/AHCCCS bed coordination.',
      },
      {
        id: 'treatment-link-3-axiom',
        title: 'Axiom Care',
        url: 'https://axiomcareaz.org',
        phone: '(844) 929-4662',
        isTemplate: false,
        type: 'web',
        badge: 'AHCCCS Detox Bed',
        description: '24/7 medically managed detox, acute stabilization & AHCCCS-funded inpatient substance beds.',
      },
      {
        id: 'treatment-link-4-template',
        title: '[Treatment Template / Fill In Here]',
        url: '#treatment-template-4',
        phone: '[Optional Phone]',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with outpatient clinic, MAT provider, counseling center, or recovery community link.',
      },
    ],
  },

  legal: {
    category: 'legal',
    title: 'Legal & Re-Entry Resources',
    badge: '4 Links Available',
    links: [
      {
        id: 'legal-link-1-template',
        title: '[Legal Template 1 / Fill In Here]',
        url: '#legal-template-1',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with court warrant quash clinic, municipal court, or public defender link.',
      },
      {
        id: 'legal-link-2-template',
        title: '[Legal Template 2 / Fill In Here]',
        url: '#legal-template-2',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with MVD state ID fee waiver, vital records birth certificate, or ID voucher link.',
      },
      {
        id: 'legal-link-3-template',
        title: '[Legal Template 3 / Fill In Here]',
        url: '#legal-template-3',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with FARE fines relief, driver license reinstatement, or court payment reduction portal.',
      },
      {
        id: 'legal-link-4-template',
        title: '[Legal Template 4 / Fill In Here]',
        url: '#legal-template-4',
        isTemplate: true,
        type: 'template',
        badge: 'Template',
        description: 'Template: Replace with Clean Slate Arizona expungement, record clearing, or civil legal services link.',
      },
    ],
  },
};
