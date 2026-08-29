import { CaseFile, GraphNode, GraphLink, DiscussionThread, Comment, InvestigatorProfile, TheorySubmission, SupporterRecord } from '../types';

export const INITIAL_CASES: CaseFile[] = [
  {
    id: 'aatip-pentagon-uap',
    caseNumber: 'DoD-AATIP-001',
    title: 'AATIP & Advanced Aerospace Threat Identification',
    subtitle: 'Declassified Pentagon UAP Investigation Program',
    category: 'UFOS_UAP',
    status: 'DOCUMENTED',
    officialVerdict: 'The Department of Defense confirmed the existence of AATIP (Advanced Aerospace Threat Identification Program), a $22 million program to study unidentified anomalous phenomena (UAP), largely brought to light via FOIA requests.',
    summary: 'Through relentless Freedom of Information Act (FOIA) requests published on The Black Vault, internal DoD communications and contracting documents regarding AATIP have been released, proving the US government actively studied UAPs long after Project Blue Book was closed.',
    claim: 'The Pentagon has maintained continuous, highly classified research and monitoring of UAP incursions over restricted military airspace.',
    claimOrigin: 'FOIA Requests by The Black Vault & 2017 NYT Revelations',
    whatWeKnow: [
      'AATIP was funded by $22 million in black money requested by former Senator Harry Reid.',
      'The Black Vault obtained and published the full list of 38 Defense Intelligence Reference Documents (DIRDs) commissioned by AATIP.',
      'The US Navy confirmed the authenticity of three leaked FLIR videos showing UAP encounters with F/A-18 Super Hornets.'
    ],
    speculations: [
      'Speculation persists that AATIP was merely a small, unclassified front for a much larger Special Access Program (SAP) that holds retrieved physical materials.',
      'Some assert the released DIRDs on warp drives and metamaterials were disinformation to obscure sensor calibration testing.'
    ],
    evidenceList: [
      {
        id: 'ev-aatip-1',
        title: '38 DIRD Reports List',
        type: 'GOVERNMENT_DOC',
        rating: 'VERIFIED',
        isSupporting: true,
        provenance: 'DIA / Released via The Black Vault FOIA',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'A list of 38 theoretical physics and aerospace research papers commissioned by the Defense Intelligence Agency (DIA) for AATIP.',
        context: 'Shows the US government was actively funding research into traversable wormholes, invisibility cloaking, and advanced nuclear propulsion in relation to UAP studies.',
        counterAnalysis: 'Critics argue the papers are purely theoretical and do not prove the US possesses these technologies.',
        votes: 1102
      }
    ],
    documents: [
      {
        id: 'doc-aatip-foia',
        title: 'AATIP & AAWSAP FOIA Responses (The Black Vault)',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Department of Defense / DIA',
        dateCreated: '2020-04-27',
        fileReference: 'https://www.theblackvault.com/documentarchive/the-advanced-aerospace-threat-identification-program-aatip-dird-report-research/',
        summary: 'Declassified email chains, contracting documents, and DIRD lists revealing the existence and funding structure of AATIP.',
        fullExcerpt: 'These records confirm the Advanced Aerospace Threat Identification Program (AATIP) was funded and operated by the DoD to investigate advanced aerospace threats.',
        authenticityNote: 'Obtained via FOIA by John Greenewald Jr.',
        pageCount: 154,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-aatip-1', name: 'Luis Elizondo', type: 'PERSON', role: 'Former AATIP Director' },
      { id: 'ent-aatip-2', name: 'DIA', type: 'AGENCY', role: 'Sponsoring Agency' },
      { id: 'ent-aatip-3', name: 'Bigelow Aerospace Advanced Space Studies (BAASS)', type: 'ORGANIZATION', role: 'Primary Contractor' }
    ],
    connectedCaseIds: [],
    timeline: [],
    views: 1205,
    commentCount: 45,
    bookmarkCount: 89,
    tags: ['FOIA', 'AATIP', 'UAP', 'Pentagon', 'The Black Vault'],
    coverImage: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'nsa-tao-surveillance',
    caseNumber: 'CRYPTO-NSA-01',
    title: 'NSA TAO Catalog & Mass Surveillance',
    subtitle: 'Hardware Implants and Global Interception',
    category: 'GLOBAL_EVENTS',
    status: 'DOCUMENTED',
    officialVerdict: 'Leaked documents confirmed the existence of the NSA\'s Tailored Access Operations (TAO) unit, which intercepts hardware shipments and develops advanced exploits to compromise digital infrastructure globally.',
    summary: 'Archives like Cryptome have hosted unprecedented leaks detailing the capabilities of the NSA\'s Tailored Access Operations (TAO). These documents reveal the industrial scale of US signals intelligence, including backdoors in consumer routers and air-gap jumping malware.',
    claim: 'The NSA conducts unregulated mass surveillance on global internet traffic and physically intercepts hardware shipments to install firmware backdoors.',
    claimOrigin: 'Snowden Leaks & Cryptome Archives (2013)',
    whatWeKnow: [
      'The NSA ANT catalog details specialized hardware and software implants for Cisco, Juniper, and Huawei devices.',
      'Cryptome hosted raw data dumps showing NSA "interdiction" operations (intercepting packages in transit).',
      'Programs like PRISM allow direct data collection from major tech companies.'
    ],
    speculations: [
      'Speculation that hardware backdoors are deliberately inserted into commercial processors at the foundry level.',
      'The exact scope of domestic data collection remains highly obfuscated by FISA courts.'
    ],
    evidenceList: [
      {
        id: 'ev-crypto-1',
        title: 'NSA ANT Catalog Leaks',
        type: 'LEAKED_DOC',
        rating: 'VERIFIED',
        isSupporting: true,
        provenance: 'Der Spiegel / Cryptome Archive',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'A 50-page classified document detailing the NSA Tailored Access Operations (TAO) unit\'s specialized hacking tools.',
        context: 'Proved definitively that the NSA was intercepting hardware shipments to implant spyware before delivery.',
        counterAnalysis: 'The intelligence community argued the release provided adversaries with actionable blueprints to counter US signals intelligence.',
        votes: 856,
        userVoted: 'up'
      }
    ],
    documents: [
      {
        id: 'doc-ant-catalog',
        title: 'NSA ANT Catalog (Cryptome Archive)',
        classificationLevel: 'TOP SECRET',
        originAgency: 'National Security Agency (NSA)',
        dateCreated: '2008 (Leaked 2013)',
        fileReference: 'https://cryptome.org/2013-info/nsa-ant/nsa-ant-catalog.htm',
        summary: 'A classified catalog of specialized hacking tools developed by the NSA\'s Advanced Network Technology (ANT) Division.',
        fullExcerpt: 'The catalog lists prices and specifications for various hardware and software exploits, including COTTONMOUTH (a USB hardware implant) and DROPOUTJEEP (an iOS software implant).',
        authenticityNote: 'Leaked via Edward Snowden, mirrored on Cryptome',
        pageCount: 50,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-nsa-1', name: 'NSA TAO', type: 'AGENCY', role: 'Perpetrator' },
      { id: 'ent-nsa-2', name: 'Edward Snowden', type: 'PERSON', role: 'Whistleblower' },
      { id: 'ent-nsa-3', name: 'Cryptome', type: 'ORGANIZATION', role: 'Hosting Archive' }
    ],
    connectedCaseIds: [],
    timeline: [],
    views: 890,
    commentCount: 22,
    bookmarkCount: 45,
    tags: ['NSA', 'Surveillance', 'Cryptome', 'Snowden', 'Cyber Security'],
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'jfk-assassination',
    caseNumber: 'FILE-0001',
    title: 'JFK Assassination & Dealey Plaza',
    subtitle: 'Lone Gunman vs. Multiple Shooters & Intelligence Apparatus',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'DISPUTED',
    officialVerdict: 'Warren Commission (1964) concluded Lee Harvey Oswald acted alone. House Select Committee on Assassinations (HSCA, 1979) concluded a probable conspiracy with a high likelihood of a second shooter on the Grassy Knoll.',
    summary: 'On November 22, 1963, President John F. Kennedy was fatally shot while motorcading through Dealey Plaza, Dallas. The official single-bullet theory remains one of the most rigorously disputed forensic conclusions in modern history.',
    claim: 'The assassination was an orchestrated operation involving elements within intelligence agencies (CIA/anti-Castro Cuban networks/organized crime) utilizing crossfire positions beyond the Texas School Book Depository.',
    claimOrigin: 'Mark Lane (1964), District Attorney Jim Garrison (1967), House Select Committee on Assassinations (1979), and millions of pages declassified under the 1992 JFK Records Act.',
    whatWeKnow: [
      'John F. Kennedy was killed at 12:30 PM CST in Dealey Plaza by rifle fire.',
      'Lee Harvey Oswald was arrested at the Texas Theatre and murdered 48 hours later in police custody by Jack Ruby.',
      'The 1979 House Select Committee on Assassinations (HSCA) officially concluded that JFK was "probably assassinated as a result of a conspiracy."',
      'Oswald spent time in the Soviet Union (1959-1962) and was monitored heavily by the CIA (201 file opened 1960).',
      'Jack Ruby had extensive documented ties to organized crime figures including Santo Trafficante Jr. and Carlos Marcello.'
    ],
    speculations: [
      'Claims of a "three tramps" photographic identification linking E. Howard Hunt directly to the plaza.',
      'Unconfirmed radio transmission tape acoustic analysis disputing 3 vs 4 shot patterns.',
      'Allegations that driver William Greer turned and shot Kennedy (debunked via high-res Zapruder film examination).'
    ],
    evidenceList: [
      {
        id: 'ev-jfk-1',
        title: 'HSCA Acoustic Dictabelt Evidence (Dallas Police Channel 1)',
        type: 'AUDIO_VIDEO',
        rating: 'DISPUTED',
        isSupporting: true,
        provenance: 'House Select Committee on Assassinations, Volume VIII (1979); Bolt Beranek and Newman acoustic report',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Acoustic waveform analysis of an open motorcycle microphone recorded in Dealey Plaza indicated four gunshot impulses with a 95% probability of a shot from the Grassy Knoll.',
        context: 'National Academy of Sciences (1982) subsequently argued the impulse matched a transmission recorded elsewhere minutes later, but independent acoustic re-evaluations (Thomas, 2001) remain split.',
        counterAnalysis: 'Cross-talk on Dallas Police Department dispatch tapes suggested the open microphone belonged to an officer at the Trade Mart, not Dealey Plaza.',
        votes: 342,
        userVoted: 'up'
      },
      {
        id: 'ev-jfk-2',
        title: 'Zapruder Film Frame 313 (Head Snap Back and to the Left)',
        type: 'PHOTOGRAPH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'National Archives and Records Administration (NARA), Record Group 272',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Frames 312 to 314 document Kennedy violently thrown backward and to his left, consistent with kinetic impact from the right-front (Grassy Knoll direction).',
        context: 'Physics counter-arguments cite the "jet effect" (expulsion of cranial mass forward creating reactionary recoil) and neuro-spasm neuromuscular reaction.',
        counterAnalysis: 'Nobel physicist Luis Alvarez demonstrated with mock melon models that cranial blowouts create rearward propulsion.',
        votes: 512
      },
      {
        id: 'ev-jfk-3',
        title: 'Commission Exhibit 399 ("Single / Magic Bullet")',
        type: 'GOVERNMENT_DOC',
        rating: 'DISPUTED',
        isSupporting: false,
        provenance: 'Warren Commission Hearings, Volume XVII, CE 399; Parkland Hospital discovery',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'A 6.5×52mm Carcano bullet discovered on a Parkland Memorial Hospital stretcher showed minimal structural deformation despite allegedly traversing 7 anatomical layers and breaking 2 bones across JFK and Governor Connally.',
        context: 'Ballistic reconstruction tests with gelatin and animal bone in 1998 showed Carcano full-metal jacket ammunition is unusually hard, but medical personnel who handled the stretcher questioned whether it was Connally’s.',
        counterAnalysis: 'Computer 3D spatial alignment (Failure Analysis Associates, 1993) proved the trajectory from the 6th floor window through both victims was a straight line when seated in jump seats.',
        votes: 419
      },
      {
        id: 'ev-jfk-4',
        title: 'CIA Declassified 201 File on Lee Harvey Oswald',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'JFK Records Collection Act (1992), NARA RG 263',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Declassified files confirm the CIA maintained an active counterintelligence surveillance dossier (201-289248) on Oswald starting in 1960 under the HTLINGUAL interception program.',
        context: 'Disproves early official statements that the intelligence community had virtually no prior tracking of Oswald before the assassination.',
        counterAnalysis: 'Routing surveillance does not equal operational handler status, but proves extensive pre-assassination awareness.',
        votes: 288
      }
    ],
    timeline: [
      {
        id: 'tl-jfk-1',
        date: '1963-11-22',
        time: '12:30 PM CST',
        title: 'Motorcade Shots Fired in Dealey Plaza',
        description: 'JFK struck by rifle fire while passing Texas School Book Depository and grassy knoll area.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'Dealey Plaza, Dallas, TX'
      },
      {
        id: 'tl-jfk-2',
        date: '1963-11-22',
        time: '01:00 PM CST',
        title: 'Official Pronouncement of Death at Parkland Hospital',
        description: 'Dr. Malcolm Perry and Dr. Charles Carrico attempt resuscitation; Perry initially describes throat wound as an entrance wound in press conference.',
        rating: 'CONFIRMED',
        location: 'Parkland Memorial Hospital, Dallas, TX'
      },
      {
        id: 'tl-jfk-3',
        date: '1963-11-22',
        time: '01:50 PM CST',
        title: 'Lee Harvey Oswald Apprehended at Texas Theatre',
        description: 'Oswald arrested following the fatal shooting of Dallas Patrolman J.D. Tippit.',
        rating: 'CONFIRMED',
        location: 'Texas Theatre, Oak Cliff, Dallas, TX'
      },
      {
        id: 'tl-jfk-4',
        date: '1963-11-24',
        time: '11:21 AM CST',
        title: 'Jack Ruby Murders Oswald on Live Television',
        description: 'Nightclub owner with syndicate links fatally shoots Oswald in the basement of Dallas Police HQ.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'Dallas Police Headquarters'
      },
      {
        id: 'tl-jfk-5',
        date: '1979-03-29',
        title: 'HSCA Issues Final Report Alleging Probable Conspiracy',
        description: 'Congress rejects lone assassin conclusion and recommends further DOJ investigation into secondary co-conspirators.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'U.S. House of Representatives, Washington, D.C.'
      }
    ],
    documents: [
      {
        id: 'doc-jfk-1',
        title: 'Warren Commission Executive Session Transcripts',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'President’s Commission on the Assassination of President Kennedy',
        dateCreated: '1964-01-27',
        dateDeclassified: '1993-08-15',
        fileReference: 'NARA RG 272, Entry 1, Box 1',
        summary: 'Secret executive deliberations between Chief Justice Earl Warren, Allen Dulles, and Gerald Ford regarding Dallas rumours that Oswald was an FBI or CIA informant (No. 116).',
        fullExcerpt: 'MR. RANKIN: "The rumor was that Oswald was an undercover agent for the FBI... having the number 179 at $200 a month... If that is true, you can see how ugly a matter it is for the Commission to deal with."',
        redactedExcerpt: 'MR. RANKIN: "The rumor was that [REDACTED] was an undercover [REDACTED] for the [REDACTED]... If that is true, you can see how ugly a matter it is for the Commission to deal with."',
        authenticityNote: 'Original certified transcript held in National Archives II, College Park, MD.',
        pageCount: 42,
        downloadable: true
      },
      {
        id: 'doc-jfk-2',
        title: 'CIA Memorandum on Oswald’s Mexico City Contacts',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Central Intelligence Agency (Directorate of Plans)',
        dateCreated: '1963-10-10',
        dateDeclassified: '2017-10-26',
        fileReference: 'DIR-74830 / JFK Collection 104-10015-10024',
        summary: 'Cable documenting Oswald’s surveillance at Soviet and Cuban embassies in Mexico City six weeks before the assassination, and Soviet KGB Department 13 contact.',
        fullExcerpt: 'SUBJECT: LEE HENRY OSWALD. "According to reliable source, on 1 October 1963, subject visited Soviet Embassy in Mexico City and spoke with Consul Valeriy Vladimirovich Kostikov, an identified KGB Department 13 assassination officer."',
        authenticityNote: 'Declassified under President Trump/Biden JFK Records Act release.',
        pageCount: 3,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-1', name: 'Lee Harvey Oswald', type: 'PERSON', role: 'Designated Sole Gunman / Disputed Operative', targetCaseId: 'jfk-assassination' },
      { id: 'ent-2', name: 'Jack Ruby', type: 'PERSON', role: 'Nightclub Owner / Oswald Assassin / Mob Associate' },
      { id: 'ent-3', name: 'Allen Dulles', type: 'PERSON', role: 'Former CIA Director (fired by JFK) / Warren Commissioner' },
      { id: 'ent-4', name: 'Central Intelligence Agency (CIA)', type: 'AGENCY', role: 'Intelligence Oversight & Surveillance' },
      { id: 'ent-5', name: 'Dealey Plaza', type: 'LOCATION', role: 'Assassination Site, Dallas, TX' },
      { id: 'ent-6', name: 'Project MKUltra', type: 'CASE', role: 'Sub-Project Behavioral Modification Program', targetCaseId: 'mkultra-program' },
      { id: 'ent-7', name: 'Operation Northwoods', type: 'CASE', role: 'Declassified 1962 False-Flag Proposal to JFK', targetCaseId: 'operation-northwoods' }
    ],
    connectedCaseIds: ['mkultra-program', 'operation-northwoods', 'bay-of-pigs-dossier'],
    views: 48920,
    commentCount: 847,
    bookmarkCount: 3120,
    isFeatured: true,
    communityVerdictVote: {
      confirmed: 120,
      disputed: 2480,
      unverified: 450,
      debunked: 60
    }
  },
  {
    id: 'mkultra-program',
    caseNumber: 'FILE-0002',
    title: 'Project MKUltra: Mind Control & Behavior Modification',
    subtitle: 'CIA Chemical Interrogation, Covert Dosing & Behavioral Engineering',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Officially acknowledged and condemned in 1975 Church Committee Hearings and 1977 Senate Select Committee on Intelligence hearings; financial compensation ordered by Congress for multiple victim estates.',
    summary: 'Project MKUltra was a top-secret CIA program of human experimentation in behavioral modification, psychoactive drug administration (including involuntary LSD dosing), hypnosis, sensory deprivation, and psychological torture conducted between 1953 and 1973.',
    claim: 'The CIA conducted systematic covert medical and psychological experiments on unwitting US and Canadian citizens to develop chemical mind control, truth serums, and memory wiping.',
    claimOrigin: 'Discovered in 1974 by investigative journalist Seymour Hersh (New York Times); substantiated by the 1975 Rockefeller Commission and Church Committee after discovery of misfiled financial vouchers.',
    whatWeKnow: [
      'Project MKUltra was authorized in April 1953 by CIA Director Allen Dulles and directed by Sidney Gottlieb.',
      'The project spanned over 149 subprojects across 80 universities, hospitals, research foundations, and federal prisons.',
      'Experiments included administering high-dose LSD, electroconvulsive therapy, sensory deprivation, and paralytic curare to unwitting subjects.',
      'CIA Director Richard Helms ordered the destruction of virtually all MKUltra files in 1973 prior to leaving office; roughly 20,000 pages of misfiled financial accounting records survived at the St. Louis Records Center.',
      'Dr. Sidney Gottlieb admitted under Senate oath that the CIA covertly dosed army scientist Dr. Frank Olson with LSD days before his mysterious 13th-floor fall in Manhattan.'
    ],
    speculations: [
      'Claims that the CIA successfully developed permanent Manchurian Candidate remote triggers (unsubstantiated by declassified records; project concluded results were too erratic and unpredictable).',
      'Theories linking Sirhan Sirhan directly to hypnoprogramming in the RFK assassination.'
    ],
    evidenceList: [
      {
        id: 'ev-mk-1',
        title: 'Senate Select Committee on Intelligence (Church Committee) Report, Book I',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'U.S. Senate Report 94-755, 94th Congress, 2d Session (1976)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official congressional finding documenting 20 years of non-consensual human pharmacological experimentation on military personnel, prisoners, and mental patients.',
        context: 'Forms the legal and historical foundation of modern informed consent standards in United States research.',
        votes: 890,
        userVoted: 'up'
      },
      {
        id: 'ev-mk-2',
        title: 'Operation Midnight Climax Safehouse Financial Records',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'CIA Financial Division records discovered 1977, Freedom of Information Act Release',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Records proving the CIA established brothels in San Francisco and New York staffed by sex workers who slipped LSD to unsuspecting patrons while CIA agents observed through two-way mirrors.',
        context: 'Directed by federal narcotics agent George Hunter White under Sidney Gottlieb.',
        votes: 620
      },
      {
        id: 'ev-mk-3',
        title: 'Dr. Frank Olson Autopsy & Forensic Exhumation (1994)',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Forensic pathology team led by Prof. James Starrs, George Washington University',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Exhumation revealed pre-fall blunt cranial trauma above the left eye prior to going through the closed hotel window, contradicting the original single-suicide claim.',
        context: 'President Gerald Ford previously issued a formal apology to the Olson family in the Oval Office in 1975 and paid a $750,000 settlement.',
        votes: 480
      }
    ],
    timeline: [
      {
        id: 'tl-mk-1',
        date: '1953-04-13',
        title: 'Project MKUltra Formally Authorized',
        description: 'CIA Director Allen Dulles approves the behavioral modification program under Technical Services Staff (TSS).',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'CIA Headquarters, Langley, VA'
      },
      {
        id: 'tl-mk-2',
        date: '1953-11-28',
        title: 'Death of Dr. Frank Olson',
        description: 'Army biochemist dies after plunging from room 1018A of the Hotel Statler in NYC nine days after being covertly dosed with LSD at Deep Creek Lake.',
        rating: 'CONFIRMED',
        location: 'New York City, NY'
      },
      {
        id: 'tl-mk-3',
        date: '1973-01-30',
        title: 'Richard Helms Orders Complete File Destruction',
        description: 'CIA Director issues orders to incinerate all MKUltra, MKSearch, and Bluebird/Artichoke operational dossiers.',
        rating: 'CONFIRMED',
        isMilestone: true
      },
      {
        id: 'tl-mk-4',
        date: '1977-08-03',
        title: 'Joint Senate Hearing with Ted Kennedy & St. Louis Document Discovery',
        description: 'Senator Edward Kennedy convenes public hearings after 20,000 financial records survive.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'U.S. Capitol, Washington, D.C.'
      }
    ],
    documents: [
      {
        id: 'doc-mk-1',
        title: 'MKUltra Subproject 68: Dr. Ewen Cameron Allan Memorial Institute Protocol',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'CIA Technical Services Division',
        dateCreated: '1957-03-01',
        dateDeclassified: '1977-09-12',
        fileReference: 'MKUltra Doc #17404, McGill University Subproject',
        summary: 'Declassified funding records for "psychic driving" experiments: putting psychiatric patients into drug-induced comas for months while playing looped audio messages hundreds of thousands of times.',
        fullExcerpt: 'PROJECT DESCRIPTION: "An examination of methods for the de-patterning of established mental pathways utilizing continuous sleep therapy, high voltage ECT (Page-Russell method), and continuous audio loop stimulation."',
        authenticityNote: 'Certified records produced under 1977 FOIA Senate deposition.',
        pageCount: 18,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-mk-1', name: 'Dr. Sidney Gottlieb', type: 'PERSON', role: 'CIA Chief of Technical Services Staff / "Poisoner in Chief"' },
      { id: 'ent-mk-2', name: 'Allen Dulles', type: 'PERSON', role: 'CIA Director (1953–1961)' },
      { id: 'ent-mk-3', name: 'Dr. Frank Olson', type: 'PERSON', role: 'Fort Detrick Biochemist / LSD Experiment Victim' },
      { id: 'ent-mk-4', name: 'Central Intelligence Agency (CIA)', type: 'AGENCY', role: 'Executive Intelligence Agency' },
      { id: 'ent-mk-5', name: 'Allan Memorial Institute', type: 'ORGANIZATION', role: 'Montreal Psychiatric Clinic / Research Facility' }
    ],
    connectedCaseIds: ['jfk-assassination', 'operation-northwoods', 'havana-syndrome'],
    views: 61400,
    commentCount: 1120,
    bookmarkCount: 4900,
    isFeatured: true,
    communityVerdictVote: {
      confirmed: 4200,
      disputed: 110,
      unverified: 45,
      debunked: 8
    }
  },
  {
    id: 'operation-northwoods',
    caseNumber: 'FILE-0003',
    title: 'Operation Northwoods: Proposed False-Flag Justification for War',
    subtitle: 'Joint Chiefs of Staff 1962 Memorandum to Stage Domestic Terror',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Officially declassified in full by the JFK Assassination Records Review Board (ARRB) on November 18, 1997. Document authenticity is undisputed.',
    summary: 'In 1962, the Chairman of the Joint Chiefs of Staff, General Lyman Lemnitzer, signed and presented a top-secret memorandum proposing that the US military stage real and simulated terrorist attacks against US military and civilian targets to justify a military invasion of Cuba.',
    claim: 'The highest levels of the US military planned domestic false-flag attacks (hijacking planes, sinking refugee boats, blowing up US ships, staging terror in Miami and DC) and blaming Fidel Castro.',
    claimOrigin: 'Declassified 1997 by the ARRB; published by author James Bamford in "Body of Secrets" (2001).',
    whatWeKnow: [
      'The memorandum was signed by all members of the Joint Chiefs of Staff on March 13, 1962.',
      'Proposals included: sinking an American ship in Guantanamo Bay and blaming Cuba; exploding a drone aircraft painted to look like a chartered civilian flight; orchestrating casualty lists in US newspapers; bombing Miami.',
      'President John F. Kennedy directly rejected the proposal during an Oval Office meeting on March 16, 1962.',
      'General Lemnitzer was subsequently denied a second term as Chairman of the Joint Chiefs by Kennedy and reassigned to Europe as NATO Supreme Commander.'
    ],
    speculations: [
      'Theories claiming Northwoods plans were adapted and executed in later historical conflicts without declassified evidentiary linkage.'
    ],
    evidenceList: [
      {
        id: 'ev-nw-1',
        title: 'Memorandum for the Secretary of Defense: Justification for US Military Intervention in Cuba (TS)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'National Archives Record Group 218, Joint Chiefs of Staff Files, JCSM-184-62',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Primary declassified memo outlining Annex A and Annex B: step-by-step methods to manufacture casus belli.',
        context: 'Unanimously endorsed by Army, Navy, Air Force, and Marine Corps top leadership.',
        votes: 1150,
        userVoted: 'up'
      }
    ],
    timeline: [
      {
        id: 'tl-nw-1',
        date: '1962-03-13',
        title: 'Joint Chiefs Sign Northwoods Proposal',
        description: 'General Lyman Lemnitzer transmits JCSM-184-62 to Secretary of Defense Robert McNamara.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'The Pentagon, Arlington, VA'
      },
      {
        id: 'tl-nw-2',
        date: '1962-03-16',
        title: 'JFK Rejects Operation Northwoods',
        description: 'President Kennedy informs Lemnitzer in the Oval Office that the US will not use overt military force against Cuba.',
        rating: 'CONFIRMED',
        location: 'The White House, Washington, D.C.'
      },
      {
        id: 'tl-nw-3',
        date: '1997-11-18',
        title: 'Full Declassification by ARRB',
        description: 'The Assassination Records Review Board releases all 15 pages unredacted to the public.',
        rating: 'CONFIRMED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-nw-1',
        title: 'JCSM-184-62: Annex to Appendix to Enclosure A',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Joint Chiefs of Staff',
        dateCreated: '1962-03-13',
        dateDeclassified: '1997-11-18',
        fileReference: 'NARA RG 218, Box 139, Folder 0184-62',
        summary: 'Exact tactical operational list detailing fake funeral ceremonies for mock casualties, remote-controlled drone switch-outs over Florida straits, and mock sabotage.',
        fullExcerpt: '"We could blow up a US ship in Guantanamo Bay and blame Cuba... Casualty lists in US newspapers would cause a helpful wave of national indignation... We could develop a Communist Cuban terror campaign in the Miami area, in other Florida cities and even in Washington."',
        authenticityNote: 'Verified original document available via National Security Archive (George Washington University).',
        pageCount: 15,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-nw-1', name: 'General Lyman Lemnitzer', type: 'PERSON', role: 'Chairman of the Joint Chiefs of Staff (1960–1962)' },
      { id: 'ent-nw-2', name: 'John F. Kennedy', type: 'PERSON', role: '35th President of the United States', targetCaseId: 'jfk-assassination' },
      { id: 'ent-nw-3', name: 'Robert McNamara', type: 'PERSON', role: 'Secretary of Defense' },
      { id: 'ent-nw-4', name: 'Joint Chiefs of Staff', type: 'AGENCY', role: 'Senior Military Leadership' },
      { id: 'ent-nw-5', name: 'Guantanamo Bay Naval Base', type: 'LOCATION', role: 'Proposed False-Flag Sabotage Target' }
    ],
    connectedCaseIds: ['jfk-assassination', 'mkultra-program', 'bay-of-pigs-dossier'],
    views: 39400,
    commentCount: 420,
    bookmarkCount: 2800,
    communityVerdictVote: {
      confirmed: 3500,
      disputed: 80,
      unverified: 20,
      debunked: 5
    }
  },
  {
    id: 'roswell-incident-1947',
    caseNumber: 'FILE-0004',
    title: 'The Roswell Incident & Project Mogul',
    subtitle: 'Extraterrestrial Craft Crash Claim vs. Top Secret Cold War Acoustic Spy Balloon',
    category: 'UFOS_UAP',
    status: 'DISPUTED',
    officialVerdict: 'USAF 1994 Report concluded the debris belonged to Project Mogul Flight #4 (classified nuclear infrasound detection balloon train); USAF 1997 Report explained alien body claims as high-altitude anthropomorphic crash test dummies used in 1953-1959.',
    summary: 'In July 1947, rancher Mac Brazel recovered unusual debris near Corona, NM. The 509th Bomb Group issued an official press release announcing the capture of a "flying disc," which was retracted 24 hours later as a weather balloon with radar target.',
    claim: 'An extraterrestrial spacecraft crashed in New Mexico, and the US military recovered wreckage and biological entities, establishing an 80-year classified coverup program.',
    claimOrigin: 'Roswell Army Air Field (RAAF) Press Release by Lt. Walter Haut (July 8, 1947); resurrected by Stanton Friedman & Jesse Marcel (1978).',
    whatWeKnow: [
      'On July 8, 1947, Public Information Officer Walter Haut issued an official press release stating RAAF had recovered a flying disc.',
      'Brigadier General Roger Ramey held a press conference the next day displaying tinfoil and balsa wood sticks, claiming it was a Rayon weather balloon.',
      'Major Jesse Marcel (509th Intelligence Officer) stated on record in 1978 that the material he recovered at Foster Ranch was not a weather balloon and possessed unusual tensile and non-combustible properties.',
      'Project Mogul was a real, highly classified NYU/USAF project utilizing multi-balloon trains and acoustic microphones to detect Soviet nuclear tests in the upper atmosphere.',
      'Air Force timeline on anthropomorphic dummy testing occurred in the mid-1950s, creating an unresolved temporal discrepancy with the 1947 incident dates.'
    ],
    speculations: [
      'The "Santilli Alien Autopsy Film" (1995) — thoroughly debunked as a staged prop production by Ray Santilli and John Humphreys.',
      'Ramey Memo optical character recognition claims stating words like "victims of the wreck" (forensically unproven / inconclusive).'
    ],
    evidenceList: [
      {
        id: 'ev-ros-1',
        title: 'Original Roswell Daily Record Headline & RAAF Press Release (July 8, 1947)',
        type: 'JOURNALISM',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Roswell Daily Record, July 8, 1947; AP Wire Dispatch',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Front-page headline: "RAAF Captures Flying Saucer On Ranch in Roswell Region." Proof that military officially claimed a disc before retracting.',
        context: 'Authorized by Base Commander Col. William Blanchard.',
        votes: 740,
        userVoted: 'up'
      },
      {
        id: 'ev-ros-2',
        title: 'USAF Project Mogul Historical Correlation Report (1994)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'USAF Headquarters Report: "Report of Air Force Research Regarding the Roswell Incident"',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Proves NYU Project Mogul Flight #4 launched June 4, 1947, consisting of neoprene balloons, radar reflectors made by toy company Olmo with purplish adhesive tape with floral/hieroglyphic symbols, unrecovered until Brazel found it.',
        context: 'Matches Marcel’s description of foil-backed paper, balsa wood struts, and unusual geometric tape markings.',
        votes: 560
      },
      {
        id: 'ev-ros-3',
        title: 'Jesse Marcel Sr. On-Camera Testimony (1978-1980)',
        type: 'TESTIMONY',
        rating: 'DISPUTED',
        isSupporting: true,
        provenance: 'Filmed interviews with researcher Leonard Stringfield and Bob Pratt',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Major Marcel testified that General Ramey switched the debris in his Fort Worth office and substituted ordinary weather balloon material for the press photos.',
        context: 'Firsthand testimony from the 509th Bomb Group intelligence officer that initiated modern Roswell public inquiry.',
        votes: 680
      }
    ],
    timeline: [
      {
        id: 'tl-ros-1',
        date: '1947-07-02',
        title: 'Mac Brazel Discovers Debris Field',
        description: 'Rancher finds spread of metallic foil, beams, and lightweight debris across Foster Ranch near Corona, NM.',
        rating: 'CONFIRMED',
        location: 'Foster Ranch, Lincoln County, NM'
      },
      {
        id: 'tl-ros-2',
        date: '1947-07-08',
        time: '11:00 AM',
        title: '509th Bomb Group Press Release',
        description: 'Military announces recovery of a "flying disc."',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'Roswell Army Air Field, NM'
      },
      {
        id: 'tl-ros-3',
        date: '1947-07-09',
        title: 'Weather Balloon Cover Story Broadcast',
        description: 'General Ramey stages press conference in Fort Worth showing weather reflector.',
        rating: 'CONFIRMED',
        location: 'Fort Worth, TX'
      },
      {
        id: 'tl-ros-4',
        date: '1994-07-28',
        title: 'USAF Releases Project Mogul Findings',
        description: 'Air Force and GAO complete declassification review concluding Mogul spy balloon debris.',
        rating: 'CONFIRMED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-ros-1',
        title: 'FBI Teletype: Flying Disc Recovery at Roswell',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Federal Bureau of Investigation (Dallas Office)',
        dateCreated: '1947-07-08',
        dateDeclassified: '1977-01-01',
        fileReference: 'FBI Vault 62-83894-209',
        summary: 'Teletype to J. Edgar Hoover noting 8th Air Force stated the object resembled a high-altitude weather balloon with radar reflector, but had been transported to Wright Field for examination.',
        fullExcerpt: '"Major Curtan, HQ 8th Air Force, advised... object was hexagonal in shape and was suspended from a balloon by cable... description resembles high altitude weather balloon... information transmitted to Wright Field for evaluation."',
        authenticityNote: 'Official document in FBI Electronic Vault.',
        pageCount: 1,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-ros-1', name: 'Major Jesse Marcel', type: 'PERSON', role: '509th Bomb Group Intelligence Officer' },
      { id: 'ent-ros-2', name: 'Brigadier General Roger Ramey', type: 'PERSON', role: 'Commander, 8th Air Force' },
      { id: 'ent-ros-3', name: '509th Bomb Wing', type: 'AGENCY', role: 'Only Atomic Bomb Squadron in 1947' },
      { id: 'ent-ros-4', name: 'Area 51 / Groom Lake', type: 'LOCATION', role: 'Classified Flight Test Facility', targetCaseId: 'area-51-groom-lake' },
      { id: 'ent-ros-5', name: 'Wright-Patterson Air Force Base', type: 'LOCATION', role: 'Foreign Technology Division' }
    ],
    connectedCaseIds: ['area-51-groom-lake', 'project-blue-book'],
    views: 74200,
    commentCount: 1540,
    bookmarkCount: 5200,
    isFeatured: true,
    communityVerdictVote: {
      confirmed: 1400,
      disputed: 3100,
      unverified: 950,
      debunked: 420
    }
  },
  {
    id: 'gary-webb-dark-alliance',
    caseNumber: 'FILE-0005',
    title: 'Gary Webb & "Dark Alliance": Contras, Cocaine & Intelligence Logistics',
    subtitle: 'Nicaraguan FDN Drug Trafficking, CIA Logistics & the 1980s Crack Epidemic',
    category: 'MONEY_POWER',
    status: 'CONFIRMED',
    officialVerdict: '1998 CIA Inspector General Frederick Hitz Report confirmed the CIA worked with dozens of Contra figures and logistical airlines known to be engaged in narcotics trafficking and shielded them from DEA prosecution.',
    summary: 'In 1996, San Jose Mercury News journalist Gary Webb published a 3-part investigative series alleging that a CIA-backed Nicaraguan Contra drug ring (Danilo Blandon & Norwin Meneses) funneled thousands of kilograms of cocaine into South Central Los Angeles (via "Freeway" Ricky Ross) to finance the Contra war.',
    claim: 'The CIA condoned, facilitated, and protected massive cocaine trafficking into American inner-city neighborhoods to fund the anti-Sandinista Contra guerillas after Congress cut off direct funding (Boland Amendment).',
    claimOrigin: 'San Jose Mercury News (August 1996), Senator John Kerry Subcommittee on Terrorism, Narcotics and International Operations (1989).',
    whatWeKnow: [
      'Congress passed the Boland Amendment in 1982-1984 prohibiting federal funding for military overthrows in Nicaragua.',
      'The 1989 Senate Kerry Committee Report concluded that "Contra drug trafficking was known to officials... who turned a blind eye to funds derived from drugs."',
      'Volume II of the 1998 CIA Inspector General Report documented that the CIA maintained working relationships with 58 Contra individuals and entities implicated in drug trafficking.',
      'The CIA and Department of Justice had a signed memorandum of understanding (1982 to 1995) relieving the CIA of the obligation to report drug trafficking by non-employees.',
      'Gary Webb was aggressively attacked by mainstream media (Washington Post, NYT, LAT) and pushed out of journalism; in 2004, Webb died of two gunshot wounds to the head, ruled suicide by the Sacramento Coroner.'
    ],
    speculations: [
      'Claims that the CIA intentionally engineered crack cocaine specifically to destroy Black urban communities (Webb never wrote this, though headline art implied intentionality).'
    ],
    evidenceList: [
      {
        id: 'ev-gw-1',
        title: 'CIA Inspector General Report: Allegations of Connections to Contras in Cocaine Trafficking (Vol. II, 1998)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Office of Inspector General, Central Intelligence Agency, Report 96-0143-IG (1998)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'CIA IG Frederick Hitz documented that the Agency was repeatedly notified of Contra-linked trafficking pipelines and suppressed DEA investigations to protect covert foreign policy priorities.',
        context: 'Substantiated the core investigative premise of Gary Webb two years after Webb was disgraced by mainstream media.',
        votes: 810,
        userVoted: 'up'
      },
      {
        id: 'ev-gw-2',
        title: '1982 CIA-DOJ Memorandum of Understanding (Casey-Smith Agreement)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'U.S. Department of Justice & CIA Interagency Agreement declassified 1998',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Agreement signed by CIA Director William Casey and Attorney General William French Smith explicitly omitting narcotics from crimes the CIA was required to report to federal law enforcement.',
        context: 'Documented interagency legal arrangement between CIA and DOJ.',
        votes: 640
      }
    ],
    timeline: [
      {
        id: 'tl-gw-1',
        date: '1986-10-05',
        title: 'C-123 Cargo Plane Shot Down in Nicaragua',
        description: 'Eugene Hasenfus captured with CIA-connected Southern Air Transport weapons shipment, exposing Iran-Contra network.',
        rating: 'CONFIRMED',
        location: 'Nicaragua'
      },
      {
        id: 'tl-gw-2',
        date: '1996-08-18',
        title: 'San Jose Mercury News Publishes "Dark Alliance"',
        description: 'Gary Webb publishes landmark multi-media series online with primary audio, court transcripts, and wiretaps.',
        rating: 'CONFIRMED',
        isMilestone: true
      },
      {
        id: 'tl-gw-3',
        date: '1998-10-08',
        title: 'CIA Inspector General Releases Volume II Confirming Contra Drug Ties',
        description: 'Internal investigation validates key findings of intelligence protection for narcotics distributors.',
        rating: 'CONFIRMED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-gw-1',
        title: 'Kerry Committee Report: Drugs, Law Enforcement and Foreign Policy',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'U.S. Senate Foreign Relations Committee',
        dateCreated: '1989-12-01',
        fileReference: 'S. Prt. 100-165, 100th Congress',
        summary: 'Official Senate finding that senior US foreign policy officials knowingly collaborated with Contra logistics providers who smuggled illicit narcotics into the US.',
        fullExcerpt: '"The logic of having drug money support the Contras was inevitable... Elements of the Contras were involved in drug trafficking, and the US government ignored the evidence."',
        authenticityNote: 'Public domain Senate committee hearing volume.',
        pageCount: 430,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-gw-1', name: 'Gary Webb', type: 'PERSON', role: 'Investigative Journalist / Pulitzer Prize Winner' },
      { id: 'ent-gw-2', name: 'Freeway Ricky Ross', type: 'PERSON', role: 'South Central LA Cocaine Kingpin' },
      { id: 'ent-gw-3', name: 'Danilo Blandon', type: 'PERSON', role: 'Contra Fundraiser & Drug Trafficker / DEA Informant' },
      { id: 'ent-gw-4', name: 'Central Intelligence Agency (CIA)', type: 'AGENCY', role: 'Foreign Intelligence Service' },
      { id: 'ent-gw-5', name: 'Oliver North', type: 'PERSON', role: 'National Security Council Staffer / Iran-Contra Coordinator' }
    ],
    connectedCaseIds: ['mkultra-program', 'jfk-assassination'],
    views: 31800,
    commentCount: 512,
    bookmarkCount: 2300,
    communityVerdictVote: {
      confirmed: 2900,
      disputed: 120,
      unverified: 40,
      debunked: 10
    }
  },
  {
    id: 'apollo-moon-landing',
    caseNumber: 'FILE-0006',
    title: 'Apollo 11 Moon Landing Hoax Claims',
    subtitle: 'Photographic & Telemetry Claims vs. Physical Lunar Retroreflectors & LRO Imagery',
    category: 'GLOBAL_EVENTS',
    status: 'DEBUNKED',
    officialVerdict: 'Conclusively proven authentic via physical lunar laser ranging retroreflectors, 382 kg of verified lunar basalt samples returned, independent Soviet tracking telemetry, and 0.5-meter resolution Lunar Reconnaissance Orbiter (LRO) surface photographs of descent stages and rover tracks.',
    summary: 'Proponents claim NASA staged and filmed the 1969 Apollo 11 lunar landing in a Hollywood studio (often claiming Stanley Kubrick directed it) due to technical inability to traverse the Van Allen radiation belts or beat the USSR in the Space Race.',
    claim: 'No human has ever landed on the Moon; all telemetry, broadcasts, and lunar photos were synthetic Cold War propaganda staged in Area 51 or soundstages.',
    claimOrigin: 'Bill Kaysing, "We Never Went to the Moon: America’s Thirty Billion Dollar Swindle" (1976).',
    whatWeKnow: [
      'Over 400,000 scientists, engineers, contractors, and technicians worked across NASA, Grumman, Boeing, and MIT to build the Saturn V and Apollo systems.',
      'The Soviet Union possessed state-of-the-art radio telemetry interception stations (Simferopol and Yevpatoria) and independently tracked Apollo 11’s radio signals from the lunar surface, acknowledging American victory.',
      'Apollo 11, 14, and 15 left Lunar Laser Ranging Retroreflector arrays that continue to be targeted by observatories worldwide (e.g. McDonald Observatory, Apache Point) to measure Earth-Moon distance down to millimeters.',
      'Lunar Reconnaissance Orbiter (LRO) satellite images from 2009-2023 clearly photograph the Apollo 11 descent stage, equipment jettisons, and astronaut footpaths.',
      'Independent geochemical analysis of 382 kg of returned moon rocks by labs in 40+ nations proved complete absence of hydrous minerals, unique impact-shock glass beads, and exposure to unfiltered cosmic ray tracks impossible to replicate in terrestrial labs in 1969.'
    ],
    speculations: [
      'Claims that the flag "waves in a wind" (explained by pendulum inertia and horizontal support rod that jammed).',
      'Missing stars in photos (standard daytime optical exposure dynamics with bright reflective sunlit lunar regolith).'
    ],
    evidenceList: [
      {
        id: 'ev-moon-1',
        title: 'Lunar Laser Ranging Experiment (LRA Retroreflectors)',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'Apache Point Observatory Lunar Laser-ranging Operation (APOLLO), New Mexico',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Photons fired from terrestrial lasers bounce back from the exact coordinates of the Apollo retroreflectors placed on the lunar surface.',
        context: 'Provides physical, continuously repeatable empirical proof of human-placed hardware at landing sites.',
        votes: 1250,
        userVoted: 'up'
      },
      {
        id: 'ev-moon-2',
        title: 'Soviet Space Agency (OKB-1) Telemetry Interception',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'State Archives of the Russian Federation (GARF), OKB-1 Records',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Soviet intelligence and space monitoring stations tracked voice, telemetry, and television signals directly from lunar coordinates. If faked, the USSR had supreme incentive to expose the deception.',
        context: 'Hostile Cold War rival telemetry independently verified signal origin.',
        votes: 980
      }
    ],
    timeline: [
      {
        id: 'tl-moon-1',
        date: '1969-07-20',
        time: '20:17:40 UTC',
        title: 'Eagle Lunar Module Touches Down on Sea of Tranquility',
        description: 'Neil Armstrong and Buzz Aldrin complete first crewed lunar landing.',
        rating: 'CONFIRMED',
        isMilestone: true,
        location: 'Mare Tranquillitatis, Moon'
      },
      {
        id: 'tl-moon-2',
        date: '1976-06-01',
        title: 'Bill Kaysing Publishes First Hoax Book',
        description: 'Former Rocketdyne technical writer self-publishes booklet establishing early hoax talking points.',
        rating: 'UNVERIFIED',
        location: 'California'
      },
      {
        id: 'tl-moon-3',
        date: '2009-07-17',
        title: 'NASA LRO Captures High-Res Surface Evidence',
        description: 'Lunar Reconnaissance Orbiter photographs Apollo 11, 14, 15, 16, 17 landing hardware and dual tracks.',
        rating: 'CONFIRMED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-moon-1',
        title: 'NASA Apollo 11 Mission Evaluation Report',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'National Aeronautics and Space Administration (Manned Spacecraft Center)',
        dateCreated: '1969-09-01',
        fileReference: 'MSC-00171 / NASA SP-238',
        summary: 'Full 220-page engineering post-flight telemetry breakdown, trajectory tracking curves, and descent propulsion telemetry.',
        fullExcerpt: '"The Apollo 11 mission was the eleventh in a series of flights using Apollo-Saturn hardware and was the first lunar landing mission of the Apollo Program... All primary mission objectives were accomplished."',
        authenticityNote: 'Archived at NASA Johnson Space Center History Collection.',
        pageCount: 220,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-moon-1', name: 'Neil Armstrong', type: 'PERSON', role: 'Commander, Apollo 11' },
      { id: 'ent-moon-2', name: 'Buzz Aldrin', type: 'PERSON', role: 'Lunar Module Pilot, Apollo 11' },
      { id: 'ent-moon-3', name: 'NASA', type: 'AGENCY', role: 'National Aeronautics and Space Administration' },
      { id: 'ent-moon-4', name: 'Area 51 / Groom Lake', type: 'LOCATION', role: 'Alleged Fake Soundstage Site in Hoax Theories', targetCaseId: 'area-51-groom-lake' }
    ],
    connectedCaseIds: ['area-51-groom-lake'],
    views: 45200,
    commentCount: 920,
    bookmarkCount: 1600,
    communityVerdictVote: {
      confirmed: 120,
      disputed: 340,
      unverified: 210,
      debunked: 4600
    }
  },
  {
    id: 'havana-syndrome',
    caseNumber: 'FILE-0007',
    title: 'Havana Syndrome: Directed Energy vs. Psychogenic Illness',
    subtitle: 'Anomalous Health Incidents (AHI) Among Diplomatic & Intelligence Personnel',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'DISPUTED',
    officialVerdict: '2023 National Intelligence Council (NIC) Assessment concluded it is "very unlikely" a foreign adversary was responsible; however, a 2020 National Academies of Sciences study found pulsed radio frequency / microwave energy was the most plausible mechanism.',
    summary: 'Beginning in late 2016 at the US Embassy in Havana, Cuba, and subsequently in Vienna, Guangzhou, and Washington, dozens of CIA officers, State Department diplomats, and military attachés reported acute onset sound perceptions, vestibular disorientation, and traumatic brain injury symptoms.',
    claim: 'A hostile intelligence service (such as Russia’s GRU Unit 29155) deployed clandestine pulsed microwave / acoustic directed-energy weapons against Western diplomats.',
    claimOrigin: 'US State Department incident reports (2017), The Insider / Der Spiegel / 60 Minutes investigation (2024).',
    whatWeKnow: [
      'Over 1,000 anomalous health incident reports filed across 90 countries.',
      'University of Pennsylvania MRI study (JAMA 2018) found significant neurological differences in white matter volume compared to control groups.',
      'The 2020 National Academies of Sciences (NAS) panel concluded directed, pulsed radio frequency energy appears to be the most plausible explanation for the core clinical cluster.',
      'In 2024, European media revealed members of GRU Unit 29155 received promotions and awards for work related to "non-lethal acoustic weapon development."',
      'Seven US intelligence agencies reviewed medical records in 2023 and found lack of consistent pattern or sensor telemetry identifying a foreign weapon system.'
    ],
    speculations: [
      'Early claims that Jamaican crickets (Anurogryllus celatus) fully caused the sound recordings (the cricket sound was verified on some audio, but does not explain physiological neuro-vestibular trauma).'
    ],
    evidenceList: [
      {
        id: 'ev-hav-1',
        title: 'National Academies of Sciences, Engineering, and Medicine Consensus Study (2020)',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Standing Committee to Advise the Department of State on Unexplained Health Incidents',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Concluded directed pulsed microwave energy via the Frey effect is the most plausible mechanism for the acute vestibular and cochlear symptoms reported by Havana diplomats.',
        context: 'Independent scientific committee study.',
        votes: 520
      },
      {
        id: 'ev-hav-2',
        title: 'Updated Assessment of Anomalous Health Incidents (Office of the DNI, 2023)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'National Intelligence Council Memorandum, March 2023',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'IC concluded that reported symptoms were diverse and likely resulted from environmental factors, pre-existing medical conditions, and conventional illnesses.',
        context: 'Contrasting intelligence community consensus assessment.',
        votes: 410
      }
    ],
    timeline: [
      {
        id: 'tl-hav-1',
        date: '2016-11-01',
        title: 'First Cluster Reported in Havana Embassy',
        description: 'Diplomats report high-pitched directional sounds in homes and hotels followed by pressure and headaches.',
        rating: 'CONFIRMED',
        location: 'Havana, Cuba'
      },
      {
        id: 'tl-hav-2',
        date: '2021-10-08',
        title: 'President Biden Signs HAVANA Act into Law',
        description: 'Authorizes financial support and medical care for victims of anomalous health incidents.',
        rating: 'CONFIRMED',
        isMilestone: true
      },
      {
        id: 'tl-hav-3',
        date: '2024-04-01',
        title: 'Joint Media Investigation Links GRU Unit 29155',
        description: 'The Insider, 60 Minutes, and Der Spiegel publish evidence of Russian intelligence operatives in proximity to incident locations.',
        rating: 'DISPUTED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-hav-1',
        title: 'JASON Defense Advisory Panel Havana AHI Physics Report',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Department of State / JASON Defense Advisory Group',
        dateCreated: '2018-11-28',
        dateDeclassified: '2021-09-30',
        fileReference: 'JSR-18-502',
        summary: 'Technical acoustic and microwave assessment of diplomatic incident audio recordings.',
        fullExcerpt: '"The sounds recorded in Cuba are acoustic in origin, matching the calling song of the Indies short-tailed cricket... However, acoustic energy cannot directly cause intracranial trauma without extreme decibel exposure."',
        authenticityNote: 'Released under FOIA via BuzzFeed News litigation.',
        pageCount: 38,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-hav-1', name: 'State Department', type: 'AGENCY', role: 'Diplomatic Corp' },
      { id: 'ent-hav-2', name: 'GRU Unit 29155', type: 'AGENCY', role: 'Russian Military Intelligence Special Operations Unit' },
      { id: 'ent-hav-3', name: 'Central Intelligence Agency (CIA)', type: 'AGENCY', role: 'Affected Intelligence Officers' }
    ],
    connectedCaseIds: ['mkultra-program'],
    views: 28900,
    commentCount: 380,
    bookmarkCount: 1450,
    isDailyMystery: true,
    communityVerdictVote: {
      confirmed: 680,
      disputed: 1540,
      unverified: 420,
      debunked: 210
    }
  },
  {
    id: 'area-51-groom-lake',
    caseNumber: 'FILE-0008',
    title: 'Area 51: Black Projects, Stealth Tech & Reverse Engineering',
    subtitle: 'From U-2 & SR-71 Blackbird to S-4 Reverse Engineering Allegations',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Officially acknowledged by the CIA in 2013 as a classified aircraft flight testing facility for high-altitude reconnaissance programs (U-2, A-12 Oxcart, F-117 Nighthawk, Have Blue, Tacit Blue). Claims of extraterrestrial hardware remain unverified.',
    summary: 'Located on the dry bed of Groom Lake in southern Nevada inside the Nevada Test and Training Range, Area 51 has been the most secretive military installation in the US since 1955.',
    claim: 'Beyond conventional black-budget aerospace development, the facility (and nearby Papoose Lake / S-4) houses recovered non-human aerial craft undergoing reverse engineering.',
    claimOrigin: 'Bob Lazar interviews with George Knapp (1989), declassified CIA histories (2013).',
    whatWeKnow: [
      'Established in 1955 by the CIA for testing the Lockheed U-2 spy plane.',
      'Birthplace of stealth technology: Have Blue prototype, F-117 Nighthawk, and Soviet MiG radar vulnerability testing (Project Constant Peg).',
      'The US government strictly denied its existence in legal filings until the 2013 declassification of a 400-page CIA historical monograph.',
      'Employees are transported daily from Las Vegas McCarran Airport via Janet Airlines (Boeing 737s with red livery stripe).',
      'Bob Lazar’s claims of working at S-4 have suffered from unverified academic credentials (MIT/Caltech), though his descriptions of the base’s security architecture predated public disclosure.'
    ],
    speculations: [
      'Claims of Element 115 gravity-wave propulsion systems prior to its synthetic synthesis in 2003 as Moscovium.'
    ],
    evidenceList: [
      {
        id: 'ev-a51-1',
        title: 'CIA Historical Monograph: The Central Intelligence Agency and Overhead Reconnaissance (1954–1974)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'CIA History Staff, declassified June 25, 2013',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'First official CIA publication explicitly naming Area 51, Groom Lake, and detailing classified flight test corridors.',
        context: 'Declassified CIA monograph acknowledging Groom Lake testing ground.',
        votes: 690
      }
    ],
    timeline: [
      {
        id: 'tl-a51-1',
        date: '1955-04-01',
        title: 'Kelly Johnson Selects Groom Lake for U-2 Testing',
        description: 'Lockheed Skunk Works establishes remote site at dry salt flat.',
        rating: 'CONFIRMED',
        location: 'Groom Lake, NV'
      },
      {
        id: 'tl-a51-2',
        date: '1989-11-10',
        title: 'Bob Lazar Goes Public with George Knapp on KLAS-TV',
        description: 'First public broadcast alleging saucer reverse engineering at S-4.',
        rating: 'DISPUTED',
        isMilestone: true,
        location: 'Las Vegas, NV'
      },
      {
        id: 'tl-a51-3',
        date: '2013-08-15',
        title: 'CIA Formally Declassifies Name and Map of Area 51',
        description: 'George Washington University National Security Archive wins FOIA request.',
        rating: 'CONFIRMED',
        isMilestone: true
      }
    ],
    documents: [
      {
        id: 'doc-a51-1',
        title: 'CIA Declassified Overhead Reconnaissance Map: Area 51 Grid Coordinates',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Central Intelligence Agency',
        dateCreated: '1961-07-12',
        dateDeclassified: '2013-06-25',
        fileReference: 'NND 083042 / CIA-RDP69B00041R',
        summary: 'Top Secret operational flight map defining Groom Lake restricted airspace (R-4808N).',
        fullExcerpt: '"The facility at Groom Lake, Nevada, known colloquially as Area 51 or the Ranch, was acquired in April 1955 to support Project AQUATONE flight testing."',
        authenticityNote: 'National Security Archive certified copy.',
        pageCount: 12,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-a51-1', name: 'Lockheed Skunk Works', type: 'ORGANIZATION', role: 'Advanced Development Programs' },
      { id: 'ent-a51-2', name: 'Kelly Johnson', type: 'PERSON', role: 'Legendary Aircraft Designer' },
      { id: 'ent-a51-3', name: 'Bob Lazar', type: 'PERSON', role: 'Whistleblower / Reverse Engineering Claim Proponent' },
      { id: 'ent-a51-4', name: 'Roswell Incident', type: 'CASE', role: 'Alleged Debris Destination', targetCaseId: 'roswell-incident-1947' }
    ],
    connectedCaseIds: ['roswell-incident-1947', 'apollo-moon-landing'],
    views: 52100,
    commentCount: 910,
    bookmarkCount: 3890,
    communityVerdictVote: {
      confirmed: 2100,
      disputed: 1800,
      unverified: 940,
      debunked: 130
    }
  },
  {
    id: 'operation-gladio',
    caseNumber: 'FILE-0009',
    title: 'Operation Gladio & NATO Stay-Behind Armies',
    subtitle: 'Clandestine Cold War Paramilitaries & The Strategy of Tension',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Officially acknowledged by Italian Prime Minister Giulio Andreotti in October 1990. European Parliament passed formal condemnation Resolution Doc. B3-2021/90.',
    summary: 'A secret network of stay-behind paramilitary armies organized by NATO, the CIA, and MI6 across Western Europe during the Cold War, later implicated in orchestrating and facilitating domestic terror attacks to manipulate political outcomes.',
    claim: 'NATO intelligence agencies maintained clandestine armed cells across Europe that orchestrated false-flag domestic bombings (e.g. Peteano bombing, Bologna massacre) under the "Strategy of Tension" to blame left-wing political movements.',
    claimOrigin: 'Italian magistrate Felice Casson investigation (1984), Prime Minister Giulio Andreotti testimony (1990), Swiss Parliamentary Inquiry (1990).',
    whatWeKnow: [
      'In 1990, Italian Prime Minister Giulio Andreotti officially confirmed the existence of Gladio in a speech to parliament.',
      'Clandestine arms caches, radio transmitters, and explosive stores were uncovered across Italy, Switzerland, and Belgium.',
      'The European Parliament formally passed a resolution on November 22, 1990, condemning clandestine military networks operating without democratic oversight.',
      'Vincenzo Vinciguerra, an operative linked to Ordine Nuovo, confessed in court to carrying out the 1972 Peteano bombing with Gladio-supplied C4 explosives.'
    ],
    speculations: [
      'Unconfirmed claims that the Brabant supermarket massacres in Belgium (1982-1985) were executed by stay-behind cells to boost police state powers.',
      'Debates over the exact depth of direct CIA operational command versus national intelligence autonomy.'
    ],
    evidenceList: [
      {
        id: 'ev-gla-1',
        title: 'Italian Parliamentary Commission Report on Terrorism',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Commissione Stragi, Italian Senate Parliamentary Record (1990-2000)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official Italian judicial inquiry detailing how stay-behind networks were utilized to counter left-wing electoral gains through covert psychological operations and state-sanctioned subversion.',
        context: 'Magistrate Felice Casson discovered Gladio files in the SISMI archive in Rome during his investigation of the 1972 Peteano bombing.',
        votes: 388,
        userVoted: 'up'
      },
      {
        id: 'ev-gla-2',
        title: 'European Parliament Resolution on Gladio',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Official Journal of the European Communities C 324, 24/12/1990',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Resolution formally condemning clandestine military structures in member states and demanding full judicial inquiries into all covert networks.',
        context: 'Passed overwhelmingly by the European Parliament in Strasbourg on November 22, 1990.',
        votes: 275
      }
    ],
    timeline: [
      { id: 'tm-gla-1', date: '1951', title: 'Clandestine Western Union Agreement', description: 'CIA and European intelligence agencies establish stay-behind network protocols.', rating: 'CONFIRMED' },
      { id: 'tm-gla-2', date: '1972-05-31', title: 'Peteano Bombing', description: 'Car bomb kills three Carabinieri officers; investigation leads to discovery of Gladio explosives.', rating: 'CONFIRMED' },
      { id: 'tm-gla-3', date: '1990-10-24', title: 'Andreotti Discloses Gladio', description: 'Italian Prime Minister officially confirms Gladio operation in parliament.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-gla-1',
        title: 'NATO Stay-Behind Directive Protocol 1956',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'NATO Supreme Headquarters Allied Powers Europe (SHAPE)',
        dateCreated: '1956-04-12',
        dateDeclassified: '1992-06-15',
        fileReference: 'SHAPE/SEC/56/GLADIO-IT',
        summary: 'Organizational framework for activating stay-behind guerrilla units and covert communications behind enemy lines.',
        fullExcerpt: 'The mission of the stay-behind organization is to maintain sabotage networks, secure drop zones, and execute covert countermeasures in designated territorial sectors.',
        authenticityNote: 'Authenticated via Italian Parliamentary Archives Record Group 14.',
        pageCount: 38,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-gla-1', name: 'Giulio Andreotti', type: 'PERSON', role: 'Italian Prime Minister who declassified Gladio' },
      { id: 'ent-gla-2', name: 'Felice Casson', type: 'PERSON', role: 'Investigative Magistrate' },
      { id: 'ent-gla-3', name: 'NATO SHAPE', type: 'AGENCY', role: 'Coordinating Military Command' },
      { id: 'ent-gla-4', name: 'CIA', type: 'AGENCY', role: 'Funding and Liaison Agency' }
    ],
    connectedCaseIds: ['operation-northwoods', 'mkultra-program', 'jfk-assassination'],
    views: 31200,
    commentCount: 420,
    bookmarkCount: 1840,
    communityVerdictVote: { confirmed: 2900, disputed: 180, unverified: 50, debunked: 10 }
  },
  {
    id: 'tartaria-mud-flood',
    caseNumber: 'FILE-0010',
    title: 'Tartaria & The Mud Flood Hypothesis',
    subtitle: 'The Lost Advanced Architectural Empire & Reset Theory',
    category: 'ANCIENT_MYSTERIES',
    status: 'DEBUNKED',
    officialVerdict: 'Mainstream historians, geologists, and architectural scholars confirm Grand Tartary was an outdated European geographic exonym for North/Central Asia, and buried ground-floor windows are standard 19th-century lightwells and street-grade alterations.',
    summary: 'A viral alternative historical hypothesis asserting that an advanced global empire named Tartaria was wiped out in the 19th century by a cataclysmic "mud flood," with its free wireless energy architecture co-opted or destroyed at World\'s Fairs.',
    claim: 'Grand Tartaria was a unified, worldwide civilization with wireless electromagnetic energy technology embedded in domes, obelisks, and cathedral spires that was deliberately erased from modern school textbooks.',
    claimOrigin: 'Russian alternative history forums (Anatoly Fomenko New Chronology influences), internet theorists circa 2016-2018.',
    whatWeKnow: [
      'Historical 16th-19th century European maps label North and Central Asia as "Grand Tartary," referring geographically to the land of nomadic peoples rather than a centralized super-state.',
      '19th-century buildings worldwide feature below-grade half-windows designed intentionally as "lightwells" or created when cities raised street grades for sewer installations (e.g. Seattle, Chicago).',
      'World\'s Fairs (e.g., 1893 Chicago World\'s Columbian Exposition) were documented extensively as temporary structures built with plaster of Paris and staff materials around steel/wood framing, not demolished ancient marble monoliths.'
    ],
    speculations: [
      'Claims that domed cathedrals and spires were electromagnetic resonance transmitters collecting atmospheric ether energy.',
      'Theories claiming world wars and city fires (Great Chicago Fire, San Francisco 1906) were deliberate demolition resets of Tartarian architecture.'
    ],
    evidenceList: [
      {
        id: 'ev-tar-1',
        title: '1893 World Columbian Exposition Architectural Blueprints',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'Chicago Historical Society / Library of Congress Prints & Photographs Division',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Architectural records and construction contracts proving the "White City" neoclassical buildings were constructed temporarily out of staff (plaster, hemp fiber, and cement) over timber framing.',
        context: 'Directly refutes the claim that the Chicago World\'s Fair was an ancient inherited Tartarian metropolis that had to be burned down.',
        votes: 412
      },
      {
        id: 'ev-tar-2',
        title: 'Historic Maps of Central Asia Exonym Usage',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'David Rumsey Historical Map Collection, Stanford University',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Linguistic and cartographic analysis showing "Tartaria" was an exonym used by Europeans for areas inhabited by Turkic and Mongol peoples beyond the Urals.',
        context: 'Demonstrates geographical labeling rather than a unified hyper-technological world empire.',
        votes: 310
      }
    ],
    timeline: [
      { id: 'tm-tar-1', date: '1692', title: 'Witsen Cartographic Publication', description: 'Nicolaes Witsen publishes "Noord en Oost Tartarye" describing Siberian geography.', rating: 'CONFIRMED' },
      { id: 'tm-tar-2', date: '1855-1860', title: 'Chicago Street Grade Raising', description: 'City of Chicago raises buildings using jack screws to install gravity-flow sewers.', rating: 'CONFIRMED' },
      { id: 'tm-tar-3', date: '1893-05-01', title: 'Chicago World\'s Fair Opens', description: 'Temporary neoclassical plaster palace exposition opens on Lake Michigan.', rating: 'CONFIRMED' }
    ],
    documents: [
      {
        id: 'doc-tar-1',
        title: 'City of Chicago Board of Public Works Municipal Grading Report',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Chicago Board of Sewerage Commissioners',
        dateCreated: '1858-03-20',
        fileReference: 'MUNI-CHI-SEW-1858',
        summary: 'Official engineering documentation detailing the raising of streets by 4 to 14 feet to prevent cholera outbreaks, explaining sunken basement windows.',
        fullExcerpt: 'The street grades throughout the downtown district have been elevated to allow the laying of brick sewers draining into the river.',
        authenticityNote: 'Preserved in Chicago Municipal Reference Collection.',
        pageCount: 64,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-tar-1', name: 'World\'s Columbian Exposition', type: 'EVENT', role: 'Focal point of architecture theories' },
      { id: 'ent-tar-2', name: 'Anatoly Fomenko', type: 'PERSON', role: 'Mathematician / New Chronology Proponent' }
    ],
    connectedCaseIds: ['apollo-moon-landing'],
    views: 45000,
    commentCount: 780,
    bookmarkCount: 2100,
    communityVerdictVote: { confirmed: 410, disputed: 890, unverified: 620, debunked: 3200 }
  },
  {
    id: 'dyatlov-pass-incident',
    caseNumber: 'FILE-0011',
    title: 'The Dyatlov Pass Incident',
    subtitle: 'Radiation, Infrasound, and Inexplicable Trauma at Kholat Syakhl',
    category: 'UNSOLVED',
    status: 'DISPUTED',
    officialVerdict: '2020 Russian Prosecutor General inquiry concluded a slab avalanche forced the hikers out of their tent, followed by hypothermia. Swiss EPFL computer simulations (2021) supported the micro-avalanche dynamic.',
    summary: 'In February 1959, nine experienced Soviet ski hikers led by Igor Dyatlov perished under bizarre circumstances on the slopes of Kholat Syakhl in the Ural Mountains, leaving their tent slashed from the inside and displaying anomalous traumatic injuries and radiation traces.',
    claim: 'The expedition encountered secret Soviet military weapons testing (such as parachuted landmines, fuel-air explosives, or infrasonic weapons) or anomalous luminous phenomena, leading to forced flight and violent internal injuries without external soft-tissue damage.',
    claimOrigin: 'Soviet investigator Lev Ivanov (1959), Yuri Yarovoi (1966), Ural State Technical University archives declassified in the 1990s.',
    whatWeKnow: [
      'The hikers slashed their tent open from the inside and fled into sub-zero blizzard conditions without boots or outer winter coats.',
      'Autopsies revealed major internal crushing injuries (fractured skulls and ribs) on Lyudmila Dubinina and Semyon Zolotaryov with no corresponding external contusions.',
      'Clothing items tested positive for elevated beta radiation contamination.',
      'Lead investigator Lev Ivanov noted in 1990 that he was ordered by regional Communist Party officials to close the case and classify all files regarding flying luminous spheres reported in the area.'
    ],
    speculations: [
      'Karman vortex street infrasound phenomenon induced sudden uncontrollable acoustic terror and disorientation.',
      'Covert military R-7 or S-75 missile tests went off course over the northern Urals.',
      'Encounter with indigenous Mansi guardians or cryptozoological hominids.'
    ],
    evidenceList: [
      {
        id: 'ev-dya-1',
        title: 'Soviet Criminal Investigation Autopsy Reports (1959)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'State Archives of the Sverdlovsk Region (GASO), Fund 1, Inventory 2',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Medical examiner Dr. Boris Vozrozhdenny determined that the massive chest traumas were equivalent to the impact of a high-speed vehicle and could not have been caused by human fists or blunt rocks.',
        context: 'Performed in Ivdel between March and May 1959 on recovered bodies from the ravine.',
        votes: 520,
        userVoted: 'up'
      },
      {
        id: 'ev-dya-2',
        title: 'EPFL / ETH Zurich Slab Avalanche Numerical Simulation',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'Nature Communications Earth & Environment (Gaume & Puzrin, Jan 2021)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Dynamic physical model demonstrating how a delayed small slab avalanche could trigger over a cut snowbank on a 30-degree slope, inflicting severe thoracic injuries on sleeping occupants.',
        context: 'Provides a rigorous mathematical framework supporting the official natural explanation.',
        votes: 390
      }
    ],
    timeline: [
      { id: 'tm-dya-1', date: '1959-02-01', title: 'Tent Pitched on Kholat Syakhl', description: 'Hikers pitch tent on the barren slopes of Dead Mountain.', rating: 'CONFIRMED' },
      { id: 'tm-dya-2', date: '1959-02-02', title: 'Emergency Egress', description: 'Tent slashed from within; hikers descend toward cedar tree.', rating: 'CONFIRMED' },
      { id: 'tm-dya-3', date: '1959-05-28', title: 'Official Inquest Closed', description: 'Case closed citing "an elemental force which the hikers were unable to overcome."', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-dya-1',
        title: 'Official Criminal Case No. 659 Decree of Termination',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Sverdlovsk Regional Prosecutor\'s Office',
        dateCreated: '1959-05-28',
        fileReference: 'GASO-F1-D659-1959',
        summary: 'Investigator Lev Ivanov conclusion decree closing criminal inquiry into the deaths of the Dyatlov group.',
        fullExcerpt: 'Taking into account the absence on the corpses of external bodily injuries and signs of a struggle... it should be considered that the cause of death was an elemental force.',
        authenticityNote: 'Declassified from Soviet regional archive files in 1990.',
        pageCount: 12,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-dya-1', name: 'Igor Dyatlov', type: 'PERSON', role: 'Expedition Leader' },
      { id: 'ent-dya-2', name: 'Lev Ivanov', type: 'PERSON', role: 'Chief Soviet Inquest Investigator' },
      { id: 'ent-dya-3', name: 'Kholat Syakhl', type: 'LOCATION', role: 'Site of incident' }
    ],
    connectedCaseIds: ['havana-syndrome', 'tunguska-event-1908'],
    views: 48900,
    commentCount: 840,
    bookmarkCount: 2980,
    communityVerdictVote: { confirmed: 1200, disputed: 2800, unverified: 950, debunked: 420 }
  },
  {
    id: 'philadelphia-experiment',
    caseNumber: 'FILE-0012',
    title: 'The Philadelphia Experiment & USS Eldridge',
    subtitle: 'Project Rainbow, Unified Field Theory & Optical Cloaking',
    category: 'UNSOLVED',
    status: 'DEBUNKED',
    officialVerdict: 'US Office of Naval Research (ONR) confirms USS Eldridge (DE-173) was on shakedown in the Bahamas during the alleged October 1943 timeframe and was never outfitted for secret invisibility or teleportation experiments.',
    summary: 'A famous naval conspiracy alleging that in October 1943 at the Philadelphia Naval Shipyard, the destroyer escort USS Eldridge was rendered optically and radar invisible using Einstein\'s Unified Field Theory, accidentally teleporting to Norfolk, Virginia with catastrophic crew casualties.',
    claim: 'US Navy electromagnetic experiments caused the USS Eldridge to phase out of space-time, causing sailors to materialize embedded in the steel deck bulkheads upon return.',
    claimOrigin: 'Carl M. Allen (alias Carlos Miguel Allende) letters sent to ufologist Morris K. Jessup in 1955; 1979 book by Charles Berlitz and William L. Moore.',
    whatWeKnow: [
      'Carl Allen admitted in 1980 to fabricating the letters and annotations sent to Jessup using multiple pens and colored inks.',
      'USS Eldridge ship logs and deck deck-books preserved in the US National Archives show the ship was nowhere near Philadelphia on October 28, 1943.',
      'The US Navy routinely conducted "degaussing" operations in Philadelphia to erase the magnetic signature of steel ship hulls against German magnetic sea mines, which laymen observers often conflated with "invisibility."'
    ],
    speculations: [
      'Claims that Nikola Tesla and John von Neumann led the electromagnetic field calculation teams before Tesla\'s death in January 1943.',
      'Connections drawn by alternative theorists to the Montauk Project in Long Island.'
    ],
    evidenceList: [
      {
        id: 'ev-pe-1',
        title: 'USS Eldridge (DE-173) Official World War II Deck Logs',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'US National Archives and Records Administration (NARA), Modern Military Records',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Deck logs from August 1943 to December 1943 proving Eldridge remained in the Brooklyn Navy Yard and Long Island Sound before sailing to Casco Bay, Maine and Bermuda.',
        context: 'Direct physical timeline contradiction to Allende\'s claim of Philadelphia dock teleportation.',
        votes: 460
      },
      {
        id: 'ev-pe-2',
        title: 'Office of Naval Research (ONR) Information Sheet on Philadelphia Experiment',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'ONR Declassified Fact Sheet 1996-02',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Naval analysis identifying the origin of the rumors as degaussing (magnetic signature suppression) and high-frequency electrical demonstrations.',
        context: 'Official position of the US Department of the Navy.',
        votes: 310
      }
    ],
    timeline: [
      { id: 'tm-pe-1', date: '1943-08-27', title: 'USS Eldridge Commissioned', description: 'Destroyer escort commissioned at Boston Navy Yard.', rating: 'CONFIRMED' },
      { id: 'tm-pe-2', date: '1955-01-13', title: 'Allende Letters Sent to Jessup', description: 'Carl Allen mails first annotated letters detailing the invisibility claim.', rating: 'CONFIRMED' },
      { id: 'tm-pe-3', date: '1999-03-23', title: 'USS Eldridge Crew Reunion', description: 'Surviving crew members give public press interviews ridiculing the teleportation myth.', rating: 'CONFIRMED' }
    ],
    documents: [
      {
        id: 'doc-pe-1',
        title: 'NARA War Diary Extract USS Eldridge DE-173 (October 1943)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Department of the Navy / Commander Task Group 23.3',
        dateCreated: '1943-11-01',
        fileReference: 'NARA-RG38-DE173-WD',
        summary: 'Daily operational log of ship movements, escort duties, and sea trial maneuvers in October 1943.',
        fullExcerpt: 'October 28, 1943: Underway in company with USS Converse en route to naval escort station. No unusual incidents observed.',
        authenticityNote: 'Official wartime naval record with intact commanding officer signatures.',
        pageCount: 22,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-pe-1', name: 'USS Eldridge (DE-173)', type: 'LOCATION', role: 'Naval Vessel' },
      { id: 'ent-pe-2', name: 'Morris K. Jessup', type: 'PERSON', role: 'Astrophysicist & UFO Author' },
      { id: 'ent-pe-3', name: 'Carl M. Allen (Carlos Allende)', type: 'PERSON', role: 'Originator of Hoax Letters' }
    ],
    connectedCaseIds: ['roswell-incident-1947', 'area-51-groom-lake'],
    views: 39500,
    commentCount: 510,
    bookmarkCount: 1650,
    communityVerdictVote: { confirmed: 350, disputed: 620, unverified: 480, debunked: 3100 }
  },
  {
    id: 'bohemian-grove-elites',
    caseNumber: 'FILE-0013',
    title: 'Bohemian Grove & The Cremation of Care',
    subtitle: 'Private Redwood Encampment of Presidents, Plutocrats & Power Brokers',
    category: 'SECRET_SOCIETIES',
    status: 'CONFIRMED',
    officialVerdict: 'The Bohemian Club is a private men\'s club founded in 1872 in San Francisco with a 2,700-acre redwood retreat in Monte Rio, California. The Manhattan Project planning meeting took place there in September 1942.',
    summary: 'An exclusive annual gathering of global political leaders, corporate titans, senior intelligence officials, and media executives in the Sonoma County redwoods, centered around an theatrical opening ritual before a 40-foot stone Owl shrine.',
    claim: 'Bohemian Grove serves as an unaccountable shadow summit where high-level geopolitics, military strategies, and economic policies are coordinated outside democratic transparency.',
    claimOrigin: 'Investigative reporting by Philip Weiss (Spy Magazine 1989), Dirk Mathison (1991), and undercover video infiltrations in 2000.',
    whatWeKnow: [
      'Prominent members and guests have included US Presidents (Richard Nixon, Ronald Reagan, George H.W. Bush, Herbert Hoover), secretaries of state (Henry Kissinger, Colin Powell), and CIA directors.',
      'In September 1942, Ernest Lawrence, J. Robert Oppenheimer, and S-1 Executive Committee members held a seminal organizational meeting at the Grove that paved the way for the Manhattan Project.',
      'The "Cremation of Care" ceremony involves burning a mock effigy representing the worldly burdens and worries of club members.',
      'Richard Nixon was recorded on White House tapes describing the gathering in crude terms while acknowledging elite attendance.'
    ],
    speculations: [
      'Theories alleging dark occult sacrifices or sinister esoteric blood oaths (debunked as theatrical Victorian summer camp dramatizations by club members).',
      'Claims that the club functions as a singular global conspiracy rather than an elite social networking retreat.'
    ],
    evidenceList: [
      {
        id: 'ev-boh-1',
        title: 'Manhattan Project S-1 Committee Historical Minutes (1942)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'US Department of Energy Historical Archives / National Atomic Museum',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official documentation confirming that key nuclear physicists and military directors met at Bohemian Grove in September 1942 to coordinate atomic bomb development.',
        context: 'Proves high-level national security decisions have historically been brokered during Grove encampments.',
        votes: 490,
        userVoted: 'up'
      },
      {
        id: 'ev-boh-2',
        title: 'Richard Nixon White House Audio Tape Recording (May 13, 1971)',
        type: 'AUDIO_VIDEO',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Nixon Presidential Library and Museum Tape Conversation 502-004',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'President Richard Nixon discussing the atmosphere and social dynamics of Bohemian Grove with White House Chief of Staff H.R. Haldeman.',
        context: 'Declassified presidential tape recording confirming high-level political interactions.',
        votes: 380
      }
    ],
    timeline: [
      { id: 'tm-boh-1', date: '1872-04-01', title: 'Bohemian Club Founded', description: 'San Francisco journalists and artists form fraternal bohemian society.', rating: 'CONFIRMED' },
      { id: 'tm-boh-2', date: '1942-09-13', title: 'Manhattan Project S-1 Meeting', description: 'Oppenheimer and Lawrence confer on atomic bomb schedule.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-boh-3', date: '1989-11-01', title: 'Spy Magazine Infiltration', description: 'Journalist Philip Weiss publishes inside exposé on Grove camp culture.', rating: 'CONFIRMED' }
    ],
    documents: [
      {
        id: 'doc-boh-1',
        title: 'Cremation of Care Ceremony Script & Musical Score',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Bohemian Club of San Francisco Archives',
        dateCreated: '1929-07-20',
        fileReference: 'BOH-SCR-COC-1929',
        summary: 'Text and dramatic stage directions for the annual theatrical opening ceremony performed in the Bohemian Grove amphitheater.',
        fullExcerpt: 'Cast off your cares, o Bohemians! In these sacred groves, the fire shall consume Dull Care and set our fellowship free.',
        authenticityNote: 'Published in club centennial commemorative anthologies.',
        pageCount: 16,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-boh-1', name: 'Bohemian Club', type: 'ORGANIZATION', role: 'Fraternal Elite Club' },
      { id: 'ent-boh-2', name: 'J. Robert Oppenheimer', type: 'PERSON', role: 'Manhattan Project Director & Grove Guest' },
      { id: 'ent-boh-3', name: 'Monte Rio, California', type: 'LOCATION', role: 'Campground Location' }
    ],
    connectedCaseIds: ['mkultra-program', 'gary-webb-dark-alliance'],
    views: 42000,
    commentCount: 650,
    bookmarkCount: 2300,
    communityVerdictVote: { confirmed: 3400, disputed: 420, unverified: 190, debunked: 90 }
  },
  {
    id: 'cicada-3301',
    caseNumber: 'FILE-0014',
    title: 'Cicada 3301 Cryptographic Recruitment Enigma',
    subtitle: 'Dark Web Ciphers, Number Theory & The Search for Collective Intelligence',
    category: 'UNSOLVED',
    status: 'UNVERIFIED',
    officialVerdict: 'The creators of Cicada 3301 have never publicly revealed their identities. Academic cryptographers and security firms believe the puzzle was created by a private cryptographic think tank, military cyber command, or elite tech syndicate.',
    summary: 'Beginning on January 4, 2012, an anonymous entity called Cicada 3301 posted complex cryptographic puzzles across 4chan, Reddit, dark web servers, and physical GPS-located telephone poles in 14 cities across 5 countries, seeking "highly intelligent individuals."',
    claim: 'Cicada 3301 is an intelligence agency recruitment pipeline (NSA, GCHQ, or MI6) or an autonomous decentralized cryptographic society developing uncrackable privacy networks.',
    claimOrigin: 'Original 4chan /x/ post on January 4, 2012; Marcus Wanner puzzle solver testimonials (2013).',
    whatWeKnow: [
      'Every official Cicada clue was digitally signed with a verified GnuPG / PGP private key (Key ID: 7A35090F) to prevent impostor clues.',
      'The puzzle required deep knowledge of classical literature (William Blake, Agrippa, Mayan numerology), advanced steganography, prime number theory, and ancient Mayan runic systems.',
      'Physical posters with QR codes were attached simultaneously to light poles in Warsaw, Paris, Seattle, Miami, Seoul, and Sydney.',
      'The final unsolved portion, the "Liber Primus" (a 73-page book written in an undiscovered runic cipher), remains 80% undeciphered to this day.'
    ],
    speculations: [
      'Theories that successful candidates were recruited into a private autonomous dark web think tank developing decentralized routing protocols.',
      'Speculation that the project was an internal cybersecurity red-team recruitment trial run by a global defense contractor.'
    ],
    evidenceList: [
      {
        id: 'ev-cic-1',
        title: 'PGP Cryptographic Signature Audit (Key ID: 7A35090F)',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'MIT PGP Public Key Server & Cryptographic Community Archives',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Verification that all authentic Cicada 3301 communications originated from the single cryptographic root key established in 2012.',
        context: 'Proves the immense operational security and singular coordination of the entity.',
        votes: 480
      },
      {
        id: 'ev-cic-2',
        title: 'Liber Primus Runic Manuscript Cryptanalysis',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Open-Source Cicada Solvers Collective / Cornell ArXiv Math Analysis',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Mathematical breakdown of the 17 translated pages of the Liber Primus, containing philosophical maxims on primes, encryption, and consciousness.',
        context: 'The remaining 56 pages remain an open mathematical challenge in modern cryptanalysis.',
        votes: 390
      }
    ],
    timeline: [
      { id: 'tm-cic-1', date: '2012-01-04', title: 'First Cicada 3301 Image Posted', description: 'Steganographic image of a cicada posted on 4chan.', rating: 'CONFIRMED' },
      { id: 'tm-cic-2', date: '2013-01-05', title: 'Second Puzzle Round', description: 'Puzzle resumes with book ciphers and physical coordinates in 5 countries.', rating: 'CONFIRMED' },
      { id: 'tm-cic-3', date: '2014-01-06', title: 'Liber Primus Released', description: 'The runic manuscript is published; final unsolved masterwork.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-cic-1',
        title: 'Liber Primus Translated Folio Excerpts',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Cicada 3301 Anonymous Cryptographic Group',
        dateCreated: '2014-01-06',
        fileReference: 'PGP-SIG-LIBER-PRIMUS-7A35090F',
        summary: 'De-anonymized and decoded runic verses from the first 17 pages of the Cicada handbook.',
        fullExcerpt: 'A warning: Believe nothing from this book, except what you know to be true. Test the knowledge. Find your divinity within.',
        authenticityNote: 'Signed with verified 2048-bit RSA PGP key.',
        pageCount: 73,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-cic-1', name: 'Cicada 3301', type: 'ORGANIZATION', role: 'Anonymous Cryptographic Collective' },
      { id: 'ent-cic-2', name: 'Marcus Wanner', type: 'PERSON', role: 'Verified 2012 Puzzle Finalist' }
    ],
    connectedCaseIds: ['mkultra-program', 'havana-syndrome'],
    views: 54000,
    commentCount: 920,
    bookmarkCount: 3400,
    communityVerdictVote: { confirmed: 890, disputed: 1400, unverified: 3100, debunked: 110 }
  },
  {
    id: 'denver-airport-murals',
    caseNumber: 'FILE-0015',
    title: 'Denver International Airport Bunkers & Murals',
    subtitle: 'Apocalyptic Artwork, Masonic Capstones & Subterranean Tunnels',
    category: 'SECRET_SOCIETIES',
    status: 'DISPUTED',
    officialVerdict: 'Denver International Airport (DEN) explanations state the subterranean levels are part of a 470,000-sq-ft automated baggage handling system and utility network; murals by artist Leo Tanguma depict environmental destruction transitioning into global peace and harmony.',
    summary: 'The massive 53-square-mile Denver International Airport, built in 1995 over budget with five multi-story subterranean buildings buried underground, featuring bizarre apocalyptic murals, gargoyles in baggage claim, and a dedication capstone citing the non-existent "New World Airport Commission."',
    claim: 'The airport covers an underground continuity of government bunker, military operations complex, or global elite subterranean shelter for catastrophic global events.',
    claimOrigin: 'Local Denver whistleblowers (1995), Alex Jones (2007), independent municipal auditing records.',
    whatWeKnow: [
      'The airport spans 33,000 acres—twice the land area of Manhattan—making it the largest airport in North America by land area.',
      'Five multi-story buildings were completely constructed, deemed improperly aligned, and buried intact rather than demolished, forming a subterranean tunnel network.',
      'The Masonic dedication marker in the Great Hall explicitly credits the "New World Airport Commission," an entity that has no registration with the state of Colorado or federal authorities.',
      'Murals by artist Leo Tanguma depict a gas-masked military figure wielding a scimitar with weeping children and burning cities, before transitioning to children celebrating around a beaten sword.'
    ],
    speculations: [
      'Theories that the runway layout resembles a swastika pattern from overhead aerial reconnaissance (architects attribute layout to prevailing wind efficiency).',
      'Claims that the automated baggage tunnels house FEMA detention holding facilities or underground mag-lev rail lines to NORAD Cheyenne Mountain.'
    ],
    evidenceList: [
      {
        id: 'ev-den-1',
        title: 'City and County of Denver Airport Construction Audit',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Denver City Auditor Office / Government Accountability Office (GAO/RCED-95-230)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Government audit detailing the $2 billion budget overrun, 16-month delay, and 470,000 square feet of underground automated baggage tunnels that were largely abandoned due to software failures.',
        context: 'Explains the vast subterranean footprint without requiring secret military bunker conspiracies.',
        votes: 420
      },
      {
        id: 'ev-den-2',
        title: 'Leo Tanguma Artist Statement on "Children of the World Dream of Peace"',
        type: 'JOURNALISM',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'Denver Commission on Cultural Affairs Exhibition Catalog (1995)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'The muralist\'s original narrative statement explaining the paintings as an allegory against war, pollution, and violence, concluding in global environmental healing.',
        context: 'Contextualizes the dark imagery as peace activism rather than a New World Order blueprint.',
        votes: 350
      }
    ],
    timeline: [
      { id: 'tm-den-1', date: '1989-11-20', title: 'Groundbreaking on Denver Airport', description: 'Construction begins across 53 square miles of open plains.', rating: 'CONFIRMED' },
      { id: 'tm-den-2', date: '1994-03-19', title: 'Masonic Capstone Dedicated', description: 'Great Hall dedication stone inscribed with New World Airport Commission.', rating: 'CONFIRMED' },
      { id: 'tm-den-3', date: '1995-02-28', title: 'Airport Officially Opens', description: 'DEN opens 16 months late with $4.8B final cost.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-den-1',
        title: 'GAO Review of Denver International Airport Construction (1995)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'General Accounting Office',
        dateCreated: '1995-09-01',
        fileReference: 'GAO/RCED-95-230',
        summary: 'Comprehensive federal review of costs, design alterations, buried infrastructure, and automated luggage system mechanical failures.',
        fullExcerpt: 'The underground baggage system experienced extensive track switch jams and sensor faults, necessitating manual luggage transport.',
        authenticityNote: 'Official US Government publication.',
        pageCount: 52,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-den-1', name: 'Denver International Airport', type: 'LOCATION', role: 'Airport & Subterranean Complex' },
      { id: 'ent-den-2', name: 'Leo Tanguma', type: 'PERSON', role: 'Mural Artist' },
      { id: 'ent-den-3', name: 'New World Airport Commission', type: 'ORGANIZATION', role: 'Mysterious Inscribed Commission' }
    ],
    connectedCaseIds: ['bohemian-grove-elites', 'georgia-guidestones'],
    views: 46700,
    commentCount: 790,
    bookmarkCount: 2600,
    communityVerdictVote: { confirmed: 1450, disputed: 2100, unverified: 890, debunked: 1120 }
  },
  {
    id: 'rendlesham-forest-incident',
    caseNumber: 'FILE-0016',
    title: 'The Rendlesham Forest Incident',
    subtitle: 'Britain\'s Roswell: Military Witnesses & Ionizing Radiation at RAF Woodbridge',
    category: 'UFOS_UAP',
    status: 'DISPUTED',
    officialVerdict: 'UK Ministry of Defence concluded the reports posed no threat to national defense and closed the file; skeptics argue the lights were optical flashes from the nearby Orford Ness Lighthouse combined with celestial stars and a burning fertilizer fire.',
    summary: 'In late December 1980, dozens of US Air Force security police stationed at twin NATO airbases RAF Bentwaters and RAF Woodbridge in Suffolk, England observed anomalous metallic craft landing in Rendlesham Forest, with Deputy Base Commander Lt. Col. Charles Halt recording live audio while measuring radiation at the landing marks.',
    claim: 'An advanced extraterrestrial or secret experimental craft touched down directly outside a NATO base housing secret tactical nuclear weapons storage bunkers, leaving three physical indentations and beta/gamma radiation spikes.',
    claimOrigin: 'Lt. Col. Charles Halt official memorandum to UK MoD (Jan 1981); Staff Sgt. Jim Penniston and Airman John Burroughs eyewitness testimony.',
    whatWeKnow: [
      'Lt. Col. Charles Halt produced an official memorandum to the British Ministry of Defence describing a triangular glowing object with red and blue lights pulsing in the forest.',
      'Halt recorded an authentic 18-minute micro-cassette tape recording during his live second-night investigation in the woods.',
      'An AN/PDR-27 beta-gamma survey meter registered elevated radiation readings (0.07 mR/hr) centered inside three depressions forming an equilateral triangle on the forest floor.',
      'In 2014, the US Department of Veterans Affairs granted full medical disability benefits to Airman John Burroughs for heart damage sustained from ionizing electromagnetic radiation exposure during the encounter.'
    ],
    speculations: [
      'Jim Penniston\'s claim in 2010 that he touched hieroglyphic symbols on the craft exterior and received a binary code telepathic download (not mentioned in his 1980 contemporaneous police report).',
      'Theories that the craft was an unacknowledged British/US electronic warfare drone or hologram projection test.'
    ],
    evidenceList: [
      {
        id: 'ev-ren-1',
        title: 'Lt. Col. Charles Halt Official MoD Memorandum (Jan 13, 1981)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'UK National Archives File DEFE 24/1948 / Released under UK FOIA',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official US Air Force memorandum written by Deputy Base Commander describing the glowing triangular craft, physical landing impressions, and radiation readings.',
        context: 'Considered one of the most credible official military UAP documents in modern history.',
        votes: 620,
        userVoted: 'up'
      },
      {
        id: 'ev-ren-2',
        title: 'Lt. Col. Halt Live 18-Minute Micro-Cassette Field Audio',
        type: 'AUDIO_VIDEO',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Verified original analog recording broadcast on BBC Radio 4 (1983)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Real-time audio recording of Lt. Col. Halt and security personnel traversing the forest, observing beams of light shining down into the weapons storage area.',
        context: 'Primary real-time acoustic evidence capturing emotional and observational reactions.',
        votes: 540
      }
    ],
    timeline: [
      { id: 'tm-ren-1', date: '1980-12-26', title: 'Initial East Gate Sighting', description: 'Airmen Burroughs and Penniston investigate craft near East Gate.', rating: 'CONFIRMED' },
      { id: 'tm-ren-2', date: '1980-12-28', title: 'Halt Field Investigation', description: 'Deputy Commander enters woods with Geiger counter and tape recorder.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-ren-3', date: '1981-01-13', title: 'Halt Memo Sent to UK MoD', description: 'Official written report submitted to British Ministry of Defence.', rating: 'CONFIRMED' }
    ],
    documents: [
      {
        id: 'doc-ren-1',
        title: 'USAF Department of the Air Force Memo: Unexplained Lights (Halt Memo)',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Department of the Air Force / 81st Combat Support Group (USAFE)',
        dateCreated: '1981-01-13',
        dateDeclassified: '1983-06-01',
        fileReference: 'DEFE-24-1948-HALT-MEMO',
        summary: 'Primary document detailing chronological observations of anomalous illuminated objects at RAF Woodbridge.',
        fullExcerpt: 'The individuals reported seeing a strange glowing object in the forest. It was metallic in appearance and triangular in shape, approximately two to three meters across the base.',
        authenticityNote: 'Authenticated by UK National Archives at Kew.',
        pageCount: 3,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-ren-1', name: 'Lt. Col. Charles Halt', type: 'PERSON', role: 'Deputy Base Commander' },
      { id: 'ent-ren-2', name: 'RAF Woodbridge', type: 'LOCATION', role: 'USAF Twin Base in UK' },
      { id: 'ent-ren-3', name: 'UK Ministry of Defence', type: 'AGENCY', role: 'Investigating Military Body' }
    ],
    connectedCaseIds: ['roswell-incident-1947', 'area-51-groom-lake'],
    views: 51200,
    commentCount: 880,
    bookmarkCount: 3100,
    communityVerdictVote: { confirmed: 2800, disputed: 1900, unverified: 620, debunked: 310 }
  },
  {
    id: 'project-stargate-remote-viewing',
    caseNumber: 'FILE-0017',
    title: 'Project Stargate: CIA Remote Viewing Program',
    subtitle: 'Stanford Research Institute, Quantum ESP & Cold War Psychic Spies',
    category: 'PSYCHOLOGY_CONTROL',
    status: 'CONFIRMED',
    officialVerdict: 'The US Government officially funded and operated Project Stargate from 1978 to 1995 under the Defense Intelligence Agency (DIA) and CIA. Declassified and terminated in 1995 following the American Institutes for Research (AIR) report concluding it was not operationally useful.',
    summary: 'A secret 20-year US military and intelligence project that employed trained psychics at Fort Meade and Stanford Research Institute (SRI) to perform "coordinate remote viewing"—attempting to psychically gather intelligence on Soviet submarine bases, hijacked planes, and hostages.',
    claim: 'Trained remote viewers consistently gathered verifiable visual and technical data on Soviet deep underground nuclear bunkers and secret facilities that defied known electromagnetic shielding.',
    claimOrigin: 'Dr. Russell Targ and Dr. Harold Puthoff (SRI 1974), Major General Albert Stubblebine, CIA 1995 declassification dump.',
    whatWeKnow: [
      'The US Government spent over $20 million between 1972 and 1995 investigating anomalous mental perception.',
      'Physicists Russell Targ and Harold Puthoff published early remote viewing experiments in Nature in October 1974.',
      'Viewers like Ingo Swann and Joseph McMoneagle were utilized during real-world crises, including locating a downed Soviet Tu-22 bomber in Africa and predicting the launch of a new Soviet Typhoon-class submarine.',
      'In 1995, the CIA declassified 270 boxes containing 12,000 pages of Stargate mission logs and scientific protocols.'
    ],
    speculations: [
      'Claims that remote viewers viewed ancient structures on Mars or extraterrestrial bases under Mount Hayes in Alaska.',
      'Debates regarding whether statistical anomaly rates reflected genuine quantum nonlocal entanglement or post-hoc confirmation bias.'
    ],
    evidenceList: [
      {
        id: 'ev-sta-1',
        title: 'CIA Declassified Stargate Program Master File (1995)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'CIA CREST Electronic Reading Room / Record Group 263',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Comprehensive collection of military intelligence taskings, session sketches, and coordinates used by military viewers at Fort Meade.',
        context: 'Completely confirms the existence, funding, and operational deployment of psychic intelligence units.',
        votes: 560,
        userVoted: 'up'
      },
      {
        id: 'ev-sta-2',
        title: 'Nature Journal Publication: Information Transmission Under Conditions of Sensory Shielding',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Nature Vol. 251, pp. 602–607 (Targ & Puthoff, Oct 1974)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Peer-reviewed scientific study detailing controlled double-blind target identification at Stanford Research Institute.',
        context: 'Established the initial scientific basis for Defense Intelligence Agency funding.',
        votes: 430
      }
    ],
    timeline: [
      { id: 'tm-sta-1', date: '1972-08-01', title: 'SRI CIA Contract Initiated', description: 'CIA Technical Services Division contracts Russell Targ and Harold Puthoff.', rating: 'CONFIRMED' },
      { id: 'tm-sta-2', date: '1978-10-01', title: 'Grill Flame / Stargate at Fort Meade', description: 'US Army Intelligence establishes operational remote viewing detachment.', rating: 'CONFIRMED' },
      { id: 'tm-sta-3', date: '1995-11-28', title: 'Official Declassification & Closure', description: 'CIA officially transfers and declassifies Stargate records.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-sta-1',
        title: 'DIA Directive: Project Star Gate Operational Guidelines',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Defense Intelligence Agency (DIA) / Directorate for Scientific and Technical Intelligence',
        dateCreated: '1984-06-18',
        dateDeclassified: '1995-12-01',
        fileReference: 'DIA-SG-DOD-84-09',
        summary: 'Standard operating procedures for coordinate target blinding, monitor protocols, and intelligence evaluation.',
        fullExcerpt: 'Remote viewing protocols require complete double-blind isolation of both the viewer and the interview monitor from all target site metadata.',
        authenticityNote: 'Authenticated via National Archives Modern Military Branch.',
        pageCount: 44,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-sta-1', name: 'Ingo Swann', type: 'PERSON', role: 'Pioneering Remote Viewer & Artist' },
      { id: 'ent-sta-2', name: 'Joseph McMoneagle', type: 'PERSON', role: 'Remote Viewer #001 & Legion of Merit Recipient' },
      { id: 'ent-sta-3', name: 'Stanford Research Institute', type: 'ORGANIZATION', role: 'Scientific Testing Laboratory' },
      { id: 'ent-sta-4', name: 'CIA', type: 'AGENCY', role: 'Funding & Oversight Agency' }
    ],
    connectedCaseIds: ['mkultra-program', 'havana-syndrome'],
    views: 49000,
    commentCount: 810,
    bookmarkCount: 2750,
    communityVerdictVote: { confirmed: 3600, disputed: 890, unverified: 450, debunked: 180 }
  },
  {
    id: 'operation-highjump-hollow-earth',
    caseNumber: 'FILE-0018',
    title: 'Operation Highjump & Admiral Byrd\'s Antarctic Mission',
    subtitle: 'Task Force 68, Secret Polar Bases & The Hollow Earth Mystery',
    category: 'ANCIENT_MYSTERIES',
    status: 'DISPUTED',
    officialVerdict: 'Task Force 68 was a massive 1946-1947 US Navy cold-weather military exercise involving 4,700 personnel and 13 ships designed to test equipment and map polar territory under extreme arctic combat conditions during the onset of the Cold War.',
    summary: 'In 1946, Admiral Richard E. Byrd led the largest military expedition ever dispatched to Antarctica (Operation Highjump). The mission terminated months ahead of schedule, sparking decades of lore regarding secret German Base 211, advanced disc craft, and openings to an inner Earth.',
    claim: 'Admiral Byrd\'s fleet encountered advanced technological craft and entrances to an inner subterranean realm beyond the South Pole, prompting an immediate tactical retreat.',
    claimOrigin: 'Santiago, Chile newspaper "El Mercurio" interview with Byrd (March 5, 1947); 1950s alternative hollow earth literature (F. Amadeo Giannini).',
    whatWeKnow: [
      'Operation Highjump deployed an aircraft carrier (USS Philippine Sea), submarines, icebreakers, and 33 aircraft to Antarctica.',
      'The expedition suffered three fatalities when a PBM-5 Mariner seaplane ("George 1") crashed in a blizzard during mapping runs.',
      'In a March 1947 interview with journalist Lee van Atta in Chile, Byrd famously warned that the US must prepare to defend against "hostile aircraft flying from polar regions."',
      'Historical archives prove Germany launched the 1938-1939 "Neuschwabenland" expedition to secure whaling rights, but never built an underground military fortress in Queen Maud Land.'
    ],
    speculations: [
      'A widely circulated "secret flight log" claiming Byrd flew inside a lush green tropical hollow earth on February 19, 1947 (debunked as Byrd was documented at Little America IV on that exact date).',
      'Theories that Operation Highjump was a combat mission to destroy Nazi flying disc bases.'
    ],
    evidenceList: [
      {
        id: 'ev-hig-1',
        title: 'Report of Operation Highjump: Task Force 68 Official Navy Report',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'US Naval History and Heritage Command, Operational Archives',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official after-action report documenting 70,000 aerial reconnaissance photographs, scientific magnetic mapping data, and polar equipment testing.',
        context: 'Confirms the military objectives while documenting the brutal icepack conditions that forced early departure.',
        votes: 410
      },
      {
        id: 'ev-hig-2',
        title: 'El Mercurio Interview with Admiral Byrd (March 5, 1947)',
        type: 'JOURNALISM',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'El Mercurio Newspaper Archives, Santiago, Chile',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Byrd stating to the press: "In case of a new war, the United States may be attacked by flying objects that are able to fly from one pole to the other at incredible speeds."',
        context: 'Primary historical quote that ignited modern geopolitical polar defense theories.',
        votes: 510
      }
    ],
    timeline: [
      { id: 'tm-hig-1', date: '1946-08-26', title: 'Highjump Ordered by CNO Nimitz', description: 'Chief of Naval Operations Chester Nimitz signs operational order.', rating: 'CONFIRMED' },
      { id: 'tm-hig-2', date: '1947-01-15', title: 'Task Force Arrives in Ross Sea', description: 'Fleet establishes Little America IV tent camp on Ross Ice Shelf.', rating: 'CONFIRMED' },
      { id: 'tm-hig-3', date: '1947-03-03', title: 'Early Termination of Highjump', description: 'Early onset of Antarctic winter and severe pack ice forces fleet departure.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-hig-1',
        title: 'US Navy Task Force 68 Operations Order No. 2-46',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Commander Task Force 68 / Department of the Navy',
        dateCreated: '1946-10-15',
        fileReference: 'TF68-OP-ORD-2-46',
        summary: 'Deployment orders specifying training of personnel and testing of naval materiel in frigid polar zones.',
        fullExcerpt: 'The objective of the Antarctic Development Project is to establish bases, extend United States sovereign rights, and determine feasibility of continuous polar operations.',
        authenticityNote: 'Preserved at National Archives College Park, MD.',
        pageCount: 36,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-hig-1', name: 'Admiral Richard E. Byrd', type: 'PERSON', role: 'Expedition Commander & Aviator' },
      { id: 'ent-hig-2', name: 'USS Philippine Sea (CV-47)', type: 'LOCATION', role: 'Flagship Aircraft Carrier' },
      { id: 'ent-hig-3', name: 'Little America IV', type: 'LOCATION', role: 'Polar Expedition Base' }
    ],
    connectedCaseIds: ['roswell-incident-1947', 'dyatlov-pass-incident'],
    views: 44000,
    commentCount: 710,
    bookmarkCount: 2200,
    communityVerdictVote: { confirmed: 920, disputed: 2100, unverified: 1400, debunked: 1900 }
  },
  {
    id: 'tunguska-event-1908',
    caseNumber: 'FILE-0019',
    title: 'The 1908 Tunguska Blast & Nikola Tesla',
    subtitle: 'The Siberian Fireball, Cosmic Airburst vs. Wardenclyffe Death Ray',
    category: 'UNSOLVED',
    status: 'CONFIRMED',
    officialVerdict: 'Mainstream astrophysics and geology confirm the blast was caused by the atmospheric airburst of a stony asteroid or comet fragment (50–100m diameter) exploding 5 to 10 kilometers above the Podkamennaya Tunguska River, flattening 80 million trees.',
    summary: 'On June 30, 1908, a titanic 12-megaton explosion flattened 2,150 square kilometers of Siberian taiga forest without leaving an impact crater, shaking seismographs worldwide and causing glowing night skies over London and Western Europe.',
    claim: 'The blast was the result of Nikola Tesla testing his wireless electrical power transmitter at Wardenclyffe Tower, New York, discharging a directed energy pulse intended for Arctic explorer Robert Peary.',
    claimOrigin: 'Alternative historical theories popularized in the late 20th century connecting Tesla\'s 1908 wireless transmission patents with Siberian seismic records.',
    whatWeKnow: [
      'The blast released energy equivalent to 10 to 15 megatons of TNT—1,000 times more powerful than the atomic bomb dropped on Hiroshima.',
      'Leonid Kulik\'s 1927 Soviet expedition discovered trees flattened outwards in a radial "butterfly" pattern across 830 square miles, with center trees remaining standing with stripped branches (the "telephone poles").',
      'Modern micro-sediment analysis from peat bogs at the site has revealed microscopic carbon and nanodiamond spherules consistent with a cosmic bolide airburst.',
      'Wardenclyffe Tower had its power generators disconnected and financial funding halted by J.P. Morgan in 1906, two years prior to the Tunguska event.'
    ],
    speculations: [
      'Theories proposing the collision of a microscopic primordial black hole or a chunk of antimatter.',
      'Alien spacecraft emergency mid-air nuclear core detonation to prevent ground catastrophe.'
    ],
    evidenceList: [
      {
        id: 'ev-tun-1',
        title: 'Soviet Academy of Sciences Leonid Kulik Expedition Field Photographs (1927)',
        type: 'PHOTOGRAPH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Russian Academy of Sciences Archives, Moscow',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Ground photographs showing the classic radial butterfly pattern of millions of flattened larch trees pointing directly away from the epicenter.',
        context: 'Conclusively established the high-altitude airburst nature of the explosion.',
        votes: 490
      },
      {
        id: 'ev-tun-2',
        title: 'Planetary and Space Science Comet/Asteroid Airburst Modeling',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Planetary and Space Science Vol. 98, pp. 56–68 (2014)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Hydrodynamic computational simulations matching the ground blast footprint to a 60-meter stony asteroid exploding at 8.5 km altitude.',
        context: 'Provides the standard scientific explanation for the lack of a ground impact crater.',
        votes: 380
      }
    ],
    timeline: [
      { id: 'tm-tun-1', date: '1908-06-30', title: 'Tunguska Atmospheric Airburst', description: 'Detonation occurs at 7:17 AM local time over Podkamennaya Tunguska.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-tun-2', date: '1927-03-01', title: 'Kulik Expedition Reaches Epicenter', description: 'First scientific party inspects ground destruction.', rating: 'CONFIRMED' },
      { id: 'tm-tun-3', date: '2013-02-15', title: 'Chelyabinsk Airburst Comparison', description: 'Chelyabinsk meteor provides modern high-definition optical verification of bolide airbursts.', rating: 'CONFIRMED' }
    ],
    documents: [
      {
        id: 'doc-tun-1',
        title: 'Irkutsk Magnetic and Meteorological Observatory Seismograph Log',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Russian Imperial Academy of Sciences',
        dateCreated: '1908-06-30',
        fileReference: 'IMMO-SEIS-1908-0630',
        summary: 'Seismic waveform recordings measuring ground shockwaves 900 kilometers south of the blast epicenter.',
        fullExcerpt: 'At 7:17 AM, the Milne horizontal pendulum registered continuous ground perturbations lasting over an hour.',
        authenticityNote: 'Historic seismic records cataloged in global geophysics repositories.',
        pageCount: 8,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-tun-1', name: 'Leonid Kulik', type: 'PERSON', role: 'First Expedition Leader' },
      { id: 'ent-tun-2', name: 'Nikola Tesla', type: 'PERSON', role: 'Inventor & Theorized Pulse Originator' },
      { id: 'ent-tun-3', name: 'Podkamennaya Tunguska River', type: 'LOCATION', role: 'Blast Site' }
    ],
    connectedCaseIds: ['dyatlov-pass-incident', 'roswell-incident-1947'],
    views: 41000,
    commentCount: 590,
    bookmarkCount: 2100,
    communityVerdictVote: { confirmed: 3100, disputed: 620, unverified: 340, debunked: 410 }
  },
  {
    id: 'georgia-guidestones',
    caseNumber: 'FILE-0020',
    title: 'The Georgia Guidestones & R.C. Christian',
    subtitle: 'The Mysterious Granite Ten Commandments & 2022 Bombing',
    category: 'GLOBAL_EVENTS',
    status: 'UNVERIFIED',
    officialVerdict: 'Erected in Elbert County, Georgia in March 1980 by a man using the pseudonym "R.C. Christian." The monument was heavily damaged in an unsolved explosive bombing on July 6, 2022, and subsequently demolished by county authorities for safety.',
    summary: 'A 19-foot-tall granite astronomical megalith dubbed "America\'s Stonehenge," inscribed in 8 modern languages and 4 ancient scripts with 10 guidelines for humanity—including maintaining global population under 500 million in perpetual balance with nature.',
    claim: 'The Guidestones were commissioned by a secretive Rosicrucian or eugenicist globalist order planning a managed depopulation and a unified world court system.',
    claimOrigin: 'Original dedication book published by Elberton Granite Finishing Company (1981); Mark Dice (2005); 2022 Georgia gubernatorial campaign controversies.',
    whatWeKnow: [
      'In June 1979, a well-dressed gentleman calling himself "Robert C. Christian" approached Joe Fendley of Elberton Granite to commission the monument representing "a small group of loyal Americans."',
      'Banker Wyatt Martin was the sole individual who knew Christian\'s true legal identity, having signed a strict non-disclosure agreement.',
      'The stones featured astronomical apertures aligning with the celestial pole and the solstice sun.',
      'On July 6, 2022 at 4:03 AM, an unknown suspect detonated an explosive device destroying the Swahili/Hindi slab; the Georgia Bureau of Investigation (GBI) released surveillance footage but has made zero arrests.'
    ],
    speculations: [
      'Documentarian Christian J. Pinto claimed in 2015 that R.C. Christian was Dr. Herbert Hinzie Kersten, a physician associated with eugenics pioneer William Shockley.',
      'Claims that the time capsule buried six feet below the capstone contained instructions for post-apocalyptic societal rebuilding.'
    ],
    evidenceList: [
      {
        id: 'ev-gui-1',
        title: 'GBI Surveillance Footage of 2022 Explosion',
        type: 'AUDIO_VIDEO',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Georgia Bureau of Investigation (GBI) Public Case File (July 6, 2022)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official time-stamped video showing a silver sedan pulling up followed by a high-explosive blast shattering the granite structure.',
        context: 'Primary evidence of the physical destruction of the monument.',
        votes: 480
      },
      {
        id: 'ev-gui-2',
        title: '"The Georgia Guidestones Guidebook" by Elberton Granite Finishing Co.',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Elbert County Historical Society Archives (1981)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'First-edition booklet written by R.C. Christian detailing the architectural and philosophical purpose of the stones as a rational beacon for post-collapse survivors.',
        context: 'Primary textual source authored by the anonymous benefactor.',
        votes: 390
      }
    ],
    timeline: [
      { id: 'tm-gui-1', date: '1979-06-01', title: 'R.C. Christian Visits Elberton', description: 'Mysterious client contracts granite company.', rating: 'CONFIRMED' },
      { id: 'tm-gui-2', date: '1980-03-22', title: 'Guidestones Unveiled', description: 'Monument dedicated before crowd of 400 people.', rating: 'CONFIRMED' },
      { id: 'tm-gui-3', date: '2022-07-06', title: 'Explosive Bombing & Demolition', description: 'Bombing destroys structure; county bulldozes remainder.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-gui-1',
        title: 'Original Elberton Granite Finishing Co. Contract Agreement',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Granite City Bank / Elberton Granite Association',
        dateCreated: '1979-07-15',
        fileReference: 'EGA-RCC-CONTRACT-1979',
        summary: 'Escrow account agreement and engineering specifications for the 119-ton granite monument.',
        fullExcerpt: 'The monument shall be constructed of Pyramid Blue granite, designed to withstand the most catastrophic natural and man-made disasters.',
        authenticityNote: 'Held by the Elbert County Museum.',
        pageCount: 14,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-gui-1', name: 'R.C. Christian', type: 'PERSON', role: 'Anonymous Benefactor' },
      { id: 'ent-gui-2', name: 'Wyatt Martin', type: 'PERSON', role: 'Banker & Trustee' },
      { id: 'ent-gui-3', name: 'Elbert County, Georgia', type: 'LOCATION', role: 'Monument Site' }
    ],
    connectedCaseIds: ['denver-airport-murals', 'bohemian-grove-elites'],
    views: 47000,
    commentCount: 760,
    bookmarkCount: 2400,
    communityVerdictVote: { confirmed: 2100, disputed: 1800, unverified: 940, debunked: 350 }
  },
  {
    id: 'voynich-manuscript',
    caseNumber: 'FILE-0021',
    title: 'The Voynich Manuscript',
    subtitle: 'The 15th-Century Undeciphered Botanical & Astrological Cipher Codex',
    category: 'ANCIENT_MYSTERIES',
    status: 'UNVERIFIED',
    officialVerdict: 'Radiocarbon dating by the University of Arizona confirms the vellum parchment dates between 1404 and 1438 AD. The manuscript (Beinecke MS 408) remains undeciphered by modern cryptographers, AI models, and linguists.',
    summary: 'An illustrated 240-page codex hand-written in an unknown writing system ("Voynichese") containing vibrant watercolor illustrations of unidentified celestial constellations, unknown botanical plants, and naked nymphs bathing in interconnected green biological piping.',
    claim: 'The codex is an encrypted hermetic compendium of advanced medieval alchemy, lost European botanical pharmacology, an artificial constructed language, or an elaborate 15th-century hoax.',
    claimOrigin: 'Discovered in 1912 by Polish-American book dealer Wilfrid Voynich at the Jesuit College of Villa Mondragone in Frascati, Italy.',
    whatWeKnow: [
      'The text strictly follows statistical Zipf\'s Law and word entropy rules consistent with natural human languages, ruling out random gibberish.',
      'World War II codebreakers, including William F. Friedman (head of the NSA predecessor Signal Intelligence Service), spent decades attempting to break the cipher without success.',
      'Vellum carbon-dating proved all pages are contemporaneous to the early 15th century Italian Renaissance.',
      'None of the 126 depicted plants match known botanical species on Earth.'
    ],
    speculations: [
      'Theories proposing it was created using a Cardan grille cipher by Renaissance alchemist John Dee or Edward Kelley.',
      'Claims that it represents a Proto-Romance phonetic dialect written in an abbreviated cursive script.'
    ],
    evidenceList: [
      {
        id: 'ev-voy-1',
        title: 'University of Arizona Accelerator Mass Spectrometry Radiocarbon Dating',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'NSF-Arizona AMS Laboratory / Yale University Beinecke Library (2009)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'High-precision carbon-14 analysis confirming with 95% confidence that the parchment was manufactured between 1404 and 1438.',
        context: 'Completely disproved 20th-century forgery claims.',
        votes: 530
      },
      {
        id: 'ev-voy-2',
        title: 'PLOS ONE Statistical Linguistics Analysis of Voynichese Entropy',
        type: 'ACADEMIC_RESEARCH',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'PLOS ONE 8(6): e66344 (Amâncio et al., 2013)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Complex network and word clustering analysis demonstrating the text exhibits authentic information-bearing semantic structure matching natural human discourse.',
        context: 'Proves the text was written intentionally with meaningful structural grammar.',
        votes: 460
      }
    ],
    timeline: [
      { id: 'tm-voy-1', date: '1420', title: 'Manuscript Penned', description: 'Vellum prepared and illustrated in Northern Italy.', rating: 'CONFIRMED' },
      { id: 'tm-voy-2', date: '1912-08-01', title: 'Wilfrid Voynich Discovery', description: 'Antique dealer acquires codex from Jesuit monastery.', rating: 'CONFIRMED' },
      { id: 'tm-voy-3', date: '1969-01-01', title: 'Donated to Yale University', description: 'Beinecke Rare Book & Manuscript Library catalogs MS 408.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-voy-1',
        title: 'Yale Beinecke Library MS 408 High-Resolution Digital Scan Excerpts',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Yale University Beinecke Rare Book and Manuscript Library',
        dateCreated: '1420-01-01',
        fileReference: 'YALE-BEINECKE-MS408',
        summary: 'Ultra-high resolution multi-spectral scans of the Zodiac, Herbal, and Balneological folios.',
        fullExcerpt: 'Folio 78r: Detailed watercolor depiction of female figures immersed in interconnected emerald fluid conduits and plumbing apparatus.',
        authenticityNote: 'Preserved at Yale University, New Haven, CT.',
        pageCount: 240,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-voy-1', name: 'Wilfrid Voynich', type: 'PERSON', role: 'Book Dealer & Discoverer' },
      { id: 'ent-voy-2', name: 'William F. Friedman', type: 'PERSON', role: 'Chief Cryptanalyst' },
      { id: 'ent-voy-3', name: 'Beinecke Library (Yale)', type: 'LOCATION', role: 'Repository' }
    ],
    connectedCaseIds: ['cicada-3301', 'tartaria-mud-flood'],
    views: 56000,
    commentCount: 940,
    bookmarkCount: 3600,
    communityVerdictVote: { confirmed: 890, disputed: 1100, unverified: 3800, debunked: 90 }
  },
  {
    id: 'black-knight-satellite',
    caseNumber: 'FILE-0022',
    title: 'The Black Knight Satellite',
    subtitle: 'The 13,000-Year-Old Alien Polar Orbit Anomaly & STS-88 Debris',
    category: 'UFOS_UAP',
    status: 'DEBUNKED',
    officialVerdict: 'NASA and space debris tracking experts confirm the famous 1998 STS-88 photographs show an astronaut thermal insulation blanket (Trunnion Pin Thermal Cover) that was accidentally lost during an EVA spacewalk while constructing the International Space Station.',
    summary: 'A long-running ufological theory claiming a 13,000-year-old extraterrestrial satellite of unknown origin has been orbiting Earth in a near-polar orbit, broadcasting anomalous radio signals detected by Nikola Tesla in 1899 and Gordon Cooper in 1963.',
    claim: 'An ancient alien sentinel satellite orbits in a polar retrograde trajectory monitoring humanity and relaying star-map coordinates pointing to Epsilon Boötis.',
    claimOrigin: '1973 article in Spaceflight magazine by Scottish science-fiction author Duncan Lunan analyzing 1920s Long Delayed Echoes (LDE); conflated with 1998 NASA STS-88 space shuttle mission photography.',
    whatWeKnow: [
      'In December 1998 during STS-88 (Space Shuttle Endeavour), astronaut Jerry Ross lost a trunnion thermal blanket during EVA-1; NASA tracked it as debris item 1998-067C (NORAD ID 25570) until it burned up in the atmosphere.',
      'Duncan Lunan later publicly retracted his 1973 star-map interpretation, stating his calculations were based on unconfirmed radio echo data.',
      'Nikola Tesla detected periodic rhythmic radio signals in Colorado Springs in 1899, which modern astrophysicists attribute to natural Jovian magnetospheric emissions or pulsars.'
    ],
    speculations: [
      'Claims that the US Department of Defense detected the object in 1960 before any human nation had the capability to launch satellites into polar orbit.'
    ],
    evidenceList: [
      {
        id: 'ev-bks-1',
        title: 'NASA STS-88 Mission Photographic Archive (Photos STS088-724-65 to 70)',
        type: 'PHOTOGRAPH',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'NASA Johnson Space Center / National Archives Space Program Collection',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'High-resolution sequential photography showing the crumpled thermal insulation blanket tumbling away from Endeavour\'s payload bay during ISS assembly.',
        context: 'Conclusively identifies the physical object in the famous "Black Knight" photographs.',
        votes: 470
      },
      {
        id: 'ev-bks-2',
        title: 'NORAD Satellite Catalog Debris Tracking Record 25570',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'US Space Command / Space-Track.org Orbital Database',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Radar tracking telemetry documenting the orbital decay and atmospheric re-entry of the STS-88 thermal blanket in early 1999.',
        context: 'Proves the photographed object was in low Earth decaying orbit, not in permanent 13,000-year polar orbit.',
        votes: 390
      }
    ],
    timeline: [
      { id: 'tm-bks-1', date: '1899-07-01', title: 'Tesla Records Periodic Radio Beeps', description: 'Nikola Tesla detects cosmic radio signals in Colorado Springs.', rating: 'CONFIRMED' },
      { id: 'tm-bks-2', date: '1973-05-01', title: 'Duncan Lunan Star Map Theory', description: 'Lunan publishes Epsilon Boötis interpretation in Spaceflight.', rating: 'CONFIRMED' },
      { id: 'tm-bks-3', date: '1998-12-11', title: 'STS-88 Thermal Blanket Lost', description: 'Astronaut loses thermal cover during ISS assembly spacewalk.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-bks-1',
        title: 'NASA STS-88 Extravehicular Activity (EVA) Mission Debrief',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'NASA Johnson Space Center',
        dateCreated: '1999-01-15',
        fileReference: 'NASA-JSC-STS88-EVA1',
        summary: 'Official technical debrief detailing the loss of four thermal insulation covers during the mating of the Unity and Zarya modules.',
        fullExcerpt: 'During installation of the trunnion pins, thermal blanket cover assembly detached from tether and drifted into orbital path.',
        authenticityNote: 'Official NASA post-mission report.',
        pageCount: 30,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-bks-1', name: 'Space Shuttle Endeavour (STS-88)', type: 'LOCATION', role: 'Mission Spacecraft' },
      { id: 'ent-bks-2', name: 'Duncan Lunan', type: 'PERSON', role: 'Author / Astrophotography Theorist' },
      { id: 'ent-bks-3', name: 'Nikola Tesla', type: 'PERSON', role: 'Pioneering Radio Experimenter' }
    ],
    connectedCaseIds: ['roswell-incident-1947', 'tunguska-event-1908'],
    views: 43000,
    commentCount: 670,
    bookmarkCount: 1950,
    communityVerdictVote: { confirmed: 410, disputed: 720, unverified: 610, debunked: 3400 }
  },
  {
    id: 'operation-mockingbird',
    caseNumber: 'FILE-0019',
    title: 'Operation Mockingbird: CIA Newsroom Infiltration & Media Control',
    subtitle: 'Frank Wisner\'s "Mighty Wurlitzer" & Classified Press Asset Networks',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Formally acknowledged in 1976 Church Committee Hearings (Book I, "Foreign and Military Intelligence") and confirmed by Carl Bernstein\'s landmark 1977 investigative expose; CIA maintained relationships with over 400 American journalists and major media executives.',
    summary: 'Starting in the early Cold War under Office of Policy Coordination chief Frank Wisner and CIA Director Allen Dulles, Operation Mockingbird was a large-scale clandestine project to recruit American and international journalists, publish manufactured propaganda, and censor unfavorable intelligence leaks.',
    claim: 'The CIA covertly placed paid assets, stringers, and senior editors at leading news organizations (The New York Times, CBS, Time, Newsweek, Washington Post) to shape domestic public opinion.',
    claimOrigin: '1975 Senate Church Committee Report, 1976 Pike Committee Report, Carl Bernstein "The CIA and the Media" (Rolling Stone, 1977).',
    whatWeKnow: [
      'The 1976 Church Committee officially concluded: "The CIA currently maintains a network of several hundred foreign individuals around the world who provide intelligence for the CIA and at times attempt to influence opinion through the use of covert propaganda."',
      'Carl Bernstein documented that over 400 American journalists secretly carried out assignments for the CIA between 1950 and 1975, with publishers like Arthur Hays Sulzberger and William Paley knowingly cooperating.',
      'Frank Wisner openly referred to the global media network as his "Mighty Wurlitzer," capable of playing any propaganda tune worldwide on command.',
      'CIA Director George H.W. Bush issued a directive in February 1976 ostensibly banning paid relationships with accredited US news organizations, but exempting unpaid voluntary contacts and foreign stringers.'
    ],
    speculations: [
      'Theories claiming that modern corporate media consolidation is an unbroken operational extension of Mockingbird without formal agency tasking orders.'
    ],
    evidenceList: [
      {
        id: 'ev-mock-1',
        title: 'Church Committee Final Report: CIA Use of Journalists (Book I, Chapter X)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'U.S. Senate Select Committee on Intelligence (1976), Report 94-755',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official Senate finding documenting that approximately 50 US journalists had formal contractual relationships with the CIA while hundreds more provided informal intelligence.',
        context: 'Primary congressional finding establishing the existence of domestic press manipulation.',
        votes: 940,
        userVoted: 'up'
      },
      {
        id: 'ev-mock-2',
        title: 'Carl Bernstein: "The CIA and the Media" (Rolling Stone, Oct 20, 1977)',
        type: 'JOURNALISM',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Rolling Stone Magazine Archive / Pulitzer Prize Journalist Investigation',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Bernstein’s six-month investigation revealed top executives at CBS, Time Inc., NYT, and AP provided cover for CIA operatives abroad and shared unpublished reporter notebooks.',
        context: 'Substantiated by declassified CIA executive records and on-the-record statements from former CIA officials.',
        votes: 820
      }
    ],
    timeline: [
      { id: 'tm-mock-1', date: '1948-09-01', title: 'Office of Policy Coordination Created', description: 'Frank Wisner establishes covert psychological warfare division under NSC 10/2.', rating: 'CONFIRMED' },
      { id: 'tm-mock-2', date: '1976-04-26', title: 'Church Committee Exposes Press Operations', description: 'Senate reveals hundreds of covert media assets and book publishing operations.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-mock-3', date: '1977-10-20', title: 'Bernstein Publishes "The CIA and the Media"', description: 'Landmark expose details specific newsrooms and executives involved in operations.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-mock-1',
        title: 'CIA Directive on Media Guidelines (Director George H.W. Bush Statement)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Central Intelligence Agency',
        dateCreated: '1976-02-11',
        fileReference: 'CIA-RDP80M00165A001800100001-3',
        summary: 'Official CIA policy statement issued in response to Church Committee disclosures regarding future relations with news media organizations.',
        fullExcerpt: 'Effective immediately, CIA will not enter into any paid or contractual relationship with any full-time or part-time news correspondent accredited by any U.S. news service, newspaper, periodical, radio or television network.',
        authenticityNote: 'Authenticated from CIA CREST records repository.',
        pageCount: 2,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-mock-1', name: 'Frank Wisner', type: 'PERSON', role: 'Chief of Office of Policy Coordination / Architect of "Mighty Wurlitzer"' },
      { id: 'ent-mock-2', name: 'Carl Bernstein', type: 'PERSON', role: 'Investigative Journalist' },
      { id: 'ent-mock-3', name: 'Allen Dulles', type: 'PERSON', role: 'CIA Director (1953–1961)' },
      { id: 'ent-mock-4', name: 'Central Intelligence Agency (CIA)', type: 'AGENCY', role: 'Oversight Agency' }
    ],
    connectedCaseIds: ['mkultra-program', 'jfk-assassination', 'gary-webb-dark-alliance'],
    views: 68000,
    commentCount: 1140,
    bookmarkCount: 4200,
    communityVerdictVote: { confirmed: 4600, disputed: 120, unverified: 35, debunked: 15 }
  },
  {
    id: 'gulf-of-tonkin-1964',
    caseNumber: 'FILE-0020',
    title: 'The Gulf of Tonkin Incident: Fabricated Casus Belli for War',
    subtitle: 'August 4, 1964 Destroyer Attack Claim vs. Declassified NSA Signals Intelligence',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Declassified NSA historical review by Robert J. Hanyok (2001, released 2005) concluded that the second attack on August 4, 1964, never occurred; SIGINT intercepts were deliberately cherry-picked and mistranslated to present an imminent attack to President Lyndon B. Johnson.',
    summary: 'On August 4, 1964, the US military reported that North Vietnamese torpedo boats launched a second unprovoked attack against the destroyers USS Maddox and USS Turner Joy in the Gulf of Tonkin. This prompted Congress to pass the Gulf of Tonkin Resolution, authorizing full military escalation in Vietnam.',
    claim: 'The August 4 attack was an erroneous or manufactured radar-ghost encounter used by the White House to pass a pre-drafted war resolution.',
    claimOrigin: 'Squadron Commander James Stockdale (eyewitness pilot, 1964/1984), Daniel Ellsberg (Pentagon Papers, 1971), NSA Cryptologic Historian Robert Hanyok (2001).',
    whatWeKnow: [
      'Navy fighter pilot Commander James Stockdale flew directly over the destroyers on August 4 and saw no North Vietnamese boats: "I had the best seat in the house... our destroyers were just shooting at phantom targets."',
      'Captain John Herrick of the USS Maddox cabled the Pentagon hours after the event: "Review of action makes many reported contacts and torpedoes fired appear doubtful. Freak weather effects on radar and overeager sonarmen may have accounted for many reports."',
      'President Johnson famously remarked privately in 1965: "For all I know, our Navy was shooting at whales out there."',
      'The 2001 NSA internal study "Spartans in Darkness" concluded that 90% of the SIGINT intercepts from August 4 were withheld or skewed to present a false impression of an active ambush.'
    ],
    speculations: [
      'Debates regarding whether President Johnson knew on August 4 that the attack was false or was deceived by Defense Secretary Robert McNamara’s selective briefings.'
    ],
    evidenceList: [
      {
        id: 'ev-ton-1',
        title: 'NSA Cryptologic History: "Skunks, Bogies, Silent Hounds, and the Flying Fish" (Hanyok, 2001)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'National Security Agency Cryptologic Quarterly / Declassified under FOIA in 2005',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official internal NSA historical study proving that SIGINT personnel systematically misdated and mistranslated intercepts from August 2 to falsely substantiate an attack on August 4.',
        context: 'Undisputed official confirmation of historical fabrication from within the NSA.',
        votes: 1120,
        userVoted: 'up'
      },
      {
        id: 'ev-ton-2',
        title: 'USS Maddox Captain John Herrick Operational Flash Cable (Aug 4, 1964)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'Naval Historical Center Archives / Pentagon Papers Vol. V',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Urgent cable from destroyer task force commander warning that bad weather and freak sonar readings likely generated false torpedo reports and urging no retaliatory airstrikes until daylight evaluation.',
        context: 'Ignored by Secretary of Defense Robert McNamara prior to airstrike authorization.',
        votes: 780
      }
    ],
    timeline: [
      { id: 'tm-ton-1', date: '1964-08-02', title: 'First Tonkin Skirmish', description: 'USS Maddox engages three North Vietnamese P-4 torpedo boats in international waters.', rating: 'CONFIRMED' },
      { id: 'tm-ton-2', date: '1964-08-04', title: 'Ghost Attack & Immediate Retaliation', description: 'Destroyers fire in darkness; President Johnson addresses nation and orders Operation Pierce Arrow bombing.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-ton-3', date: '1964-08-07', title: 'Gulf of Tonkin Resolution Passed', description: 'Congress passes resolution with only two dissenting votes, expanding the Vietnam War.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-ton-1',
        title: 'NSA Gulf of Tonkin SIGINT Translation Review File',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'National Security Agency (NSA)',
        dateCreated: '1964-08-04',
        dateDeclassified: '2005-11-30',
        fileReference: 'NSA-SIGINT-TONKIN-DOC-2005',
        summary: 'Declassified original raw intercepts demonstrating that North Vietnamese military messages referred to salvage operations from August 2 rather than new offensive actions.',
        fullExcerpt: 'The North Vietnamese radio messages cited as proof of attack on August 4 were in fact translations describing the towing of two damaged patrol boats from the August 2 engagement.',
        authenticityNote: 'Verified and published by George Washington University National Security Archive.',
        pageCount: 34,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-ton-1', name: 'Robert McNamara', type: 'PERSON', role: 'Secretary of Defense' },
      { id: 'ent-ton-2', name: 'Lyndon B. Johnson', type: 'PERSON', role: '36th President of the United States' },
      { id: 'ent-ton-3', name: 'Adm. James Stockdale', type: 'PERSON', role: 'Fighter Squadron Commander & Eyewitness' },
      { id: 'ent-ton-4', name: 'National Security Agency (NSA)', type: 'AGENCY', role: 'Signals Intelligence Oversight' }
    ],
    connectedCaseIds: ['operation-northwoods', 'operation-gladio'],
    views: 59000,
    commentCount: 940,
    bookmarkCount: 3800,
    communityVerdictVote: { confirmed: 4800, disputed: 60, unverified: 15, debunked: 5 }
  },
  {
    id: 'operation-paperclip',
    caseNumber: 'FILE-0021',
    title: 'Operation Paperclip: Nazi Scientists & The Cold War Arsenal',
    subtitle: 'JIOA Dossier Whitewashing, V-2 Ballistics & Biomedical Chemical Weapons',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Formally acknowledged and declassified in full by the US Government under the Nazi War Crimes Disclosure Act (1998); over 1,600 German scientists, engineers, and technicians were granted immunity and US citizenship.',
    summary: 'Between 1945 and 1959, the Joint Intelligence Objectives Agency (JIOA) covertly extracted over 1,600 German scientists, engineers, and doctors—including Wernher von Braun, Arthur Rudolph, and Kurt Blome—to harness their expertise for the US missile, space, and chemical/biological warfare programs.',
    claim: 'The US military actively scrubbed, fabricated, and whitewashed the Nazi Party, SS memberships, and concentration camp slave labor records of German scientists to bypass President Truman’s explicit order against recruiting war criminals.',
    claimOrigin: 'Investigative journalist Linda Hunt (1985), Annie Jacobsen "Operation Paperclip" (2014), US National Archives NARA Record Group 330.',
    whatWeKnow: [
      'President Harry S. Truman explicitly ordered that anyone found to have been a member of the Nazi Party or more than a nominal participant should not be granted entry.',
      'JIOA officers systematically removed negative security evaluations from personnel files, attaching a literal paperclip to files cleared for immigration (giving the operation its name).',
      'Wernher von Braun, who became the director of NASA\'s Marshall Space Flight Center and chief architect of the Saturn V rocket, held the rank of SS-Sturmbannführer and utilized Mittelbau-Dora concentration camp slave laborers to build V-2 rockets.',
      'Dr. Kurt Blome, deputy Reich health leader who tested chemical weapons and plague bacteria on concentration camp inmates at Dachau, was acquitted at Nuremberg with US assistance and hired by the US Army Chemical Corps at Camp Detrick.'
    ],
    speculations: [
      'Theories claiming that Paperclip scientists established an ideological deep-state shadow network inside US intelligence, rather than functioning primarily as pragmatic technological tools of the Cold War.'
    ],
    evidenceList: [
      {
        id: 'ev-pap-1',
        title: 'JIOA Dossier on Wernher von Braun: Scrubbed SS Membership File',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'National Archives and Records Administration (NARA), RG 330, Entry 186',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Military intelligence records proving that von Braun’s initial "ardent Nazi" security evaluation was replaced with a redacted assessment stating he posed no political threat.',
        context: 'Primary documentation of administrative falsification of immigration dossiers.',
        votes: 890,
        userVoted: 'up'
      },
      {
        id: 'ev-pap-2',
        title: 'Department of Justice Office of Special Investigations (OSI) Arthur Rudolph Report',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'US Department of Justice OSI Declassified Findings (1984)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Federal investigation concluding that Saturn V project manager Arthur Rudolph was complicit in the deaths of thousands of slave laborers at the Mittelwerk V-2 underground factory; Rudolph renounced US citizenship and departed the country.',
        context: 'Proves high-level war crimes knowledge among senior US aerospace leadership.',
        votes: 760
      }
    ],
    timeline: [
      { id: 'tm-pap-1', date: '1945-07-06', title: 'Joint Chiefs Establish Project Overcast', description: 'Initial military directive authorizing extraction of German rocket scientists.', rating: 'CONFIRMED' },
      { id: 'tm-pap-2', date: '1945-09-20', title: 'Von Braun Arrives in Fort Bliss, Texas', description: 'First group of V-2 engineers begins ballistic testing for the US Army.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-pap-3', date: '1969-07-20', title: 'Saturn V Rocket Lands Apollo 11 on Moon', description: 'Von Braun\'s rocket architecture achieves first crewed lunar landing.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-pap-1',
        title: 'JIOA Directive: Exploitation of German Specialists',
        classificationLevel: 'DECLASSIFIED',
        originAgency: 'Joint Intelligence Objectives Agency / War Department',
        dateCreated: '1946-03-04',
        dateDeclassified: '1998-10-08',
        fileReference: 'NARA RG 330, Box 42, JIOA-PAPERCLIP',
        summary: 'Top secret military policy memo authorizing the issuance of clean visas to specialists whose skills were deemed vital to national security regardless of wartime party affiliations.',
        fullExcerpt: 'The scientific and technical achievements of these specialists are of paramount value to the national defense. Their potential utilization by other nations must be denied.',
        authenticityNote: 'Certified declassified archive record under Nazi War Crimes Disclosure Act.',
        pageCount: 12,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-pap-1', name: 'Wernher von Braun', type: 'PERSON', role: 'V-2 Rocket Scientist & NASA Center Director' },
      { id: 'ent-pap-2', name: 'Kurt Blome', type: 'PERSON', role: 'Nazi Biological Warfare Chief / Army Chemical Corps Advisor' },
      { id: 'ent-pap-3', name: 'Joint Intelligence Objectives Agency (JIOA)', type: 'AGENCY', role: 'Administering Intelligence Body' },
      { id: 'ent-pap-4', name: 'Fort Detrick', type: 'LOCATION', role: 'US Army Biological & Chemical Warfare Center' }
    ],
    connectedCaseIds: ['mkultra-program', 'apollo-moon-landing', 'area-51-groom-lake'],
    views: 64000,
    commentCount: 980,
    bookmarkCount: 3900,
    communityVerdictVote: { confirmed: 4900, disputed: 45, unverified: 12, debunked: 3 }
  },
  {
    id: 'tuskegee-syphilis-study',
    caseNumber: 'FILE-0022',
    title: 'The Tuskegee Syphilis Study: 40 Years of Non-Consensual Medical Exploitation',
    subtitle: 'US Public Health Service Withholding Penicillin from 399 Impoverished Men',
    category: 'GOVERNMENT_INTELLIGENCE',
    status: 'CONFIRMED',
    officialVerdict: 'Officially exposed in 1972 by whistleblower Peter Buxtun and reporter Jean Heller (Associated Press); terminated immediately by the Department of Health, Education, and Welfare; President Bill Clinton issued a formal White House apology on May 16, 1997.',
    summary: 'From 1932 to 1972, the US Public Health Service (USPHS) and the Tuskegee Institute conducted a clinical study on 600 impoverished African American sharecroppers in Macon County, Alabama (399 with latent syphilis and 201 uninfected controls) to observe the untreated progression of the disease.',
    claim: 'Federal health agencies knowingly deceived hundreds of Black men with promises of "free health care" and free burial insurance, while actively preventing them from receiving penicillin even after it became the verified standard cure in 1947.',
    claimOrigin: 'Peter Buxtun internal PHS memos (1966/1968), Jean Heller AP front-page dispatch (July 25, 1972), 1973 Senate Kennedy Subcommittee hearings.',
    whatWeKnow: [
      'The study participants were told they were being treated for "bad blood," a local colloquialism encompassing anemia, fatigue, and various ailments.',
      'Researchers provided non-therapeutic diagnostic spinal taps, placebos, and mineral tonics instead of actual treatment.',
      'When penicillin became widely available as the proven cure in 1947, USPHS researchers deliberately withheld the antibiotic from subjects and intervened with local doctors, draft boards, and military clinics to block them from receiving penicillin elsewhere.',
      'By 1972, 28 participants had died directly of syphilis, 100 had died of related complications, 40 of their wives had been infected, and 19 children had been born with congenital syphilis.'
    ],
    speculations: [
      'A persistent urban myth that the US government deliberately infected the Tuskegee subjects with syphilis (historical records and medical files show the subjects already had pre-existing latent syphilis, though researchers actively blocked treatment).'
    ],
    evidenceList: [
      {
        id: 'ev-tusk-1',
        title: 'Peter Buxtun USPHS Whistleblower Correspondence (1966 & 1968)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'National Archives RG 90, Public Health Service Records',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Primary internal letters written by PHS venereal disease investigator Peter Buxtun demanding the ethical termination of the study on moral grounds, which were rejected by senior CDC and PHS leadership.',
        context: 'Proves the government had internal awareness of the ethical violations years before public exposure.',
        votes: 840,
        userVoted: 'up'
      },
      {
        id: 'ev-tusk-2',
        title: 'Presidential Apology by President Bill Clinton (May 16, 1997)',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'The White House Office of the Press Secretary / Oval Office Speech Transcript',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Official presidential address stating: "The United States government did something that was wrong—deeply, profoundly, morally wrong... It was an outrage to our commitment to integrity and equality for all our people."',
        context: 'Final federal admission of wrongdoing and establishment of national bioethics standards.',
        votes: 920
      }
    ],
    timeline: [
      { id: 'tm-tusk-1', date: '1932-10-01', title: 'Study Initiated by USPHS', description: 'Tuskegee study begins enrollment under Dr. Taliaferro Clark.', rating: 'CONFIRMED' },
      { id: 'tm-tusk-2', date: '1947-06-01', title: 'Penicillin Becomes Standard Cure', description: 'Researchers choose to withhold penicillin to preserve longitudinal autopsy data.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-tusk-3', date: '1972-07-25', title: 'Jean Heller AP Expose Published', description: 'Front-page news shocks nation; HEW orders immediate shutdown of study.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-tusk-4', date: '1997-05-16', title: 'Formal White House Apology', description: 'President Clinton apologizes to surviving subjects in East Room ceremony.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-tusk-1',
        title: 'Final Report of the Tuskegee Syphilis Study Ad Hoc Advisory Panel (1973)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Department of Health, Education, and Welfare (HEW)',
        dateCreated: '1973-04-01',
        fileReference: 'HEW-OS-73-001',
        summary: 'Independent federal panel finding that the study was ethically indefensible and led directly to the passage of the National Research Act of 1974 and modern Institutional Review Boards (IRBs).',
        fullExcerpt: 'The study was unethical from its inception in 1932 and should have been terminated immediately when penicillin became available.',
        authenticityNote: 'Official US Government report held in National Library of Medicine.',
        pageCount: 58,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-tusk-1', name: 'Peter Buxtun', type: 'PERSON', role: 'PHS Social Worker & Whistleblower' },
      { id: 'ent-tusk-2', name: 'Dr. Taliaferro Clark', type: 'PERSON', role: 'Chief of USPHS Venereal Disease Division' },
      { id: 'ent-tusk-3', name: 'US Public Health Service (USPHS)', type: 'AGENCY', role: 'Sponsoring Federal Agency' },
      { id: 'ent-tusk-4', name: 'Macon County, Alabama', type: 'LOCATION', role: 'Study Site' }
    ],
    connectedCaseIds: ['mkultra-program', 'operation-paperclip'],
    views: 52000,
    commentCount: 780,
    bookmarkCount: 2900,
    communityVerdictVote: { confirmed: 4700, disputed: 20, unverified: 5, debunked: 2 }
  },
  {
    id: 'tictac-uap-nimitz-2004',
    caseNumber: 'FILE-0023',
    title: 'The 2004 USS Nimitz "Tic Tac" UAP Encounters',
    subtitle: 'Radar AN/SPY-1 Drops from 80,000 Ft, FLIR1 Sensor Video & Naval Pilot Eyewitnesses',
    category: 'UFOS_UAP',
    status: 'CONFIRMED',
    officialVerdict: 'Officially authenticated and released by the Department of Defense in April 2020; the Pentagon confirmed the FLIR1 video was recorded by US Navy aviators and the objects remain classified as "unidentified."',
    summary: 'In November 2004, approximately 100 miles southwest of San Diego, the USS Nimitz Carrier Strike Group 11 tracked anomalous aerial vehicles on AN/SPY-1B passive radar dropping from 80,000 feet to sea level in under a second without generating sonic booms or thermal exhaust signatures.',
    claim: 'US military fighter jets engaged an advanced non-aerodynamic craft exhibiting instantaneous acceleration, transmedium capabilities, and radar-jamming electronic countermeasures beyond any known terrestrial propulsion.',
    claimOrigin: 'Cmdr. David Fravor and Lt. Cmdr. Jim Slaight (VFA-41 Black Aces), Senior Chief Kevin Day (USS Princeton Radar Operator), New York Times (Dec 16, 2017).',
    whatWeKnow: [
      'The USS Princeton guided-missile cruiser tracked multiple anomalous radar returns over several days descending from the upper atmosphere at hypersonic speeds.',
      'Commander David Fravor (Top Gun graduate and commanding officer of VFA-41) visually engaged a 40-foot smooth white cylindrical object ("Tic Tac") mirroring his F/A-18F Super Hornet descent before accelerating instantaneously out of sight.',
      'A second F/A-18F equipped with an ATFLIR thermal pod captured the official "FLIR1" video, documenting the object without visible wings, control surfaces, rotor blades, or heat exhaust.',
      'In June 2021, the Office of the Director of National Intelligence (ODNI) issued a preliminary assessment stating 143 of 144 military UAP incidents investigated could not be explained by known US black projects or atmospheric anomalies.'
    ],
    speculations: [
      'Debates between advanced foreign adversarial drone swarms (China/Russia) vs. breakthrough private aerospace technology vs. non-human intelligence.'
    ],
    evidenceList: [
      {
        id: 'ev-tic-1',
        title: 'Department of Defense Authenticated FLIR1 Video (Nov 14, 2004)',
        type: 'AUDIO_VIDEO',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'US Navy ATFLIR Camera System / Department of Defense Release 2020',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Targeting pod recording in mid-wave infrared showing the cylindrical object holding position against 120-knot headwind before accelerating left off-screen at immense velocity.',
        context: 'Unedited military electro-optical sensor telemetry authenticated by Pentagon press office.',
        votes: 1450,
        userVoted: 'up'
      },
      {
        id: 'ev-tic-2',
        title: 'Congressional Testimony of Cmdr. David Fravor (July 26, 2023)',
        type: 'TESTIMONY',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'House Oversight and Accountability Subcommittee on National Security',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Sworn testimony detailing physical flight performance: "The technology that we faced was far superior than anything that we had, have today, or have looked to develop in the next 10 years."',
        context: 'Firsthand testimony under federal penalty of perjury.',
        votes: 1180
      }
    ],
    timeline: [
      { id: 'tm-tic-1', date: '2004-11-10', title: 'USS Princeton Tracks Radar Anomalies', description: 'Senior Chief Kevin Day observes returns dropping from 80,000 ft to sea level in 0.78 seconds.', rating: 'CONFIRMED' },
      { id: 'tm-tic-2', date: '2004-11-14', title: 'Cmdr. David Fravor Visual Engagement', description: 'Two Super Hornets vectored to visual intercept; FLIR1 footage captured.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-tic-3', date: '2017-12-16', title: 'New York Times Publishes AATIP Program', description: 'Helene Cooper and Leslie Kean break story on Pentagon UAP investigations.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-tic-4', date: '2020-04-27', title: 'Pentagon Formally Releases Unclassified Videos', description: 'DoD confirms FLIR1, GIMBAL, and GOFAST videos are genuine naval recordings.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-tic-1',
        title: 'ODNI Preliminary Assessment: Unidentified Aerial Phenomena (2021)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Office of the Director of National Intelligence (ODNI)',
        dateCreated: '2021-06-25',
        fileReference: 'ODNI-UAP-2021-06',
        summary: 'Official intelligence community assessment analyzing 144 naval aviator encounters between 2004 and 2021, concluding the majority represent physical objects that pose flight safety hazards.',
        fullExcerpt: 'In 18 incidents, described in 21 reports, observers reported unusual UAP movement patterns or flight characteristics... Some UAP appeared to remain stationary in winds aloft, move against the wind, maneuver abruptly, or move at considerable speed, without discernable means of propulsion.',
        authenticityNote: 'Published on official DNI.gov portal.',
        pageCount: 9,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-tic-1', name: 'Cmdr. David Fravor', type: 'PERSON', role: 'Commanding Officer, VFA-41 Black Aces' },
      { id: 'ent-tic-2', name: 'USS Nimitz (CVN-68)', type: 'LOCATION', role: 'Supercarrier Flagship' },
      { id: 'ent-tic-3', name: 'Department of Defense (DoD)', type: 'AGENCY', role: 'Investigating Military Body' },
      { id: 'ent-tic-4', name: 'Area 51 / Groom Lake', type: 'LOCATION', role: 'Advanced Aerospace Flight Testing Site', targetCaseId: 'area-51-groom-lake' }
    ],
    connectedCaseIds: ['rendlesham-forest-incident', 'roswell-incident-1947', 'area-51-groom-lake'],
    views: 82000,
    commentCount: 1620,
    bookmarkCount: 5900,
    isFeatured: true,
    communityVerdictVote: { confirmed: 5200, disputed: 920, unverified: 340, debunked: 110 }
  },
  {
    id: 'phoenix-lights-1997',
    caseNumber: 'FILE-0024',
    title: 'The Phoenix Lights: Mass V-Shaped Craft & Governor Symington\'s Confession',
    subtitle: 'March 13, 1997 Mass Sighting vs. Luke AFB A-10 Illumination Flare Drills',
    category: 'UFOS_UAP',
    status: 'DISPUTED',
    officialVerdict: 'US Air Force reported that the 10:00 PM lights were LUU-2B/B illumination flares dropped by four Maryland Air National Guard A-10 Warthogs over the Barry M. Goldwater Bombing Range; however, the earlier 8:15–8:45 PM massive solid V-shaped silent craft remains unexplained.',
    summary: 'On the evening of March 13, 1997, thousands of residents across a 300-mile corridor from Nevada through Prescott, Phoenix, and Tucson witnessed a silent, enormous triangular/V-shaped craft blocking out the stars, followed by a secondary formation of stationary amber lights over the Estrella Mountains.',
    claim: 'A colossal extraterrestrial or unacknowledged advanced aerospace craft traversed Arizona airspace at low altitude before the military staged a decoy flare drop to obscure the sighting.',
    claimOrigin: 'Over 10,000 civilian eyewitnesses, Dr. Lynne Kitei photographic archive, Arizona Governor Fife Symington (confession in 2007).',
    whatWeKnow: [
      'The event consisted of two distinct temporal phases: Phase 1 (8:15–8:45 PM): A massive solid V-shaped craft flying low and silently across the entire state; Phase 2 (10:00 PM): A series of stationary lights hovering over the Phoenix mountain ridges.',
      'Governor Fife Symington originally mocked the incident during a televised press conference featuring an aide dressed in an alien costume.',
      'In March 2007, former Governor Symington admitted under oath to investigative reporter Leslie Kean: "I witnessed it myself. It was enormous and unexplained. As a former Air Force officer, I know what military flares and aircraft look like, and this was not from this world."',
      'Air traffic control radar at Phoenix Sky Harbor Airport logged visual confirmations from pilots while reporting no primary skin-paint radar targets due to transponder absence.'
    ],
    speculations: [
      'Debates regarding whether the Phase 1 craft was an experimental Northrop Grumman stealth blimp or aerostat platform.'
    ],
    evidenceList: [
      {
        id: 'ev-phx-1',
        title: 'Governor Fife Symington On-Record Statement (CNN / Leslie Kean 2007)',
        type: 'TESTIMONY',
        rating: 'CONFIRMED',
        isSupporting: true,
        provenance: 'CNN Interview broadcast / Verified On-the-Record Sworn Declaration',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Former Arizona Governor confirmed on record that he personally witnessed the massive delta-shaped craft over Phoenix and participated in a government coverup to prevent public panic.',
        context: 'First sitting or former US governor to publicly attest to observing a massive structured UAP.',
        votes: 1100,
        userVoted: 'up'
      },
      {
        id: 'ev-phx-2',
        title: 'Luke Air Force Base 104th Fighter Squadron Flight Records',
        type: 'GOVERNMENT_DOC',
        rating: 'CONFIRMED',
        isSupporting: false,
        provenance: 'USAF Air National Guard Declassified Training Logs (1997)',
        authenticity: 'VERIFIED_ORIGINAL',
        summary: 'Documents confirming A-10 aircraft dropped 16 LUU-2 flares at 15,000 feet over the Goldwater Range at approximately 10:00 PM, accounting for the secondary line of drifting lights.',
        context: 'Explains the 10:00 PM lights without resolving the 8:30 PM solid V-formation reports.',
        votes: 720
      }
    ],
    timeline: [
      { id: 'tm-phx-1', date: '1997-03-13', time: '08:15 PM', title: 'Phase 1: V-Shaped Craft Enters Arizona', description: 'Solid chevron craft reported over Henderson, NV and Prescott, AZ traveling south.', rating: 'CONFIRMED', isMilestone: true },
      { id: 'tm-phx-2', date: '1997-03-13', time: '10:00 PM', title: 'Phase 2: Illumination Flares over Estrellas', description: 'A-10 flare drop occurs over Barry M. Goldwater Range.', rating: 'CONFIRMED' },
      { id: 'tm-phx-3', date: '2007-03-18', title: 'Governor Symington Discloses Sighting', description: 'Former governor publicly confesses to witnessing the craft on 10th anniversary.', rating: 'CONFIRMED', isMilestone: true }
    ],
    documents: [
      {
        id: 'doc-phx-1',
        title: 'Phoenix Sky Harbor FAA Air Traffic Control Audio Transcript (March 13, 1997)',
        classificationLevel: 'PUBLIC RECORD',
        originAgency: 'Federal Aviation Administration (FAA)',
        dateCreated: '1997-03-13',
        fileReference: 'FAA-PHX-ATC-031397',
        summary: 'Radio communications between tower controllers and commercial airliners attempting to locate the source of visual lights above the airport.',
        fullExcerpt: 'CONTROLLER: "America West 56, do you see any traffic in your twelve o’clock?" PILOT: "We see a series of five bright lights in a formation, but nothing showing on TCAS collision radar."',
        authenticityNote: 'Obtained under Freedom of Information Act.',
        pageCount: 16,
        downloadable: true
      }
    ],
    entities: [
      { id: 'ent-phx-1', name: 'Gov. Fife Symington', type: 'PERSON', role: 'Governor of Arizona & Pilot Witness' },
      { id: 'ent-phx-2', name: 'Luke Air Force Base', type: 'LOCATION', role: 'USAF Base in Glendale, AZ' },
      { id: 'ent-phx-3', name: 'Federal Aviation Administration (FAA)', type: 'AGENCY', role: 'Civil Aviation Authority' }
    ],
    connectedCaseIds: ['tictac-uap-nimitz-2004', 'rendlesham-forest-incident', 'roswell-incident-1947'],
    views: 71000,
    commentCount: 1290,
    bookmarkCount: 4400,
    communityVerdictVote: { confirmed: 3900, disputed: 1800, unverified: 680, debunked: 240 }
  }
];

// Rabbit Hole Network Graph
export const INITIAL_GRAPH_NODES: GraphNode[] = [
  // Cases
  { id: 'jfk-assassination', label: 'JFK Assassination', type: 'CASE', caseId: 'jfk-assassination', rating: 'DISPUTED', radius: 24, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'mkultra-program', label: 'Project MKUltra', type: 'CASE', caseId: 'mkultra-program', rating: 'CONFIRMED', radius: 24, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'operation-northwoods', label: 'Operation Northwoods', type: 'CASE', caseId: 'operation-northwoods', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'roswell-incident-1947', label: 'Roswell Incident', type: 'CASE', caseId: 'roswell-incident-1947', rating: 'DISPUTED', radius: 22, category: 'UFOS_UAP' },
  { id: 'gary-webb-dark-alliance', label: 'Gary Webb & Dark Alliance', type: 'CASE', caseId: 'gary-webb-dark-alliance', rating: 'CONFIRMED', radius: 20, category: 'MONEY_POWER' },
  { id: 'apollo-moon-landing', label: 'Moon Landing Hoax', type: 'CASE', caseId: 'apollo-moon-landing', rating: 'DEBUNKED', radius: 18, category: 'GLOBAL_EVENTS' },
  { id: 'havana-syndrome', label: 'Havana Syndrome', type: 'CASE', caseId: 'havana-syndrome', rating: 'DISPUTED', radius: 19, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'area-51-groom-lake', label: 'Area 51 Groom Lake', type: 'CASE', caseId: 'area-51-groom-lake', rating: 'CONFIRMED', radius: 20, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'operation-gladio', label: 'Operation Gladio', type: 'CASE', caseId: 'operation-gladio', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'tartaria-mud-flood', label: 'Tartaria Mud Flood', type: 'CASE', caseId: 'tartaria-mud-flood', rating: 'DEBUNKED', radius: 18, category: 'ANCIENT_MYSTERIES' },
  { id: 'dyatlov-pass-incident', label: 'Dyatlov Pass Incident', type: 'CASE', caseId: 'dyatlov-pass-incident', rating: 'DISPUTED', radius: 20, category: 'UNSOLVED' },
  { id: 'philadelphia-experiment', label: 'Philadelphia Experiment', type: 'CASE', caseId: 'philadelphia-experiment', rating: 'DEBUNKED', radius: 18, category: 'UNSOLVED' },
  { id: 'bohemian-grove-elites', label: 'Bohemian Grove', type: 'CASE', caseId: 'bohemian-grove-elites', rating: 'CONFIRMED', radius: 21, category: 'SECRET_SOCIETIES' },
  { id: 'cicada-3301', label: 'Cicada 3301 Ciphers', type: 'CASE', caseId: 'cicada-3301', rating: 'UNVERIFIED', radius: 20, category: 'UNSOLVED' },
  { id: 'denver-airport-murals', label: 'Denver Airport Bunkers', type: 'CASE', caseId: 'denver-airport-murals', rating: 'DISPUTED', radius: 19, category: 'SECRET_SOCIETIES' },
  { id: 'rendlesham-forest-incident', label: 'Rendlesham Forest UAP', type: 'CASE', caseId: 'rendlesham-forest-incident', rating: 'DISPUTED', radius: 21, category: 'UFOS_UAP' },
  { id: 'project-stargate-remote-viewing', label: 'Project Stargate', type: 'CASE', caseId: 'project-stargate-remote-viewing', rating: 'CONFIRMED', radius: 22, category: 'PSYCHOLOGY_CONTROL' },
  { id: 'operation-highjump-hollow-earth', label: 'Operation Highjump', type: 'CASE', caseId: 'operation-highjump-hollow-earth', rating: 'DISPUTED', radius: 20, category: 'ANCIENT_MYSTERIES' },
  { id: 'tunguska-event-1908', label: '1908 Tunguska Blast', type: 'CASE', caseId: 'tunguska-event-1908', rating: 'CONFIRMED', radius: 20, category: 'UNSOLVED' },
  { id: 'georgia-guidestones', label: 'Georgia Guidestones', type: 'CASE', caseId: 'georgia-guidestones', rating: 'UNVERIFIED', radius: 19, category: 'GLOBAL_EVENTS' },
  { id: 'voynich-manuscript', label: 'Voynich Manuscript', type: 'CASE', caseId: 'voynich-manuscript', rating: 'UNVERIFIED', radius: 20, category: 'ANCIENT_MYSTERIES' },
  { id: 'black-knight-satellite', label: 'Black Knight Satellite', type: 'CASE', caseId: 'black-knight-satellite', rating: 'DEBUNKED', radius: 18, category: 'UFOS_UAP' },
  { id: 'operation-mockingbird', label: 'Operation Mockingbird', type: 'CASE', caseId: 'operation-mockingbird', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'gulf-of-tonkin-1964', label: 'Gulf of Tonkin Incident', type: 'CASE', caseId: 'gulf-of-tonkin-1964', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'operation-paperclip', label: 'Operation Paperclip', type: 'CASE', caseId: 'operation-paperclip', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'tuskegee-syphilis-study', label: 'Tuskegee Syphilis Study', type: 'CASE', caseId: 'tuskegee-syphilis-study', rating: 'CONFIRMED', radius: 22, category: 'GOVERNMENT_INTELLIGENCE' },
  { id: 'tictac-uap-nimitz-2004', label: 'USS Nimitz Tic Tac UAP', type: 'CASE', caseId: 'tictac-uap-nimitz-2004', rating: 'CONFIRMED', radius: 23, category: 'UFOS_UAP' },
  { id: 'phoenix-lights-1997', label: 'The Phoenix Lights', type: 'CASE', caseId: 'phoenix-lights-1997', rating: 'DISPUTED', radius: 21, category: 'UFOS_UAP' },

  // Agencies & Institutions
  { id: 'node-cia', label: 'Central Intelligence Agency (CIA)', type: 'AGENCY', radius: 28, description: 'US Foreign Intelligence Service founded 1947.' },
  { id: 'node-jcs', label: 'Joint Chiefs of Staff', type: 'AGENCY', radius: 18, description: 'US Military Leadership Council.' },
  { id: 'node-fbi', label: 'Federal Bureau of Investigation (FBI)', type: 'AGENCY', radius: 20, description: 'Domestic intelligence and federal law enforcement.' },
  { id: 'node-nsa', label: 'National Security Agency (NSA)', type: 'AGENCY', radius: 22, description: 'Signals Intelligence and Cryptologic Directorate.' },
  { id: 'node-dod', label: 'Department of Defense (Pentagon)', type: 'AGENCY', radius: 22, description: 'US Armed Forces Executive Command.' },
  { id: 'node-gru', label: 'GRU Unit 29155', type: 'AGENCY', radius: 16, description: 'Russian Military Foreign Intelligence.' },
  { id: 'node-nasa', label: 'NASA', type: 'AGENCY', radius: 18, description: 'Civilian Space Agency.' },
  { id: 'node-nato', label: 'NATO Clandestine Planning Committee', type: 'AGENCY', radius: 20, description: 'Stay-behind coordination framework.' },
  { id: 'node-dia', label: 'Defense Intelligence Agency (DIA)', type: 'AGENCY', radius: 20, description: 'Military intelligence and Stargate management.' },
  { id: 'node-sri', label: 'Stanford Research Institute (SRI)', type: 'AGENCY', radius: 18, description: 'Scientific parapsychology laboratory.' },

  // People
  { id: 'node-allen-dulles', label: 'Allen Dulles', type: 'PERSON', radius: 18, description: 'CIA Director (1953-61), MKUltra Founder, Warren Commissioner.' },
  { id: 'node-jfk', label: 'John F. Kennedy', type: 'PERSON', radius: 22, description: '35th US President, opposed Northwoods, assassinated 1963.' },
  { id: 'node-oswald', label: 'Lee Harvey Oswald', type: 'PERSON', radius: 18, description: 'Ex-Marine, defector, designated sole shooter.' },
  { id: 'node-gottlieb', label: 'Dr. Sidney Gottlieb', type: 'PERSON', radius: 16, description: 'Chief of CIA Technical Services Staff (TSS).' },
  { id: 'node-lemnitzer', label: 'Gen. Lyman Lemnitzer', type: 'PERSON', radius: 15, description: 'Chairman JCS, drafted Northwoods.' },
  { id: 'node-gary-webb', label: 'Gary Webb', type: 'PERSON', radius: 16, description: 'Investigative reporter who exposed Contra cocaine pipelines.' },
  { id: 'node-carl-bernstein', label: 'Carl Bernstein', type: 'PERSON', radius: 16, description: 'Investigative reporter who broke Operation Mockingbird and Watergate.' },
  { id: 'node-wernher-von-braun', label: 'Wernher von Braun', type: 'PERSON', radius: 18, description: 'V-2 Rocket Pioneer & NASA Saturn V Architect.' },
  { id: 'node-david-fravor', label: 'Cmdr. David Fravor', type: 'PERSON', radius: 16, description: 'Top Gun Aviator who engaged Tic Tac UAP in 2004.' },
  { id: 'node-fife-symington', label: 'Gov. Fife Symington', type: 'PERSON', radius: 15, description: 'Arizona Governor & Pilot who witnessed Phoenix Lights.' },
  { id: 'node-jesse-marcel', label: 'Maj. Jesse Marcel', type: 'PERSON', radius: 15, description: '509th Bomb Group Intelligence Officer.' },
  { id: 'node-bob-lazar', label: 'Bob Lazar', type: 'PERSON', radius: 14, description: 'S-4 reverse engineering whistleblower.' },
  { id: 'node-nikola-tesla', label: 'Nikola Tesla', type: 'PERSON', radius: 18, description: 'Pioneering electrical polymath & wireless power inventor.' },
  { id: 'node-admiral-byrd', label: 'Admiral Richard E. Byrd', type: 'PERSON', radius: 17, description: 'Commander of Antarctic Task Force 68.' },
  { id: 'node-oppenheimer', label: 'J. Robert Oppenheimer', type: 'PERSON', radius: 18, description: 'Manhattan Project scientific director.' },
  { id: 'node-charles-halt', label: 'Lt. Col. Charles Halt', type: 'PERSON', radius: 16, description: 'RAF Woodbridge Deputy Base Commander.' },

  // Locations & Events
  { id: 'node-dealey-plaza', label: 'Dealey Plaza (Dallas)', type: 'LOCATION', radius: 16, description: 'Site of JFK assassination.' },
  { id: 'node-cuba', label: 'Cuba & Bay of Pigs', type: 'EVENT', radius: 19, description: 'Epicenter of 1960s Cold War covert operations.' },
  { id: 'node-groom-lake', label: 'Groom Lake (Area 51)', type: 'LOCATION', radius: 16, description: 'Secret Nevada flight testing salt flat.' },
  { id: 'node-fort-detrick', label: 'Fort Detrick (Maryland)', type: 'LOCATION', radius: 16, description: 'Army Biological Labs & MKUltra Chemical Depot.' },
  { id: 'node-church-committee', label: 'Church Committee (1975)', type: 'EVENT', radius: 18, description: 'Senate inquiry that exposed CIA abuses and MKUltra.' },
  { id: 'node-bohemian-grove', label: 'Bohemian Grove (Sonoma)', type: 'LOCATION', radius: 16, description: '2,700-acre redwood retreat in Monte Rio, CA.' },
  { id: 'node-denver-airport', label: 'Denver International Airport', type: 'LOCATION', radius: 16, description: '53 sq mile airport with deep subterranean networks.' }
];

export const INITIAL_GRAPH_LINKS: GraphLink[] = [
  // JFK connections
  { source: 'jfk-assassination', target: 'node-jfk', relationship: 'Victim / Subject', strength: 1 },
  { source: 'jfk-assassination', target: 'node-oswald', relationship: 'Arrested Suspect', strength: 1 },
  { source: 'jfk-assassination', target: 'node-dealey-plaza', relationship: 'Physical Location', strength: 1 },
  { source: 'jfk-assassination', target: 'node-cia', relationship: 'Surveillance & Counterintelligence 201 File', strength: 0.8 },
  { source: 'jfk-assassination', target: 'node-allen-dulles', relationship: 'Fired by JFK / Warren Commissioner', strength: 0.9 },
  { source: 'jfk-assassination', target: 'node-cuba', relationship: 'Anti-Castro Cuban Operative Nexus', strength: 0.7 },

  // MKUltra connections
  { source: 'mkultra-program', target: 'node-cia', relationship: 'Authorized & Managed By', strength: 1 },
  { source: 'mkultra-program', target: 'node-allen-dulles', relationship: 'Approved in 1953', strength: 1 },
  { source: 'mkultra-program', target: 'node-gottlieb', relationship: 'Operational Director', strength: 1 },
  { source: 'mkultra-program', target: 'node-fort-detrick', relationship: 'Biomedical Chemical Research Base', strength: 0.9 },
  { source: 'mkultra-program', target: 'node-church-committee', relationship: 'Exposed to Public in 1975', strength: 0.9 },
  { source: 'mkultra-program', target: 'jfk-assassination', relationship: 'Shared Intelligence Staff & Behavior Studies', strength: 0.6 },
  { source: 'mkultra-program', target: 'havana-syndrome', relationship: 'Neuro-pharmacological & Weaponization Precedent', strength: 0.5 },
  { source: 'mkultra-program', target: 'project-stargate-remote-viewing', relationship: 'CIA Mind Sciences Directorate Overlap', strength: 0.8 },

  // Operation Mockingbird connections
  { source: 'operation-mockingbird', target: 'node-cia', relationship: 'Created & Financed By', strength: 1 },
  { source: 'operation-mockingbird', target: 'node-allen-dulles', relationship: 'Supervised Expansion', strength: 0.9 },
  { source: 'operation-mockingbird', target: 'node-carl-bernstein', relationship: 'Exposed in 1977 Rolling Stone', strength: 1 },
  { source: 'operation-mockingbird', target: 'node-church-committee', relationship: 'Investigated in Book I Chapter X', strength: 0.9 },
  { source: 'operation-mockingbird', target: 'gary-webb-dark-alliance', relationship: 'Media Smear & Narrative Control Precedent', strength: 0.8 },
  { source: 'operation-mockingbird', target: 'jfk-assassination', relationship: 'Early Press Coordination Post-Dealey Plaza', strength: 0.7 },

  // Gulf of Tonkin connections
  { source: 'gulf-of-tonkin-1964', target: 'node-nsa', relationship: 'Fabricated SIGINT Translations (Hanyok Study)', strength: 1 },
  { source: 'gulf-of-tonkin-1964', target: 'node-dod', relationship: 'Retaliatory Strike Authorization', strength: 0.9 },
  { source: 'gulf-of-tonkin-1964', target: 'operation-northwoods', relationship: 'Manufactured Casus Belli Evolution', strength: 0.8 },

  // Operation Paperclip connections
  { source: 'operation-paperclip', target: 'node-wernher-von-braun', relationship: 'Extracted Nazi Ballistics Chief', strength: 1 },
  { source: 'operation-paperclip', target: 'node-nasa', relationship: 'Saturn V & Space Program Foundation', strength: 0.9 },
  { source: 'operation-paperclip', target: 'node-fort-detrick', relationship: 'Chemical & Biological Weapons Transfers', strength: 0.8 },
  { source: 'operation-paperclip', target: 'area-51-groom-lake', relationship: 'Aerospace Engineering Heritage', strength: 0.7 },
  { source: 'operation-paperclip', target: 'apollo-moon-landing', relationship: 'Saturn V Rocket Engineering', strength: 0.9 },

  // Tuskegee Syphilis Study connections
  { source: 'tuskegee-syphilis-study', target: 'mkultra-program', relationship: 'Non-Consensual Human Experimentation Era', strength: 0.7 },
  { source: 'tuskegee-syphilis-study', target: 'node-church-committee', relationship: 'Bioethics & Congressional Oversight Reforms', strength: 0.7 },

  // Tic Tac UAP & Phoenix Lights connections
  { source: 'tictac-uap-nimitz-2004', target: 'node-david-fravor', relationship: 'Primary Eyewitness Pilot', strength: 1 },
  { source: 'tictac-uap-nimitz-2004', target: 'node-dod', relationship: 'Authenticated FLIR1 Telemetry Video', strength: 0.9 },
  { source: 'tictac-uap-nimitz-2004', target: 'phoenix-lights-1997', relationship: 'Mass Visual & Sensor Corroboration', strength: 0.7 },
  { source: 'tictac-uap-nimitz-2004', target: 'rendlesham-forest-incident', relationship: 'Military Fleet Transmedium UAP Encounters', strength: 0.8 },
  { source: 'phoenix-lights-1997', target: 'node-fife-symington', relationship: 'Eyewitness & 2007 Confession', strength: 1 },
  { source: 'phoenix-lights-1997', target: 'roswell-incident-1947', relationship: 'Mass Southwestern Sightings Lore', strength: 0.6 },

  // Operation Northwoods connections
  { source: 'operation-northwoods', target: 'node-jcs', relationship: 'Authored & Signed By', strength: 1 },
  { source: 'operation-northwoods', target: 'node-lemnitzer', relationship: 'Chief Proponent', strength: 1 },
  { source: 'operation-northwoods', target: 'node-jfk', relationship: 'Rejected by President Kennedy in 1962', strength: 1 },
  { source: 'operation-northwoods', target: 'node-cuba', relationship: 'Targeted Justification for Invasion', strength: 0.9 },
  { source: 'operation-northwoods', target: 'jfk-assassination', relationship: 'Deepened Kennedy-Pentagon Friction', strength: 0.7 },
  { source: 'operation-northwoods', target: 'operation-gladio', relationship: 'Shared Strategy of Tension Methodology', strength: 0.8 },

  // Gladio connections
  { source: 'operation-gladio', target: 'node-nato', relationship: 'Coordinated By Stay-Behind Directorate', strength: 1 },
  { source: 'operation-gladio', target: 'node-cia', relationship: 'Funding & Paramilitary Training', strength: 0.9 },
  { source: 'operation-gladio', target: 'node-church-committee', relationship: 'European Covert Action Disclosure', strength: 0.7 },

  // Roswell connections
  { source: 'roswell-incident-1947', target: 'node-jesse-marcel', relationship: 'First Responding Officer', strength: 1 },
  { source: 'roswell-incident-1947', target: 'area-51-groom-lake', relationship: 'Alleged Transfer of Material', strength: 0.6 },
  { source: 'roswell-incident-1947', target: 'node-fbi', relationship: 'Investigated in 1947 Teletype', strength: 0.6 },
  { source: 'roswell-incident-1947', target: 'rendlesham-forest-incident', relationship: 'Military UAP Precedent & Debris Lore', strength: 0.7 },
  { source: 'roswell-incident-1947', target: 'black-knight-satellite', relationship: 'Early Space Age Extraterrestrial Lore', strength: 0.5 },

  // Stargate connections
  { source: 'project-stargate-remote-viewing', target: 'node-dia', relationship: 'Executive Program Leadership', strength: 1 },
  { source: 'project-stargate-remote-viewing', target: 'node-sri', relationship: 'Contracted Parapsychology Lab', strength: 1 },
  { source: 'project-stargate-remote-viewing', target: 'node-cia', relationship: 'Transferred & Declassified in 1995', strength: 0.9 },

  // Bohemian Grove & Power Nodes
  { source: 'bohemian-grove-elites', target: 'node-bohemian-grove', relationship: 'Retreat Facility', strength: 1 },
  { source: 'bohemian-grove-elites', target: 'node-oppenheimer', relationship: '1942 Manhattan Project Meeting', strength: 0.9 },
  { source: 'bohemian-grove-elites', target: 'node-cia', relationship: 'Directors in Attendance', strength: 0.8 },
  { source: 'bohemian-grove-elites', target: 'denver-airport-murals', relationship: 'Globalist Elite Symbolism Lore', strength: 0.6 },

  // Rendlesham connections
  { source: 'rendlesham-forest-incident', target: 'node-charles-halt', relationship: 'Deputy Base Commander & Tape Author', strength: 1 },
  { source: 'rendlesham-forest-incident', target: 'area-51-groom-lake', relationship: 'Nuclear & Special Access Facility Proximity', strength: 0.6 },

  // Tesla connections
  { source: 'tunguska-event-1908', target: 'node-nikola-tesla', relationship: 'Theorized Directed Energy Pulse', strength: 0.7 },
  { source: 'black-knight-satellite', target: 'node-nikola-tesla', relationship: '1899 Colorado Springs Cosmic Signals', strength: 0.6 },

  // Byrd connections
  { source: 'operation-highjump-hollow-earth', target: 'node-admiral-byrd', relationship: 'Fleet Expedition Leader', strength: 1 },

  // Dark Alliance connections
  { source: 'gary-webb-dark-alliance', target: 'node-gary-webb', relationship: 'Author / Reporter', strength: 1 },
  { source: 'gary-webb-dark-alliance', target: 'node-cia', relationship: 'Investigated Contra-Cocaine Shielding', strength: 0.9 },
  { source: 'gary-webb-dark-alliance', target: 'node-cuba', relationship: 'Central American Covert Action Network', strength: 0.6 },

  // Area 51 connections
  { source: 'area-51-groom-lake', target: 'node-groom-lake', relationship: 'Geographical Site', strength: 1 },
  { source: 'area-51-groom-lake', target: 'node-bob-lazar', relationship: 'Whistleblower Allegations', strength: 0.8 },
  { source: 'area-51-groom-lake', target: 'node-cia', relationship: 'Overhead Reconnaissance Declassified 2013', strength: 0.9 },
  { source: 'area-51-groom-lake', target: 'apollo-moon-landing', relationship: 'Claimed Studio Site in Hoax Theories', strength: 0.4 },

  // Havana Syndrome connections
  { source: 'havana-syndrome', target: 'node-gru', relationship: 'Suspected Threat Vector (2024)', strength: 0.7 },
  { source: 'havana-syndrome', target: 'node-cia', relationship: 'Targeted Personnel in Vienna & Havana', strength: 0.8 },

  // Cross-Institutional Links
  { source: 'node-allen-dulles', target: 'node-cia', relationship: 'Director 1953-1961', strength: 1 },
  { source: 'node-church-committee', target: 'node-cia', relationship: 'Subpoenaed and Investigated', strength: 1 },
  { source: 'node-church-committee', target: 'node-fbi', relationship: 'COINTELPRO Investigation', strength: 0.8 }
];

export const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: 'disc-1',
    caseId: 'jfk-assassination',
    title: 'Was JFK really a lone gunman? Analyzing the Parkland Dr. Perry interview transcript',
    authorName: 'Agent_Veritas',
    authorRank: 'INVESTIGATOR',
    createdAt: '2026-08-10',
    commentCount: 847,
    viewCount: 2400,
    upvotes: 312,
    isPinned: true,
    tags: ['Dealey Plaza', 'Parkland Hospital', 'Forensics', 'Zapruder'],
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=3gVqPZq_6gA',
    mediaType: 'youtube',
    category: 'THEORY_DEBATES',
    initialComment: 'Dr. Malcolm Perry stated in the 2:18 PM press conference on Nov 22 that the bullet in JFK\'s neck appeared to be an ENTRANCE wound. How did the Warren Commission reconcile this with a shot fired solely from behind?'
  },
  {
    id: 'disc-2',
    caseId: 'operation-gladio',
    title: 'Declassified NATO Stay-Behind Documents: The Strategy of Tension in Italy',
    authorName: 'RedactedArchivist',
    authorRank: 'ARCHIVIST',
    createdAt: '2026-08-14',
    commentCount: 142,
    viewCount: 980,
    upvotes: 189,
    isPinned: true,
    tags: ['Gladio', 'Andreotti', 'NATO', 'Stay-Behind'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    category: 'NEW_EVIDENCE',
    initialComment: 'The 1990 European Parliament resolution formally condemned clandestine stay-behind networks operating outside judicial and parliamentary oversight. Why is this official history omitted from high school textbooks?'
  },
  {
    id: 'disc-3',
    caseId: 'project-stargate-remote-viewing',
    title: 'Evaluating the 1995 American Institutes for Research (AIR) Stargate Evaluation',
    authorName: 'NeuroSkeptic_99',
    authorRank: 'ANALYST',
    createdAt: '2026-08-15',
    commentCount: 96,
    viewCount: 710,
    upvotes: 145,
    tags: ['Stargate', 'SRI', 'Puthoff', 'Fort Meade'],
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    category: 'THEORY_DEBATES',
    initialComment: 'Statistician Dr. Jessica Utts concluded in the official 1995 CIA review that laboratory evidence for anomalous cognition was statistically conclusive, whereas Ray Hyman concluded it had no operational value. How do we reconcile scientific anomaly with military utility?'
  },
  {
    id: 'disc-4',
    caseId: 'rendlesham-forest-incident',
    title: 'Analyzing Lt. Col. Charles Halt\'s 18-Minute Micro-Cassette Audio Recording',
    authorName: 'BeaconObserver',
    authorRank: 'INVESTIGATOR',
    createdAt: '2026-08-16',
    commentCount: 120,
    viewCount: 880,
    upvotes: 172,
    tags: ['Rendlesham', 'RAF Woodbridge', 'Radiation', 'Halt Memo'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Xz292k23T5g',
    mediaType: 'youtube',
    category: 'NEW_EVIDENCE',
    initialComment: 'The AN/PDR-27 beta/gamma meter clicks in real-time as Halt approaches the three indentations in the forest floor. Could Orford Ness lighthouse generate localized 0.07 mR/hr ionizing radiation?'
  },
  {
    id: 'disc-5',
    caseId: 'mkultra-program',
    title: 'Subproject 68: The Allan Memorial Institute survivors and legal restitution precedents',
    authorName: 'ShadowDossier',
    authorRank: 'ARCHIVIST',
    createdAt: '2026-08-12',
    commentCount: 89,
    viewCount: 650,
    upvotes: 125,
    tags: ['Dr. Cameron', 'Psychic Driving', 'Montreal', 'Ethics'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    category: 'THEORY_DEBATES',
    initialComment: 'Looking closely at the surviving accounting ledgers: Dr. Ewen Cameron received direct CIA funding funneled through the Society for the Investigation of Human Ecology. The Canadian government eventually settled with 77 patients in 1992.'
  },
  {
    id: 'disc-6',
    caseId: 'operation-mockingbird',
    title: 'Carl Bernstein\'s 1977 Rolling Stone Expose vs. Modern Media Transparency',
    authorName: 'Agent_Veritas',
    authorRank: 'INVESTIGATOR',
    createdAt: '2026-08-17',
    commentCount: 178,
    viewCount: 1420,
    upvotes: 265,
    isPinned: true,
    tags: ['Mockingbird', 'Wisner', 'Press Freedom', 'Church Committee'],
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=5ED63A_hcdE',
    mediaType: 'youtube',
    initialComment: 'Carl Bernstein uncovered that Arthur Hays Sulzberger (NYT) and William Paley (CBS) signed formal non-disclosure agreements with CIA Directorate of Plans. Did the 1976 Bush Directive truly sever these ties or merely shift them to private contract security firms?'
  },
  {
    id: 'disc-7',
    caseId: 'gulf-of-tonkin-1964',
    title: 'Robert Hanyok\'s NSA SIGINT Study: The Anatomy of a Fabricated War Trigger',
    authorName: 'RedactedArchivist',
    authorRank: 'ARCHIVIST',
    createdAt: '2026-08-18',
    commentCount: 134,
    viewCount: 1150,
    upvotes: 210,
    tags: ['Tonkin', 'NSA', 'Hanyok Study', 'USS Maddox'],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    initialComment: 'The 2001 internal NSA paper proved 90% of radar/sonar logs on August 4 were misattributed translations from the August 2 skirmish. How did McNamara justify presenting immediate airstrike coordinates to LBJ within hours before daylight reconnaissance?'
  },
  {
    id: 'disc-8',
    caseId: 'tictac-uap-nimitz-2004',
    title: 'Evaluating the Radar Telemetry: Kevin Day & AN/SPY-1 Drops from 80k Feet',
    authorName: 'AeroPhysicist_Alpha',
    authorRank: 'SENIOR_INVESTIGATOR',
    createdAt: '2026-08-18',
    commentCount: 245,
    viewCount: 2980,
    upvotes: 412,
    isPinned: true,
    tags: ['Tic Tac', 'David Fravor', 'FLIR1', 'USS Princeton'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=6rVOPS58USY',
    mediaType: 'youtube',
    initialComment: 'Calculating the kinetic force: an object dropping from 80,000 feet to sea level in 0.78 seconds implies an instantaneous acceleration of over 100g without generating a sonic boom or ionizing heat wake. What physical propulsion model could account for this outside transmedium warp or plasma metric manipulation?'
  },
  {
    id: 'disc-9',
    caseId: 'operation-paperclip',
    title: 'Kurt Blome and Fort Detrick: The Biological Warfare Transfer Paradox',
    authorName: 'BioEthicsGuard',
    authorRank: 'ANALYST',
    createdAt: '2026-08-16',
    commentCount: 112,
    viewCount: 890,
    upvotes: 198,
    tags: ['Paperclip', 'Fort Detrick', 'Wernher von Braun', 'Nuremberg'],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    mediaType: 'image',
    initialComment: 'While Wernher von Braun was celebrated as an American hero for Apollo 11, the recruitment of Kurt Blome (Nazi biological warfare head) directly compromised the Nuremberg Code standards US prosecutors had just established.'
  }
];

export const INITIAL_SUPPORTERS: SupporterRecord[] = [
  {
    id: 'sup-1',
    donorName: 'Dr. Evelyn Cross',
    callsign: 'CIPHER_TITAN',
    amount: 500,
    tierName: 'Majestic Titan',
    message: 'The archives belong to the people. Keep declassifying without fear or censorship.',
    timestamp: '2026-08-17 19:42',
    badge: '👑 #1 HIGHEST DONATOR',
    isTopDonor: true
  },
  {
    id: 'sup-2',
    donorName: 'Marcus Sterling',
    callsign: 'ECHO_VECTOR',
    amount: 250,
    tierName: 'Grand Benefactor',
    message: 'Dedicated to Gary Webb and all investigative journalists who paid the ultimate price.',
    timestamp: '2026-08-16 14:15',
    badge: '🥈 GRAND PATRON'
  },
  {
    id: 'sup-3',
    donorName: 'Elena Rostova',
    callsign: 'AURA_ARCHIVIST',
    amount: 150,
    tierName: 'Senior Patron',
    message: 'Rigorous citations and primary FOIA documents are the only antidote to propaganda.',
    timestamp: '2026-08-15 08:30',
    badge: '🥉 SENIOR PATRON'
  },
  {
    id: 'sup-4',
    donorName: 'Major T. Vance',
    callsign: 'NIGHT_OWL_88',
    amount: 75,
    tierName: 'Archive Patron',
    message: 'Honoring the servicemen at Rendlesham and Fort Meade.',
    timestamp: '2026-08-14 22:10',
    badge: '⭐ PATRON'
  },
  {
    id: 'sup-5',
    donorName: 'Liam Chen',
    callsign: 'DELTA_SKEPTIC',
    amount: 50,
    tierName: 'Field Supporter',
    message: 'Evidence over conjecture. Love the open peer review forum.',
    timestamp: '2026-08-13 11:05',
    badge: '🛡️ SUPPORTER'
  },
  {
    id: 'sup-6',
    donorName: 'Samantha Ray',
    callsign: 'PROJECT_SHADOW',
    amount: 25,
    tierName: 'Field Supporter',
    message: 'Keep the declassified servers running 24/7!',
    timestamp: '2026-08-12 17:50',
    badge: '🛡️ SUPPORTER'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    caseId: 'jfk-assassination',
    authorName: 'DeclassifiedMind',
    authorRank: 'SENIOR_INVESTIGATOR',
    authorBadge: 'FACT CHECKER',
    content: 'Dr. Perry later clarified under oath to the Warren Commission that he based his initial press conference remark on a quick visual glance before performing a tracheotomy directly through the neck wound, which obliterated the original margins.',
    createdAt: '2026-08-10 14:22',
    upvotes: 142,
    downvotes: 12,
    stance: 'DEVILS_ADVOCATE',
    citedEvidenceId: 'ev-jfk-3'
  },
  {
    id: 'comm-2',
    caseId: 'jfk-assassination',
    authorName: 'CipherScout_01',
    authorRank: 'RESEARCHER',
    authorBadge: 'SOURCE HUNTER',
    content: 'Even if the neck wound was an exit wound, CE 399 shows virtually zero lead deformity. It was found on an unoccupied stretcher in Parkland Hospital hallway by Darrell Tomlinson. The chain of custody is broken from minute one.',
    createdAt: '2026-08-10 16:05',
    upvotes: 219,
    downvotes: 8,
    stance: 'SUPPORTING',
    citedEvidenceId: 'ev-jfk-3'
  },
  {
    id: 'comm-3',
    caseId: 'mkultra-program',
    authorName: 'ShadowDossier',
    authorRank: 'ARCHIVIST',
    authorBadge: 'ARCHIVIST',
    content: 'The most terrifying aspect is Richard Helms ordering the total shredding of all 149 subproject folders in 1973. If not for the misfiled financial vouchers in St. Louis, MKUltra would officially be considered an urban legend today.',
    createdAt: '2026-08-12 18:30',
    upvotes: 388,
    downvotes: 3,
    stance: 'SUPPORTING',
    citedEvidenceId: 'ev-mk-1'
  },
  {
    id: 'comm-4',
    caseId: 'operation-mockingbird',
    authorName: 'Agent_Veritas',
    authorRank: 'INVESTIGATOR',
    authorBadge: 'SOURCE HUNTER',
    content: 'Church Committee Book I, page 455 explicitly confirms that the CIA subsidized over 1,000 books in university presses and mainstream publications without attribution to shape academic discourse.',
    createdAt: '2026-08-17 10:14',
    upvotes: 194,
    downvotes: 4,
    stance: 'SUPPORTING',
    citedEvidenceId: 'ev-mock-1'
  },
  {
    id: 'comm-5',
    caseId: 'gulf-of-tonkin-1964',
    authorName: 'RedactedArchivist',
    authorRank: 'ARCHIVIST',
    authorBadge: 'FACT CHECKER',
    content: 'Stockdale\'s memoir "In Love and War" gives the definitive pilot account: he flew at treetop level over the destroyers on August 4 and confirmed there was nothing in the water except US Navy ship wakes.',
    createdAt: '2026-08-18 15:40',
    upvotes: 230,
    downvotes: 6,
    stance: 'SUPPORTING',
    citedEvidenceId: 'ev-ton-1'
  },
  {
    id: 'comm-6',
    caseId: 'tictac-uap-nimitz-2004',
    authorName: 'AeroPhysicist_Alpha',
    authorRank: 'SENIOR_INVESTIGATOR',
    authorBadge: 'TECHNICAL ANALYST',
    content: 'The ATFLIR FLIR1 sensor showed zero aerodynamic control surfaces, zero thermal plume in mid-wave IR, and immediate jamming of the APG-73 radar radar lock, indicating active electronic countermeasures.',
    createdAt: '2026-08-18 18:22',
    upvotes: 310,
    downvotes: 11,
    stance: 'SUPPORTING',
    citedEvidenceId: 'ev-tic-1'
  }
];

export const INITIAL_SUBMISSIONS: TheorySubmission[] = [
  {
    id: 'sub-0042',
    caseNumber: 'FILE-0042',
    title: 'The Rendlesham Forest Incident: RAF Bentwaters Nuclear Bunker Proximity',
    category: 'UFOS_UAP',
    submitterName: 'BeaconObserver',
    submitterRank: 'ANALYST',
    submittedAt: '2026-08-16',
    status: 'UNDER_REVIEW',
    suggestedRating: 'DISPUTED',
    claim: 'In December 1980, multiple US Air Force security police personnel at RAF Woodbridge / Bentwaters encountered an anomalous craft emitting ionizing radiation near secret tactical nuclear weapons storage sites.',
    knownFacts: [
      'Lt. Col. Charles Halt recorded live real-time audio tape during the second night investigation.',
      'Defense Ministry declassified radar records from RAF Watton showing unidentified returns.',
      'Radiation readings were recorded with an AN/PDR-27 beta/gamma survey meter at 0.07 mR/hr.'
    ],
    evidenceText: 'Primary cassette audio recording of Lt. Col. Halt; sworn declarations by Sgt. John Burroughs and Jim Penniston.',
    sources: [
      'UK National Archives DEFE 24/1948',
      'Halt Memorandum to UK Ministry of Defence (Jan 13, 1981)'
    ],
    connectedCases: ['roswell-incident-1947', 'area-51-groom-lake'],
    moderationNotes: 'High quality primary documentation provided. Needs cross-verification against Orford Ness lighthouse optical flash calculations.'
  },
  {
    id: 'sub-0043',
    caseNumber: 'FILE-0043',
    title: 'Operation Gladio: NATO Stay-Behind Clandestine Armies & Years of Lead',
    category: 'GOVERNMENT_INTELLIGENCE',
    submitterName: 'EuroHistorian',
    submitterRank: 'INVESTIGATOR',
    submittedAt: '2026-08-17',
    status: 'PUBLISHED',
    suggestedRating: 'CONFIRMED',
    claim: 'NATO, CIA, and MI6 organized secret stay-behind paramilitary networks across Western Europe that were later implicated in false-flag bombings in Italy during the "Strategy of Tension."',
    knownFacts: [
      'Italian Prime Minister Giulio Andreotti officially acknowledged Operation Gladio in parliament in October 1990.',
      'European Parliament passed a resolution on November 22, 1990, condemning clandestine stay-behind networks.'
    ],
    evidenceText: 'Italian Parliamentary Commission on Terrorism report; Swiss Parliamentary Inquiry (PPU).',
    sources: [
      'Official Bulletin of the Italian Chamber of Deputies (1990)',
      'European Parliament Resolution Doc. B3-2021/90'
    ],
    connectedCases: ['operation-northwoods', 'mkultra-program'],
    moderationNotes: 'Approved by Senior Reviewer. Transitioned into public archival case pool.'
  }
];

export const INITIAL_USER_PROFILE: InvestigatorProfile = {
  uid: 'user-current',
  id: 'user-current',
  email: 'operative@cipherfiles.org',
  displayName: 'Cipher Agent 77',
  callsign: 'CIPHER-77',
  codename: 'CipherAgent_77',
  role: 'archivist',
  tier: 'VIP_MAJESTIC',
  rank: 'ANALYST',
  reputation: 840,
  clearanceLevel: 'LEVEL 4 // COSMIC DECLASSIFIED',
  contributionsCount: 24,
  debunkCount: 7,
  sourcesDiscovered: 15,
  rabbitHolesFollowed: 48,
  badges: [
    { id: 'b-1', name: 'Source Hunter', icon: '📑', description: 'Contributed 10+ primary declassified government/academic documents.', unlockedAt: '2026-07-15' },
    { id: 'b-2', name: 'Fact Checker', icon: '⚖️', description: 'Successfully debunked 5+ fraudulent claims with peer-reviewed evidence.', unlockedAt: '2026-08-01' },
    { id: 'b-3', name: 'Rabbit Hole Explorer', icon: '🕳️', description: 'Mapped and traversed 30+ interconnected cross-case nodes.', unlockedAt: '2026-08-10' }
  ],
  savedCaseIds: ['jfk-assassination', 'mkultra-program', 'operation-northwoods'],
  recentActivity: [
    { id: 'act-1', action: 'Upvoted Evidence', target: 'HSCA Acoustic Dictabelt Evidence (FILE-0001)', timestamp: '12m ago' },
    { id: 'act-2', action: 'Followed Rabbit Hole', target: 'JFK ➔ CIA ➔ MKUltra ➔ Sidney Gottlieb', timestamp: '2h ago' },
    { id: 'act-3', action: 'Peer-Reviewed Submission', target: 'Operation Gladio (FILE-0043)', timestamp: 'Yesterday' }
  ],
  createdAt: '2026-07-01T00:00:00.000Z'
};
