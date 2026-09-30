/**
 * REAL UTF-8 HEX DUMP GENERATOR
 *
 * Encodes actual portfolio text into genuine forensic hex dump lines.
 * Format: 0xOFFSET: B0 B1 B2 ... B15 |ASCII|
 * Zero synthetic or fake data; uses only genuine UTF-8 bytes.
 */

export function generateHexDump(sourceText: string, maxLines = 60): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(sourceText);
  const lines: string[] = [];
  const bytesPerLine = 16;
  const totalLines = Math.min(Math.ceil(bytes.length / bytesPerLine), maxLines);

  for (let lineIdx = 0; lineIdx < totalLines; lineIdx++) {
    const offset = lineIdx * bytesPerLine;
    const chunk = bytes.slice(offset, offset + bytesPerLine);

    // 1. Offset in 0x0000 format
    const offsetHex = '0x' + offset.toString(16).padStart(4, '0').toUpperCase();

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
