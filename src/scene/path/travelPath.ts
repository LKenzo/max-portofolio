import { Vector3, CatmullRomCurve3 } from 'three';
import { deriveControlPointYValues } from '../../logic/scrollMath';

/**
 * 3D Spline Path Definition (Restored Phase B Lateral Control Points)
 *
 * Preserves Phase B commit (ef68790) lateral X and Z coordinates.
 * Y coordinates are derived dynamically from measured DOM section offsets (recomputed on resize).
 * P0: Stage 01 Hero (x: 3.2, z: 0.5)
 * P1: Transition Boundary (x: 2.2, z: -0.4)
 * P2: Stage 02 Credentials (x: -2.6, z: 0.6)
 * P3: Stage 03 Toolkit Audit (x: -1.0, z: -0.3)
 * P4: Stage 04 Exhibits (x: 2.8, z: 0.4)
 * P5: Stage 05 Contact Sign-off (x: 0.0, z: 0.0) -> Fixed resting position inside viewport
 */

export function createTravelPath(
  isMobile: boolean,
  sectionTops?: readonly number[]
): CatmullRomCurve3 {
  // Mobile compresses lateral X drift so traveler never obstructs reading text
  const xMult = isMobile ? 0.25 : 1.0;
  const zMult = isMobile ? 0.5 : 1.0;

  // Derives Y coordinates strictly from measured DOM section offsets
  const yValues =
    sectionTops && sectionTops.length >= 2
      ? deriveControlPointYValues(sectionTops, 0.8, -2.8)
      : [0.8, -0.4, -1.2, -1.8, -2.4, -2.8];

  const controlPoints = [
    new Vector3(3.2 * xMult, yValues[0], 0.5 * zMult),  // P0: Hero
    new Vector3(2.2 * xMult, yValues[1], -0.4 * zMult), // P1: Boundary
    new Vector3(-2.6 * xMult, yValues[2], 0.6 * zMult), // P2: Credentials
    new Vector3(-1.0 * xMult, yValues[3], -0.3 * zMult),// P3: Skills
    new Vector3(2.8 * xMult, yValues[4], 0.4 * zMult),  // P4: Case Files
    new Vector3(0.0, yValues[5], 0.0),                 // P5: Contact & Fixed Clasp
  ];

  return new CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5);
}
