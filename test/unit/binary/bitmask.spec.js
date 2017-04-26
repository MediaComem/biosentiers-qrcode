import { encode, decode } from '../../../src/binary/bitmask';

describe('bitmask', () => {
  describe('encoding', () => {
    let bytes;
    beforeEach(() => {
      bytes = [];
    });

    it('should encode an empty bitmask', () => {
      encode(bytes, 0, []);
      expectBitmask(0);
    })

    it('should encode a bitmask from raw indices', () => {
      encode(bytes, 0, [ 0, 4, 7 ]);
      expectBitmask(145);
    });

    it('should encode a bitmask from references values', () => {
      encode(bytes, 0, [ 'foo', 'baz' ], [ 'foo', 'bar', 'baz', 'qux' ]);
      expectBitmask(5);
    });

    it('should encode a bitmask with a custom function', () => {
      encode(bytes, 0, [ '12', '12345' ], (string) => string.length);
      expectBitmask(36);
    });

    function expectBitmask(value) {
      expect(bytes).to.have.lengthOf(1);
      expect(bytes[0]).to.eql(value);
    }
  });

  describe('decoding', () => {
    it('should decode an empty bitmask', () => {
      const decoded = decodeBitmask(0);
      expect(decoded).to.eql([]);
    });

    it('should decode a bitmask as raw indices', () => {
      const decoded = decodeBitmask(7);
      expect(decoded).to.eql([ 0, 1, 2 ]);
    });

    it('should decode a bitmask with reference values', () => {
      const decoded = decodeBitmask(10, [ 'foo', 'bar', 'baz', 'qux' ]);
      expect(decoded).to.eql([ 'bar', 'qux' ]);
    });

    it('should decode a bitmask with a custom function', () => {
      const decoded = decodeBitmask(255, (i) => i * 3 + 42);
      expect(decoded).to.eql([ 42, 45, 48, 51, 54, 57, 60, 63 ]);
    });

    function decodeBitmask(value, references) {
      return decode([ value ], 0, references);
    }
  });
});
