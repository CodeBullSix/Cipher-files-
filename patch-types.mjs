import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('InvestigationWorkspace')) {
  content += `

export interface InvestigationWorkspace {
  id: string;
  title: string;
  description: string;
  owner: string;
  caseId?: string;
  createdAt: string;
  updatedAt: string;
  notes?: WorkspaceNote[];
  references?: WorkspaceReference[];
  connections?: WorkspaceConnection[];
}

export interface WorkspaceNote {
  id: string;
  workspaceId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceReference {
  id: string;
  workspaceId: string;
  entityType: 'CASE' | 'PERSON' | 'ORGANISATION' | 'LOCATION' | 'EVIDENCE' | 'EVENT';
  entityId: string;
  createdAt: string;
  resolvedData?: any; // To hold the fetched details of the referenced entity
}

export interface WorkspaceConnection {
  id: string;
  workspaceId: string;
  sourceRefId: string;
  targetRefId: string;
  label: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
`;
  fs.writeFileSync('src/types.ts', content);
}
