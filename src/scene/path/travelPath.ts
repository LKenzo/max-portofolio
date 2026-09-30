import { Vector3, CatmullRomCurve3 } from 'three';

/**
 * 3D Spline Path Definition
 *
 * Exactly 6 control points mapped to document sections:
 * P0: §01 Identity Hero (Stage right)
 * P1: Transition / Section Boundary
 * P2: §02 Credentials & Academic Records
 * P3: §03 Technical Arsenal & Skills Matrix
 * P4: §04 Case Files (Works)
 * P5: §05 Contact & Sign-off
 */

export function createTravelPath(isMobile: boolean): CatmullRomCurve3 {
  // Mobile compresses lateral X drift so traveler never obstructs reading text
  const xMult = isMobile ? 0.25 : 1.0;
  const zMult = isMobile ? 0.5 : 1.0;

  const controlPoints = [
    new Vector3(3.2 * xMult, 0.8, 0.5 * zMult),    // P0: Hero
    new Vector3(2.2 * xMult, -1.8, -0.4 * zMult),  // P1: Boundary
    new Vector3(-2.6 * xMult, -4.5, 0.6 * zMult),  // P2: Credentials
    new Vector3(-1.0 * xMult, -7.2, -0.3 * zMult), // P3: Skills
    new Vector3(2.8 * xMult, -10.0, 0.4 * zMult),  // P4: Case Files
    new Vector3(0.0, -13.0, 0.0),                  // P5: Contact & Exit
  ];

  return new CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5);
}
