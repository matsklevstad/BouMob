import type { Standing } from "../types/Standing";

// This data is based on the provided screenshot for local development.
export const fakeStandingsData: Partial<Standing>[] = [
  {
    position: 1,
    orgId: 1011569, // Ryde (from TEAM_LOGOS)
    orgName: "Ryde",
    matches: 14,
    victories: 11,
    draws: 1,
    losses: 2,
    totalGoalsFormatted: "89 - 48",
    goalDifference: 41,
    totalPoints: 34,
  },
  {
    position: 2,
    orgId: 1009858, // Tanem Drekk Å Høvleri (mapped to tandem/default2)
    orgName: "Tanem Drekk Å Høvleri",
    matches: 15,
    victories: 10,
    draws: 3,
    losses: 2,
    totalGoalsFormatted: "72 - 47",
    goalDifference: 25,
    totalPoints: 33,
  },
  {
    position: 3,
    orgId: 1009856, // AC Munkvoll (mapped to default)
    orgName: "AC Munkvoll",
    matches: 15,
    victories: 9,
    draws: 1,
    losses: 5,
    totalGoalsFormatted: "68 - 46",
    goalDifference: 22,
    totalPoints: 28,
  },
  {
    position: 4,
    orgId: 913462, // Bouvet (matches TEAM_LOGOS)
    orgName: "Bouvet",
    matches: 14,
    victories: 8,
    draws: 2,
    losses: 4,
    totalGoalsFormatted: "56 - 41",
    goalDifference: 15,
    totalPoints: 26,
  },
  {
    position: 5,
    orgId: 995429, // Aker Solutions
    orgName: "Aker Solutions",
    matches: 15,
    victories: 6,
    draws: 1,
    losses: 8,
    totalGoalsFormatted: "60 - 76",
    goalDifference: -16,
    totalPoints: 19,
  },
  {
    position: 6,
    orgId: 177642, // Jernbanen (mapped to jernbanen/default3)
    orgName: "Jernbanen",
    matches: 15,
    victories: 5,
    draws: 2,
    losses: 8,
    totalGoalsFormatted: "51 - 60",
    goalDifference: -9,
    totalPoints: 17,
  },
  {
    position: 7,
    orgId: 716906, // Bravida FK
    orgName: "Bravida FK",
    matches: 15,
    victories: 4,
    draws: 3,
    losses: 8,
    totalGoalsFormatted: "49 - 70",
    goalDifference: -21,
    totalPoints: 15,
  },
  {
    position: 8,
    orgId: 995679, // Enova
    orgName: "Enova",
    matches: 16,
    victories: 4,
    draws: 3,
    losses: 9,
    totalGoalsFormatted: "56 - 90",
    goalDifference: -34,
    totalPoints: 15,
  },
  {
    position: 9,
    orgId: 1000302, // NAVpoli (nav)
    orgName: "NAVpoli",
    matches: 15,
    victories: 2,
    draws: 0,
    losses: 13,
    totalGoalsFormatted: "63 - 86",
    goalDifference: -23,
    totalPoints: 6,
  },
];
