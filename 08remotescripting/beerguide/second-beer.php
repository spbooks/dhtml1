<?php
  include 'beers.php';
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>The beer guide</title>
    <link rel="stylesheet" type="text/css" href="second-beer.css">
  </head>
  <body>
    <h1>The beer guide</h1>

    <div id="characters">
      <h2>Beer characters</h2>
      <ul>
        <?php foreach ($beercharacters as $beerchar) { ?>
          <li>
            <a id="<?php echo htmlspecialchars($beerchar); ?>"
                href="character.php?character=<?php
                echo htmlspecialchars($beerchar); ?>"><?php
                echo htmlspecialchars($beerchar); ?></a>
          </li>
        <?php } ?>
      </ul>
    </div>

    <div id="beers">
      <h2>The beers</h2>
      <ul>
        <?php foreach (array_keys($beers) as $beer) { ?>
          <li>
            <a id="<?php echo htmlspecialchars($beer); ?>"
                href="beer.php?beer=<?php
                echo htmlspecialchars($beer); ?>"><?php
                echo htmlspecialchars($beers[$beer][0]); ?></a>
        </li>
        <?php } ?>
      </ul>
    </div>

    <div id="beerdata">
      <h2>Beer data</h2>
      <p id="beerdef"></p>
    </div>
  </body>
</html>
