import { encode as encodeBitmask, decode as decodeBitmask } from '../binary/bitmask';
import { encode as encodeTimestamp, decode as decodeTimestamp } from '../binary/timestamp';
import { encode as encodeUint, decode as decodeUint } from '../binary/uint';
import { encode as encodeUtf8String, decode as decodeUtf8String } from '../binary/utf8-string';
import Encoder from '../binary/encoder';
import Decoder from '../binary/decoder';

const FORMAT_VERSION = 1;
const FORMAT_LENGTH = 134;
const CREATOR_NAME_LENGTH = 40;
const EXCURSION_ID_LENGTH = 5;
const EXCURSION_NAME_LENGTH = 60;
const PARTICIPANT_ID_LENGTH = 2;
const PARTICIPANT_NAME_LENGTH = 20;
const THEMES = [ 'bird', 'butterfly', 'flower', 'tree'  ];

export function encode(data, options) {
  options = options || {};

  var encoder = new Encoder();
  encoder.add(encodeUint, FORMAT_VERSION, 1);
  encoder.add(encodeUtf8String, data.excursion.creatorName, CREATOR_NAME_LENGTH);
  encoder.add(encodeUtf8String, data.excursion.id, EXCURSION_ID_LENGTH);
  encoder.add(encodeTimestamp, data.excursion.date);
  encoder.add(encodeUtf8String, data.excursion.name, EXCURSION_NAME_LENGTH);
  encoder.add(encodeUtf8String, data.excursion.participant.id, PARTICIPANT_ID_LENGTH);
  encoder.add(encodeUtf8String, data.excursion.participant.name, PARTICIPANT_NAME_LENGTH);
  encoder.add(encodeBitmask, data.excursion.themes, options.themes || THEMES);
  encoder.add(encodeBitmask, data.excursion.zones, options.zones);

  if (encoder.bytes.length != FORMAT_LENGTH) {
    throw new Error(`Format 0 byte length should be 134 (got ${encoder.bytes.length})`);
  }

  return encoder.bytes;
}

export function decode(string, options) {
  options = options || {};

  const decoder = new Decoder(string);
  if (decoder.bytes.length != FORMAT_LENGTH) {
    throw new Error(`Format 0 byte length should be 134 (got ${decoder.bytes.length})`);
  }

  return {
    version: decoder.get(decodeUint, 1),
    excursion: {
      creatorName: decoder.get(decodeUtf8String, CREATOR_NAME_LENGTH),
      id: decoder.get(decodeUtf8String, EXCURSION_ID_LENGTH),
      date: decoder.get(decodeTimestamp, 4),
      name: decoder.get(decodeUtf8String, EXCURSION_NAME_LENGTH),
      participant: {
        id: decoder.get(decodeUtf8String, PARTICIPANT_ID_LENGTH),
        name: decoder.get(decodeUtf8String, PARTICIPANT_NAME_LENGTH)
      },
      themes: decoder.get(decodeBitmask, options.themes || THEMES),
      zones: decoder.get(decodeBitmask, options.zones)
    }
  };
}
