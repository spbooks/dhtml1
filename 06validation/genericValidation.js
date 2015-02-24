var fV = {
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
    for (var i in validationSet) {
      if (document.getElementsByName(i)) {
        var formField = document.getElementsByName(i)[0];
        fV.addEvent(formField, 'blur', fV.checkValid, false);

        if (!formField.form.validateSubmit) {
          fV.addEvent(formField.form, 'submit', fV.checkValidSubmit, false);
          formField.form.onsubmit = fV.checkSubmit; // Safari
          formField.form.validateSubmit = true;
        }
      }
    }
  },

  checkValidSubmit: function(e) {
    var frm = window.event ? window.event.srcElement : e ? e.target : null;
    if (!frm) return;
    var errText = [];

    for (var i = 0; i < frm.elements.length; i++) {
      if (frm.elements[i].name && validationSet[frm.elements[i].name]) {

        var failedE = fV.handleValidity(frm.elements[i]);

        var errDisplay = document.getElementById('error_' + frm.elements[i].name);

        if (failedE && errDisplay) {
          errDisplay.innerHTML =
              validationSet[failedE.name]['error'];
        }
        if (!failedE && errDisplay) {
          errDisplay.innerHTML = '';
        }

        if (failedE) {
          var labels = document.getElementsByTagName('label');
          errText[errText.length] = validationSet[failedE.name]['error'];
          for (var j = 0; j < labels.length; j++) {
            if (labels[j].htmlFor == failedE.id) {
              errText[errText.length - 1] +=
                  ' (field \'' + labels[j].firstChild.nodeValue + '\')';
            }
          }
        }
      }  /* end 'if' */
    } /* end 'for' */

    if (errText.length > 0) {
      alert('Please fix the following errors and resubmit:\n' +
          errText.join('\n'));
      frm.submitAllowed = false;
      if (e && e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (window.event) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
        return false;
      }
    } else {
      frm.submitAllowed = true;
    }
  },

  checkSubmit: function() {
    if (this.attachEvent) return true;
    return this.submitAllowed;
  },
  
  checkValid: function(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;

    var failedE = fV.handleValidity(target);

    var errDisplay = document.getElementById('error_' + target.name);

    if (failedE && errDisplay) {
      errDisplay.innerHTML = validationSet[failedE.name]['error'];
      failedE.focus();
    }
    if (failedE && !errDisplay) {
      alert(validationSet[failedE.name]['error']);
    }
    if (!failedE && errDisplay) {
      errDisplay.innerHTML = '';
    }
  },

  handleValidity: function(field) {
    if (!field.value) {
      return null;
    }
    var re = validationSet[field.name]['regexp'];
    if (!field.value.match(re)) {
      return field;
    } else {
      return null;
    }
  }
}

fV.addEvent(window, 'load', fV.init, false);

