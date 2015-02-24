function addEvent(elm, evType, fn, useCapture)
// cross-browser event handling for IE5+, NS6+ and Mozilla 
// By Scott Andrew 
{
  if (elm.addEventListener) { 
    elm.addEventListener(evType, fn, useCapture); 
    return true; 
  } else if (elm.attachEvent) { 
    var r = elm.attachEvent('on' + evType, fn); 
    return r; 
  } else {
    elm['on' + evType] = fn;
  }
}

// climb up the tree to the supplied tag.
function ascendDOM(e, target) {
  while (e.nodeName.toLowerCase() != target && 
      e.nodeName.toLowerCase() != 'html')
    e = e.parentNode;
  
  return (e.nodeName.toLowerCase() == 'html') ? null : e;
}

// turn on highlighting
function hi_cell(e) {
  var el;
  if (window.event && window.event.srcElement)
    el = window.event.srcElement;
  if (e && e.target)
    el = e.target;
  if (!el) return;

  el = ascendDOM(el, 'td');
  if (el == null) return;

  var parent_row = ascendDOM(el, 'tr');
  if (parent_row == null) return;

  var parent_table = ascendDOM(parent_row, 'table');
  if (parent_table == null) return;

  // row styling
  parent_row.className += ' hi';

  // column styling
  var ci = -1;
  for (var i = 0; i < parent_row.cells.length; i++) {
    if (el === parent_row.cells[i]) {
      ci = i;
    }
  }
  if (ci == -1) return; // this should never happen

  for (var i = 0; i < parent_table.rows.length; i++) {
    var cell = parent_table.rows[i].cells[ci];
    cell.className += ' hi';
  }

}

// turn off highlighting
function lo_cell(e) {
  var el;
  if (window.event && window.event.srcElement)
    el = window.event.srcElement;
  if (e && e.target)
    el = e.target;
  if (!el) return;

  el = ascendDOM(el, 'td');
  if (el == null) return;
  
  var parent_row = ascendDOM(el, 'tr');
  if (el == null) return;

  var parent_table = ascendDOM(parent_row, 'table');
  if (el == null) return;

  // row de-styling
  parent_row.className = parent_row.className.replace(/\b ?hi\b/, '');

  // column de-styling
  var ci = -1;
  for (var i = 0; i < parent_row.cells.length; i++) {
    if (el === parent_row.cells[i]) {
      ci = i;
    }
  }
  if (ci == -1) return; // this should never happen

  for (var i = 0; i < parent_table.rows.length; i++) {
    var cell = parent_table.rows[i].cells[ci];
    cell.className = cell.className.replace(/\b ?hi\b/, '');
  }
}

function addListeners() {
  if (!document.getElementsByTagName) return;
  
  var all_cells = document.getElementsByTagName('td');
  for (var i = 0; i < all_cells.length; i++) {
    addEvent(all_cells[i], 'mouseover', hi_cell, false);
    addEvent(all_cells[i], 'mouseout', lo_cell, false);
  }
}

addEvent(window, 'load', addListeners, false);

