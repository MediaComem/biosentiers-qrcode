import { encode as encodeUint, decode as decodeUint } from '../binary/uint';

/**
 * Fills a byte array with a 4-byte integer representing the specified date in minutes.
 * Seconds and milliseconds are lost in the conversion.
 */
export function encode(bytes, offset, dateOrTimestamp) {

  const timestamp = typeof(dateOrTimestamp.getTime) == 'function' ? dateOrTimestamp.getTime() : dateOrTimestamp;
  if (!Number.isInteger(timestamp)) {
    throw new Error(`Timestamp must be an integer or a date (got a value of type ${typeof(timestamp)})`)
  } else if (timestamp < 0) {
    throw new Error(`Timestamp must be positive (got ${timestamp})`);
  }

  const minutes = Math.floor(timestamp / 60000);
  return encodeUint(bytes, offset, minutes, 4);
}

/**
 * Decodes a date from a 4-byte number of minutes at the specified position in a byte array.
 */
export function decode(bytes, offset) {
  const minutes = decodeUint(bytes, offset, 4);
  return new Date(minutes * 60000);
}
