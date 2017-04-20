import { encode as encodeBitmask, decode as decodeBitmask } from '../binary/bitmask';
import { encode as encodeTimestamp, decode as decodeTimestamp } from '../binary/timestamp';
import { encode as encodeUint, decode as decodeUint } from '../binary/uint';
import { encode as encodeUtf8String, decode as decodeUtf8String } from '../binary/utf8-string';
import Encoder from '../binary/encoder';
import Decoder from '../binary/decoder';

const FORMAT_VERSION = 0;
const FORMAT_LENGTH = 134;
const CREATOR_NAME_LENGTH = 40;
const EXCURSION_ID_LENGTH = 5;
const EXCURSION_NAME_LENGTH = 60;
const PARTICIPANT_ID_LENGTH = 2;
const PARTICIPANT_NAME_LENGTH = 20;
const TYPES = [ 'bird', 'butterfly', 'flower', 'tree'  ];

export function encode(data, options) {
  options = options || {};

  var encoder = new Encoder();
  encoder.add(encodeUint, FORMAT_VERSION, 1);
  encoder.add(encodeUtf8String, data.creatorName, CREATOR_NAME_LENGTH);
  encoder.add(encodeUtf8String, data.excursionId, EXCURSION_ID_LENGTH);
  encoder.add(encodeTimestamp, data.excursionDate);
  encoder.add(encodeUtf8String, data.excursionName, EXCURSION_NAME_LENGTH);
  encoder.add(encodeUtf8String, data.participantId, PARTICIPANT_ID_LENGTH);
  encoder.add(encodeUtf8String, data.participantName, PARTICIPANT_NAME_LENGTH);
  encoder.add(encodeBitmask, data.types, options.types || TYPES);
  encoder.add(encodeBitmask, data.zones);

  if (encoder.bytes.length != FORMAT_LENGTH) {
    throw new Error(`Format 0 byte length should be 134 (got ${encoder.bytes.length})`);
  }

  return encoder.toString();
}

export function decode(string, options) {
  options = options || {};

  const decoder = new Decoder(string);
  if (decoder.bytes.length != FORMAT_LENGTH) {
    throw new Error(`Format 0 byte length should be 134 (got ${decoder.bytes.length})`);
  }

  const decoded = {};
  decoded.version = decoder.get(decodeUint, 1);
  decoded.creatorName = decoder.get(decodeUtf8String, CREATOR_NAME_LENGTH);
  decoded.excursionId = decoder.get(decodeUtf8String, EXCURSION_ID_LENGTH);
  decoded.excursionDate = decoder.get(decodeTimestamp, 4);
  decoded.excursionName = decoder.get(decodeUtf8String, EXCURSION_NAME_LENGTH);
  decoded.participantId = decoder.get(decodeUtf8String, PARTICIPANT_ID_LENGTH);
  decoded.participantName = decoder.get(decodeUtf8String, PARTICIPANT_NAME_LENGTH);
  decoded.types = decoder.get(decodeBitmask, TYPES);
  decoded.zones = decoder.get(decodeBitmask);

  return decoded;
}
