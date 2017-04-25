import { ensureByte } from '../binary/byte';

/**
 * Utility class to progressively build a byte array and keep track of the current offset.
 */
export default class Encoder {

  /**
   * Constructs an encoder with an empty byte array.
   */
  constructor() {
    this.bytes = [];
    this.offset = 0;
  }

  /**
   * Calls the specified encoding function with this encoder's internal byte array, the
   * current offset and the specified extra arguments. It's the responsibility of the
   * encoding function to add more bytes to the array starting at the specified offset.
   *
   * The encoder will automatically increment its current offset by the number of new bytes
   * added to the array, so subsequent calls will invoke encoding functions with greater offsets.
   */
  add(encodeFunc, ...args) {

    const currentLength = this.bytes.length;
    args.unshift(this.bytes, this.offset);

    var result = encodeFunc.apply(undefined, args);
    this.offset += (this.bytes.length - currentLength);

    return result;
  }
}
