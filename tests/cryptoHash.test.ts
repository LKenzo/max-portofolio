import { describe, it, expect, vi } from 'vitest';
import {
  normalizeExhibitText,
  computeSha256,
  computeExhibitHash,
  type ExhibitInput,
} from '../src/logic/cryptoHash';
import { PROFILE } from '../src/data/profile';

describe('cryptoHash logic & Web Crypto SHA-256 tests', () => {
  const sampleExhibit: ExhibitInput = {
    name: 'Sample Tool',
    summary: 'A test security utility for verification.',
    highlights: ['Feature 1: test suite', 'Feature 2: local harness'],
    primaryLanguage: 'Python',
    url: 'https://github.com/example/sample-tool',
  };

  describe('NIST Published Known-Answer Tests (KAT)', () => {
    // Official NIST FIPS 180-2 / 180-4 test vectors
    it('matches NIST test vector for empty string ("")', async () => {
      const emptyHash = await computeSha256('');
      expect(emptyHash).toBe(
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      );
    });

    it('matches NIST test vector for "abc"', async () => {
      const abcHash = await computeSha256('abc');
      expect(abcHash).toBe(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
      );
    });
  });

  describe('normalizeExhibitText()', () => {
    it('normalizes CRLF to Unix LF', () => {
      const withCRLF: ExhibitInput = {
        name: 'Sample Tool\r\n',
        summary: 'Line 1\r\nLine 2',
        highlights: ['Feature 1\r\nwith newline'],
        primaryLanguage: 'Python\r\n',
        url: 'https://github.com/example/sample-tool\r\n',
      };

      const normalized = normalizeExhibitText(withCRLF);
      expect(normalized).not.toContain('\r');
      expect(normalized).toContain('Sample Tool\n---\nLine 1\nLine 2');
    });

    it('trims outer whitespace from fields', () => {
      const withSpaces: ExhibitInput = {
        name: '  Sample Tool  ',
        summary: '  Trimmed summary.  ',
        highlights: ['  Highlight 1  '],
        primaryLanguage: '  Python  ',
        url: '  https://github.com/example/sample-tool  ',
      };

      const normalized = normalizeExhibitText(withSpaces);
      expect(normalized).toBe(
        'Sample Tool\n---\nTrimmed summary.\n---\nHighlight 1\n---\nPython\n---\nhttps://github.com/example/sample-tool'
      );
    });

    it('handles exhibits with undefined or empty highlights array', () => {
      const noHighlights: ExhibitInput = {
        name: 'No Highlight Tool',
        summary: 'A tool without highlights.',
        primaryLanguage: 'JavaScript',
        url: 'https://github.com/example/no-highlight',
      };

      const normalized = normalizeExhibitText(noHighlights);
      expect(normalized).toBe(
        'No Highlight Tool\n---\nA tool without highlights.\n---\n\n---\nJavaScript\n---\nhttps://github.com/example/no-highlight'
      );
    });
  });

  describe('computeExhibitHash()', () => {
    it('computes a valid 64-character lowercase hexadecimal hash', async () => {
      const hash = await computeExhibitHash(sampleExhibit);
      expect(hash).not.toBeNull();
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is strictly deterministic (identical inputs yield identical hash)', async () => {
      const hash1 = await computeExhibitHash(sampleExhibit);
      const hash2 = await computeExhibitHash({ ...sampleExhibit });
      expect(hash1).toBe(hash2);
    });

    it('generates distinct hashes for differing inputs', async () => {
      const hashA = await computeExhibitHash(sampleExhibit);
      const hashB = await computeExhibitHash({
        ...sampleExhibit,
        name: 'Different Name',
      });
      expect(hashA).not.toBe(hashB);
    });

    it('computes deterministic hashes for the 4 featured exhibits in profile.ts', async () => {
      const featured = PROFILE.projects.slice(0, 4);
      expect(featured).toHaveLength(4);

      for (const project of featured) {
        const hash = await computeExhibitHash(project);
        expect(hash).not.toBeNull();
        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
      }
    });

    it('gracefully returns null instead of throwing when crypto.subtle is unavailable', async () => {
      const originalSubtle = globalThis.crypto?.subtle;
      try {
        // Temporarily redefine subtle to undefined
        Object.defineProperty(globalThis.crypto, 'subtle', {
          value: undefined,
          configurable: true,
        });

        const result = await computeExhibitHash(sampleExhibit);
        expect(result).toBeNull();
      } finally {
        // Restore subtle
        Object.defineProperty(globalThis.crypto, 'subtle', {
          value: originalSubtle,
          configurable: true,
        });
      }
    });
  });
});

