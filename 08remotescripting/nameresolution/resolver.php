<?php

$names = array( 
  'sil' => 'sil@kryogenix.org',
  'simon' => 'simon@incutio.com',
  'simonm' => 'simon@sitepoint.com',
  'nigel' => 'nrm@kingtide.com.au',
  'kev' => 'kevin@sitepoint.com'
);

$p = @$_GET['p'];

if (isset($names[$p]))
  setcookie('RSLite', $names[$p]);

?>
