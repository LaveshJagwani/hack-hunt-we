export const navItems = [
  { label: "hunt board", to: "/" },
  { label: "messy search", to: "/explore" },
  { label: "deadline wall", to: "/calendar" },
  { label: "save my spots", to: "/auth" }
];

export const landingStats = [
  { label: "Freshly indexed", value: "148", tone: "sky" },
  { label: "Closing this week", value: "31", tone: "cherry" },
  { label: "Actually beginner-safe", value: "19", tone: "mint" },
  { label: "Mentor-heavy weirdos", value: "12", tone: "butter" }
];

export const heroScratchNotes = [
  "No more finding a killer hackathon two hours after registrations closed.",
  "Built for people who save links in random group chats and regret it later.",
  "Yes, we also side-eye sites that hide the real deadline three clicks deep."
];

export const discoveryBlurbs = [
  {
    title: "Search by panic level",
    copy: "Type 'last date soon', 'AI', or 'remote only' and the board calms down a bit."
  },
  {
    title: "Find the easy wins",
    copy: "Some events are glorious chaos. Others are a clean weekend build with a fair shot."
  },
  {
    title: "Keep the weird ones",
    copy: "Save the niche biohackathon in Lisbon before it disappears into your tabs."
  }
];

export const featuredHackathons = [
  {
    title: "Midnight API Jam",
    host: "Postman x tiny teams club",
    theme: "DevTools",
    format: "remote",
    location: "Remote / global",
    deadline: "Apply by Apr 10",
    prize: "$18k",
    summary:
      "For builders who would rather demo a useful tool than pitch a grand vision deck at 2am.",
    tags: ["🔥 trending", "easy win", "mentor-heavy"],
    note: "The one people keep forwarding with 'this feels very buildable'.",
    tone: "peach",
    stamp: "cherry",
    tilt: "left"
  },
  {
    title: "Climate Sprint: Bengaluru",
    host: "Open data folks + civic nerds",
    theme: "Climate",
    format: "irl",
    location: "Bengaluru, India",
    deadline: "Closes in 4 days",
    prize: "$25k",
    summary:
      "Maps, sensors, ugly dashboards, useful outcomes. Very little fluff. Great coffee odds.",
    tags: ["last date soon", "irl", "ships fast"],
    note: "More prototypes, fewer vibe slides.",
    tone: "mint",
    stamp: "ink",
    tilt: "right"
  },
  {
    title: "Figma to Frontend Throwdown",
    host: "Design engineers anonymous",
    theme: "Design",
    format: "hybrid",
    location: "Remote + Berlin finals",
    deadline: "Starts Apr 18",
    prize: "$9k",
    summary:
      "Perfect if your team has one design goblin, one CSS goblin, and a deadline addiction.",
    tags: ["crowd favorite", "frontend", "weekend-sized"],
    note: "Somebody will absolutely overdo the hover states.",
    tone: "sky",
    stamp: "butter",
    tilt: "slightLeft"
  },
  {
    title: "LedgerLab Fintech Brawl",
    host: "Three fintech APIs in a trench coat",
    theme: "FinTech",
    format: "remote",
    location: "Remote / APAC-friendly",
    deadline: "Shortlist on Friday",
    prize: "$42k",
    summary:
      "Budgeting, invoicing, fraud alerts, money movement. Boring on paper, surprisingly winnable in practice.",
    tags: ["easy win", "b2b weird", "quietly lucrative"],
    note: "Serious prize pool, unserious branding. We respect that.",
    tone: "butter",
    stamp: "sky",
    tilt: "slightRight"
  }
];

export const exploreHackathons = [
  {
    title: "Midnight API Jam",
    host: "Postman x tiny teams club",
    theme: "DevTools",
    format: "remote",
    location: "Remote / global",
    deadline: "Apply by Apr 10",
    prize: "$18k",
    summary:
      "Build the internal tool you wish existed yesterday. Judges love demos that save actual time.",
    tags: ["🔥 trending", "easy win", "mentor-heavy"],
    tech: ["APIs", "React", "Node"],
    note: "Strong chance of winning with a brutally useful product.",
    tone: "peach",
    stamp: "cherry",
    tilt: "left"
  },
  {
    title: "Climate Sprint: Bengaluru",
    host: "Open data folks + civic nerds",
    theme: "Climate",
    format: "irl",
    location: "Bengaluru, India",
    deadline: "Closes in 4 days",
    prize: "$25k",
    summary:
      "Local climate data, sensors, urban dashboards, and organizers who care more about outcomes than jargon.",
    tags: ["last date soon", "irl", "ships fast"],
    tech: ["Maps", "Data Viz", "IoT"],
    note: "Bring your own caffeine and a team that can ship by Sunday.",
    tone: "mint",
    stamp: "ink",
    tilt: "right"
  },
  {
    title: "Wallet UX Rescue Mission",
    host: "Indie wallet founders",
    theme: "Web3",
    format: "remote",
    location: "Remote / EU-friendly",
    deadline: "Starts Apr 14",
    prize: "$12k",
    summary:
      "Take a wallet flow from 'absolutely not' to 'my cousin could use this' without killing the fun.",
    tags: ["frontend", "crowd favorite", "prototype-heavy"],
    tech: ["EVM", "UX", "TypeScript"],
    note: "Rare Web3 event where UX is not an afterthought.",
    tone: "sky",
    stamp: "butter",
    tilt: "slightLeft"
  },
  {
    title: "Figma to Frontend Throwdown",
    host: "Design engineers anonymous",
    theme: "Design",
    format: "hybrid",
    location: "Remote + Berlin finals",
    deadline: "Starts Apr 18",
    prize: "$9k",
    summary:
      "A designer and a frontend dev walk into a challenge board and somehow leave as friends.",
    tags: ["weekend-sized", "frontend", "easy win"],
    tech: ["Figma", "CSS", "Motion"],
    note: "The judges are picky in a useful way.",
    tone: "butter",
    stamp: "sky",
    tilt: "slightRight"
  },
  {
    title: "LedgerLab Fintech Brawl",
    host: "Three fintech APIs in a trench coat",
    theme: "FinTech",
    format: "remote",
    location: "Remote / APAC-friendly",
    deadline: "Shortlist on Friday",
    prize: "$42k",
    summary:
      "Expense tooling, invoicing, fraud monitoring, and surprisingly generous office-hour support.",
    tags: ["easy win", "quietly lucrative", "b2b weird"],
    tech: ["Payments", "Dashboards", "AI Ops"],
    note: "Not flashy. Very practical. Prize pool says hello.",
    tone: "peach",
    stamp: "ink",
    tilt: "flat"
  },
  {
    title: "Campus AI Tiny Grant",
    host: "A university lab with taste",
    theme: "AI",
    format: "remote",
    location: "Remote / student-led",
    deadline: "Review every Monday",
    prize: "$6k",
    summary:
      "Small teams, fast judging, no nonsense. Build one good AI feature and explain it like a human.",
    tags: ["student-friendly", "easy win", "ships fast"],
    tech: ["LLMs", "Python", "Evaluation"],
    note: "Feels more like a makers grant than a spectacle.",
    tone: "mint",
    stamp: "cherry",
    tilt: "left"
  },
  {
    title: "CareStack Health Build",
    host: "Doctors, operators, and one cursed spreadsheet",
    theme: "Health",
    format: "hybrid",
    location: "Chennai + remote qualifiers",
    deadline: "Closes in 8 days",
    prize: "$30k",
    summary:
      "Patient ops, scheduling, care journeys, and the rare chance to build something painfully useful.",
    tags: ["mentor-heavy", "hybrid", "real-users"],
    tech: ["Analytics", "Workflow", "Mobile"],
    note: "More messy than glamorous. Potentially high impact.",
    tone: "sky",
    stamp: "cherry",
    tilt: "right"
  },
  {
    title: "Offline City Quest",
    host: "Civic hackers + local museums",
    theme: "Culture",
    format: "irl",
    location: "Pune, India",
    deadline: "Invite list on Apr 22",
    prize: "$7k",
    summary:
      "Location-based clues, storytelling tech, odd interfaces, and one category dedicated to delightful nonsense.",
    tags: ["irl", "crowd favorite", "weird in a good way"],
    tech: ["AR", "Maps", "Storytelling"],
    note: "If your team likes making people smile, this is it.",
    tone: "blush",
    stamp: "ink",
    tilt: "slightLeft"
  }
];

export const themeFilters = ["All", "AI", "Web3", "Climate", "FinTech", "Design", "DevTools", "Health", "Culture"];

export const formatFilters = ["All", "remote", "irl", "hybrid"];

export const vibeFilters = ["All", "easy win", "last date soon", "mentor-heavy", "crowd favorite"];

export const spotlightHackathon = {
  title: "Midnight API Jam",
  subtitle: "For teams who like practical demos more than dramatic pitch decks.",
  host: "Postman x tiny teams club",
  location: "Remote / global",
  format: "Remote",
  deadline: "April 10, 2026",
  buildWindow: "48 focused hours",
  prize: "$18,000",
  team: "Solo to 4 people",
  whyItHits:
    "This is the kind of event where a sharp problem statement, a useful product, and a fast demo can beat louder teams. Nobody is asking for a metaverse here. Bless.",
  description:
    "The challenge board is centered on ugly, useful tooling: API explorers, internal dashboards, onboarding helpers, debugging assistants, and tiny workflow automations that make developers mutter 'okay, wait, this is actually good.'",
  tags: ["🔥 trending", "easy win", "mentor-heavy", "remote only"],
  tracks: [
    "Best tool for exhausted developers",
    "Fastest demo-to-value ratio",
    "Most useful AI sidekick for API work"
  ],
  timeline: [
    { label: "Warm-up call", value: "Apr 8 / 8:30 PM IST" },
    { label: "Build weekend", value: "Apr 11 to Apr 12" },
    { label: "Live demos", value: "Apr 13 / rolling rooms" }
  ],
  perks: [
    "Judges give product feedback instead of vague vibes.",
    "Mentor hours are stacked in APAC and Europe, not just US evenings.",
    "Winning teams get intro calls with actual devtools operators."
  ]
};

export const recommendedHackathons = [
  {
    title: "Campus AI Tiny Grant",
    host: "A university lab with taste",
    theme: "AI",
    format: "remote",
    location: "Remote / student-led",
    deadline: "Review every Monday",
    prize: "$6k",
    summary: "Small, clean scope. Great if you want one polished AI feature and a fair shot.",
    tags: ["student-friendly", "easy win"],
    note: "Surprisingly kind judging rubric.",
    tone: "mint",
    stamp: "cherry",
    tilt: "slightRight"
  },
  {
    title: "Wallet UX Rescue Mission",
    host: "Indie wallet founders",
    theme: "Web3",
    format: "remote",
    location: "Remote / EU-friendly",
    deadline: "Starts Apr 14",
    prize: "$12k",
    summary: "A cleaner, more opinionated challenge if your team lives in frontend and flow design.",
    tags: ["frontend", "crowd favorite"],
    note: "Good chaos. Not scammy chaos.",
    tone: "sky",
    stamp: "butter",
    tilt: "left"
  }
];

export const calendarDays = [
  { day: "", ghost: true },
  { day: "", ghost: true },
  { day: "1" },
  { day: "2", event: "Mentor signup", tone: "sky" },
  { day: "3" },
  { day: "4", event: "Wallet UX opens", tone: "butter" },
  { day: "5" },
  { day: "6" },
  { day: "7", event: "Campus AI review", tone: "mint" },
  { day: "8" },
  { day: "9" },
  { day: "10", event: "Midnight API closes", tone: "cherry", focus: true },
  { day: "11" },
  { day: "12", event: "Climate Sprint shortlist", tone: "mint" },
  { day: "13" },
  { day: "14", event: "Wallet UX kickoff", tone: "sky" },
  { day: "15" },
  { day: "16" },
  { day: "17", event: "Health Build Q&A", tone: "peach" },
  { day: "18" },
  { day: "19" },
  { day: "20" },
  { day: "21", event: "Campus AI review", tone: "mint" },
  { day: "22", event: "City Quest invites", tone: "butter" },
  { day: "23" },
  { day: "24" },
  { day: "25" },
  { day: "26" },
  { day: "27" },
  { day: "28", event: "CareStack demos", tone: "sky" },
  { day: "29" },
  { day: "30" },
  { day: "", ghost: true },
  { day: "", ghost: true },
  { day: "", ghost: true }
];

export const calendarHighlights = [
  {
    date: "Apr 10",
    title: "Midnight API Jam closes",
    copy: "If you're applying, do not be heroic at 11:58 PM. Upload earlier."
  },
  {
    date: "Apr 14",
    title: "Wallet UX kickoff",
    copy: "Great one for design-engineering duos who want a more visual challenge."
  },
  {
    date: "Apr 22",
    title: "Offline City Quest invites",
    copy: "Weird, local, and memorable. Exactly the kind of event that disappears from the internet."
  }
];

export const authReasons = [
  "Save weird niche events before they vanish into 12 open tabs.",
  "Keep your shortlist, deadlines, and 'maybe this weekend' plans in one place.",
  "Apply faster when a good hackathon suddenly announces a cutoff."
];

export const footerLinks = [
  { label: "Explore", to: "/explore" },
  { label: "Calendar", to: "/calendar" },
  { label: "Details", to: "/details" },
  { label: "Log in", to: "/auth" }
];
