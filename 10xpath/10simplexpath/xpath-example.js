var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<day>' +
  '  <activity type="fun" time="1300" duration="1h">' +
  '    Drink beer' +
  '    <activity type="fun work">' +
  '      <purchase type="book">Modern DOM Scripting</purchase>' +
  '    </activity>' +
  '  </activity>' +
  '  <activity type="work" time="0900" duration="9h">' +
  '    Write code' +
  '  </activity>' +
  '  <activity type="fun" time="2200" duration="2h">' +
  '    Write code' + 
  '  </activity>' +
  '  <activity>sleep</activity>' +
  '</day>';

var dom = Sarissa.getDomDocument();
dom.loadXML(xml);

/* Commands to make the XPath selections work in IE */
dom.setProperty('SelectionNamespaces',
    'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"');
dom.setProperty('SelectionLanguage', 'XPath');

var xpaths = [
    '//day',
    '/day',
    '/day/activity',
    '/day/activity/activity',
    '//activity',
    '//activity[@time="0900"]',
    '/day/activity[2]'];

function queries() {
  for (var i = 0; i < xpaths.length; i++) {
    var nodes = dom.selectNodes(xpaths[i]);
    var results = xpaths[i] + '\n';
    for (var j = 0; j < nodes.length; j++) {
      results += nodes[j].nodeName + '\n';
    }
    alert(results);
  }
}

window.onload = queries;
