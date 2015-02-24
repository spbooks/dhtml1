var rH = {
  addEvent: function(elm, evType, fn, useCapture) {
    // addEvent cross-browser event handling for IE5+, NS6 and Mozilla
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
  },

  init: function() {

    // get the header links
    if (!document.getElementsByTagName || !document.getElementById)
      return;
    var navList = document.getElementById('nav');
    rH.links = navList.getElementsByTagName('a');

    var extra = document.getElementById('extra');

    for (var i = 0; i < rH.links.length; i++) {

      // install event listeners
      rH.addEvent(rH.links[i], 'mouseover', rH.mOver, false);
      rH.addEvent(rH.links[i], 'mouseout', rH.mOut, false);

      // move the corresponding span into the extra div
      var theLi = rH.links[i].parentNode;
      var theSpan = theLi.getElementsByTagName('span')[0];
      extra.appendChild(theSpan);
      theSpan.style.display = 'block';

      // remember where the span is, and what's happening
      rH.links[i].tipSpan = theSpan;
      rH.links[i].tipState = 'none';

    }
    setInterval(rH.moveLinks, 50); // test with 500
  },

  mOver: function(e) {
    var link;
    if (e && e.target)
      link = e.target;
    if (window.event && window.event.srcElement)
      link = window.event.srcElement;
    if (!link)
      return;
    
    if (link.nodeType == 3) {
      link = link.parentNode; // Fix for Safari
    }

    if (link.tipState != 'full' ) {
      link.tipState = 'rising';
    }
  },

  mOut: function(e) {
    var link;
    if (e && e.target)
      link = e.target;
    if (window.event && window.event.srcElement)
      link = window.event.srcElement;
    if (!link)
      return;
    
    if (link.nodeType == 3) {
      link = link.parentNode; // Fix for Safari
    }

    if (link.tipState != 'none' ) {
      link.tipState = 'falling';
    }
  },

  moveLinks: function() {
    for (var i = 0; i < rH.links.length; i++) {
      var link = rH.links[i];
      if (link.tipState == 'none' ||
          link.tipState == 'full') {
        continue;
      }
      var theSpan = link.tipSpan;
      var height = parseInt(theSpan.style.top);
      if (isNaN(height)) {
        height = 0;
      }
      if (link.tipState == 'rising') {
        height -= 2;
        if (height <= -theSpan.offsetHeight) {
          link.tipState = 'full';
        }
      } else {
        height += 2;
        if (height >= 0) {
          link.tipState = 'none';
        }
      }
      theSpan.style.top = height + 'px';
    }
  },

  links: []
};

rH.addEvent(window, 'load', rH.init, false);

