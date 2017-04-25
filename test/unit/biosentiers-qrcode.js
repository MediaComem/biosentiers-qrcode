import moment from 'moment';

import bioqr from '../../src/biosentiers-qrcode';

describe('bioqr', () => {

  var sampleData = {
    version: 1,
    excursion: {
      creatorName: 'Räksmörgås º¬∆',
      id: 'x728s',
      date: moment().milliseconds(0).toDate(),
      name: 'ジ　エクスクルシオン',
      participant: {
        id: 'f8',
        name: 'Bob',
      },
      types: ['bird', 'flower'],
      zones: [1, 3]
    }
  };

  it('should encode and decode data as a byte array with format version 1', () => {

    var encoded = bioqr.encode(sampleData);
    expect(encoded).to.be.an('array');
    expect(encoded[0]).to.eql(1);
    expect(encoded).to.have.lengthOf(134);

    var decoded = bioqr.decode(encoded);
    expect(decoded).to.eql(sampleData);
  });

  it('should encode and decode data as a numeric string with format version 1', () => {

    var encoded = bioqr.encode(sampleData, { format: 'numeric' });
    expect(encoded).to.be.a('string');
    expect(encoded).to.have.lengthOf(321);

    var decoded = bioqr.decode(encoded, { format: 'numeric' });
    expect(decoded).to.eql(sampleData);
  });

  it('should encode and decode data as a string with format version 1', () => {

    var encoded = bioqr.encode(sampleData, { format: 'string' });
    expect(encoded).to.be.a('string');
    expect(encoded[0]).to.eql('\u0001');
    expect(encoded).to.have.lengthOf(134);

    var decoded = bioqr.decode(encoded, { format: 'string' });
    expect(decoded).to.eql(sampleData);
  });
});
