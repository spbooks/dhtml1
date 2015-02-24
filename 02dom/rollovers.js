function setupRollovers() {
  if (!document.getElementsByTagName)
    return;
  var all_links = document.getElementsByTagName('a');
  for (var i = 0; i < all_links.length; i++) {
    var link = all_links[i]; 
    if (link.className &&
        (' ' + link.className + ' ').indexOf(' rollover ') != -1) {
      if (link.childNodes &&
          link.childNodes.length == 1 &&
          link.childNodes[0].nodeName.toLowerCase() == 'img') {
        link.onmouseover = mouseover;
        link.onmouseout = mouseout;
      }
    }
  }
}

function find_target(e)
{
  /* Begin the DOM events part, which you */
  /* can ignore for now if it's confusing */
  var target; 

  if (window.event && window.event.srcElement) 
    target = window.event.srcElement;
  else if (e && e.target)
    target = e.target;
  if (!target)
    return null;

  while (target != document.body &&
      target.nodeName.toLowerCase() != 'a')
    target = target.parentNode;

  if (target.nodeName.toLowerCase() != 'a')
    return null;

  return target;
}

function mouseover(e) {
  var target = find_target(e);
  if (!target) return;

  // the only child node of the a tag in target will be an img tag
  var img_tag = target.childNodes[0];

  // Take the "src", which names an image called "something.ext",
  // Make it point to "something_over.ext"
  // This is done with a regular expression
  img_tag.src = img_tag.src.replace(/(\.[^.]+)$/, '_over$1');
}

function mouseout(e) {
  var target = find_target(e);
  if (!target) return;

  // the only child node of the A-tag in |target| will be an IMG-tag
  var img_tag = target.childNodes[0];

  // Take the "src", which names an image as "something_over.ext",
  // Make it point to "something.ext"
  // This is done with a regular expression
  img_tag.src = img_tag.src.replace(/_over(\.[^.]+)$/, '$1');
}

// When the page loads, set up the rollovers
window.onload = setupRollovers;

