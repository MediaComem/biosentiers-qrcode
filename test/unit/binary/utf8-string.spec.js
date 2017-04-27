import { encode, decode } from '../../../src/binary/utf8-string';

describe('bitmask', () => {
  describe('encoding', () => {
    let bytes;
    beforeEach(() => {
      bytes = [];
    });

    it('should encode a string', () => {
      encode(bytes, 0, 'foo', 3);
      expectBytes(0x66, 0x6F, 0x6F);
    });

    it('should encode a string with 2-byte UTF-8 characters', () => {
      encode(bytes, 0, 'aéàè', 7);
      expectBytes(0x61, 0xC3, 0xA9, 0xC3, 0xA0, 0xC3, 0xA8)
    });

    it('should encode a string with 3-byte UTF-8 characters', () => {
      encode(bytes, 0, '∂∆cd', 8);
      expectBytes(0xE2, 0x88, 0x82, 0xE2, 0x88, 0x86, 0x63, 0x64);
    });

    it('should encode a string with 4-byte UTF-8 character', () => {
      encode(bytes, 0, '\u2106F \u21075 \u21076', 14);
      expectBytes(0xE2, 0x84, 0x86, 0x46, 0x20, 0xE2, 0x84, 0x87, 0x35, 0x20, 0xE2, 0x84, 0x87, 0x36);
    });

    it('should encode a string with characters of various byte sizes', () => {
      encode(bytes, 0, 'aé∆\u2106F', 10);
      expectBytes(0x61, 0xC3, 0xA9, 0xE2, 0x88, 0x86, 0xE2, 0x84, 0x86, 0x46);
    });

    it('should pad a string that is too short with spaces', () => {
      encode(bytes, 0, 'a é', 7);
      expectBytes(0x61, 0x20, 0xC3, 0xA9, 0x20, 0x20, 0x20);
    });

    it('should truncate a string that is too long', () => {
      encode(bytes, 0, 'foo bar baz', 5);
      expectBytes(0x66, 0x6F, 0x6F, 0x20, 0x62);
    });

    it('should not include an incomplete multi-byte UTF-8 character', () => {
      encode(bytes, 0, 'a \u2106F', 4);
      expectBytes(0x61, 0x20, 0x20, 0x20);
    });

    it('should encode an empty string', () => {
      encode(bytes, 0, '', 5);
      expectBytes(0x20, 0x20, 0x20, 0x20, 0x20);
    });

    it('should encode an undefined string', () => {
      encode(bytes, 0, undefined, 3);
      expectBytes(0x20, 0x20, 0x20);
    });

    function expectBytes(...expectedBytes) {
      expect(bytes.slice(0, bytes.length)).to.eql(expectedBytes);
    }
  });

  describe('decoding', () => {
    it('should decode a string', () => {
      const decoded = decodeString(3, 0x66, 0x6F, 0x6F);
      expect(decoded).to.eql('foo');
    });

    it('should decode a string with 2-byte UTF-8 characters', () => {
      const decoded = decodeString(7, 0x61, 0xC3, 0xA9, 0xC3, 0xA0, 0xC3, 0xA8);
      expect(decoded).to.eql('aéàè')
    });

    it('should decode a string with 3-byte UTF-8 characters', () => {
      const decoded = decodeString(8, 0xE2, 0x88, 0x82, 0xE2, 0x88, 0x86, 0x63, 0x64);
      expect(decoded).to.eql('∂∆cd');
    });

    it('should decode a string with 4-byte UTF-8 character', () => {
      const decoded = decodeString(14, 0xE2, 0x84, 0x86, 0x46, 0x20, 0xE2, 0x84, 0x87, 0x35, 0x20, 0xE2, 0x84, 0x87, 0x36);
      expect(decoded).to.eql('\u2106F \u21075 \u21076');
    });

    it('should decode a string with characters of various byte sizes', () => {
      const decoded = decodeString(10, 0x61, 0xC3, 0xA9, 0xE2, 0x88, 0x86, 0xE2, 0x84, 0x86, 0x46);
      expect(decoded).to.eql('aé∆\u2106F');
    });

    it('should decode a string with padding', () => {
      const decoded = decodeString(7, 0x61, 0x20, 0xC3, 0xA9, 0x20, 0x20, 0x20);
      expect(decoded).to.eql('a é');
    });

    it('should decode an empty string', () => {
      const decoded = decodeString(5, 0x20, 0x20, 0x20, 0x20, 0x20);
      expect(decoded).to.eql('');
    });

    function decodeString(length, ...bytes) {
      return decode(bytes, 0, length);
    }
  });
});
