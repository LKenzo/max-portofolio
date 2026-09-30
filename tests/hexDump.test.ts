import { describe, it, expect } from 'vitest';
import { generateHexDump } from '../src/logic/hexDump';

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
});
