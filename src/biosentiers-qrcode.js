import { encode as v1Encode, decode as v1Decode } from './formats/v0';

const bioqr = {
  encode: encode,
  decode: decode
};

function encode(data, options) {
  switch (data.version) {
    case 0:
      return v1Encode(data, options);
    default:
      throw new Error(`Unknown format version ${data.version}`);
  }
}

function decode(string, options) {
  const version = string.charCodeAt(0);
  switch (version) {
    case 0:
      return v1Decode(string, options);
    default:
      throw new Error(`String is not in a known format version ${version}`);
  }
}

export default bioqr;
export { encode, decode };
