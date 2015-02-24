function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture);
    return true;
  } else if (elm.attachEvent) {
    var r = elm.attachEvent('on' + evType, fn);
    return r;
  } else {
    elm['on' + evType] = fn;
  }
}

function init() {
  if (!document.getElementById)
    return;
  var clock = document.getElementById('clock');
  if (!clock.innerHTML)
    return;
  setInterval(function() { update(clock); }, 1000);
}

function update(clock) {
  var d = new Date();
  var digits, readout = '';

  digits = d.getHours();
  readout += (digits > 9 ? '' : '0') + digits + ':';

  digits = d.getMinutes();
  readout += (digits > 9 ? '' : '0') + digits + ':';

  digits = d.getSeconds();
  readout += (digits > 9 ? '' : '0') + digits;

  clock.innerHTML = readout;
}

addEvent(window, 'load', init, false);

