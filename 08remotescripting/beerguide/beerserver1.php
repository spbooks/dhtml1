<?php
  include 'beers.php';

  if ($_GET['action'] == 'beer') {
    $beer = $_GET['beer'];
    // Write out the beer definition
    echo $beers[$beer][1];
  } 
?>
