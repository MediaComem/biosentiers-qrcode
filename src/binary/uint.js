/**
 * Fills a byte array with the specified integer's bytes (in big endian order).
 *
 * Unsigned integers may only be serialized up to a precision of 6 bytes
 * (JavaScript numbers are doubles with a significand of 52 bits).
 */
export function encode(bytes, offset, number, byteSize) {
  if (!Number.isInteger(number)) {
    throw new Error(`Number must be an integer`);
  } else if (number < 0) {
    throw new Error(`Unsigned integer cannot be smaller than zero (got ${number})`);
  } else if (byteSize < 1) {
    throw new Error(`Unsigned integer cannot be encoded with less than one byte`);
  } else if (byteSize > 6) {
    throw new Error(`Unsigned integer cannot be encoded with more than seven bytes`);
  }

  // Ensure the number is not larger than the maximum allowed by the specified byte size
  const bits = byteSize * 8;
  const max = Math.pow(2, bits) - 1;
  if (number > max) {
    throw new Error(`Unsigned ${byteSize} bytes integer cannot be greater than ${max} (got ${number})`);
  }

  // Add the specified number of bytes
  const bound = offset + byteSize;
  for (let i = offset; i < bound; i++) {
    // For each byte, right-shift the number by the correct amount
    // and take the last 8 bits (with & 0xFF) to obtain the byte to store at that position
    // (e.g. for a 4 bytes integer, the first byte is right-shifted by 24,
    // the second by 16, the third by 8 and the fourth by 0)
    const bitShift = (bound - i - 1) * 8;
    bytes[i] = 0xFF & (number >> bitShift);
  }
}

/**
 * Decodes an unsigned integer's bytes from the specified portion of a byte array (in big endian order).
 */
export function decode(bytes, offset, byteSize) {
  if (byteSize < 1 || byteSize > 6) {
    throw new Error(`Unsigned integer byte size must be between 1 and 6 (got ${byteSize})`);
  }

  let number = 0;
  const bound = offset + byteSize;

  // Iterate byte by byte over the specified range (from offset to offset + byteSize)
  for (let i = offset; i < bound; i++) {
    // Shift each byte's bits by the correct amount
    // and add them to the result number
    // (e.g. for a 4 bytes integer, the first byte is left-shifted by 24,
    // the second by 16, the third by 8 and the fourth by 0)
    const bitShift = (bound - i - 1) * 8;
    number = number | (bytes[i] << bitShift);
  }

  return number;
}
