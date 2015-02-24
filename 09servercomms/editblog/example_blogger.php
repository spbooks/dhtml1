<?php

// This script uses IXR, from http://scripts.incutio.com/xmlrpc/
include 'IXR.inc.php';

// Turn off all warnings and errors.
// error_reporting(0);

class ExampleBloggerServer extends IXR_Server {

	function ExampleBloggerServer() {
		$this->methods = array(
		  // Blogger API
		  'blogger.getRecentPosts' => 'this:blogger_getRecentPosts',
		  'blogger.editPost' => 'this:blogger_editPost'
		);
		$this->IXR_Server($this->methods);
	}

	/* blogger.getRecentPosts ...gets recent posts */
	function blogger_getRecentPosts($args) {
        /* Returns a hard coded list of posts, ignoring input parameters. */
        return array(
            array(
                'userid' => 'simon',
                'dateCreated' => new IXR_Date(time()),
                'content' => 'This is the first post',
                'postid' => 'firstPost'
            ),
            array(
                'userid' => 'stuart',
                'dateCreated' => new IXR_Date(time()),
                'content' => 'This is another post!',
                'postid' => 'second'
            )
        );
    }

	/* blogger.editPost ...edits a post */
	function blogger_editPost($args) { 
	   /* This doesn't actually do anything. */
	   return true;
	}

}

$exampleBloggerServer = new ExampleBloggerServer();

?>
