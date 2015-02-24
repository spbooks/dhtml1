function addEvent(elm, evType, fn, useCapture) {
  // cross-browser event handling for IE5+, NS6 and Mozilla
  // By Scott Andrew
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
  var uls = document.getElementsByTagName('ul');
  for (var u = 0; u < uls.length; u++) {
    if (uls[u].className.search(/\bslidingmenu\b/) == -1) continue;
    var lis = uls[u].getElementsByTagName('li');
    for (var i = 0; i < lis.length; i++) {
      var node = lis[i];
      if (node.nodeName.toLowerCase() == 'li' &&
          node.getElementsByTagName('ul').length > 0) {
        addEvent(node, 'mouseover', getMoverFor(node), false);
        addEvent(node, 'mouseout', getMoutFor(node), false);
        node.getElementsByTagName('a')[0].className += ' subheader';
      }
    }
  }
}

addEvent(window, 'load', init, false);

function getMoverFor(node) {
  return function(e) { mover(e, node); };
}

function getMoutFor(node) {
  return function(e) { mout(e, node); };
}

function mover(e, targetElement) {
  var el = window.event ? targetElement : e ? e.currentTarget : null;
  if (!el) return;
  for (var i = 0; i < el.childNodes.length; i++) {
    var node = el.childNodes[i];
    if (node.nodeName.toLowerCase() == 'ul') {
      node.style.display = 'block';
    }
  }
}

function mout(e, targetElement) {
  var el = window.event ? targetElement : e ? e.currentTarget : null;
  if (!el) return;
  for (var i = 0; i < el.childNodes.length; i++) {
    var node = el.childNodes[i];
    if (node.nodeName.toLowerCase() == 'ul') {
      node.style.display = 'none';
    }
  }
}
