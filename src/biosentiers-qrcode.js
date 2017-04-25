import BigNumber from '../node_modules/bignumber.js/bignumber';
import { encode as v1Encode, decode as v1Decode } from './formats/v1';
import { ensureByte } from './binary/byte';

const bioqr = {
  encode: encode,
  decode: decode
};

function encode(data, options) {
  options = options || {};

  let bytes;
  switch (data.version) {
    case 1:
      bytes = v1Encode(data, options);
      break;
    default:
      throw new Error(`Unknown format version ${data.version}`);
  }

  if (options.format == 'numeric') {
    return convertBytesToNumeric(bytes);
  } else if (options.format == 'string') {
    return convertBytesToString(bytes);
  } else {
    return bytes;
  }
}

function decode(data, options) {
  options = options || {};

  let bytes;
  if (options.format == 'numeric') {
    bytes = convertNumericToBytes(data);
  } else if (options.format == 'string' || typeof(data) == 'string') {
    bytes = convertStringToBytes(data);
  } else {
    bytes = data;
  }

  const version = bytes[0];
  switch (version) {
    case 1:
      return v1Decode(bytes, options);
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

function convertBytesToNumeric(bytes) {

  let string = '';
  bytes.forEach(function(byte) {
    var bitsString = byte.toString(2);
    string += '00000000'.substring(bitsString.length) + bitsString;
  });

  return new BigNumber(string, 2).toString(10);
}

function convertNumericToBytes(number) {

  const bytes = [];

  const bitsString = new BigNumber(number, 10).toString(2);
  for (var i = bitsString.length; i > 0; i -= 8) {
    if (i >= 8) {
      bytes.unshift(parseInt(bitsString.slice(i - 8, i), 2));
    } else {
      bytes.unshift(parseInt(bitsString.slice(0, i), 2));
    }
  }

  return bytes;
}

export default bioqr;
export { encode, decode };
