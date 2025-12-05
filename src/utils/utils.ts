// In Next.js, static assets in the public folder are served from the root
export const TEAM_LOGOS: Record<number, string> = {
  913462: "/logos/bouvet.png",
  995429: "/logos/aker.png",
  716906: "/logos/bravida.png",
  1000302: "/logos/nav.png",
  995679: "/logos/enova.png",
  1011569: "/logos/ryde.png",
  1009858: "/logos/default2.png",
  177642: "/logos/default3.png",
  1009856: "/logos/default.png",
  0: "/logos/react.svg",
};

export function getTeamLogo(orgId: number) {
  if (!orgId) return "/logos/react.svg";
  return TEAM_LOGOS[orgId] || "/logos/react.svg";
}
