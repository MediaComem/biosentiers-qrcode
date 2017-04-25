//var decoded = bioqr.decode(data);
//console.log(JSON.stringify(decoded, undefined, 2));

$(function() {

  var sample = {
    version: 0,
    creatorName: 'Räksmörgås ∆',
    excursionId: 'x728s',
    excursionDate: new Date(),
    excursionName: 'ジ　エクスクルシオン',
    participantId: 'f8',
    participantName: 'Bob',
    types: [ 'bird', 'flower' ],
    zones: [ 1, 3 ]
  };

  var $textarea = $('#qr-form .input textarea');
  var $decodedTextarea = $('#qr-form .decoded textarea');
  var $encodingAlert = $('#qr-form .input .alert');
  var $decodingAlert = $('#qr-form .decoded .alert');
  var $qr1Alert = $('#qrcodes .qr1 .alert');

  var $qr2Canvas = $('#qr-canvas2');
  var $qr2Alert = $('#qrcodes .qr2 .alert');

  $textarea.val(JSON.stringify(sample, undefined, 2));

  generate();

  var previousValue;
  $textarea.on('change keyup', function() {
    var value = $textarea.val();
    if (value != previousValue) {
      generate();
    }
  });

  function generate() {
    setAlert($encodingAlert, false);

    try {
      var data = JSON.parse($textarea.val());
      data.excursionDate = moment(data.excursionDate).toDate();

      var encoded = bioqr.encode(data);

      decode(encoded);
      generateQr1(encoded);
      generateQr2(encoded);
    } catch(e) {
      setAlert($encodingAlert, e.stack);
    }
  }

  function decode(data) {
    setAlert($decodingAlert, false);

    try {
      var decoded = bioqr.decode(data);
      $decodedTextarea.val(JSON.stringify(decoded, undefined, 2));
    } catch(e) {
      setAlert($decodingAlert, e.stack);
    }
  }

  function generateQr1(data) {
    setAlert($qr1Alert, false);

    try {
      var options = {
        //version: 10,
        errorCorrectionLevel: 'Q',
        scale: 8,
        margin: 0
      };

      var segs = [
        { data: data, mode: 'byte' }
      ];

      qrcodelib.toCanvas(document.getElementById('qr-canvas1'), segs, options, function (error) {
        if (error) {
          console.warn(error);
          return setAlert($qr1Alert, error.stack);
        }
      });
    } catch(e) {
      setAlert($qr1Alert, e.stack);
    }
  }

  function generateQr2(data) {
    $qr2Canvas.empty();
    setAlert($qr2Alert, false);

    try {
      new QRCode("qr-canvas2", {
        text: data,
        width: 456,
        height: 456,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.Q
      });
    } catch(e) {
      setAlert($qr2Alert, e.stack);
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
