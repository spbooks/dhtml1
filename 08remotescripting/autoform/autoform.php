<?php

  // Note: This code assumes magic_quotes is turned off
  // File containing a serialized key => value array

  $data_file = './serialized.dat';

  if (!file_exists($data_file)) {
    // Initalise file with default array keys
    $fp = fopen($data_file, 'w');
    fwrite($fp, serialize(array('name' => '', 'age' => '', 'shoesize' => '')));
    fclose($fp);
  }

  $from_file = unserialize(file_get_contents($data_file));

  if (isset($_GET['debug'])) {
    echo "<pre>"; print_r($from_file); exit;
  }

  $changed_keys = array();

  if ($_POST) {
    foreach (array_keys($from_file) as $key) {
      if (array_key_exists($key, $_POST) && $_POST[$key] != $from_file[$key]) {
        $changed_keys[] = $key;
        $from_file[$key] = $_POST[$key];
      }
    }
    if (count($changed_keys) > 0) {
      // Write data back to file
      $fp = fopen($data_file, 'w');
      fwrite($fp, serialize($from_file));
      fclose($fp);
    }
  }
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <link href="autoform.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="autoform.js"></script>
    <script type="text/javascript">
      aF.changedElements = [<?php 
        if (count($changed_keys) > 0) {
          echo "'" . implode("', '", array_map('addslashes', $changed_keys)) . "'";
        }
      ?>];
    </script>
  </head>
  <body>
    <h1>An auto-saving form</h1>

    <form method="post" class="auto" id="f1">
      <p>
        <label for="name">Name</label>
        <input type="text" name="name" id="name"
            value="<?php echo htmlspecialchars($from_file['name']); ?>">
      </p>
      <p>
        <label for="age">Age</label>
        <input type="text" name="age" id="age"
            value="<?php echo htmlspecialchars($from_file['age']); ?>">
      </p>
      <p>
        <label for="shoesize">Shoe size</label>
        <input type="text" name="shoesize" id="shoesize"
            value="<?php echo htmlspecialchars($from_file['shoesize']); ?>">
      </p>
      <input type="submit">
    </form>
  </body>
</html>
