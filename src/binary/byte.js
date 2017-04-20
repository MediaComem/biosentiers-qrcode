/**
 * Returns the specified value unchanged, but throws an error if it is not an integer between 0 and 255.
 */
export function ensureByte(byte) {
  if (!Number.isInteger(byte)) {
    throw new Error(`Byte is not an integer (${byte})`);
  } else if (byte < 0) {
    throw new Error(`Byte is too small (${byte} < 0)`)
  } else if (byte > 255) {
    throw new Error(`Byte is too large (${byte} > 255)`);
  }

  return byte;
}
