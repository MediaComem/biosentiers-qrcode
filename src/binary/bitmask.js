/**
 * Fills a byte array with a 1-byte bitmask that can be used to serialize up to 8 boolean flags.
 *
 * If no references are given, values must be numbers from 0 to 7.
 * For example, the values [ 1, 3 ] would be encoded as the integer 10 (or 00001010 in binary).
 *
 * If references are given, then each value must be one of the reference values.
 * The references array must not contain more than 32 items.
 * For example, the values [ 'foo', 'baz' ] with references [ 'foo', 'bar', 'baz' ]
 * would be encoded as the integer 5 (or 00000101 in binary).
 */
export function encode(bytes, offset, values, references) {
  let byte = 0;

  values.forEach(function(value, i) {

    let bitmaskIndex = value;

    // If references are given, convert the value to its index in the reference array
    if (references) {
      bitmaskIndex = references.indexOf(value);
      if (bitmaskIndex < 0) {
        throw new Error(`Unknown bitmask value ${value} (allowed: ${references.join(', ')})`);
      } else if (bitmaskIndex > 7) {
        throw new Error(`References have too many values (${references.length} > 32)`);
      }
    } else if (!Number.isInteger(bitmaskIndex) || bitmaskIndex < 0 || bitmaskIndex > 31) {
      throw new Error(`Bitmask value ${i} must be an integer between 0 and 31 or one of the reference values (got ${bitmaskIndex})`);
    }

    // Set the correct bit to 1 in the bitmask
    byte = byte | (1 << bitmaskIndex);
  });

  // Add the byte to the array
  bytes[offset] = byte;
}

/**
 * Decodes up to 8 boolean flags from a 1-byte bitmask at the specified position in a byte array.
 *
 * If no references are given, the indices of the active flags are returned, e.g. [ 1, 3 ].
 *
 * If references are given, the indices are converted to the correspond reference values,
 * e.g. [ 'foo', 'baz' ] if the decoded flags are [ 0, 2 ] and the references are [ 'foo', 'bar', 'baz' ].
 */
export function decode(bytes, offset, references) {

  const values = [];
  const byte = bytes[offset];

  // Iterate over the 8 bits
  for (let i = 0; i < 8; i++) {
    // Check whether the bit at the current position is 1
    const mask = 1 << i;
    if ((byte & mask) > 0) {
      // Add the index (or reference value) to the result array if that is the case
      if (!references) {
        values.push(i);
      } else if (references[i]) {
        values.push(references[i]);
      }
    }
  }

  return values;
}
