import { db } from './src/db/index.js';
import { caseFiles, people, organisations, locations, events, evidenceItems, sources, entityRelationships, casePeople, caseOrganisations, caseLocations, caseRelationships, eventCaseFiles, evidenceCaseFiles, eventEvidence } from './src/db/schema.js';
import { eq, ilike, or } from 'drizzle-orm';
import crypto from 'crypto';

function genId(prefix: string) {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
}

async function getOrCreateEntity(type: 'PERSON' | 'ORGANISATION' | 'LOCATION', name: string, description?: string, role?: string) {
  const table = type === 'PERSON' ? people : type === 'ORGANISATION' ? organisations : locations;
  const existing = await db.select({ id: table.id }).from(table).where(ilike(table.name, name)).limit(1);
  if (existing.length > 0) return existing[0].id;
  const id = genId(type.toLowerCase());
  await db.insert(table).values({
    id,
    name,
    description: description || null,
    role: role || null,
    createdBy: 'seed-admin-uid',
    verificationStatus: 'VERIFIED'
  } as any);
  return id;
}

const batch = [
  {
    case: {
      id: 'cf-family-jewels',
      title: 'The "Family Jewels": CIA Domestic Abuses',
      slug: 'cia-family-jewels',
      summary: 'A set of highly classified reports compiled by the CIA in 1973 detailing the agency\'s own illegal and inappropriate activities from the 1950s to the 1970s.',
      description: 'Ordered by Director James R. Schlesinger after the Watergate scandal, the 693-page document detailed assassination plots, domestic surveillance, wiretapping of journalists, and illegal mail opening. It was later released in 2007, confirming many long-standing allegations of CIA overreach during the Cold War.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'CIA-1973-FJ',
      subtitle: 'The CIA\'s Internal Confession',
      officialVerdict: 'The documents were officially declassified in 2007. They confirm the existence of numerous illegal programs, directly leading to the Church Committee investigations.',
      coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      claim: 'The CIA operated numerous illegal, domestic, and extrajudicial programs for decades.',
      claimOrigin: 'Seymour Hersh (New York Times, 1974), Official CIA Declassification (2007)',
      whatWeKnow: [
        'The report was ordered by James R. Schlesinger in 1973.',
        'It documented Project MKUltra (behavioral modification), Operation CHAOS (domestic surveillance of dissidents), and assassination plots against foreign leaders like Fidel Castro.',
        'William Colby later testified about these activities to Congress.'
      ],
      speculations: [
        'Critics argue the "Family Jewels" released in 2007 may have been sanitized, missing even more sensitive operations.'
      ]
    },
    people: ['Richard Helms', 'William Colby', 'Seymour Hersh', 'James R. Schlesinger'],
    organisations: ['Central Intelligence Agency (CIA)', 'U.S. Senate'],
    locations: ['Langley, Virginia'],
    events: [
      { date: '1973-05-09', title: 'Schlesinger Directive', description: 'CIA Director James Schlesinger orders all employees to report activities that might violate the agency\'s charter.', rating: 'CONFIRMED' },
      { date: '1974-12-22', title: 'NYT Exposé', description: 'Seymour Hersh publishes a front-page article in The New York Times exposing the illegal CIA domestic spy rings.', rating: 'CONFIRMED' },
      { date: '2007-06-25', title: 'Declassification', description: 'The CIA officially releases the 693-page "Family Jewels" document.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'The Family Jewels Document', url: 'https://www.cia.gov/readingroom', description: 'The declassified 693-page PDF released by the CIA.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'CIA Reading Room: The Family Jewels', url: 'https://www.cia.gov/readingroom', type: 'OFFICIAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-operation-mongoose',
      title: 'Operation Mongoose: The Covert War Against Cuba',
      slug: 'operation-mongoose',
      summary: 'A secret program of the CIA developed during the Kennedy administration aimed at removing Fidel Castro from power in Cuba following the failed Bay of Pigs invasion.',
      description: 'Operation Mongoose (The Cuban Project) involved sabotage, espionage, and assassination plots orchestrated by the CIA and the Department of Defense. It was authorized by President John F. Kennedy in November 1961. The project failed to destabilize the Castro regime and contributed significantly to the escalation of the Cuban Missile Crisis.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'CIA-1961-MONGOOSE',
      subtitle: 'The Covert Campaign to Topple Castro',
      officialVerdict: 'Declassified documents confirm Operation Mongoose involved 33 proposed plans, ranging from propaganda to assassination. It was suspended in 1962 as part of the Cuban Missile Crisis resolution.',
      coverImage: 'https://images.unsplash.com/photo-1590483736622-398541ce1711?auto=format&fit=crop&w=1200&q=80',
      claim: 'The US government engaged in a systematic campaign of terrorism and sabotage against Cuba.',
      claimOrigin: 'U.S. Government Documents / The Church Committee',
      whatWeKnow: [
        'The operation was overseen by Attorney General Robert F. Kennedy and commanded by Edward Lansdale.',
        'It included bizarre assassination plots against Castro, such as poisoned cigars and exploding seashells.',
        'The operation was formally suspended in October 1962.'
      ],
      speculations: [
        'Some historians argue that Mongoose\'s aggressive posture practically guaranteed Soviet military deployment in Cuba.'
      ]
    },
    people: ['John F. Kennedy', 'Robert F. Kennedy', 'Edward Lansdale', 'Richard Helms'],
    organisations: ['Central Intelligence Agency (CIA)', 'Department of Defense (DoD)', 'National Security Council (NSC)'],
    locations: ['Cuba', 'Washington D.C.', 'Miami, Florida'],
    events: [
      { date: '1961-11-30', title: 'Mongoose Authorized', description: 'President John F. Kennedy officially authorizes Operation Mongoose to help Cuba overthrow the Communist regime.', rating: 'CONFIRMED' },
      { date: '1962-10-30', title: 'Operation Suspended', description: 'Mongoose operations are halted following the resolution of the Cuban Missile Crisis.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'Mongoose Planning Documents', url: 'https://nsarchive.gwu.edu', description: 'Declassified memos detailing the 33 tasks comprising the operation.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'National Security Archive: The Cuban Missile Crisis', url: 'https://nsarchive.gwu.edu', type: 'ARCHIVAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-operation-ajax',
      title: 'Operation Ajax: The 1953 Iranian Coup',
      slug: 'operation-ajax',
      summary: 'The covert overthrow of the democratically elected Prime Minister of Iran, Mohammad Mosaddegh, orchestrated by the UK\'s MI6 and the US CIA.',
      description: 'Driven by the UK\'s desire to regain control of nationalized Iranian oil and US fears of Soviet influence, Operation TPAJAX replaced Mosaddegh with the autocratic rule of Shah Mohammad Reza Pahlavi. This established decades of resentment, culminating in the 1979 Iranian Revolution.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'CIA-1953-AJAX',
      subtitle: 'The Overthrow of Mohammad Mosaddegh',
      officialVerdict: 'The CIA formally acknowledged its role in the coup in 2013, declassifying documents detailing the planning and execution of Operation Ajax.',
      coverImage: 'https://images.unsplash.com/photo-1542640244-7e672d6cb466?auto=format&fit=crop&w=1200&q=80',
      claim: 'The US and UK intelligence services engineered the overthrow of a sovereign democratic government.',
      claimOrigin: 'Historical Consensus / CIA Declassification (2013)',
      whatWeKnow: [
        'The operation was led by CIA officer Kermit Roosevelt Jr.',
        'The CIA and MI6 funded street protests, bribed military officials, and distributed anti-Mosaddegh propaganda.',
        'The coup successfully installed the Shah as an absolute monarch.'
      ],
      speculations: [
        'Debate continues on whether the primary motivation was Cold War anti-communism or the protection of British petroleum interests (Anglo-Iranian Oil Company).'
      ]
    },
    people: ['Allen Dulles', 'Kermit Roosevelt Jr', 'Mohammad Mosaddegh'],
    organisations: ['Central Intelligence Agency (CIA)', 'UK Ministry of Defence'],
    locations: ['Tehran, Iran'],
    events: [
      { date: '1953-08-19', title: 'The Coup d\'État', description: 'Pro-Shah military units and paid mobs march on Mosaddegh\'s residence, resulting in his arrest.', rating: 'CONFIRMED' },
      { date: '2013-08-19', title: 'CIA Acknowledgment', description: 'The National Security Archive publishes declassified CIA documents formally acknowledging the agency\'s central role.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'CIA Internal History of TPAJAX', url: 'https://nsarchive.gwu.edu', description: 'A declassified internal CIA history document detailing the operation.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'CIA Confirms Role in 1953 Iran Coup', url: 'https://nsarchive.gwu.edu', type: 'ARCHIVAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-project-azorian',
      title: 'Project AZORIAN: The Submarine Heist',
      slug: 'project-azorian',
      summary: 'A 1974 CIA operation to recover the sunken Soviet submarine K-129 from the Pacific Ocean floor using a purpose-built ship, the Hughes Glomar Explorer.',
      description: 'One of the most complex, expensive, and secretive intelligence operations of the Cold War. The CIA enlisted billionaire Howard Hughes to provide a cover story: deep-sea manganese nodule mining. The operation successfully recovered a portion of the submarine from a depth of 16,000 feet.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'CIA-1974-AZORIAN',
      subtitle: 'The Howard Hughes Cover-Up',
      officialVerdict: 'The operation was exposed in 1975 by journalists. In 2010, the CIA declassified a detailed history of the project, confirming the recovery effort.',
      coverImage: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=80',
      claim: 'The CIA built a massive salvage ship under the guise of commercial mining to steal Soviet nuclear technology.',
      claimOrigin: 'Los Angeles Times (1975) / CIA Release (2010)',
      whatWeKnow: [
        'The Soviet Golf-II class submarine K-129 sank in 1968.',
        'The Hughes Glomar Explorer was custom-built with a giant mechanical claw to lift the sub.',
        'During the lift in 1974, the submarine broke apart, and only a portion (containing bodies of Soviet sailors) was recovered.'
      ],
      speculations: [
        'Rumors persist about exactly what technology or codebooks were successfully recovered in the salvaged section, which remains highly classified.'
      ]
    },
    people: ['Richard Nixon', 'Howard Hughes', 'William Colby'],
    organisations: ['Central Intelligence Agency (CIA)', 'Department of Defense (DoD)'],
    locations: ['Pacific Ocean', 'Hawaii'],
    events: [
      { date: '1974-08-08', title: 'Recovery Operation', description: 'The Hughes Glomar Explorer attempts to lift K-129; the submarine breaks apart during ascent.', rating: 'CONFIRMED' },
      { date: '1975-02-07', title: 'Press Leak', description: 'The Los Angeles Times breaks the story of the CIA\'s involvement with the Glomar Explorer.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'Project Azorian Declassified History', url: 'https://nsarchive.gwu.edu', description: 'Redacted CIA internal history of the project.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'Project AZORIAN (National Security Archive)', url: 'https://nsarchive.gwu.edu', type: 'ARCHIVAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-pentagon-papers',
      title: 'The Pentagon Papers',
      slug: 'pentagon-papers',
      summary: 'A top-secret Department of Defense study of U.S. political and military involvement in Vietnam from 1945 to 1967, leaked by Daniel Ellsberg to The New York Times.',
      description: 'The papers revealed that the U.S. had secretly enlarged the scope of its actions in the Vietnam War with the bombings of nearby Cambodia and Laos, coastal raids on North Vietnam, and Marine Corps attacks, none of which were reported to the mainstream media. The leaks proved that the Johnson administration had systematically lied to the public.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'DOD-1971-PP',
      subtitle: 'The Secret History of the Vietnam War',
      officialVerdict: 'The Supreme Court ruled in New York Times Co. v. United States that the government could not enjoin the newspapers from publishing the leaked documents (prior restraint).',
      coverImage: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=1200&q=80',
      claim: 'The U.S. government systematically lied to the public and Congress about the scale and success of the Vietnam War.',
      claimOrigin: 'Daniel Ellsberg / The New York Times (1971)',
      whatWeKnow: [
        'The study was commissioned by Secretary of Defense Robert McNamara in 1967.',
        'Daniel Ellsberg, a RAND Corporation analyst, photocopied the documents and leaked them in 1971.',
        'President Richard Nixon attempted to block publication, leading to a landmark Supreme Court case on press freedom.'
      ],
      speculations: [
        'Nixon\'s paranoia over leaks like the Pentagon Papers directly led to the formation of the "Plumbers," the team responsible for the Watergate break-in.'
      ]
    },
    people: ['Robert McNamara', 'Lyndon B. Johnson', 'Richard Nixon', 'Daniel Ellsberg'],
    organisations: ['Department of Defense (DoD)', 'U.S. Senate'],
    locations: ['Washington D.C.', 'Vietnam'],
    events: [
      { date: '1971-06-13', title: 'Initial Publication', description: 'The New York Times publishes the first installment of the Pentagon Papers.', rating: 'CONFIRMED' },
      { date: '1971-06-30', title: 'Supreme Court Ruling', description: 'The Supreme Court rules 6-3 in favor of the press, allowing publication to continue.', rating: 'CONFIRMED' },
      { date: '2011-06-13', title: 'Full Declassification', description: 'The complete, unredacted Pentagon Papers are officially declassified.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'The Pentagon Papers (Full Report)', url: 'https://www.archives.gov', description: 'The official 7,000-page declassified report.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'National Archives: Pentagon Papers', url: 'https://www.archives.gov', type: 'OFFICIAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-project-blue-book',
      title: 'Project Blue Book',
      slug: 'project-blue-book',
      summary: 'A series of systematic studies of unidentified flying objects (UFOs) conducted by the United States Air Force from 1952 to 1969.',
      description: 'Headquartered at Wright-Patterson Air Force Base, Blue Book investigated over 12,000 UFO reports. While the vast majority were explained as misidentifications of natural phenomena or aircraft, exactly 701 cases remained "unidentified." The project was terminated after the Condon Committee concluded there was no scientific justification for continued study.',
      category: 'UFOS_UAP',
      status: 'DOCUMENTED',
      caseNumber: 'USAF-1952-PBB',
      subtitle: 'The Official Air Force UFO Investigation',
      officialVerdict: 'The USAF concluded that no UFO reported, investigated, and evaluated represented technological developments beyond the range of modern science or a threat to national security.',
      coverImage: 'https://images.unsplash.com/photo-1542382348-154df66bd2f5?auto=format&fit=crop&w=1200&q=80',
      claim: 'The US military systematically tracked and investigated UFO phenomena for decades.',
      claimOrigin: 'United States Air Force (1952)',
      whatWeKnow: [
        'The project was directed by several officers over its lifespan, with astronomer J. Allen Hynek serving as the primary scientific consultant.',
        'It was preceded by Project Sign (1947) and Project Grudge (1949).',
        'In 1953, the CIA-sponsored Robertson Panel recommended debunking UFOs to prevent public panic and intelligence channel clogging.'
      ],
      speculations: [
        'Many critics, including Hynek later in his life, argued Blue Book functioned more as a public relations effort to dismiss UFOs rather than a rigorous scientific investigation.'
      ]
    },
    people: ['J. Allen Hynek', 'Allen Dulles'],
    organisations: ['United States Air Force (USAF)', 'Central Intelligence Agency (CIA)'],
    locations: ['Wright-Patterson Air Force Base, Ohio'],
    events: [
      { date: '1952-03-01', title: 'Project Initiated', description: 'Project Blue Book is formally established, succeeding Project Grudge.', rating: 'CONFIRMED' },
      { date: '1969-12-17', title: 'Project Terminated', description: 'The Secretary of the Air Force announces the termination of Project Blue Book.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'Project Blue Book Archives', url: 'https://www.archives.gov', description: 'Declassified case files from the project.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'National Archives: Project Blue Book', url: 'https://www.archives.gov', type: 'OFFICIAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-operation-condor',
      title: 'Operation Condor: Transnational Assassination Network',
      slug: 'operation-condor',
      summary: 'A United States-backed campaign of political repression and state terror involving intelligence operations and assassination of opponents, implemented in 1975 by the right-wing dictatorships of South America.',
      description: 'The program, nominally intended to eradicate communist or Soviet influence, resulted in the murder and "disappearance" of an estimated 60,000 to 80,000 people. Participating states included Chile, Argentina, Uruguay, Paraguay, Bolivia, and Brazil, with the CIA providing planning, coordination, and technical support.',
      category: 'GOVERNMENT_INTELLIGENCE',
      status: 'DOCUMENTED',
      caseNumber: 'DINA-1975-CONDOR',
      subtitle: 'The South American Shadow War',
      officialVerdict: 'Declassified CIA and State Department documents confirm the existence of the network and the US government\'s awareness and facilitation of its operations.',
      coverImage: 'https://images.unsplash.com/photo-1590483736622-398541ce1711?auto=format&fit=crop&w=1200&q=80',
      claim: 'South American dictatorships formed a transnational network to assassinate political dissidents with US logistical support.',
      claimOrigin: 'Paraguayan "Archives of Terror" (1992)',
      whatWeKnow: [
        'The operation targeted dissidents, union leaders, students, and journalists.',
        'In 1976, Condor agents assassinated former Chilean ambassador Orlando Letelier in a car bombing in Washington, D.C.',
        'US Secretary of State Henry Kissinger was fully briefed on Condor operations.'
      ],
      speculations: [
        'The exact extent of direct CIA involvement in specific executions remains a subject of intense historical debate, though logistical and communications support is documented.'
      ]
    },
    people: ['Henry Kissinger', 'Augusto Pinochet', 'Richard Helms', 'Richard Nixon'],
    organisations: ['Central Intelligence Agency (CIA)', 'State Department'],
    locations: ['Chile', 'Argentina', 'Washington D.C.'],
    events: [
      { date: '1975-11-25', title: 'Condor Officially Established', description: 'Intelligence chiefs from six South American nations meet in Santiago to formalize the network.', rating: 'CONFIRMED' },
      { date: '1976-09-21', title: 'Letelier Assassination', description: 'Orlando Letelier and Ronni Moffitt are killed by a car bomb in Washington D.C., orchestrated by DINA (Chile).', rating: 'CONFIRMED' },
      { date: '1992-12-22', title: 'Archives of Terror Discovered', description: 'A massive cache of Condor documents is discovered in Paraguay, exposing the full scale of the operation.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'The Archives of Terror', url: 'https://nsarchive.gwu.edu', description: 'Microfilmed records detailing the arrest, torture, and execution protocols of Condor.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'National Security Archive: Operation Condor', url: 'https://nsarchive.gwu.edu', type: 'ARCHIVAL', reliability: 'HIGH' }
    ]
  }
];

async function run() {
  console.log('Starting Case Library Expansion Seeding (Batch 3)...');
  let inserted = 0;
  let skipped = 0;
  let relInserted = 0;

  for (const item of batch) {
    // Check if case exists
    const existing = await db.select({ id: caseFiles.id }).from(caseFiles).where(eq(caseFiles.slug, item.case.slug));
    if (existing.length > 0) {
      console.log(`Skipping duplicate case: ${item.case.title}`);
      skipped++;
      continue;
    }

    console.log(`Inserting Case: ${item.case.title}`);
    await db.insert(caseFiles).values({
      ...item.case,
      createdBy: 'seed-admin-uid',
      featured: false
    } as any);

    const cId = item.case.id;
    
    const eMap = new Map<string, string>(); // name to UUID

    // Entities
    for (const p of item.people) {
      const eId = await getOrCreateEntity('PERSON', p);
      eMap.set(p, eId);
      await db.insert(casePeople).values({ caseFileId: cId, personId: eId }).onConflictDoNothing();
    }
    for (const org of item.organisations) {
      const eId = await getOrCreateEntity('ORGANISATION', org);
      eMap.set(org, eId);
      await db.insert(caseOrganisations).values({ caseFileId: cId, organisationId: eId }).onConflictDoNothing();
    }
    for (const loc of item.locations) {
      const eId = await getOrCreateEntity('LOCATION', loc);
      eMap.set(loc, eId);
      await db.insert(caseLocations).values({ caseFileId: cId, locationId: eId }).onConflictDoNothing();
    }

    // Events
    for (const ev of item.events) {
      const evId = genId('ev');
      await db.insert(events).values({
        id: evId,
        title: ev.title,
        description: ev.description,
        type: 'INCIDENT',
        dateString: ev.date,
        startDate: new Date(ev.date),
        verificationStatus: 'VERIFIED',
        createdBy: 'seed-admin-uid'
      });
      await db.insert(eventCaseFiles).values({ eventId: evId, caseFileId: cId }).onConflictDoNothing();
    }

    // Sources
    const sourceIds = [];
    for (const src of item.sources) {
      const sId = genId('src');
      await db.insert(sources).values({
        id: sId,
        name: src.title,
        url: src.url,
        sourceType: src.type as any,
        reliability: src.reliability as any
      });
      sourceIds.push(sId);
    }

    // Evidence
    for (const evi of item.evidence) {
      const eviId = genId('evi');
      await db.insert(evidenceItems).values({
        id: eviId,
        title: evi.title,
        description: evi.description,
        type: evi.type as any,
        stance: evi.stance as any,
        status: evi.status as any,
        sourceId: sourceIds.length > 0 ? sourceIds[0] : null,
        submittedById: 'seed-admin-uid'
      });
      await db.insert(evidenceCaseFiles).values({ evidenceId: eviId, caseFileId: cId }).onConflictDoNothing();
    }
    
    // Explicit Relationships for Graph
    const rels: any[] = [];
    if (item.case.slug === 'cia-family-jewels') {
      rels.push({ s: 'Richard Helms', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
      rels.push({ s: 'William Colby', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
      rels.push({ s: 'James R. Schlesinger', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'operation-mongoose') {
      rels.push({ s: 'John F. Kennedy', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
      rels.push({ s: 'Robert F. Kennedy', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'operation-ajax') {
      rels.push({ s: 'Allen Dulles', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'project-azorian') {
      rels.push({ s: 'Howard Hughes', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'pentagon-papers') {
      rels.push({ s: 'Robert McNamara', t: 'Department of Defense (DoD)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
      rels.push({ s: 'Daniel Ellsberg', t: 'Department of Defense (DoD)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'project-blue-book') {
      rels.push({ s: 'J. Allen Hynek', t: 'United States Air Force (USAF)', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
    } else if (item.case.slug === 'operation-condor') {
      rels.push({ s: 'Henry Kissinger', t: 'State Department', st: 'PERSON', tt: 'ORGANISATION', rel: 'AFFILIATED_WITH' });
      rels.push({ s: 'Augusto Pinochet', t: 'Central Intelligence Agency (CIA)', st: 'PERSON', tt: 'ORGANISATION', rel: 'ASSOCIATED_WITH' });
    }
    
    for (const r of rels) {
       const sid = eMap.get(r.s);
       const tid = eMap.get(r.t);
       if (sid && tid) {
           await db.insert(entityRelationships).values({
               id: genId('rel'),
               sourceType: r.st,
               sourceId: sid,
               targetType: r.tt,
               targetId: tid,
               relationshipType: r.rel,
               description: 'Documented intelligence/government affiliation',
               createdBy: 'seed-admin-uid'
           }).onConflictDoNothing();
           relInserted++;
       }
    }
    
    inserted++;
  }

  console.log(`\nBatch 3 Complete! Inserted Cases: ${inserted}, Skipped: ${skipped}, Entity Rels Added: ${relInserted}`);
  process.exit(0);
}

run().catch(console.error);
