bG = {
  init: function() {
    if (!Sarissa || !document.getElementsByTagName) return;
    var beerlinks = document.getElementById('beers').getElementsByTagName('a');
    for (var i = 0; i < beerlinks.length; i++) {
      bG.addEvent(beerlinks[i], 'click', bG.clickBeer, false);
      beerlinks[i].onclick = function() { return false; }; // Safari
    }
    var charlinks = document.getElementById('characters').getElementsByTagName('a');
    for (var i = 0; i < charlinks.length; i++) {
      bG.addEvent(charlinks[i], 'click', bG.clickCharacter, false);
      charlinks[i].onclick = function() { return false; }; // Safari
    }
  },

  addEvent: function(elm, evType, fn, useCapture) {
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
  
  geturl: function(u, fn) {
    var xmlhttp = Sarissa.getXmlHttpRequest();
    xmlhttp.open('GET', u, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        fn(xmlhttp.responseText);
      }
    }
    xmlhttp.send(null);
  },
  
  clickBeer: function(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    if (target.nodeName.toLowerCase() != 'a')
      target = target.parentNode;

    bG.display(target.id);
    
    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
      return;
    }
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  },

  display: function(beer) {
    bG.geturl('beerserver1.php?action=beer&beer=' + escape(beer), bG.display2);
  },

  display2: function(beerdata) {
    var text = document.getElementById('beerdef');
    text.innerHTML = beerdata;
    text.style.display = '';
  },

  clickCharacter: function(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    if (target.nodeName.toLowerCase() != 'a')
      target = target.parentNode;

    bG.highlight(target.id);

    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
      return;
    }
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  },

  highlight: function(character) {
    bG.geturl('beerserver2.php?action=character&character=' + escape(character), bG.highlight2);
  },
  
  highlight2: function(charjs) {
    eval(charjs);
  }
}

bG.addEvent(window, 'load', bG.init, false);
