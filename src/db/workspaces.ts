import { db } from './index.js';
import * as schema from './schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function getWorkspacesForUser(userId: string) {
  return db.query.investigationWorkspaces.findMany({
    where: eq(schema.investigationWorkspaces.owner, userId),
    orderBy: [desc(schema.investigationWorkspaces.updatedAt)]
  });
}

export async function getWorkspaceById(workspaceId: string, userId: string) {
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(
      eq(schema.investigationWorkspaces.id, workspaceId),
      eq(schema.investigationWorkspaces.owner, userId)
    ),
    with: {
      notes: true,
      references: true,
      connections: true
    }
  });
  
  if (!ws) return null;
  
  // Resolve reference data
  for (const ref of ws.references as any[]) {
    if (ref.entityType === 'CASE') {
      const c = await db.query.caseFiles.findFirst({ where: eq(schema.caseFiles.id, ref.entityId) });
      if (c) ref.resolvedData = { title: c.title, description: c.summary };
    } else if (ref.entityType === 'PERSON') {
      const p = await db.query.people.findFirst({ where: eq(schema.people.id, ref.entityId) });
      if (p) ref.resolvedData = { title: p.name, description: p.description };
    } else if (ref.entityType === 'ORGANISATION') {
      const o = await db.query.organisations.findFirst({ where: eq(schema.organisations.id, ref.entityId) });
      if (o) ref.resolvedData = { title: o.name, description: o.description };
    } else if (ref.entityType === 'LOCATION') {
      const l = await db.query.locations.findFirst({ where: eq(schema.locations.id, ref.entityId) });
      if (l) ref.resolvedData = { title: l.name, description: l.description };
    } else if (ref.entityType === 'EVIDENCE') {
      const e = await db.query.evidenceItems.findFirst({ where: eq(schema.evidenceItems.id, ref.entityId) });
      if (e) ref.resolvedData = { title: e.title, description: e.description };
    } else if (ref.entityType === 'EVENT') {
      const ev = await db.query.events.findFirst({ where: eq(schema.events.id, ref.entityId) });
      if (ev) ref.resolvedData = { title: ev.title, description: ev.description };
    }
  }
  
  return ws;
}

export async function createWorkspace(data: any, userId: string) {
  const id = uuidv4();
  await db.insert(schema.investigationWorkspaces).values({
    id,
    title: data.title || 'Untitled Workspace',
    description: data.description || '',
    owner: userId,
    caseId: data.caseId || null
  });
  
  // Create an initial empty note
  await db.insert(schema.workspaceNotes).values({
    id: uuidv4(),
    workspaceId: id,
    content: ''
  });
  
  return getWorkspaceById(id, userId);
}

export async function updateWorkspace(workspaceId: string, data: any, userId: string) {
  // Verify ownership
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Workspace not found or unauthorized");
  
  await db.update(schema.investigationWorkspaces)
    .set({
      title: data.title !== undefined ? data.title : ws.title,
      description: data.description !== undefined ? data.description : ws.description,
      updatedAt: new Date()
    })
    .where(eq(schema.investigationWorkspaces.id, workspaceId));
    
  return getWorkspaceById(workspaceId, userId);
}

export async function deleteWorkspace(workspaceId: string, userId: string) {
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Workspace not found or unauthorized");
  
  await db.delete(schema.investigationWorkspaces).where(eq(schema.investigationWorkspaces.id, workspaceId));
  return true;
}

// NOTES
export async function updateNote(noteId: string, content: string, userId: string) {
  const note = await db.query.workspaceNotes.findFirst({ where: eq(schema.workspaceNotes.id, noteId) });
  if (!note) throw new Error("Note not found");
  
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, note.workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  await db.update(schema.workspaceNotes)
    .set({ content, updatedAt: new Date() })
    .where(eq(schema.workspaceNotes.id, noteId));
    
  // Touch workspace
  await db.update(schema.investigationWorkspaces).set({ updatedAt: new Date() }).where(eq(schema.investigationWorkspaces.id, note.workspaceId));
    
  return true;
}

// REFERENCES
export async function addReference(workspaceId: string, entityType: string, entityId: string, userId: string) {
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  // Check if it already exists
  const existing = await db.query.workspaceReferences.findFirst({
    where: and(
      eq(schema.workspaceReferences.workspaceId, workspaceId),
      eq(schema.workspaceReferences.entityType, entityType as any),
      eq(schema.workspaceReferences.entityId, entityId)
    )
  });
  if (existing) return existing;
  
  const id = uuidv4();
  await db.insert(schema.workspaceReferences).values({
    id,
    workspaceId,
    entityType: entityType as any,
    entityId
  });
  
  return db.query.workspaceReferences.findFirst({ where: eq(schema.workspaceReferences.id, id) });
}

export async function removeReference(referenceId: string, userId: string) {
  const ref = await db.query.workspaceReferences.findFirst({ where: eq(schema.workspaceReferences.id, referenceId) });
  if (!ref) throw new Error("Not found");
  
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, ref.workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  await db.delete(schema.workspaceReferences).where(eq(schema.workspaceReferences.id, referenceId));
  return true;
}

// CONNECTIONS
export async function addConnection(workspaceId: string, sourceRefId: string, targetRefId: string, label: string, notes: string, userId: string) {
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  const id = uuidv4();
  await db.insert(schema.workspaceConnections).values({
    id,
    workspaceId,
    sourceRefId,
    targetRefId,
    label,
    notes: notes || ''
  });
  
  return db.query.workspaceConnections.findFirst({ where: eq(schema.workspaceConnections.id, id) });
}

export async function updateConnection(connectionId: string, label: string, notes: string, userId: string) {
  const conn = await db.query.workspaceConnections.findFirst({ where: eq(schema.workspaceConnections.id, connectionId) });
  if (!conn) throw new Error("Not found");
  
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, conn.workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  await db.update(schema.workspaceConnections)
    .set({ label, notes, updatedAt: new Date() })
    .where(eq(schema.workspaceConnections.id, connectionId));
    
  return true;
}

export async function removeConnection(connectionId: string, userId: string) {
  const conn = await db.query.workspaceConnections.findFirst({ where: eq(schema.workspaceConnections.id, connectionId) });
  if (!conn) throw new Error("Not found");
  
  const ws = await db.query.investigationWorkspaces.findFirst({
    where: and(eq(schema.investigationWorkspaces.id, conn.workspaceId), eq(schema.investigationWorkspaces.owner, userId))
  });
  if (!ws) throw new Error("Unauthorized");
  
  await db.delete(schema.workspaceConnections).where(eq(schema.workspaceConnections.id, connectionId));
  return true;
}
