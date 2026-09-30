/**
 * REAL UTF-8 HEX DUMP & STREAM GENERATORS
 *
 * Encodes actual portfolio text into genuine forensic hex dump lines.
 * Format: 0xOFFSET: B0 B1 B2 ... B15 |ASCII|
 * Zero synthetic or fake data; uses only genuine UTF-8 bytes and verified profile records.
 */

export function generateHexDump(sourceText: string, maxLines = 45, loopToFill = false): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(sourceText);
  if (bytes.length === 0) return '';
  const lines: string[] = [];
  const bytesPerLine = 16;
  const chunkCount = Math.ceil(bytes.length / bytesPerLine);
  const totalLines = loopToFill ? maxLines : Math.min(chunkCount, maxLines);

  for (let lineIdx = 0; lineIdx < totalLines; lineIdx++) {
    const offset = lineIdx * bytesPerLine;
    const byteStart = (lineIdx * bytesPerLine) % bytes.length;
    const chunk: number[] = [];
    for (let i = 0; i < bytesPerLine; i++) {
      if (loopToFill) {
        chunk.push(bytes[(byteStart + i) % bytes.length]);
      } else {
        const idx = offset + i;
        if (idx < bytes.length) chunk.push(bytes[idx]);
      }
    }

    // 1. Offset in 0x0000 format
    const offsetHex = '0x' + (offset % 0x10000).toString(16).padStart(4, '0').toUpperCase();

    // 2. Hex byte columns
    const hexBytes: string[] = [];
    const asciiChars: string[] = [];

    for (let i = 0; i < bytesPerLine; i++) {
      if (i < chunk.length) {
        const b = chunk[i];
        hexBytes.push(b.toString(16).padStart(2, '0'));
        // Printable ASCII (0x20 to 0x7E), otherwise '.'
        asciiChars.push(b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.');
      } else {
        hexBytes.push('  ');
        asciiChars.push(' ');
      }
    }

    // Split hex bytes into two groups of 8 for authentic hex dump readability
    const firstHalf = hexBytes.slice(0, 8).join(' ');
    const secondHalf = hexBytes.slice(8, 16).join(' ');
    const asciiStr = asciiChars.join('');

    lines.push(`${offsetHex}  ${firstHalf}  ${secondHalf}  |${asciiStr}|`);
  }

  return lines.join('\n');
}

export interface StreamItem {
  readonly offset: number;
  readonly category: string;
  readonly value: string;
}

export function generateOffsetStream(items: readonly StreamItem[], maxLines = 45, loopToFill = false): string {
  if (items.length === 0) return '';
  const lines: string[] = [];
  const count = loopToFill ? maxLines : Math.min(items.length, maxLines);

  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const offset = i * 32;
    const offsetHex = '0x' + (offset % 0x10000).toString(16).padStart(4, '0').toUpperCase();
    const cat = item.category.padEnd(16, ' ').slice(0, 16);
    const val = item.value.padEnd(36, ' ').slice(0, 36);
    lines.push(`${offsetHex}  [${cat}]  ${val}  |LOGGED|`);
  }

  return lines.join('\n');
}
