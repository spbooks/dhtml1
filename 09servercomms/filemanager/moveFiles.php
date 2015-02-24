<?php
$ROOT = realpath($_SERVER['DOCUMENT_ROOT'] . '/test');

$path = isset($_GET['path']) ? $_GET['path'] : '/';
$rp = realpath($ROOT . $path);
// Be paranoid; check that this is a subdir of ROOT
if (strpos($rp, $ROOT) === 0) {
  $fname=isset($_GET['file']) ? $_GET['file'] : '';
  $fn = realpath($ROOT . $fname);
  if (strpos($fn, $ROOT) === 0) {
    if (is_dir($rp) && file_exists($fn)) {
      $fileonly = basename($fn);
      rename($fn, $rp . '/' . $fileonly) or die('Moving file failed');
      print 'OK';
    } else {
      print 'File or directory bad';
    }
  } else {
    print 'Bad filename';
  }
} else {
  print 'Bad directory';
}
?>
