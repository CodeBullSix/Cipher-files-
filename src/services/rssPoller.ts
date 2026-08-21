import admin from 'firebase-admin';
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { CaseFile } from '../types';

let isInitialized = false;
let db: admin.firestore.Firestore;

function initializeAdmin() {
  if (isInitialized) return;
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  let projectId = 'cipher-files';
  let databaseId = '(default)';
  
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (firebaseConfig.projectId) projectId = firebaseConfig.projectId;
    if (firebaseConfig.firestoreDatabaseId) databaseId = firebaseConfig.firestoreDatabaseId;
  }

  if (!admin.apps.length) {
    // Uses Application Default Credentials (ADC) which works securely in Cloud Run environments
    admin.initializeApp({
      projectId: projectId
    });
  }
  
  // Use admin.firestore()
  try {
    const { getFirestore } = require('firebase-admin/firestore');
    db = getFirestore(admin.app(), databaseId);
  } catch (err) {
    db = admin.firestore();
    if (databaseId !== '(default)' && typeof db.settings === 'function') {
        db.settings({ databaseId });
    }
  }
  isInitialized = true;
}

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
});

function generateId(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'sync-' + Math.abs(hash).toString(16);
}

export async function fetchTheBlackVault(): Promise<CaseFile[]> {
  try {
    const feed = await parser.parseURL('https://www.theblackvault.com/documentarchive/feed/');
    return feed.items.slice(0, 5).map(item => {
      const id = generateId(item.link || item.title || '');
      return {
        id,
        caseNumber: `TBV-${new Date(item.pubDate || Date.now()).getFullYear()}-${id.substring(5, 9).toUpperCase()}`,
        title: item.title || 'Untitled Black Vault Document',
        subtitle: 'Automated declassification sync from The Black Vault',
        category: 'GOVERNMENT_INTELLIGENCE',
        status: 'VERIFIED',
        claim: `Declassified records recently acquired by The Black Vault regarding ${item.title}.`,
        summary: (item.contentSnippet || item.content || '').substring(0, 500) + '...',
        whatWeKnow: [
          'Records acquired via FOIA or direct declassification.',
          'Hosted and archived at The Black Vault for public review.',
          'Raw primary source documentation.'
        ],
        speculations: [
          'Implications are subject to researcher analysis.'
        ],
        evidenceList: [
          {
            id: `ev-${id}-1`,
            type: 'OFFICIAL_DOCUMENT',
            title: 'The Black Vault Archive Link',
            description: 'Direct link to the archived records and analysis on The Black Vault.',
            authenticityScore: 99,
            url: item.link
          }
        ],
        entities: [
          { id: `ent-tbv-${id}`, name: 'The Black Vault', type: 'ORGANIZATION', role: 'FOIA Archive' },
          { id: `ent-jg-${id}`, name: 'John Greenewald Jr.', type: 'PERSON', role: 'Archivist' }
        ],
        upvotes: 0,
        downvotes: 0,
        mindblownCount: 0,
        skepticCount: 0,
        beliefScore: 90,
        commentCount: 0,
        views: 0,
        createdAt: new Date(item.pubDate || Date.now()).toISOString()
      };
    });
  } catch (error) {
    console.error('Failed to fetch The Black Vault RSS:', error);
    return [];
  }
}

export async function fetchCryptome(): Promise<CaseFile[]> {
  try {
    // We scrape the main index.html for Cryptome
    const response = await fetch('https://cryptome.org/');
    if (!response.ok) throw new Error('Cryptome response not OK');
    const html = await response.text();
    
    // Simple regex to grab the latest <a href="...">202x-xxx.pdf</a> Date Title
    const regex = /<a href="([^"]+\.([a-zA-Z0-9]{3,4}))">([^<]+)<\/a>\s*([^<]*[0-9]{4})/g;
    let match;
    const items = [];
    let count = 0;
    
    while ((match = regex.exec(html)) !== null && count < 5) {
      const url = match[1];
      const linkText = match[3];
      const desc = match[4].trim().replace(/<\/?b>/g, '');
      
      // Some URLs might be relative
      const fullUrl = url.startsWith('http') ? url : `https://cryptome.org/${url.startsWith('/') ? url.substring(1) : url}`;
      
      const id = generateId(fullUrl);
      items.push({
        id,
        caseNumber: `CRYPTO-${id.substring(5, 9).toUpperCase()}`,
        title: `${linkText} - ${desc.substring(0, 100)}`,
        subtitle: 'Automated sync from Cryptome Archive',
        category: 'GOVERNMENT_INTELLIGENCE',
        status: 'DOCUMENTED',
        claim: `Raw security/intelligence document published on Cryptome: ${linkText}`,
        summary: `This file was recently published on Cryptome, a digital library hosting documents on freedom of expression, cryptography, espionage, and surveillance.\n\nFile reference: ${desc}`,
        whatWeKnow: [
          'Published on the Cryptome public archive.',
          'Provides raw uncensored documentation or intelligence.'
        ],
        speculations: [],
        evidenceList: [
          {
            id: `ev-${id}-1`,
            type: 'OFFICIAL_DOCUMENT',
            title: linkText,
            description: desc,
            authenticityScore: 85,
            url: fullUrl
          }
        ],
        entities: [
          { id: `ent-crypto-${id}`, name: 'Cryptome', type: 'ORGANIZATION', role: 'Hosting Archive' },
          { id: `ent-jy-${id}`, name: 'John Young', type: 'PERSON', role: 'Archivist' }
        ],
        upvotes: 0,
        downvotes: 0,
        mindblownCount: 0,
        skepticCount: 0,
        beliefScore: 80,
        commentCount: 0,
        views: 0,
        createdAt: new Date().toISOString()
      });
      count++;
    }
    return items;
  } catch (error) {
    console.error('Failed to fetch Cryptome:', error);
    return [];
  }
}

export async function syncRssFeeds() {
  initializeAdmin();
  console.log('[RSS Poller] Starting sync from The Black Vault and Cryptome...');
  
  const [tbvCases, cryptoCases] = await Promise.all([
    fetchTheBlackVault(),
    fetchCryptome()
  ]);

  const allCases = [...tbvCases, ...cryptoCases];
  if (allCases.length === 0) {
    console.log('[RSS Poller] No items fetched or errors occurred.');
    return;
  }

  let newCount = 0;
  let updateCount = 0;

  const batch = db.batch();
  
  for (const c of allCases) {
    const docRef = db.collection('cases').doc(c.id);
    const existing = await docRef.get();
    
    if (!existing.exists) {
      batch.set(docRef, { ...c, authorUid: 'system-rss-sync', authorName: 'Automated Archival Sync' });
      newCount++;
    } else {
      // Don't overwrite community stats like upvotes or comments, just the content
      batch.update(docRef, {
        title: c.title,
        summary: c.summary,
        evidenceList: c.evidenceList,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      updateCount++;
    }
  }

  await batch.commit();
  console.log(`[RSS Poller] Sync complete. Inserted ${newCount} new dossiers, updated ${updateCount}.`);
  return { newCount, updateCount };
}
