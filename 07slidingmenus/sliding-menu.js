sM = {
  init: function() {
    var uls = document.getElementsByTagName('ul');
    for (var u = 0; u < uls.length; u++) {
      if (uls[u].className.search(/\bslidingmenu\b/) == -1) continue;
      var lis = uls[u].getElementsByTagName('li');
      for (var i = 0; i < lis.length; i++) {
        var node = lis[i];
        if (node.nodeName.toLowerCase() == 'li' &&
            node.getElementsByTagName('ul').length > 0) {
          sM.addEvent(node, 'mouseover', sM.getMoverFor(node), false);
          sM.addEvent(node, 'mouseout', sM.getMoutFor(node), false);
          node.getElementsByTagName('a')[0].className += ' subheader';
          node.isIn = false;
        }
      }
    }
  },
  
  getMoverFor: function(node) {
    return function(e) { sM.mover(e, node); };
  },
  
  getMoutFor: function(node) {
    return function(e) { sM.mout(e, node); };
  },

  mover: function(e, targetElement) {
    var el = window.event ? targetElement : e ? e.currentTarget : null;
    if (!el) return;
    clearTimeout(el.outTimeout);
    if (!el.isIn) {
      for (var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if (node.nodeName.toLowerCase() == 'ul') {
          // Stop current animation
          clearInterval(node.intervalID);
          // Assign initial visible area
          node.clippingRectangle = [0, 0, 4, 0];
          // Save full width and height
          node.style.display = 'block';
          node.savedOW = node.offsetWidth;
          node.savedOH = node.offsetHeight;
          node.style.display = 'none';
          // Start animation
          node.intervalID = setInterval(function() { sM.showMenu(node); }, 10);
          break;
        }
      }
    }
    el.isIn = true;
    el.className += '';   // Force IE to recompute styles
  },

  mout: function(e, targetElement) {
    var el = window.event ? targetElement : e ? e.currentTarget : null;
    if (!el) return;
    el.outTimeout = setTimeout(function() { sM.mout2(el); }, 300);
  },

  mout2: function(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeName.toLowerCase() == 'ul') {
        // Stop current animation
        clearInterval(node.intervalID);
        // Start animation
        node.intervalID = setInterval(function() { sM.hideMenu(node); }, 10);
        break;
      }
    }
    el.isIn = false;
  },
  
  showMenu: function(el) {
    el.clippingRectangle[1] += 20;
    if (el.clippingRectangle[1] >= el.savedOW) {
      el.clippingRectangle[1] = el.savedOW;
      el.clippingRectangle[2] += 20;
      if (el.clippingRectangle[2] >= el.savedOH) {
        el.clippingRectangle[2] = el.savedOH;
        clearInterval(el.intervalID);
        // reset the clip: browser-specific
        if (document.all && !window.opera) {
          el.style.clip = 'rect(auto)';
        } else {
          el.style.clip = '';
        }
        return;
      }
    }
    el.style.clip = 'rect(' + el.clippingRectangle.join('px ') + 'px)';
    el.style.display = 'block';
  },

  hideMenu: function(el) {
    el.clippingRectangle[2] -= 20;
    if (el.clippingRectangle[2] <= 4) {
      el.clippingRectangle[2] = 4;
      el.clippingRectangle[1] -= 20;
      if (el.clippingRectangle[1] <= 0) {
        clearInterval(el.intervalID);
        // reset the clip: browser-specific
        if (document.all && !window.opera) {
          el.style.clip = 'rect(auto)';
        } else {
          el.style.clip = '';
        }
        el.style.display = 'none';
        return;
      }
    }
    el.style.clip = 'rect(' + el.clippingRectangle.join('px ') + 'px)';
  },

  addEvent: function(elm, evType, fn, useCapture) {
    // cross-browser event handling for IE5+, NS6 and Mozilla
    // By Scott Andrew
    if (elm.addEventListener) {
      elm.addEventListener(evType, fn, useCapture);
      return true;
    } else if (elm.attachEvent) {
      var r = elm.attachEvent('on' + evType, fn);
      EventCache.add(elm, evType, fn);
      return r;
    } else {
      elm['on' + evType] = fn;
    }
  }
};

sM.addEvent(window, 'load', sM.init, false);
sM.addEvent(window, 'unload', EventCache.flush, false);
