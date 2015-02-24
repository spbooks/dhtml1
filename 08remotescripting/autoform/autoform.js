var aF = {
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
    if (!document.getElementById ||
        !document.createElement ||
        !document.getElementsByTagName ||
        !document.getElementsByName) return;
    if (parent.document.getElementById('autoform_ifr')) {
      aF.init_child();
    } else {
      aF.init_parent();
    }
  },

  init_parent: function() {
    // I'm the parent form; reload myself in
    // an iframe to do form submissions, if
    // there are any autoforms on the page.
    var load_child = false;
    var frms = document.getElementsByTagName('form');
    for (var i = 0; i < frms.length; i++) {
      if (frms[i].className &&
          frms[i].className.search(/\bauto\b/) != -1) {
        // load the child
        load_child = true;
        // disable submit on this form
        aF.addEvent(frms[i], 'submit', aF.cancel_submit, false);
        frms[i].onsubmit = function() { return false; }; // Safari
        // hide the submit button
        for (var j = frms[i].elements.length - 1; j > 0; j--) {
          var el = frms[i].elements[j];
          if (el.nodeName.toLowerCase() == 'input' && 
              el.type.toLowerCase() == 'submit') {
            el.parentNode.removeChild(el);
          }
        }
        // attach a change listener to each element
        for (var j = 0; j < frms[i].elements.length; j++) {
          var el = frms[i].elements[j];
          aF.addEvent(el, 'change', aF.parent_element_change, false);
        }
      }
    }
    if (load_child) aF.parent_load_child();
  },

  init_child: function() {
    // I've just been loaded; look to see if there are
    // any AUTOFORM_CHANGED_ELEMENTS defined. If so,
    // call my parent to say that they have
    // been changed.
    parent.aF.parent_document_callback(document);
    if (aF.changedElements && aF.changedElements.length > 0) {
      parent.aF.parent_callback(aF.changedElements);
    }
  },

  cancel_submit: function(e) {
    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
      return false;
    } else if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  
  parent_load_child: function() {
    var b = document.getElementsByTagName('body')[0];
    var i = document.createElement('iframe');
    i.id = 'autoform_ifr';
    i.name = 'autoform_ifr';
    b.appendChild(i);
    if (i.contentDocument && i.contentDocument.location) {
      // For DOM2 compliant
      var subdoc = i.contentDocument;
    } else if (i.contentWindow) {
      // For IE5.5 and IE6
      var subdoc = i.contentWindow.document;
    } else if (window.frames) {
      // Safari
      var subdoc = window.frames['autoform_ifr'].document;
    } else {
      return;
    }
    subdoc.location.replace(location.href);
  },

  parent_callback: function(elementNames) {
    for (var i = 0; i < elementNames.length; i++) {
      var el = document.getElementsByName(elementNames[i])[0];
      el.className = el.className.replace(/\b ?autoform_[a-z]+\b/, '');
      el.className += ' autoform_saved';
    }
  },

  parent_document_callback: function(docObj) {
    aF.childDocument = docObj;
  },

  parent_element_change: function(e) {
    var el = window.event ? window.event.srcElement : e ? e.target : null;
    if (!el) return;
    el.className = el.className.replace(/\bautoform_[a-z]+\b/, '');
    el.className += ' autoform_pending';
    var child_form = aF.childDocument.getElementById(el.form.id);
    aF.childDocument.getElementsByName(el.name)[0].value = el.value;
    child_form.submit();
  }
}

aF.addEvent(window, 'load', aF.init, false);
