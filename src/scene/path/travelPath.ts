import { Vector3, CatmullRomCurve3 } from 'three';

/**
 * 3D Spline Path Definition (Evidence Locker)
 *
 * Mapped to document sections, positioned strictly OUTSIDE text columns:
 * P0: Stage 01 Hero (Deep stage right margin: x = 5.2, completely clear of hero text)
 * P1: Stage 01/02 Transition Boundary (Right margin gutter: x = 4.8)
 * P2: Stage 02 Credentials (Right margin gutter: x = 5.0)
 * P3: Stage 03 Toolkit Audit (Right margin gutter: x = 4.7)
 * P4: Stage 04 Exhibit Inspection (Right margin gutter: x = 5.1)
 * P5: Stage 05 Custody Sign-Off (Converges to center seal stamp: x = 0.0)
 */

export function createTravelPath(isMobile: boolean): CatmullRomCurve3 {
  // Mobile compresses lateral X drift so traveler never obstructs reading text
  const xMult = isMobile ? 0.05 : 1.0;
  const zMult = isMobile ? 0.4 : 1.0;

  const controlPoints = [
    new Vector3(5.2 * xMult, 0.6, 0.1 * zMult),    // P0: Hero (Far right margin, clear of text)
    new Vector3(4.8 * xMult, -2.2, -0.3 * zMult),  // P1: Boundary
    new Vector3(5.0 * xMult, -5.0, 0.2 * zMult),   // P2: Credentials (Right margin)
    new Vector3(4.7 * xMult, -7.8, -0.2 * zMult),  // P3: Toolkit Audit (Right margin)
    new Vector3(5.1 * xMult, -10.5, 0.3 * zMult),  // P4: Exhibits (Right margin)
    new Vector3(0.0, -13.2, 0.0),                  // P5: Contact Sign-off (Center seal)
  ];

  return new CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5);
}
