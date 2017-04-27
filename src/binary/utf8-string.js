/**
 * Fills a byte array with the UTF-8 bytes of the specified string.
 *
 * If the string is longer than the specified length (in bytes), extra bytes are not serialized.
 * Extra spaces at the end of the string will be lost when decoding, as spaces are used for padding.
 */
export function encode(bytes, offset, string, length) {

  let currentByte = offset;
  const stringLength = string ? string.length : 0;

  // For each character in the string...
  for (let i = 0; i < stringLength; i++) {

    const char = string[i];

    // Convert the character to an array of UTF-8 bytes (1 to 4 bytes per character)
    const utf8Bytes = stringToUtf8Bytes(char);

    // Stop here if there are too many bytes (the rest of the string is ignored)
    if (currentByte + utf8Bytes.length > offset + length) {
      break;
    }

    // Add the character's UTF-8 bytes to the byte array
    for (let j = 0; j < utf8Bytes.length; j++) {
      bytes[currentByte + j] = utf8Bytes[j];
    }

    currentByte += utf8Bytes.length;
  }

  // If the string is not long enough to fill the expected length, pad it with spaces
  const remainingBytes = offset + length - currentByte;
  for (let i = 0; i < remainingBytes; i++) {
    bytes.push(0x20); // space
  }
}

/**
 * Decodes a string from the UTF-8 bytes in the specified portion of a byte array.
 */
export function decode(bytes, offset, length) {

  const stringBytes = bytes.slice(offset, offset + length);
  const rawString = stringBytes.map(function(byte) {
    return String.fromCodePoint(byte);
  }).join('');

  return decodeURIComponent(escape(rawString)).trim();
}

/**
 * Convers a string to an array containing all its character's UTF-8 bytes (1 to 4 bytes per character).
 */
function stringToUtf8Bytes(string) {
  return unescape(encodeURIComponent(string)).split('').map(function(char) {
    return char.charCodeAt(0);
  });
}
