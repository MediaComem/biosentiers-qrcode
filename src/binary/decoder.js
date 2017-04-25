import { ensureByte } from '../binary/byte';

/**
 * Utility class to progressively decode a byte array and keep track of the current offset.
 */
export default class Decoder {

  /**
   * Constructs a decoder for the specified byte array.
   *
   * A string can also be given in place of the byte array.
   * It should contain only characters that can be represented with 1 byte in UTF-8.
   */
  constructor(bytes) {
    this.offset = 0;
    this.bytes = bytes;
  }

  /**
   * Calls the specified decoding function with this decoder's internal byte array, the
   * current offset and the specified extra arguments, and returns the result. It's the
   * responsibility of the decoding function to extract the relevant bytes from the array,
   * starting at the specified offset.
   *
   * If the last argument passed to the decoding function is a positive integer, the
   * decoder will interpret it as the number of bytes that have been decoded and increment
   * the current offset by that value. Otherwise, it will assume that only 1 byte has been
   * decoded. Add an extra number argument if that is not the case.
   */
  get(decodeFunc, ...args) {

    const lastArg = args.length >= 1 ? args[args.length - 1] : undefined;

    args.unshift(this.bytes, this.offset);

    var result = decodeFunc.apply(undefined, args);

    if (Number.isInteger(lastArg) && lastArg >= 1) {
      this.offset += lastArg;
    } else {
      this.offset++;
    }

    return result;
  }
}
