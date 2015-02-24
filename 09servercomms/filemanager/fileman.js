var fM = {
  init: function() {
    if (!document.getElementById || !document.getElementsByTagName ||
        !Drag || !Drag.init)
      return;
    
    // Make the targets remove the element when dropped upon
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
      var t = elements[i];
      if (t.className.search(/\btarget\b/) != -1) {
        t.onDroppedOn = fM.moveFileHere;
      }
    }

    // Make folders clickable to list that folder's files
    var fs = document.getElementById('folders').getElementsByTagName('a');
    for (var i = 0; i < fs.length; i++) {
      fM.addEvent(fs[i], 'click', fM.openFolder, false);
      if (!fs[i].onclick) {
        fs[i].onclick = function() { return false; }; // Safari
      }
    }
    
    // Load the initial fileset
    fM.loadFiles('/');
  },
  
  setUpDraggables: function() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
      var draggable = elements[i];
      if (draggable.className.search(/\bdraggable\b/) != -1) {
        Drag.init(draggable);
        
        draggable.onDragStart = function(x, y) {
          document.body.className += ' dragging';
          fM.createProxyTargets();
          this.ZINDEX = this.style.zIndex;
          this.style.zIndex = 999;
          this.SAVED_POSITION = [x, y];
        };
        
        draggable.onDragEnd = function(x, y) {
          this.style.left = this.SAVED_POSITION[0];
          this.style.top = this.SAVED_POSITION[1];
          this.style.zIndex = this.ZINDEX;
          fM.elementDropped(this, x, y);
          fM.removeProxyTargets();
          document.body.className = document.body.className.replace(/\b ?dragging\b/, '');
        };
      }
    }
  },

  createProxyTargets: function() {
    fM.PROXY_TARGETS = [];
    var targets = document.getElementsByTagName('*');
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (t.className.search(/\btarget\b/) != -1) {

        var proxyTarget = document.createElement('a');
        proxyTarget.className = 'proxyTarget';
        proxyTarget.style.left = fM.findPosX(t) + 'px';
        proxyTarget.style.top = fM.findPosY(t) + 'px';
        proxyTarget.style.width = t.offsetWidth + 'px';
        proxyTarget.style.height = t.offsetHeight + 'px';
        proxyTarget.href = '#';
        proxyTarget.realElement = t;
  
        fM.PROXY_TARGETS[fM.PROXY_TARGETS.length] = proxyTarget;
        document.body.appendChild(proxyTarget);
  
        fM.addEvent(proxyTarget, 'mouseover', fM.targetOver, false);
        fM.addEvent(proxyTarget, 'mouseout', fM.targetOut, false);
      }
    }
  },

  removeProxyTargets: function() {
    for (var i = 0; i < fM.PROXY_TARGETS.length; i++) {
      var tt = fM.PROXY_TARGETS[i].realElement;
      tt.className = tt.className.replace(/\bhover\b/, '');
      document.body.removeChild(fM.PROXY_TARGETS[i]);
    }
    fM.PROXY_TARGETS = [];
  },

  targetOver: function(e) {
    var t = window.event ? window.event.srcElement : e ? e.target : null;
    if (!t) return;
    var tt = t.realElement;
    tt.className += ' hover';
  },

  targetOut: function(e) {
    var t = window.event ? window.event.srcElement : e ? e.target : null;
    if (!t) return;
    var tt = t.realElement;
    tt.className = tt.className.replace(/\b ?hover\b/, '');
  },

  elementDropped: function(draggedObj, x, y) {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
      var t = elements[i];
      if (t.className.search(/\btarget\b/) != -1 &&
          t.className.search(/\bhover\b/) != -1 && t.onDroppedOn) {
        t.onDroppedOn(draggedObj);
      }
    }
  },
  
  moveFileHere: function(dragged) {
    var file = dragged.getAttribute('path');
    var path = this.getAttribute('path');
    var xmlhttp = Sarissa.getXmlHttpRequest();
    var qs = '?path=' + escape(path) + '&file=' + escape(file);
    var url = 'moveFiles.php' + qs;
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        fM.receiveMoveDetails(xmlhttp.responseText, dragged);
      }
    };
    xmlhttp.send(null);
  },
  
  receiveMoveDetails: function(data, dragged) {
    if (data == 'OK') {
      dragged.parentNode.removeChild(dragged);
    } else {
      alert('There was an error moving the file:\n' + data);
    }
  },
  
  openFolder: function(e) {
    var t = window.event ? window.event.srcElement : e ? e.target : null;
    if (!t) return;
    while (t.nodeName.toLowerCase() != 'a' &&
        t.nodeName.toLowerCase() != 'body')
      t = t.parentNode;
    fM.loadFiles(t.getAttribute('path'));
    if (window.event) {
      window.event.cancelBubble = true;
      window.event.returnValue = false;
    }
    if (e && e.stopPropagation && e.preventDefault) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  
  loadFiles: function(path) {
    var files = document.getElementById('files');
    files.innerHTML = 'loading files...';
    var xmlhttp = Sarissa.getXmlHttpRequest();
    var url = 'getFiles.php?rnd=' + (new Date()).getTime() + '&path=' + escape(path);
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        fM.receiveFilenames(xmlhttp.responseXML, path);
      }
    };
    xmlhttp.send(null);
  },
  
  receiveFilenames: function(dom, path) {
    var files = document.getElementById('files');
    files.innerHTML = '';
    
    var ul = document.createElement('ul');
    var fileNodes = dom.getElementsByTagName('file');
    for (var i = 0; i < fileNodes.length; i++) {
      var li = document.createElement('li');
      li.className = 'draggable';
      var s = '';
      for (var j = 0; j < fileNodes[i].firstChild.nodeValue.length; j += 5) {
        s += fileNodes[i].firstChild.nodeValue.substr(j, 5);
        s += '<wbr>';
      }
      li.setAttribute('path', path + '/' + fileNodes[i].firstChild.nodeValue);
      li.innerHTML = s;
      ul.appendChild(li);
    }
    files.appendChild(ul);
    setTimeout(fM.setUpDraggables, 100);
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
  
  // Based on findPos*, by ppk (http://www.quirksmode.org/js/findpos.html)
  findPosX: function(obj) {
    var curLeft = 0;
    if (obj.offsetParent) {
      do {
        curLeft += obj.offsetLeft;
      } while (obj = obj.offsetParent);
    }
    else if (obj.x) {
      curLeft += obj.x;
    }
    return curLeft;
  },
  
  findPosY: function(obj) {
    var curTop = 0;
    if (obj.offsetParent) {
      do {
        curTop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    else if (obj.y) {
      curTop += obj.y;
    }
    return curTop;
  }
}

fM.addEvent(window, 'load', fM.init, false);
