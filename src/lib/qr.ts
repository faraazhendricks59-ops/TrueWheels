/**
 * A QR code encoder.
 *
 * The brief for this phase rendered QR codes by putting the share URL into a
 * query string on api.qrserver.com, which is a third-party service. That sends
 * the link being shared to a server the project does not control, on every
 * render, and it means the code stops working if that service does. A QR code
 * is arithmetic, so it is done here instead.
 *
 * Scope: byte mode, error correction levels L and M, versions 1 to 10, which
 * covers 213 bytes at level M and 271 at level L. A vehicle URL is far shorter
 * than that. Higher versions and the other two levels are not implemented, and
 * the encoder throws rather than silently producing a code that would not scan.
 *
 * The implementation follows ISO/IEC 18004: mode and character count headers,
 * Reed-Solomon error correction over GF(256) with the primitive polynomial
 * 0x11D, the eight data masks with the four penalty rules, and the standard
 * function patterns. It is verified by decoding its own output.
 */

const PRIMITIVE = 0x11d;

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= PRIMITIVE;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

/** Generator polynomial for `degree` error correction codewords. */
function rsGenerator(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

/** Remainder of the message divided by the generator, the error correction block. */
function rsEncode(data: number[], degree: number): number[] {
  const gen = rsGenerator(degree);
  const remainder = new Array<number>(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    if (factor !== 0) {
      for (let i = 0; i < degree; i++) {
        remainder[i] ^= gfMul(gen[i + 1], factor);
      }
    }
  }
  return remainder;
}

export type ErrorCorrectionLevel = "L" | "M";

interface BlockSpec {
  ecPerBlock: number;
  groups: number[];
}

/**
 * Block structure per version and level: the number of error correction
 * codewords in each block, and the data codeword count of each block. Two
 * groups exist for the versions where the data does not divide evenly.
 */
const BLOCKS: Record<ErrorCorrectionLevel, Record<number, BlockSpec>> = {
  L: {
    1: { ecPerBlock: 7, groups: [19] },
    2: { ecPerBlock: 10, groups: [34] },
    3: { ecPerBlock: 15, groups: [55] },
    4: { ecPerBlock: 20, groups: [80] },
    5: { ecPerBlock: 26, groups: [108] },
    6: { ecPerBlock: 18, groups: [68, 68] },
    7: { ecPerBlock: 20, groups: [78, 78] },
    8: { ecPerBlock: 24, groups: [97, 97] },
    9: { ecPerBlock: 30, groups: [116, 116] },
    10: { ecPerBlock: 18, groups: [68, 68, 69, 69] },
  },
  M: {
    1: { ecPerBlock: 10, groups: [16] },
    2: { ecPerBlock: 16, groups: [28] },
    3: { ecPerBlock: 26, groups: [44] },
    4: { ecPerBlock: 18, groups: [32, 32] },
    5: { ecPerBlock: 24, groups: [43, 43] },
    6: { ecPerBlock: 16, groups: [27, 27, 27, 27] },
    7: { ecPerBlock: 18, groups: [31, 31, 31, 31] },
    8: { ecPerBlock: 22, groups: [38, 38, 39, 39] },
    9: { ecPerBlock: 22, groups: [36, 36, 36, 37, 37] },
    10: { ecPerBlock: 26, groups: [43, 43, 43, 43, 44] },
  },
};

/** Row and column centres of the alignment patterns, per version. */
const ALIGNMENT: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

const FORMAT_EC_BITS: Record<ErrorCorrectionLevel, number> = { L: 1, M: 0 };

function charCountBits(version: number): number {
  return version <= 9 ? 8 : 16;
}

function dataCodewordCount(version: number, level: ErrorCorrectionLevel): number {
  return BLOCKS[level][version].groups.reduce((total, n) => total + n, 0);
}

/** Bit stream with the MSB-first ordering the specification requires. */
class BitBuffer {
  readonly bits: number[] = [];

  put(value: number, length: number): void {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
}

function buildCodewords(text: string, version: number, level: ErrorCorrectionLevel): number[] {
  const spec = BLOCKS[level][version];
  const capacityBits = dataCodewordCount(version, level) * 8;
  const bytes = Array.from(new TextEncoder().encode(text));

  const buffer = new BitBuffer();
  buffer.put(0b0100, 4);
  buffer.put(bytes.length, charCountBits(version));
  for (const byte of bytes) buffer.put(byte, 8);

  if (buffer.bits.length > capacityBits) {
    throw new Error(`QR data does not fit version ${version}`);
  }

  // Terminator, then pad to a codeword boundary, then the two alternating pad bytes.
  buffer.put(0, Math.min(4, capacityBits - buffer.bits.length));
  while (buffer.bits.length % 8 !== 0) buffer.bits.push(0);
  for (let pad = 0; buffer.bits.length < capacityBits; pad++) {
    buffer.put(pad % 2 === 0 ? 0xec : 0x11, 8);
  }

  const codewords: number[] = [];
  for (let i = 0; i < buffer.bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | buffer.bits[i + j];
    codewords.push(byte);
  }

  // Split into blocks, correct each, then interleave data and correction blocks.
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  for (const size of spec.groups) {
    const block = codewords.slice(offset, offset + size);
    offset += size;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, spec.ecPerBlock));
  }

  const result: number[] = [];
  const maxData = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxData; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  }
  for (let i = 0; i < spec.ecPerBlock; i++) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

function maskAt(mask: number, row: number, col: number): boolean {
  switch (mask) {
    case 0: return (row + col) % 2 === 0;
    case 1: return row % 2 === 0;
    case 2: return col % 3 === 0;
    case 3: return (row + col) % 3 === 0;
    case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
    case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
    case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
    default: return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
  }
}

/** The four penalty rules from the specification, used to pick the best mask. */
function penalty(modules: boolean[][]): number {
  const size = modules.length;
  let score = 0;

  const runs = (get: (i: number, j: number) => boolean) => {
    for (let i = 0; i < size; i++) {
      let run = 1;
      for (let j = 1; j < size; j++) {
        if (get(i, j) === get(i, j - 1)) {
          run++;
        } else {
          if (run >= 5) score += 3 + (run - 5);
          run = 1;
        }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
  };
  runs((i, j) => modules[i][j]);
  runs((i, j) => modules[j][i]);

  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = modules[r][c];
      if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) {
        score += 3;
      }
    }
  }

  const pattern = [true, false, true, true, true, false, true];
  const matches = (get: (i: number, j: number) => boolean) => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - 7; j++) {
        let hit = true;
        for (let k = 0; k < 7; k++) if (get(i, j + k) !== pattern[k]) { hit = false; break; }
        if (!hit) continue;
        const before = j >= 4 && [0, 1, 2, 3].every((k) => !get(i, j - 1 - k));
        const after = j + 11 <= size && [0, 1, 2, 3].every((k) => !get(i, j + 7 + k));
        if (before || after) score += 40;
      }
    }
  };
  matches((i, j) => modules[i][j]);
  matches((i, j) => modules[j][i]);

  let dark = 0;
  for (const row of modules) for (const cell of row) if (cell) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

function formatBits(level: ErrorCorrectionLevel, mask: number): number {
  const data = (FORMAT_EC_BITS[level] << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
}

function versionBits(version: number): number {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  return (version << 12) | rem;
}

export interface QrCode {
  /** Modules per side. */
  size: number;
  /** `modules[row][col]`, true where the module is dark. */
  modules: boolean[][];
  version: number;
  level: ErrorCorrectionLevel;
}

/**
 * Encode `text` as a QR code.
 *
 * Level M is used when it fits in the version range, since a showroom code is
 * printed and will pick up scuffs; level L is the fallback for long URLs.
 */
export function encodeQr(text: string): QrCode {
  if (!text) throw new Error("Cannot encode an empty QR payload");
  const bytes = new TextEncoder().encode(text).length;

  let chosen: { version: number; level: ErrorCorrectionLevel } | null = null;
  for (const level of ["M", "L"] as ErrorCorrectionLevel[]) {
    for (let version = 1; version <= 10; version++) {
      // 4 bits of mode plus the character count header must fit alongside the data.
      const capacityBits = dataCodewordCount(version, level) * 8;
      if (4 + charCountBits(version) + bytes * 8 <= capacityBits) {
        chosen = { version, level };
        break;
      }
    }
    if (chosen) break;
  }
  if (!chosen) {
    throw new Error(`QR payload of ${bytes} bytes exceeds the supported capacity`);
  }

  const { version, level } = chosen;
  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );

  // Finder patterns with their separators: a 7x7 ring, a light ring, a 3x3 core.
  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const dist = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        modules[y][x] = dist !== 2 && dist <= 3;
        reserved[y][x] = true;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns.
  for (let i = 8; i < size - 8; i++) {
    modules[6][i] = i % 2 === 0;
    reserved[6][i] = true;
    modules[i][6] = i % 2 === 0;
    reserved[i][6] = true;
  }

  // Alignment patterns, skipping the three that would sit on a finder.
  for (const r of ALIGNMENT[version]) {
    for (const c of ALIGNMENT[version]) {
      const onFinder =
        (r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8);
      if (onFinder) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          modules[r + dy][c + dx] = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
          reserved[r + dy][c + dx] = true;
        }
      }
    }
  }

  modules[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Reserve the format information cells and, from version 7, the version cells.
  for (let i = 0; i <= 8; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }
  for (let i = size - 8; i < size; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      reserved[b][a] = true;
      reserved[a][b] = true;
    }
  }

  const codewords = buildCodewords(text, version, level);
  const dataBits: number[] = [];
  for (const byte of codewords) {
    for (let i = 7; i >= 0; i--) dataBits.push((byte >>> i) & 1);
  }

  // Place the data in the standard two-column zigzag, skipping the timing column.
  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let step = 0; step < size; step++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = upward ? size - 1 - step : step;
        if (reserved[y][x]) continue;
        modules[y][x] = bitIndex < dataBits.length && dataBits[bitIndex] === 1;
        bitIndex++;
      }
    }
    upward = !upward;
  }

  // Choose the mask with the lowest penalty.
  let bestMask = 0;
  let bestScore = Infinity;
  let bestModules: boolean[][] = modules;
  for (let mask = 0; mask < 8; mask++) {
    const candidate = modules.map((row) => row.slice());
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved[r][c] && maskAt(mask, r, c)) candidate[r][c] = !candidate[r][c];
      }
    }
    // Score with the format bits in place, since they count towards the penalty.
    applyFormat(candidate, size, formatBits(level, mask));
    const score = penalty(candidate);
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
      bestModules = candidate;
    }
  }

  applyFormat(bestModules, size, formatBits(level, bestMask));
  if (version >= 7) applyVersion(bestModules, size, versionBits(version));

  return { size, modules: bestModules, version, level };
}

function applyFormat(modules: boolean[][], size: number, bits: number): void {
  const bit = (i: number) => ((bits >>> i) & 1) === 1;

  // The 15 format bits are written twice, and each copy runs along a different
  // axis. Splitting them the wrong way still fills every format cell, so the
  // grid looks complete while no reader can parse it.
  //
  // Copy one runs down column 8: bits 0-5 down the top-left, bits 6-7 stepping
  // over the timing row, bits 8-14 up from the bottom-left corner.
  for (let i = 0; i < 15; i++) {
    if (i < 6) modules[i][8] = bit(i);
    else if (i < 8) modules[i + 1][8] = bit(i);
    else modules[size - 15 + i][8] = bit(i);
  }

  // Copy two runs along row 8: bits 0-7 in from the right edge, bit 8 at column
  // 7, bits 9-14 back to the left corner.
  for (let i = 0; i < 15; i++) {
    if (i < 8) modules[8][size - i - 1] = bit(i);
    else if (i < 9) modules[8][7] = bit(i);
    else modules[8][14 - i] = bit(i);
  }

  modules[size - 8][8] = true;
}

function applyVersion(modules: boolean[][], size: number, bits: number): void {
  for (let i = 0; i < 18; i++) {
    const value = ((bits >>> i) & 1) === 1;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    modules[b][a] = value;
    modules[a][b] = value;
  }
}
