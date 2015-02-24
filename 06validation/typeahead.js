var tADD = {
  addEvent: function(elm, evType, fn, useCapture) {
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
  },

  init: function() {
    if (!document.getElementsByTagName) return;
    var selects = document.getElementsByTagName('select');
    for (var i = 0; i < selects.length; i++) {
      tADD.addEvent(selects[i], 'keydown', tADD.addKey, false);
      tADD.addEvent(selects[i], 'keypress',
          function(e) { if (e) e.preventDefault(); }, false);
    }
  },
  
  addKey: function(e) {
    var t = window.event ? window.event.srcElement : e ? e.target : null;
    if (!t) return;

    if (e && e.which) {
      var code = e.which;
    } else if (e && e.keyCode) {
      var code = e.keyCode;
    } else if (window.event && window.event.keyCode) {
      var code = window.event.keyCode;
    } else {
      return;
    }

    var character = String.fromCharCode(code).toLowerCase();
    if (t.timeout_key)
      clearTimeout(t.timeout_key);

    if (!t.keyword)
      t.keyword = '';

    if (code == 8) {
      if (t.keyword != '')
        t.keyword = t.keyword.substr(0, t.keyword.length - 1);
    } else if (code >= 32) {
      t.keyword += character;
    }

    if (t.keyword == '') {
      window.status = '';
    } else {
      window.status = 'Searching: ' + t.keyword;
  
      t.timeout_key = setTimeout(
          function() { window.status = t.keyword = ''; },
          5000);

      var gotoIndex = t.selectedIndex;
      for (var i = 0; i < t.options.length; i++) {
        if (t.options[i].text.toLowerCase().indexOf(t.keyword) != -1) {
          gotoIndex = i;
          break;
        }
      }
      setTimeout(function() { t.selectedIndex = gotoIndex; }, 1);
    }

    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
    } else if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

tADD.addEvent(window, 'load', tADD.init, false);
