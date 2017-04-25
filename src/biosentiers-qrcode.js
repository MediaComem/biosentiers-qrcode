import { encode as v0Encode, decode as v0Decode } from './formats/v0';

const bioqr = {
  encode: encode,
  decode: decode
};

function encode(data, options) {
  options = options || {};

  let bytes;
  switch (data.version) {
    case 0:
      bytes = v0Encode(data, options);
      break;
    default:
      throw new Error(`Unknown format version ${data.version}`);
  }

  if (options.format == 'string') {
    return convertBytesToString(bytes);
  } else {
    return bytes;
  }
}

function decode(data, options) {

  let bytes;
  if (typeof(data) == 'string') {
    bytes = convertStringToBytes(data);
  } else {
    bytes = data;
  }

  const version = bytes[0];
  switch (version) {
    case 0:
      return v0Decode(bytes, options);
    default:
      throw new Error(`Data is not in a known format version ${version}`);
  }
}

/**
 * Converts a byte array to a string.
 */
function convertBytesToString(bytes) {
  return bytes.map(function(byte) {
    return String.fromCodePoint(ensureByte(byte));
  }).join('');
}

/**
 * Converts a string to a byte array.
 */
function convertStringToBytes(string) {
  return string.split('').map(function(char) {
    return char.charCodeAt(0);
  });
}

export default bioqr;
export { encode, decode };
