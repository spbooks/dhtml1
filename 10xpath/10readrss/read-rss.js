var rR = {
  init: function() {
    if (!document.getElementById || !document.createElement ||
        !document.getElementsByTagName || !Sarissa) return;
    // Find all <a> elements with an "rss" attribute that are
    // inside <ul> elements with id "blogs"
    var blogs = document.getElementById('blogs');
    var as = blogs.getElementsByTagName('a');
    for (var i = 0; i < as.length; i++) {
      var rssURL = as[i].getAttribute('rss');
      if (rssURL) {
        rR.loadRssData(rssURL, as[i].parentNode, as[i]);
      }
    }
  },
  
  loadRssData: function(rssURL, liTag, aTag) {
    // Asynchronously request the data from the appropriate RSS file,
    // and insert it into the document
    var xmlhttp = Sarissa.getXmlHttpRequest();
    xmlhttp.open('GET', rssURL, true);

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        var dom = Sarissa.getDomDocument();
        dom.loadXML(xmlhttp.responseText);
        dom.setProperty('SelectionLanguage', 'XPath');
        dom.setProperty('SelectionNamespaces', 
            'xmlns:xhtml="http://www.w3.org/1999/xhtml"');
        Sarissa.setXpathNamespaces(dom,
            'xmlns:my="http://purl.org/rss/1.0/" ' +
            'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'
        );
        var items = dom.documentElement.selectNodes('/rdf:RDF/my:item');
        if (items.length > 0) {
          var ul = document.createElement('ul');
          for (var j = 0; j < items.length && j < 5; j++) {
            var i = items[j];
            var li, a, p, tn, dn; // new elements
            var title, desc;      // existing elements

            li = document.createElement('li');
            a  = document.createElement('a');
            p  = document.createElement('p');

            a.href =
              i.selectSingleNode('my:link').firstChild.nodeValue;
            title =
              i.selectSingleNode('my:title').firstChild.nodeValue;
            desc =
              i.selectSingleNode('my:description').firstChild.nodeValue;

            tn = document.createTextNode(title);
            dn = document.createTextNode(desc);

            a.appendChild(tn);
            p.appendChild(dn);
            li.appendChild(a);
            li.appendChild(p);
            ul.appendChild(li);
          }
          liTag.appendChild(ul);
          
          // and since there are some items to show, change the
          // link in the main list to show and hide these items
          rR.addEvent(aTag, 'click', rR.showAndHide, false);
        }
      }
    }
    xmlhttp.send(null);
  },
  
  showAndHide: function(e) {
    var el = window.event ? window.event.srcElement : e ? e.target : null;
    if (!el) return;

    // ascend the DOM tree until we get to our parent LI
    while (el.nodeName.toLowerCase() != 'li' &&
           el.nodeName.toLowerCase() != 'html') {
      el = el.parentNode;
    }
    if (el.nodeName.toLowerCase() == 'html') return;
    
    if (el.className.search(/\bshow\b/) == -1) {
      el.className += ' show';
    } else {
      el.className = el.className.replace(/\b ?show\b/, '');
    }
    if (e && e.stopPropagation && e.preventDefault) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      e.returnValue = false;
      e.cancelBubble = true;
    }
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
  }
}

rR.addEvent(window, 'load', rR.init, false);
