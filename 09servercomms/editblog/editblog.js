var eB = {
  /* Change these bits */
  USERNAME: 'sil',
  PASSWORD: 'nowayjose!',
  API_URL: 'example_blogger.php',
  BLOG_NAME: '/main',
  
  /* Don't change anything below here */
  posts: null,

  init: function() {
    if (!jsolait) return;
    if (!document.getElementById) return;
    
    var xmlrpc = importModule('xmlrpc');
    eB.api = {
      getRecentPosts: new xmlrpc.XMLRPCMethod(eB.API_URL, 'blogger.getRecentPosts'),
      editPost: new xmlrpc.XMLRPCMethod(eB.API_URL, 'blogger.editPost')
    };
    
    var element;
    element = document.getElementById('get');
    eB.addEvent(element, 'click', eB.getPosts, false);
    element = document.getElementById('save');
    eB.addEvent(element, 'click', eB.sendPost, false);
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
  
  getPosts: function() {
    try {
      eB.posts = eB.api.getRecentPosts(
          '', eB.BLOG_NAME, eB.USERNAME, eB.PASSWORD, 5);
    } catch(e) {
      alert('There was an error fetching posts.');
      return;
    }
    var p = document.getElementById('posts');
    p.innerHTML = '';
    for (var i = 0; i < eB.posts.length; i++) {
      eB.addItem(p, eB.posts[i]);
    }
  },
  
  addItem: function(para, post) {
    var text = document.createTextNode(post.postid);

    var a = document.createElement('a');
    a.href = '#';
    a.postID = post.postid;
    eB.addEvent(a, 'click', eB.clickLink, false);
    a.appendChild(text);

    var li = document.createElement('li');
    li.appendChild(a);

    para.appendChild(li);
  },
  
  clickLink: function(e) {
    var t = window.event ? window.event.srcElement : e ? e.target : null;
    if (!t) return;
    while (t.nodeName.toLowerCase() != 'a' &&
        t.nodeName.toLowerCase() != 'body')
      t = t.parentNode;
    var postid = t.postID;
    for (var i = 0; i < eB.posts.length; i++) {
      if (eB.posts[i].postid == postid) {
        eB.CURRENT_POST = postid;
        document.getElementById('post').value = eB.posts[i].content;
        document.getElementById('save').disabled = '';
        return;
      }
    }
  },
  
  sendPost: function() {
    try {
      eB.api.editPost(
          '', eB.CURRENT_POST, eB.USERNAME, eB.PASSWORD,
          document.getElementById('post').value, true);
      alert('Post saved OK!');
      document.getElementById('post').value = '';
      eB.CURRENT_POST = null;
      document.getElementById('save').disabled = 'disabled';
    } catch(e) {
      alert('There was an error saving your post.\n(' + e.message + ')');
      return;
    }
  }
}

eB.addEvent(window, 'load', eB.init, false);
