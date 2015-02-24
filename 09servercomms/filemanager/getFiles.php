<?php
header('Content-Type: text/xml');

$ROOT = realpath($_SERVER['DOCUMENT_ROOT'] . '/test');

echo "<files>\n";
$pth = isset($_GET['path']) ? $_GET['path'] : '/';
$rp = realpath($ROOT . $pth);

// Be paranoid; check that this is a subdir of ROOT
if (strpos($rp, $ROOT) === 0) {
  $dir = dir($rp);
  while ($entry = $dir->read()) {
    if (!is_dir($dir->path . '/' . $entry)) {
      echo '<file>' . htmlspecialchars($entry) . "</file>\n";
    }
  }
}
echo "</files>\n";
?>

