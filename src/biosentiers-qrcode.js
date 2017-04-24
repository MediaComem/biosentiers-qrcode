import { encode as v0Encode, decode as v0Decode } from './formats/v0';

const bioqr = {
  encode: encode,
  decode: decode
};

function encode(data, options) {
  switch (data.version) {
    case 0:
      return v0Encode(data, options);
    default:
      throw new Error(`Unknown format version ${data.version}`);
  }
}

function decode(string, options) {
  const version = string.charCodeAt(0);
  switch (version) {
    case 0:
      return v0Decode(string, options);
    default:
      throw new Error(`String is not in a known format version ${version}`);
  }
}

export default bioqr;
export { encode, decode };
