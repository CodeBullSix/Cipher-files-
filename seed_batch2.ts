import { db } from './src/db/index.js';
import { caseFiles, people, organisations, locations, events, evidenceItems, sources, entityRelationships, casePeople, caseOrganisations, caseLocations, caseRelationships, eventCaseFiles, evidenceCaseFiles, eventEvidence } from './src/db/schema.js';
import { eq, ilike } from 'drizzle-orm';
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
      id: 'cf-antikythera',
      title: 'The Antikythera Mechanism: Ancient Analogue Computer',
      slug: 'antikythera-mechanism',
      summary: 'A heavily encrusted bronze artifact recovered in 1901 off the coast of the Greek island Antikythera. Modern imaging has revealed it to be an incredibly complex ancient astronomical calculator, predating similar geared technology by over a millennium.',
      description: 'The mechanism consists of at least 30 meshing bronze gears. It was used to predict astronomical positions and eclipses for calendrical and astrological purposes decades in advance. Its discovery fundamentally rewrote the understanding of ancient Greek technological engineering capabilities.',
      category: 'ARCHAEOLOGICAL_MYSTERIES',
      status: 'DOCUMENTED',
      caseNumber: 'ARCH-GR-1901',
      subtitle: 'The World\'s First Known Analogue Computer',
      officialVerdict: 'Extensive X-ray tomography by the Antikythera Mechanism Research Project confirmed the device is an advanced astronomical and calendrical computer dating to approximately 205 BC – 100 BC.',
      coverImage: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=1200&q=80',
      claim: 'Ancient Greek civilization possessed geared calculating technology comparable to 14th-century European clockwork.',
      claimOrigin: 'Derek J. de Solla Price (1959), Antikythera Mechanism Research Project (2006)',
      whatWeKnow: [
        'The artifact was discovered by sponge divers off Point Glyphadia on the Greek island of Antikythera in 1901.',
        'It tracks the Metonic cycle, the eclipse-predicting Saros cycle, and the Olympiad cycle.',
        'No other artifact of comparable complexity is known from antiquity.'
      ],
      speculations: [
        'Some scholars speculate it was constructed in Rhodes, possibly connected to the school of Posidonius or the work of Archimedes.'
      ]
    },
    people: ['Valerios Stais', 'Derek J. de Solla Price', 'Archimedes'],
    organisations: ['National Archaeological Museum (Athens)', 'Antikythera Mechanism Research Project'],
    locations: ['Antikythera, Greece', 'Athens, Greece'],
    events: [
      { date: '1901-05-17', title: 'Mechanism Discovered', description: 'Greek sponge divers recover the encrusted bronze mechanism from a Roman-era shipwreck.', rating: 'CONFIRMED' },
      { date: '1902-05-17', title: 'Valerios Stais Identifies Gears', description: 'Archaeologist Valerios Stais first notices that a piece of rock recovered from the wreck actually contains a bronze gear wheel.', rating: 'CONFIRMED' },
      { date: '2006-11-30', title: 'X-Ray Microfocus Tomography Published', description: 'Nature publishes findings from the Antikythera Mechanism Research Project revealing the intricate internal gear workings and hidden inscriptions.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'AMRP High-Resolution X-Rays', url: 'https://antikythera-mechanism.gr', description: 'Computed tomography (CT) scans revealing the internal gear trains and thousands of text characters.', type: 'DATASET', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'Decoding the ancient Greek astronomical calculator (Nature)', url: 'https://www.nature.com', type: 'ACADEMIC', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-wow-signal',
      title: 'The 1977 "Wow!" Signal',
      slug: 'wow-signal',
      summary: 'A strong, narrowband radio signal detected on August 15, 1977, by Ohio State University\'s Big Ear radio telescope, bearing expected hallmarks of non-terrestrial and non-solar system origin.',
      description: 'Lasting exactly 72 seconds, the signal was incredibly strong and appeared to come from the direction of the constellation Sagittarius. Astronomer Jerry R. Ehman was so surprised by how closely it matched the expected signature of an interstellar signal that he circled it on the printout and wrote "Wow!".',
      category: 'SCIENTIFIC_ANOMALY',
      status: 'UNVERIFIED',
      caseNumber: 'SETI-1977-WOW',
      subtitle: 'The Most Promising SETI Detection in History',
      officialVerdict: 'The signal remains unexplained. Despite extensive follow-up observations by the Big Ear and other advanced radio telescopes over decades, the signal has never been detected again.',
      coverImage: 'https://images.unsplash.com/photo-1541888079633-89689899321c?auto=format&fit=crop&w=1200&q=80',
      claim: 'The Wow! signal was a deliberate radio transmission from an extraterrestrial intelligence.',
      claimOrigin: 'Jerry R. Ehman, Big Ear Radio Observatory (1977)',
      whatWeKnow: [
        'The signal intensity peaked sharply and lasted 72 seconds, exactly matching the observational window of the Big Ear telescope sweeping the sky as the Earth rotated.',
        'The frequency (near the 1420 MHz hydrogen line) is naturally "quiet" and widely theorized to be the logical frequency for interstellar communication.',
        'It was not of terrestrial or near-Earth origin based on bandwidth and frequency characteristics.'
      ],
      speculations: [
        'Hypotheses have included a passing comet (later largely debunked), space debris reflecting a terrestrial signal, or a highly secretive military satellite, though none perfectly fit the data.',
        'Proponents of SETI view it as the best candidate for an intercepted alien transmission.'
      ]
    },
    people: ['Jerry R. Ehman'],
    organisations: ['Ohio State University', 'Search for Extraterrestrial Intelligence (SETI)', 'NASA'],
    locations: ['Big Ear Radio Observatory, Delaware, Ohio'],
    events: [
      { date: '1977-08-15', title: 'Signal Detection', description: 'Big Ear telescope records the 6EQUJ5 alphanumeric sequence representing the signal intensity.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'The "Wow!" Printout', url: 'https://www.bigear.org', description: 'The original computer printout bearing the 6EQUJ5 sequence and Ehman\'s handwritten "Wow!".', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'North American AstroPhysical Observatory (NAAPO) Archives', url: 'https://www.bigear.org', type: 'ARCHIVAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-max-headroom',
      title: 'The 1987 Max Headroom Signal Hijacking',
      slug: 'max-headroom-hijacking',
      summary: 'On November 22, 1987, an unidentified person wearing a Max Headroom mask successfully hijacked the television broadcast signals of two Chicago stations. The perpetrators were never caught.',
      description: 'In a highly sophisticated act of broadcast piracy, the hijacker overrode the signals of WGN-TV and WTTW. The video featured distorted audio, erratic behavior, and references to local Chicago personalities. The FBI investigated but failed to identify the culprits.',
      category: 'UNEXPLAINED_INCIDENTS',
      status: 'DOCUMENTED',
      caseNumber: 'FCC-CHI-1987',
      subtitle: 'Unsolved Broadcast Signal Intrusion',
      officialVerdict: 'The FCC and FBI concluded that the hijackers likely used high-power microwave transmission equipment to overpower the stations\' studio-to-transmitter links. The case remains open and unsolved.',
      coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
      claim: 'An unknown technical expert bypassed standard broadcast security to transmit an illicit broadcast over major metropolitan networks.',
      claimOrigin: 'Chicago Television Audiences / FCC (1987)',
      whatWeKnow: [
        'The first intrusion on WGN-TV lasted 25 seconds during the 9 O\'Clock News.',
        'The second intrusion on PBS affiliate WTTW lasted 90 seconds during an episode of Doctor Who.',
        'The equipment required to execute the hijack was expensive and required significant technical expertise.'
      ],
      speculations: [
        'Theories suggest the culprit may have been a disgruntled former broadcasting employee or a member of the local Chicago hacker/phreaker underground.',
        'Numerous internet communities have claimed to identify the perpetrators, but no evidence has proven conclusive.'
      ]
    },
    people: [],
    organisations: ['Federal Communications Commission (FCC)', 'Federal Bureau of Investigation (FBI)'],
    locations: ['Chicago, Illinois'],
    events: [
      { date: '1987-11-22', title: 'WGN and WTTW Hijacked', description: 'Two separate signal intrusions occur on Chicago broadcast television within hours of each other.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'WTTW Broadcast Recording', url: 'https://www.youtube.com', description: 'VCR recordings made by viewers of the 90-second WTTW intrusion during Doctor Who.', type: 'VIDEO', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'FCC Investigation Files (FOIA)', url: 'https://www.fcc.gov', type: 'OFFICIAL', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-uvb76',
      title: 'UVB-76: The Russian "Buzzer" Numbers Station',
      slug: 'uvb-76-buzzer',
      summary: 'A mysterious shortwave radio station that has been broadcasting a continuous, monotonous buzzing tone since the late 1970s, occasionally interrupted by voice transmissions in Russian.',
      description: 'Transmitting at 4625 kHz, UVB-76 is widely believed to be a military communications channel for the Russian Armed Forces. While its exact purpose is classified, theories range from a "Dead Hand" nuclear retaliation trigger to an atmospheric study tool, though it is most likely a channel for transmitting coded orders to military units.',
      category: 'GLOBAL_EVENTS',
      status: 'DOCUMENTED',
      caseNumber: 'SW-4625-UVB',
      subtitle: 'The Monotonous Enigma of the Shortwave Spectrum',
      officialVerdict: 'The Russian government has never officially acknowledged the station\'s purpose. Radio triangulation and urban explorers have located former and current transmission sites tied to the Russian military.',
      coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=1200&q=80',
      claim: 'The station acts as a secure, long-range command and control channel for Russian strategic forces.',
      claimOrigin: 'Amateur Shortwave Listeners (SWL) Community (1970s)',
      whatWeKnow: [
        'The station has operated nearly continuously since at least 1973 (originally as a two-note pip, later changing to a buzz).',
        'Occasionally, the buzz stops and a live voice reads phonetic Russian names and numbers (e.g., "UVB-76, UVB-76...").',
        'In 2010, the transmitter was moved from Povarovo near Moscow to multiple sites, including Naro-Fominsk.'
      ],
      speculations: [
        'A popular but widely debunked theory is that the Buzzer is a "Dead Hand" (Perimeter) fail-deadly switch that would launch ICBMs if the signal stops.',
        'Shortwave analysts strongly suggest it is a channel for the Western Military District command network.'
      ]
    },
    people: [],
    organisations: ['Russian Armed Forces'],
    locations: ['Povarovo, Russia', 'Naro-Fominsk, Russia'],
    events: [
      { date: '1973-01-01', title: 'First Known Broadcasts', description: 'Amateur radio operators first report hearing the station transmitting repetitive pips.', rating: 'CONFIRMED' },
      { date: '1997-12-24', title: 'First Voice Message Recorded', description: 'The buzzer stops, and a male voice transmits a coded message.', rating: 'CONFIRMED' },
      { date: '2010-08-01', title: 'Transmitter Relocation', description: 'The station goes briefly silent and changes transmission sites from Povarovo to other military nodes.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'Audio Recordings of Voice Messages', url: 'https://priyom.org', description: 'Archived audio captures of the buzzing tone being interrupted by live microphone voice traffic.', type: 'AUDIO', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'Priyom.org Numbers Station Research', url: 'https://priyom.org', type: 'ACADEMIC', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-dancing-plague',
      title: 'The Strasbourg Dancing Plague of 1518',
      slug: 'strasbourg-dancing-plague',
      summary: 'A bizarre case of choreomania that occurred in Strasbourg, Alsace, where hundreds of people danced erratically for days or weeks, with some reportedly dying from exhaustion.',
      description: 'In July 1518, a woman named Frau Troffea began dancing fervently in a street in Strasbourg. Within weeks, dozens joined her. City authorities, believing the cure was more dancing, hired musicians and built stages. It remains one of the most well-documented mass psychogenic illnesses in history.',
      category: 'HISTORICAL_ANOMALIES',
      status: 'DOCUMENTED',
      caseNumber: 'HIST-1518-ALS',
      subtitle: 'Mass Psychogenic Illness in the Holy Roman Empire',
      officialVerdict: 'Modern historians and medical sociologists generally attribute the event to a combination of stress-induced mass hysteria (psychogenic illness) fueled by intense religious superstition and extreme civic hardship.',
      coverImage: 'https://images.unsplash.com/photo-1596704179371-bdc24f6efabf?auto=format&fit=crop&w=1200&q=80',
      claim: 'Hundreds of citizens were gripped by an uncontrollable compulsion to dance until physical collapse.',
      claimOrigin: 'Strasbourg City Archives, Chronicles of Paracelsus',
      whatWeKnow: [
        'Civic records, physician notes, and sermons from the period extensively document the outbreak.',
        'Authorities initially tried to cure the dancers by encouraging them to dance continuously, which likely worsened the contagion.',
        'The dancing finally ceased when those afflicted were taken to a shrine of St. Vitus.'
      ],
      speculations: [
        'Some scholars previously suggested ergot poisoning (from a fungus on rye bread that produces LSD-like symptoms), but ergotism typically causes severe physical restriction rather than prolonged endurance dancing.',
        'The region was suffering from intense famine and disease, creating a psychological pressure cooker ideal for trance states.'
      ]
    },
    people: ['Frau Troffea', 'Paracelsus'],
    organisations: [],
    locations: ['Strasbourg, France (Holy Roman Empire)'],
    events: [
      { date: '1518-07-14', title: 'Frau Troffea Begins Dancing', description: 'The outbreak begins with a single woman dancing uncontrollably in the streets.', rating: 'CONFIRMED' },
      { date: '1518-09-01', title: 'Pilgrimage to St. Vitus', description: 'The remaining dancers are taken to the shrine of St. Vitus in Saverne, after which the epidemic subsides.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'Accounts of Paracelsus', url: 'https://example.com', description: 'Medical observations written by the physician Paracelsus detailing the event.', type: 'DOCUMENT', stance: 'SUPPORTING', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'A Time to Dance, A Time to Die (John Waller)', url: 'https://example.com', type: 'ACADEMIC', reliability: 'HIGH' }
    ]
  },
  {
    case: {
      id: 'cf-somerton-man',
      title: 'The Somerton Man (Taman Shud Case)',
      slug: 'somerton-man-taman-shud',
      summary: 'An unidentified man found dead on Somerton Park beach in South Australia in 1948. A scrap of paper reading "Tamám Shud" (Persian for "is over") was found in his pocket, sparking decades of espionage theories.',
      description: 'The perfectly dressed but label-less body carried no identification. The paper scrap was matched to a rare edition of the Rubaiyat of Omar Khayyam containing a seemingly encrypted code. In 2022, DNA analysis identified the man as Carl "Charles" Webb, an electrical engineer with no known spy connections, though the code and his exact death circumstances remain unexplained.',
      category: 'UNSOLVED',
      status: 'DOCUMENTED',
      caseNumber: 'SAPOL-1948-SM',
      subtitle: 'The Cold War Enigma of Somerton Beach',
      officialVerdict: 'The South Australia Police originally found no clear cause of death, suspecting undetectable poison. In 2022, Professor Derek Abbott and Colleen Fitzpatrick used genetic genealogy to identify the man as Carl Webb, concluding it was likely a domestic tragedy rather than an espionage assassination.',
      coverImage: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
      claim: 'The unidentified body belonged to an international spy assassinated with an undetectable poison.',
      claimOrigin: 'South Australian Press / Cold War Paranoia (1948)',
      whatWeKnow: [
        'All identification labels were carefully removed from the man\'s clothing.',
        'A secret pocket contained a scrap of paper reading "Tamám Shud" torn from a specific book found nearby.',
        'The book contained a faint, undeciphered sequence of letters often assumed to be a code.'
      ],
      speculations: [
        'For decades, many believed he was a Soviet spy due to the proximity of the Woomera rocket testing range and the removal of clothing labels.',
        'With the 2022 identification of Carl Webb, prevailing theories suggest he died by suicide following a marital separation, and the "code" may have been horse racing betting notations.'
      ]
    },
    people: ['Carl "Charles" Webb', 'Derek Abbott', 'Colleen Fitzpatrick'],
    organisations: ['South Australia Police'],
    locations: ['Somerton Park, Adelaide, Australia'],
    events: [
      { date: '1948-12-01', title: 'Body Discovered', description: 'The unidentified body is found propped against a seawall on Somerton Park beach.', rating: 'CONFIRMED' },
      { date: '1949-01-14', title: 'Tamám Shud Scrap Found', description: 'A rolled-up piece of paper is found deep in a fob pocket of the man\'s trousers.', rating: 'CONFIRMED' },
      { date: '2022-07-26', title: 'DNA Identification', description: 'Derek Abbott announces DNA results identifying the man as Carl "Charles" Webb.', rating: 'CONFIRMED' }
    ],
    evidence: [
      { title: 'The Rubaiyat Code', url: 'https://example.com', description: 'The faint penciled letters found in the back of the book associated with the body.', type: 'PHOTOGRAPH', stance: 'CONTEXTUAL', status: 'VERIFIED' }
    ],
    sources: [
      { title: 'Coronial Inquest Records, State Records of South Australia', url: 'https://archives.sa.gov.au', type: 'OFFICIAL', reliability: 'HIGH' }
    ]
  }
];

async function run() {
  console.log('Starting Case Library Expansion Seeding (Batch 2)...');
  let inserted = 0;
  let skipped = 0;

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

    // Entities
    for (const p of item.people) {
      const eId = await getOrCreateEntity('PERSON', p);
      await db.insert(casePeople).values({ caseFileId: cId, personId: eId }).onConflictDoNothing();
    }
    for (const org of item.organisations) {
      const eId = await getOrCreateEntity('ORGANISATION', org);
      await db.insert(caseOrganisations).values({ caseFileId: cId, organisationId: eId }).onConflictDoNothing();
    }
    for (const loc of item.locations) {
      const eId = await getOrCreateEntity('LOCATION', loc);
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
    
    inserted++;
  }

  console.log(`\nBatch 2 Complete! Inserted: ${inserted}, Skipped: ${skipped}`);
  process.exit(0);
}

run().catch(console.error);
