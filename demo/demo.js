//var decoded = bioqr.decode(data);
//console.log(JSON.stringify(decoded, undefined, 2));

$(function() {

  var sample = {
    version: 1,
    creatorName: 'Räksmörgås ∆',
    excursionId: 'x728s',
    excursionDate: new Date(),
    excursionName: 'ジ　エクスクルシオン',
    participantId: 'f8',
    participantName: 'Bob',
    types: [ 'bird', 'flower' ],
    zones: [ 1, 3 ]
  };

  var $sourceTextarea = $('#qr-form .input textarea');
  var $decodedTextarea = $('#qr-form .decoded textarea');
  var $encodingAlert = $('#qr-form .input .alert');
  var $decodingAlert = $('#qr-form .decoded .alert');
  var $qrAlert = $('#qrcode .alert');

  $sourceTextarea.val(JSON.stringify(sample, undefined, 2));

  generate();

  var previousValue;
  $sourceTextarea.on('change keyup', function() {
    var value = $sourceTextarea.val();
    if (value != previousValue) {
      generate();
    }
  });

  function generate() {
    setAlert($encodingAlert, false);

    try {
      var data = JSON.parse($sourceTextarea.val());
      data.excursionDate = moment(data.excursionDate).toDate();

      var encoded = bioqr.encode(data, { format: 'numeric'});

      decode(encoded);
      generateQr(encoded);
    } catch(e) {
      setAlert($encodingAlert, e.stack);
    }
  }

  function decode(data) {
    setAlert($decodingAlert, false);

    try {
      var decoded = bioqr.decode(data, { format: 'numeric' });
      $decodedTextarea.val(JSON.stringify(decoded, undefined, 2));
    } catch(e) {
      setAlert($decodingAlert, e.stack);
    }
  }

  function generateQr(data) {
    setAlert($qrAlert, false);

    try {
      var options = {
        version: 10,
        errorCorrectionLevel: 'Q',
        scale: 8,
        margin: 0
      };

      var segs = [
        { data: data, mode: 'numeric' }
      ];

      qrcodelib.toCanvas(document.getElementById('qr-canvas'), segs, options, function (error) {
        if (error) {
          console.warn(error);
          return setAlert($qrAlert, error.stack);
        }
      });
    } catch(e) {
      setAlert($qrAlert, e.stack);
    }
  }

  function setAlert($element, alert) {
    if (alert) {
      $element.text(alert);
      $element.removeClass("hidden");
    } else {
      $element.addClass("hidden");
    }
  }
});
