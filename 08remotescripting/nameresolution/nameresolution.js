var nR = {
  init: function() {
    if (!document.getElementById) return;
    if (!RSLiteObject) return;
    window.RSLite = new RSLiteObject();
    // Set the "to" and "cc" fields to have name resolution
    var to_field = document.getElementById('to');
    if (to_field) nR.addEvent(to_field, 'change', nR.resolve, false);
    var cc_field = document.getElementById('cc');
    if (cc_field) nR.addEvent(cc_field, 'change', nR.resolve, false);
    // Set up the callbacks
    window.RSLite.callback = nR.resolve_callback;
    window.RSLite.failure = nR.resolve_failure;
  },
  
  addEvent: function(elm, evType, fn, useCapture) {
    // cross-browser event handling for IE5+, NS6 and Mozilla
    // By Scott Andrew
    if (elm.addEventListener){
      elm.addEventListener(evType, fn, useCapture);
      return true;
    } else if (elm.attachEvent){
      var r = elm.attachEvent('on' + evType, fn);
      return r;
    } else {
      elm['on' + evType] = fn;
    }
  },
   
  resolve: function(e) {
    var target = window.event ? window.event.srcElement: e ? e.target : null;
    if (!target || !target.value) return;
    nR.currentTarget = target;
    if (nR.currentTarget.errorSpan) {
      nR.currentTarget.errorSpan.parentNode.removeChild(nR.currentTarget.errorSpan);
      nR.currentTarget.errorSpan = null;
    }
    if (target.value.indexOf('@') != -1) return; // already an email address
    // Try and resolve the entered value to a proper value by calling
    // the server for name resolution
    window.RSLite.call('resolver.php', target.value);
  },
   
  resolve_callback: function(response) {
    nR.currentTarget.value = response;
  },
   
  resolve_failure: function() {
    var errorSpan = document.createElement('span');
    errorSpan.className = 'error';
    errorSpan.appendChild(document.createTextNode(
        'Address ' + nR.currentTarget.value + ' invalid'));
    nR.currentTarget.errorSpan = errorSpan;
    nR.currentTarget.parentNode.appendChild(errorSpan);
  }
}

nR.addEvent(window, 'load', nR.init, false);
