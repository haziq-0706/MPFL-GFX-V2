export const TEAMS = {
  JDT: { code: "JDT", name: "Johor Darul Ta'zim", short: "JDT", primary: "#E2D505", dark: "#1A1464", crest: "/assets/crests/jdt.png" },
  SEL: { code: "SEL", name: "Selangor FC",         short: "SEL", primary: "#DD1E35", dark: "#DD1E35", crest: "/assets/crests/sel.png" },
  PAH: { code: "PAH", name: "Pahang Rangers",      short: "PAH", primary: "#1B5E20", dark: "#1B5E20", crest: "/assets/crests/pah.png" },
  KLC: { code: "KLC", name: "Kuala Lumpur City",   short: "KLC", primary: "#7B1FA2", dark: "#7B1FA2", crest: "/assets/crests/klc.png" },
  PFA: { code: "PFA", name: "PFA Odin Sarawak",    short: "PFA", primary: "#1565C0", dark: "#0D47A1", crest: "/assets/crests/pfa.png" },
  USM: { code: "USM", name: "USM FC",              short: "USM", primary: "#6A1B9A", dark: "#4A148C", crest: "/assets/crests/usm.png" },
  TRG: { code: "TRG", name: "Terengganu",          short: "TRG", primary: "#FFFFFF", dark: "#0A0A0A", crest: "/assets/crests/trg.png" },
  ATM: { code: "ATM", name: "ATM",                 short: "ATM", primary: "#2E7D32", dark: "#1B5E20", crest: "/assets/crests/atm.png" },
  WIP: { code: "WIP", name: "Wipers",              short: "WIP", primary: "#E65100", dark: "#BF360C", crest: "/assets/crests/wip.png" },
} as const;

export type TeamCode = keyof typeof TEAMS;
export type Team = typeof TEAMS[TeamCode];

export const TEAM_LIST = Object.values(TEAMS);

export const DEFAULT_STANDINGS = [
  { pos: 1, code: "JDT", name: "Johor Darul Ta'zim", p: 8, w: 6, d: 2, l: 0, gd: 10, pts: 20 },
  { pos: 2, code: "SEL", name: "Selangor FC",         p: 8, w: 5, d: 1, l: 2, gd: 5,  pts: 16 },
  { pos: 3, code: "KLC", name: "Kuala Lumpur City",   p: 8, w: 4, d: 1, l: 3, gd: 2,  pts: 13 },
  { pos: 4, code: "PFA", name: "PFA Odin Sarawak",    p: 8, w: 3, d: 3, l: 2, gd: 1,  pts: 12 },
  { pos: 5, code: "ATM", name: "ATM",                 p: 8, w: 3, d: 1, l: 4, gd: -2, pts: 10 },
  { pos: 6, code: "PAH", name: "Pahang Rangers",      p: 8, w: 2, d: 3, l: 3, gd: -3, pts: 9  },
  { pos: 7, code: "USM", name: "USM FC",              p: 8, w: 2, d: 1, l: 5, gd: -5, pts: 7  },
  { pos: 8, code: "TRG", name: "Terengganu",          p: 8, w: 1, d: 2, l: 5, gd: -4, pts: 5  },
  { pos: 9, code: "WIP", name: "Wipers",              p: 8, w: 0, d: 2, l: 6, gd: -9, pts: 2  },
];
