import { describe, it, expect } from 'vitest';
import { generateHexDump, generateOffsetStream } from '../src/logic/hexDump';

describe('hexDump logic tests', () => {
  it('generates genuine hex dump format with 0x offsets and real UTF-8 bytes', () => {
    const text = 'Max Frenat // Cybersecurity';
    const dump = generateHexDump(text);
    const lines = dump.split('\n');

    expect(lines.length).toBeGreaterThan(0);
    // Line starts with 0x0000
    expect(lines[0]).toMatch(/^0x0000\s+/);
    // ASCII representation contains the text
    expect(lines[0]).toContain('|Max Frenat // Cy|');
    // Hex bytes for 'M' (0x4d), 'a' (0x61), 'x' (0x78)
    expect(lines[0]).toContain('4d 61 78 20');
  });

  it('handles empty input gracefully', () => {
    const dump = generateHexDump('');
    expect(dump).toBe('');
  });

  it('respects maxLines constraint', () => {
    const longText = 'A'.repeat(500);
    const dump = generateHexDump(longText, 5);
    const lines = dump.split('\n');
    expect(lines.length).toBe(5);
  });

  describe('generateOffsetStream()', () => {
    it('formats offset column, category, and value with authentic 0x offsets', () => {
      const items = [
        { offset: 0, category: 'STAGE 01', value: 'INTAKE & COLLECTION' },
        { offset: 32, category: 'STAGE 02', value: 'CREDENTIALS LOGGED' },
      ];
      const stream = generateOffsetStream(items);
      const lines = stream.split('\n');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toContain('0x0000  [STAGE 01        ]  INTAKE & COLLECTION');
      expect(lines[1]).toContain('0x0020  [STAGE 02        ]  CREDENTIALS LOGGED');
    });
  });
});
