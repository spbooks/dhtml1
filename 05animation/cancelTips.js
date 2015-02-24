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
  if (!document.getElementById) return;
  var mylink = document.getElementById('mylink');
  addEvent(mylink, 'mouseover', mover, false);
  addEvent(mylink, 'mouseout', mout, false);
}

function mover() {
  TIMEOUT_ID = setTimeout(
    'document.getElementById("explain").innerHTML' +
    ' = "Return to the homepage"',
    2000);
}

function mout() {
  // put in an &nbsp; placeholder to clear the current content
  document.getElementById("explain").innerHTML = "&nbsp;";
  clearTimeout(TIMEOUT_ID);
}

var TIMEOUT_ID;
addEvent(window, 'load', init, false);

