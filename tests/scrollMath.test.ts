import { describe, it, expect } from 'vitest';
import {
  clamp,
  calculateScrollProgress,
  mapOffsetToCurveT,
  getTravelerScale,
} from '../src/logic/scrollMath';

describe('scrollMath logic tests', () => {
  describe('clamp()', () => {
    it('clamps values below min', () => {
      expect(clamp(-5, 0, 1)).toBe(0);
    });

    it('clamps values above max', () => {
      expect(clamp(1.5, 0, 1)).toBe(1);
    });

    it('preserves values within range', () => {
      expect(clamp(0.42, 0, 1)).toBe(0.42);
    });
  });

  describe('calculateScrollProgress()', () => {
    it('returns 0 when scroll is at top', () => {
      expect(calculateScrollProgress(0, 3000, 1000)).toBe(0);
    });

    it('returns 0.5 when halfway through document', () => {
      // maxScroll = 3000 - 1000 = 2000; halfway = 1000
      expect(calculateScrollProgress(1000, 3000, 1000)).toBe(0.5);
    });

    it('returns 1.0 when scroll reaches bottom', () => {
      expect(calculateScrollProgress(2000, 3000, 1000)).toBe(1.0);
    });

    it('clamps to 1.0 if overscrolling', () => {
      expect(calculateScrollProgress(2500, 3000, 1000)).toBe(1.0);
    });

    it('handles edge case where document is smaller than viewport', () => {
      expect(calculateScrollProgress(0, 800, 1000)).toBe(0);
    });
  });

  describe('mapOffsetToCurveT()', () => {
    // 6 section waypoints: [0, 800, 1800, 3000, 4200, 5000]
    const sectionTops = [0, 800, 1800, 3000, 4200, 5000];
    const viewportHeight = 1000; // anchor offset = 350px

    it('returns 0 when near the top of first section', () => {
      // scrollY = 0 => currentPos = 350
      // Between 0 and 800 (segment 0): localT = 350 / 800 = 0.4375
      // segmentFraction = 1/5 = 0.2 => t = 0.4375 * 0.2 = 0.0875
      const t = mapOffsetToCurveT(0, viewportHeight, sectionTops);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThan(0.2);
    });

    it('returns 0 if currentPos is before first section top', () => {
      expect(mapOffsetToCurveT(-500, viewportHeight, sectionTops)).toBe(0);
    });

    it('returns 1.0 if currentPos has passed the last section', () => {
      expect(mapOffsetToCurveT(6000, viewportHeight, sectionTops)).toBe(1.0);
    });

    it('handles empty or single-element section arrays gracefully', () => {
      expect(mapOffsetToCurveT(100, viewportHeight, [])).toBe(0);
      expect(mapOffsetToCurveT(100, viewportHeight, [500])).toBe(0);
    });

    it('smoothly scales across intermediate segments', () => {
      // Between section 2 (1800) and section 3 (3000): currentPos = 2400 (halfway)
      // scrollY = 2400 - 350 = 2050
      const t = mapOffsetToCurveT(2050, viewportHeight, sectionTops);
      // Segment 2 out of 5: base = 2/5 = 0.4. Halfway = 0.4 + 0.5 * 0.2 = 0.5
      expect(t).toBeCloseTo(0.5, 4);
    });
  });

  describe('getTravelerScale()', () => {
    it('returns 0.55 on mobile widths (< 768px)', () => {
      expect(getTravelerScale(360)).toBe(0.55);
      expect(getTravelerScale(767)).toBe(0.55);
    });

    it('returns 1.0 on desktop widths (>= 768px)', () => {
      expect(getTravelerScale(768)).toBe(1.0);
      expect(getTravelerScale(1440)).toBe(1.0);
    });
  });
});
