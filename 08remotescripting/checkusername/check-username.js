var cU = {
  init: function() {
    if (!document.getElementById) return;
    if (!Sarissa) return;
    cU.name = document.getElementById('name');
    cU.username = document.getElementById('username');
    cU.usernamecontainer = document.getElementById('usernamecontainer');
    if (!cU.name || !cU.username) return;
    if (!cU.usernamecontainer.innerHTML) return;
    cU.addEvent(cU.username, 'change', cU.checkUsername, false);
  },

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

  checkUsername: function() {
    var xmlhttp = Sarissa.getXmlHttpRequest();
    var qs = '?username=' + cU.username.value +
        '&name=' + cU.name.value;
    xmlhttp.open('GET', 'check-username.php' + qs, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        cU.receiveUsernames(xmlhttp.responseXML);
      }
    };
    xmlhttp.send(null);
  },

  receiveUsernames: function(dom) {
    var alternatives = dom.getElementsByTagName('username');
    var usernameHTML = '<label for="username" class="para">' +
      'The username \'USERNAME\' is already in use. ' +
      'Please choose one of the alternatives below, or ' +
      'enter another username.</label>' +
      '<ul class="radio">ALTERNATIVESLIST<li>' +
      '<label class="radio"><input type="radio" name="unchoice" ' +
      'checked="checked" value="username"> ' +
      'Another choice:</label> ' +
      '<input type="text" class="text" id="username" name="username">' +
      '</li></ul>';
    usernameHTML = usernameHTML.replace('USERNAME', cU.username.value);
    var alternativeslist = '';
    for (var i = 0; i < alternatives.length; i++) {
      var thisAL = '<li><label class="radio"><input type="radio" name="unchoice" ' +
          'checked="checked" value="USERNAME"> ' +
          'USERNAME</label></li>';
      thisAL = thisAL.replace(/USERNAME/g, alternatives[i].firstChild.nodeValue);
      alternativeslist += thisAL;
    }
    usernameHTML = usernameHTML.replace('ALTERNATIVESLIST', alternativeslist);
    cU.usernamecontainer.innerHTML = usernameHTML;

    // reattach the event, giving browsers time to do the innerHTML work
    setTimeout(function() {
      cU.username = document.getElementById('username');
      cU.addEvent(cU.username, 'change', cU.checkUsername, false);
    }, 200);
  }
}

cU.addEvent(window, 'load', cU.init, false);
