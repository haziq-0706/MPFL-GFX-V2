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
  { pos: 1, code: "JDT", name: "Johor Darul Ta'zim", p: 12, w: 9, d: 2, l: 1, gf: 54, ga: 11, gd: 43, pts: 29, form: ["W","W","W","D","W"] },
  { pos: 2, code: "SEL", name: "Selangor FC",         p: 12, w: 8, d: 1, l: 3, gf: 41, ga: 22, gd: 19, pts: 25, form: ["W","L","W","W","D"] },
  { pos: 3, code: "KLC", name: "Kuala Lumpur City",   p: 12, w: 6, d: 2, l: 4, gf: 32, ga: 28, gd: 4,  pts: 20, form: ["L","W","W","L","W"] },
  { pos: 4, code: "PFA", name: "PFA Odin Sarawak",    p: 12, w: 5, d: 3, l: 4, gf: 28, ga: 27, gd: 1,  pts: 18, form: ["D","W","D","W","L"] },
  { pos: 5, code: "ATM", name: "ATM",                 p: 12, w: 4, d: 2, l: 6, gf: 24, ga: 30, gd: -6, pts: 14, form: ["L","W","L","D","W"] },
  { pos: 6, code: "PAH", name: "Pahang Rangers",      p: 12, w: 3, d: 4, l: 5, gf: 20, ga: 28, gd: -8, pts: 13, form: ["D","L","D","L","W"] },
  { pos: 7, code: "USM", name: "USM FC",              p: 12, w: 3, d: 2, l: 7, gf: 19, ga: 34, gd: -15,pts: 11, form: ["L","L","W","D","L"] },
  { pos: 8, code: "TRG", name: "Terengganu",          p: 12, w: 2, d: 3, l: 7, gf: 17, ga: 32, gd: -15,pts: 9,  form: ["L","D","L","W","L"] },
  { pos: 9, code: "WIP", name: "Wipers",              p: 12, w: 1, d: 2, l: 9, gf: 12, ga: 45, gd: -33,pts: 5,  form: ["L","L","L","D","L"] },
];
