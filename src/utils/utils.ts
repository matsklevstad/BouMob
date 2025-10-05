import bouvet from "../../src/assets/logos/bouvet.png";
import defaultLogo from "../../src/assets/logos/default.png";
import aker from "../../src/assets/logos/aker.png";
import bravida from "../../src/assets/logos/bravida.png";
import nav from "../../src/assets/logos/nav.png";
import enova from "../../src/assets/logos/enova.png";
import ryde from "../../src/assets/logos/ryde.png";

export const TEAM_LOGOS: Record<number, string> = {
    913462: bouvet,
    995429: aker,
    716906: bravida,
    1000302: nav,
    995679: enova,
    1011569: ryde,
    0: defaultLogo,
};

export function getTeamLogo(orgId?: number) {
  if (!orgId) return defaultLogo;
  return TEAM_LOGOS[orgId] || defaultLogo;
}