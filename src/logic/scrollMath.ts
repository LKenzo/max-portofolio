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
 * Divides the spline into equal segments corresponding to section waypoints.
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
 * Returns traveler scale based on viewport width (simplifies/scales down on mobile).
 */
export function getTravelerScale(viewportWidth: number): number {
  return viewportWidth < 768 ? 0.55 : 1.0;
}
