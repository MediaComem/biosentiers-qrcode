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
    });

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

    it('should not encode a bitmask with out-of-bounds indices', () => {
      expect(() => {
        encode(bytes, 0, [ 3, 8 ]);
      }).to.throw('Bitmask value 1 must be an integer between 0 and 7 or one of the reference values (got 8)');
    });

    it('should not encode a bitmask with unknown values', () => {
      expect(() => {
        encode(bytes, 0, [ 'foo', 'bar' ], [ 'bar', 'baz', 'qux' ]);
      }).to.throw('Unknown bitmask value foo (allowed: bar, baz, qux)');
    });

    it('should not encode a bitmask with out-of-bounds reference values', () => {
      expect(() => {
        encode(bytes, 0, [ 'foo2', 'foo9' ], [ 'foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7', 'foo8', 'foo9' ]);
      }).to.throw('References have too many values (9 > 8)');
    });

    it('should not encode a bitmask with a custom function returning invalid indices', () => {
      expect(() => {
        encode(bytes, 0, [ 'foo', 'bar' ], () => 42);
      }).to.throw('Bitmask value 0 must be an integer between 0 and 7 or one of the reference values (got 42)');
    });

    it('should not accept a references object of the wrong type', () => {
      expect(() => {
        encode(bytes, 0, [ 'foo', 'bar' ], { foo: 'bar' });
      }).to.throw('Unsupported references that is not an array or function (got a value of type object)');
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
