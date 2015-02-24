<?php

// A quick and dirty XMLHTTP response script

header('Content-type: text/xml');
$username = $_GET['username'];
$name = $_GET['name'];
$names = explode(' ', $name);
$initial = substr(trim($name), 0, 1);
$surname = $names[count($names) - 1];
$firstname = $names[0];

?>
<usernames>
  <username><?php echo htmlspecialchars($firstname) . htmlspecialchars($surname); ?></username>
  <username><?php echo htmlspecialchars($initial) . htmlspecialchars($surname); ?></username>
  <username><?php echo htmlspecialchars($username); ?>194</username>
</usernames>
