export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'MILESTONE' | 'EVIDENCE' | 'COMMUNITY' | 'INVESTIGATION';
}

export const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  'FIRST_CONTRIBUTION': {
    id: 'FIRST_CONTRIBUTION',
    name: 'First Lead',
    description: 'Made your first meaningful contribution to the investigation.',
    icon: '🔍',
    category: 'MILESTONE'
  },
  'EVIDENCE_CONTRIBUTOR': {
    id: 'EVIDENCE_CONTRIBUTOR',
    name: 'Evidence Contributor',
    description: 'Contributed verified evidence to the database.',
    icon: '📄',
    category: 'EVIDENCE'
  },
  'COMMUNITY_PARTICIPANT': {
    id: 'COMMUNITY_PARTICIPANT',
    name: 'Community Participant',
    description: 'Participated in an investigator discussion.',
    icon: '💬',
    category: 'COMMUNITY'
  },
  'RELATIONSHIP_MAPPER': {
    id: 'RELATIONSHIP_MAPPER',
    name: 'Rabbit Hole Mapper',
    description: 'Documented a relationship between investigative entities.',
    icon: '🔗',
    category: 'INVESTIGATION'
  },
  'RESEARCHER': {
    id: 'RESEARCHER',
    name: 'Dedicated Researcher',
    description: 'Reached a total of 50 community reputation.',
    icon: '⭐',
    category: 'MILESTONE'
  }
};
