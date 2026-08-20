export interface AvatarPreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  gradient: string;
  border: string;
  description: string;
}

export const TACTICAL_AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'archival-seal',
    name: 'National Archives Seal',
    category: 'Institutional',
    icon: '🏛️',
    gradient: 'from-slate-900 via-slate-950 to-blue-950/60',
    border: 'border-cyan-500/60 text-cyan-300',
    description: 'Documentary preservation and historical declassification authority.'
  },
  {
    id: 'foia-analyst',
    name: 'FOIA Legal Directorate',
    category: 'Legal & Records',
    icon: '⚖️',
    gradient: 'from-amber-950/70 via-slate-950 to-slate-900',
    border: 'border-amber-500/60 text-amber-300',
    description: 'Special access litigation, declassification appeals, and statutory review.'
  },
  {
    id: 'forensics-crest',
    name: 'Forensic Science Institute',
    category: 'Forensics',
    icon: '🔬',
    gradient: 'from-emerald-950/70 via-slate-950 to-teal-950/70',
    border: 'border-emerald-500/60 text-emerald-300',
    description: 'Physical evidence verification, ballistics trajectory, and material analysis.'
  },
  {
    id: 'signal-intelligence',
    name: 'SIGINT / Signals & Telemetry',
    category: 'Technical',
    icon: '📡',
    gradient: 'from-sky-950/80 via-slate-900 to-indigo-950/80',
    border: 'border-sky-500/60 text-sky-300',
    description: 'Frequency monitoring, satellite telemetry, and acoustic signature analysis.'
  },
  {
    id: 'osint-beacon',
    name: 'Open-Source Intelligence (OSINT)',
    category: 'Intelligence',
    icon: '🌐',
    gradient: 'from-blue-950/80 via-slate-900 to-cyan-950/80',
    border: 'border-blue-500/60 text-blue-300',
    description: 'Cross-border verification, geolocation, and crowdsourced evidentiary auditing.'
  },
  {
    id: 'declassified-cipher',
    name: 'Cryptographic & Record Archive',
    category: 'Cryptography',
    icon: '🔐',
    gradient: 'from-purple-950/80 via-slate-900 to-slate-950',
    border: 'border-purple-500/60 text-purple-300',
    description: 'Digital signature provenance, redaction reconstruction, and cipher analysis.'
  },
  {
    id: 'aero-propulsion',
    name: 'Aerospace & Phenomena Directorate',
    category: 'Aerospace',
    icon: '🛸',
    gradient: 'from-teal-950/80 via-slate-900 to-slate-950',
    border: 'border-teal-500/60 text-teal-300',
    description: 'Aviation telemetry, radar tracking logs, and anomalous flight dynamics.'
  },
  {
    id: 'investigative-press',
    name: 'Investigative Press Corps',
    category: 'Journalism',
    icon: '📰',
    gradient: 'from-stone-900 via-slate-950 to-neutral-900',
    border: 'border-neutral-400/60 text-neutral-200',
    description: 'First-hand whistleblower interviews, FOIA filings, and deep investigative reporting.'
  },
  {
    id: 'historical-society',
    name: 'Academic Historical Review',
    category: 'Academic',
    icon: '📜',
    gradient: 'from-orange-950/70 via-slate-950 to-amber-950/50',
    border: 'border-orange-500/60 text-orange-300',
    description: 'Primary source cross-examination, archival historiography, and peer evaluation.'
  },
  {
    id: 'cartography-geo',
    name: 'Geospatial & Cartographic Survey',
    category: 'Geospatial',
    icon: '🧭',
    gradient: 'from-indigo-950/80 via-slate-900 to-violet-950/70',
    border: 'border-indigo-500/60 text-indigo-300',
    description: 'Topographic mapping, satellite imagery comparison, and historical site surveys.'
  }
];

export const SPECIALIZATION_OPTIONS = [
  'FOIA Declassification & Archival Records Specialist',
  'Investigative Journalist & Whistleblower Interrogator',
  'Historical Ballistics & Trajectory Forensic Analyst',
  'Aerospace Telemetry & Anomalous Radar Specialist',
  'Financial Forensic Investigator & Shell Entity Tracing',
  'Signals Intelligence & Telecommunications Historian',
  'Academic Historiographer & Primary Document Auditor',
  'Geospatial Intelligence & Satellite Imagery Analyst',
  'Constitutional & National Security Legal Scholar',
  'Medical Examiner & Pathology Records Examiner'
];
