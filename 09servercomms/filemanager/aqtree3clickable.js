/*
aqtree3clickable.js

Converts an unordered list to an explorer-style tree, with clickable
icons

To make this work, simply add one line to your HTML:
<script type="text/javascript" src="aqtree3clickable.js"></script>

and then make the top UL of your nested unordered list of class
"aqtree3clickable".

That's it. No registration function, nothing.

http://www.kryogenix.org/code/browser/aqlists/

Stuart Langridge, November 2002
sil@kryogenix.org

Inspired by Aaron's labels.js (http://youngpup.net/demos/labels/) and Dave Lindquist's menuDropDown.js (http://www.gazingus.org/dhtml/?id=109)

*/

addEvent(window, "load", makeTreesC);

function makeTreesC() {
  // We don't actually need createElement, but we do
  // need good DOM support, so this is a good check.
  if (!document.createElement) return;
    
  uls = document.getElementsByTagName("ul");
  for (uli=0;uli<uls.length;uli++) {
    ul = uls[uli];
    if (ul.nodeName == "UL" && ul.className == "aqtree3clickable") {
          processULELC(ul);
    }
  }
}

function processULELC(ul) {
  if (!ul.childNodes || ul.childNodes.length == 0) return;
  // Iterate LIs
  for (var itemi=0;itemi<ul.childNodes.length;itemi++) {
    var item = ul.childNodes[itemi];
    if (item.nodeName == "LI") {
      // Iterate things in this LI
      var a;
      var subul;
      subul = "";
      for (var sitemi=0;sitemi<item.childNodes.length;sitemi++) {
        var sitem = item.childNodes[sitemi];
        switch (sitem.nodeName) {
          case "A": a = sitem; break;
          case "UL": subul = sitem; 
            processULELC(subul);
            break;
        }
      }
      if (subul) {
        associateELC(a,subul);
      } else {
        a.parentNode.className = "aq3bullet";
      }
    }
  }
}

function associateELC(a,ul) {
  if (a.parentNode.className.indexOf('aq3open') == -1)
    a.parentNode.className = 'aq3closed';
  a.onclick = function () {
    this.parentNode.className =
      (this.parentNode.className=='aq3open') ? "aq3closed" : "aq3open";
    return false;
  }
}

/*              Utility functions                    */

function addEvent(obj, evType, fn){
  /* adds an eventListener for browsers which support it
     Written by Scott Andrew: nice one, Scott */
  if (obj.addEventListener){
    obj.addEventListener(evType, fn, true);
    return true;
  } else if (obj.attachEvent){
    var r = obj.attachEvent("on"+evType, fn);
    return r;
  } else {
    return false;
  }
}
