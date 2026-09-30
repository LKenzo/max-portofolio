/**
 * PURE LOGIC MODULE: Scroll Math & Section Offset Interpolation
 *
 * Maps actual DOM section positions to Catmull-Rom spline parameters.
 * Recomputed on window resize. Zero side-effects; fully unit-testable.
 */

export interface SectionOffset {
  readonly id: string;
  readonly top: number;
  readonly height: number;
}

/**
 * Constrains a value within a specified range [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates normalized scroll progress [0, 1] across total scrollable document height.
 */
export function calculateScrollProgress(
  scrollY: number,
  docHeight: number,
  viewportHeight: number
): number {
  const maxScroll = docHeight - viewportHeight;
  if (maxScroll <= 0) return 0;
  return clamp(scrollY / maxScroll, 0, 1);
}

/**
 * Maps current scroll position to curve parameter t in [0, 1] based on actual DOM section offsets.
 * Divides the spline into segments corresponding to section waypoints.
 * Strictly clamps output in [0, 1].
 *
 * @param scrollY Current vertical scroll offset
 * @param viewportHeight Viewport height in pixels
 * @param sectionTops Array of vertical top offsets (in px) for each waypoint section
 */
export function mapOffsetToCurveT(
  scrollY: number,
  viewportHeight: number,
  sectionTops: readonly number[]
): number {
  if (!sectionTops || sectionTops.length === 0) return 0;
  if (sectionTops.length === 1) return 0;

  // Viewport focus anchor (35% down the viewport)
  const currentPos = scrollY + viewportHeight * 0.35;

  const first = sectionTops[0];
  const last = sectionTops[sectionTops.length - 1];

  if (currentPos <= first) return 0;
  if (currentPos >= last) return 1;

  const segmentCount = sectionTops.length - 1;
  const segmentFraction = 1 / segmentCount;

  for (let i = 0; i < segmentCount; i++) {
    const start = sectionTops[i];
    const end = sectionTops[i + 1];
    if (currentPos >= start && currentPos <= end) {
      const span = end - start;
      const localT = span > 0 ? (currentPos - start) / span : 0;
      return clamp(i * segmentFraction + localT * segmentFraction, 0, 1);
    }
  }

  return 1;
}

/**
 * Derives the 6 spline control point Y coordinates directly from measured DOM section offsets.
 * Recomputed on window resize.
 *
 * @param sectionTops Measured top offsets (in px) of the document sections
 * @param startY 3D world Y coordinate at Hero start (default: 0.8)
 * @param endY 3D world Y coordinate at Contact resting position (default: -2.8)
 */
export function deriveControlPointYValues(
  sectionTops: readonly number[],
  startY = 0.8,
  endY = -2.8
): number[] {
  if (!sectionTops || sectionTops.length < 2) {
    return [startY, (startY + endY) / 2, -1.0, -1.8, -2.4, endY];
  }

  const s0 = sectionTops[0];
  const sLast = sectionTops[sectionTops.length - 1];
  const totalSpan = sLast - s0;
  const worldSpan = startY - endY;

  if (totalSpan <= 0) {
    return [startY, (startY + endY) / 2, -1.0, -1.8, -2.4, endY];
  }

  // Relative progression [0, 1] for each measured DOM section offset
  const rho = sectionTops.map((top) => clamp((top - s0) / totalSpan, 0, 1));

  // P0: Hero
  const y0 = startY;
  // P1: Midpoint boundary between Hero and Credentials
  const rhoBoundary = (rho[0] + (rho[1] ?? 0.25)) / 2;
  const y1 = startY - rhoBoundary * worldSpan;
  // P2: Credentials
  const y2 = startY - (rho[1] ?? 0.25) * worldSpan;
  // P3: Toolkit Audit
  const y3 = startY - (rho[2] ?? 0.5) * worldSpan;
  // P4: Exhibit Inspection
  const y4 = startY - (rho[3] ?? 0.75) * worldSpan;
  // P5: Contact Sign-off (fixed resting position inside viewport)
  const y5 = endY;

  return [y0, y1, y2, y3, y4, y5];
}

/**
 * Returns traveler scale based on viewport width (simplifies/scales down on mobile).
 */
export function getTravelerScale(viewportWidth: number): number {
  return viewportWidth < 768 ? 0.55 : 1.0;
}
