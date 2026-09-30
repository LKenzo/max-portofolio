import type { ProjectEntry } from '../data/types';

export type ExhibitInput = Pick<
  ProjectEntry,
  'name' | 'summary' | 'highlights' | 'primaryLanguage' | 'url'
>;

/**
 * EXACT NORMALIZATION SPECIFICATION (REPRODUCIBLE BROWSER HASHING)
 *
 * Rules:
 * 1. Takes only verified fields that exist in profile.ts:
 *    - name
 *    - summary
 *    - highlights
 *    - primaryLanguage
 *    - url
 * 2. Trims leading and trailing whitespace from each field.
 * 3. Normalizes all line-breaks to standard Unix LF ('\n').
 * 4. Joins the highlights array with '\n' (empty string if undefined or empty).
 * 5. Combines the fields using standard delimiter ('\n---\n') in strict order:
 *    ${name}\n---\n${summary}\n---\n${highlights}\n---\n${primaryLanguage}\n---\n${url}
 * 6. Encodes the resulting normalized string as UTF-8 bytes for Web Crypto SHA-256.
 *
 * Notice: This hash is computed locally in the browser over the exhibit's normalized text.
 * It demonstrates reproducible client-side cryptography; it does not attest to remote
 * repository state or server-side authenticity.
 */
export function normalizeExhibitText(exhibit: ExhibitInput): string {
  const name = (exhibit.name || '').trim().replace(/\r\n/g, '\n');
  const summary = (exhibit.summary || '').trim().replace(/\r\n/g, '\n');
  const highlights = (exhibit.highlights || [])
    .map((h) => h.trim().replace(/\r\n/g, '\n'))
    .filter((h) => h.length > 0)
    .join('\n');
  const lang = (exhibit.primaryLanguage || '').trim().replace(/\r\n/g, '\n');
  const url = (exhibit.url || '').trim().replace(/\r\n/g, '\n');

  return [name, summary, highlights, lang, url].join('\n---\n');
}

/**
 * Computes a 64-character lowercase SHA-256 hexadecimal digest via Web Crypto API.
 * Returns null if crypto.subtle is unavailable (e.g. non-secure context) or if hashing fails.
 */
export async function computeSha256(text: string): Promise<string | null> {
  const cryptoApi =
    typeof window !== 'undefined'
      ? window.crypto
      : (globalThis as unknown as { crypto?: Crypto }).crypto;

  if (!cryptoApi || !cryptoApi.subtle) {
    return null;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await cryptoApi.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

/**
 * Computes SHA-256 over normalized exhibit text.
 * UI Label: "SHA-256 of this exhibit's text, computed in your browser"
 * Returns null if crypto.subtle is unavailable so the UI can gracefully omit or show no hash.
 */
export async function computeExhibitHash(exhibit: ExhibitInput): Promise<string | null> {
  const normalized = normalizeExhibitText(exhibit);
  return computeSha256(normalized);
}
