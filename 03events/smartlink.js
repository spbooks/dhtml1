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

// Here's the smart link code

function handleLink(e) {
  var el;
  if (window.event && window.event.srcElement)
    el = window.event.srcElement;
  if (e && e.target)
    el = e.target;
  if (!el)
    return;

  while (el.nodeName.toLowerCase() != 'a' &&
      el.nodeName.toLowerCase() != 'body')
    el = el.parentNode;
  if (el.nodeName.toLowerCase() == 'body')
    return;

  if (document.getElementById('newwin') &&
      document.getElementById('newwin').checked) {
    window.open(el.href);
    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
    }
    if (e && e.stopPropagation && e.preventDefault) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

function cancelClick() {
  if (document.getElementById('newwin') &&
      document.getElementById('newwin').checked) {
    return false;
  }
  return true;
}

// here's the bit that installs the listeners

function addListeners() {
  if (!document.getElementById)
    return;

  var all_links = document.getElementsByTagName('a');
  for (var i = 0; i < all_links.length; i++) {
    addEvent(all_links[i], 'click', handleLink, false);
    all_links[i].onclick = cancelClick;
  }
}

addEvent(window, 'load', addListeners, false);

