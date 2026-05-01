export const electionTimeline = [
  {
    phase: "1. Preparation & Registration",
    details: "Citizens ensure they meet eligibility criteria (18+ years, Indian citizen) and register to vote with the Election Commission of India (ECI) to get their Voter ID (EPIC).",
    icon: "ClipboardCheck"
  },
  {
    phase: "2. Notification & Nominations",
    details: "The ECI announces the election schedule. Candidates file their nomination papers, which are scrutinized, and a final list of contesting candidates is published.",
    icon: "BookOpen"
  },
  {
    phase: "3. Campaigning & Voting",
    details: "Political parties campaign until 48 hours before voting. On polling day, registered voters cast their votes at designated booths using Electronic Voting Machines (EVMs) and VVPATs.",
    icon: "Vote"
  },
  {
    phase: "4. Counting & Results",
    details: "Votes are counted securely under ECI supervision. Results are officially declared, and the winning candidates are certified.",
    icon: "BarChart3"
  }
];

export const votingOptions = [
  {
    type: "In-Person Polling Booths",
    description: "The most common method. Go to your designated local polling booth on election day. You must carry your Voter ID (EPIC) or other ECI-approved photo ID."
  },
  {
    type: "Postal Ballot",
    description: "Available only for restricted categories like service voters (armed forces), personnel on election duty, electors above 85 years, and Persons with Disabilities (PwD)."
  },
  {
    type: "Vote-from-Home",
    description: "A recent initiative by the ECI allowing senior citizens (85+) and PwDs (40%+ disability) to cast their vote from home using postal ballots with strict videography."
  }
];

export const electedPositions = [
  {
    title: "Member of Parliament (Lok Sabha)",
    level: "National",
    role: "MPs represent their constituency in the lower house of the Parliament. The party or coalition with a majority in the Lok Sabha forms the central government and selects the Prime Minister.",
    term: "5 years"
  },
  {
    title: "Member of Legislative Assembly (MLA)",
    level: "State",
    role: "MLAs represent their constituency in the State Legislative Assembly. The majority party forms the state government and selects the Chief Minister.",
    term: "5 years"
  },
  {
    title: "Member of Parliament (Rajya Sabha)",
    level: "National",
    role: "Elected indirectly by state MLAs, they represent states in the upper house of Parliament, reviewing and passing central legislation.",
    term: "6 years (1/3rd retire every 2 years)"
  },
  {
    title: "President of India",
    level: "National",
    role: "The ceremonial head of state and commander-in-chief of the armed forces. Elected indirectly by an electoral college consisting of MPs and MLAs.",
    term: "5 years"
  },
  {
    title: "Mayor / Municipal Councilor",
    level: "Local (Urban)",
    role: "Councilors form the municipal corporation to oversee urban local governance (water, sanitation, roads). The Mayor is the ceremonial head.",
    term: "5 years"
  },
  {
    title: "Sarpanch / Ward Member",
    level: "Local (Rural)",
    role: "Elected members of the Gram Panchayat responsible for village-level development, dispute resolution, and local administration.",
    term: "5 years"
  }
];
