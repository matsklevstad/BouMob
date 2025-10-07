import bouvet from "../../src/assets/logos/bouvet.png";
import munkvoll from "../../src/assets/logos/default.png";
import tandem from "../../src/assets/logos/default2.png";
import jernbanen from "../../src/assets/logos/default3.png";
import aker from "../../src/assets/logos/aker.png";
import bravida from "../../src/assets/logos/bravida.png";
import nav from "../../src/assets/logos/nav.png";
import enova from "../../src/assets/logos/enova.png";
import ryde from "../../src/assets/logos/ryde.png";
import defaultLogo from "../../src/assets/logos/react.svg";

export const TEAM_LOGOS: Record<number, string> = {
  913462: bouvet,
  995429: aker,
  716906: bravida,
  1000302: nav,
  995679: enova,
  1011569: ryde,
  1009858: tandem,
  177642: jernbanen,
  1009856: munkvoll,
  0: defaultLogo,
};

export function getTeamLogo(orgId: number) {
  if (!orgId) return defaultLogo;
  return TEAM_LOGOS[orgId];
}
