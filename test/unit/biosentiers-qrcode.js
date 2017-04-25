import moment from 'moment';

import bioqr from '../../src/biosentiers-qrcode';

describe('bioqr', () => {
  it('should encode and decode data with format version 1', () => {

    var data = {
      version: 0,
      creatorName: 'Räksmörgås º¬∆',
      excursionId: 'x728s',
      excursionDate: moment().milliseconds(0).toDate(),
      excursionName: 'ジ　エクスクルシオン',
      participantId: 'f8',
      participantName: 'Bob',
      types: [ 'bird', 'flower' ],
      zones: [ 1, 3 ]
    };

    var encoded = bioqr.encode(data);
    expect(encoded).to.be.an('array');
    expect(encoded[0]).to.eql(0);
    expect(encoded).to.have.lengthOf(134);

    var decoded = bioqr.decode(encoded);
    expect(decoded).to.eql(data);
  });
});
