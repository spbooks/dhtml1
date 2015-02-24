<?php
  include 'beers.php';
  
  if ($_GET['action'] == 'character') {
    
    $character = $_GET['character'];

    // highlight one character
    foreach ($beercharacters as $bc) { ?>
      document.getElementById('<?php echo addslashes($bc); ?>').className = '';
    <?php } ?>
    document.getElementById('<?php echo addslashes($character); ?>').className = 'highlight';
    <?php

    // highlight beers of that character
    foreach (array_keys($beers) as $beer) { ?>
      document.getElementById('<?php echo addslashes($beer); ?>').className = '';
      <?php if ($beers[$beer][2] == $character) { ?>
        document.getElementById('<?php echo addslashes($beer); ?>').className = 'highlight';
      <?php }
    }
  }
?>
