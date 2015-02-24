<?php

  $form_variables = array(
    'email' => array(
      'regexp' => '/^.+?@.+?\..+$/',
      'error' => 'This email address is invalid. ' .
        'It should be of the form someone@example.com.'
    ),
    'phone' => array(
      'regexp' => '/^[- ()0-9]+$/',
      'error' => 'A phone number must be digits only.'
    ),
    'country' => array(
      'regexp' => '/^[a-zA-Z][a-zA-Z]$/',
      'error' => 'Country codes are two letters only. ' . 
                 'Examples are US, UK or FR'
    )
  );

  function build_javascript($form_variables) {
    $js = "var validationSet = {\n";
    $entries = array();
    foreach ($form_variables as $name => $properties) {
      $entry = "  '$name': {\n";
      $entry .= "    'regexp': {$properties['regexp']},\n";
      $entry .= "    'error': '".addslashes($properties['error'])."'\n";
      $entry .= "  }";
      $entries[] = $entry;
    }
    $js .= join(",\n", $entries) . "\n";
    $js .= "}\n";
    return $js;
  }
      
  function build_form($form_variables, $errors=array(), $data=array()) {
    // Ensure $errors and $data have empty strings for incorrect fields
    foreach (array_keys($form_variables) as $name) {
      $data[$name] = isset($data[$name]) ? htmlspecialchars($data[$name]) : '';
      if (!isset($errors[$name])) {
        $errors[$name] = '';
      } elseif ($errors[$name]) {
        $data[$name] = ''; // Don't redisplay invalid data
      }
    }

    $javascript = build_javascript($form_variables);

    echo <<<EOD
      <script type="text/javascript">
        $javascript
      </script>
      <script type="text/javascript" src="genericValidation.js"></script>
      <form action="" method="post">
        <p>
          <label for="email">Email address</label>
          <input type="text" name="email" id="email"
               value="{$data['email']}">
          <span id="error_email" class="errormessage"
               >{$errors['email']}</span>
        </p>
        <p>
          <label for="phone">Phone number</label>
          <input type="text" name="phone" id="phone"
               value="{$data['phone']}">
          <span id="error_phone" class="errormessage"
               >{$errors['phone']}</span>
        </p>
        <p>
          <label for="country">Country code</label>
          <input type="text" name="country" id="country"
               size="2" maxlength="2" value="{$data['country']}">
          <span id="error_country" class="errormessage"
               >{$errors['country']}</span>
        </p>
        <p><input type="submit" value="submit"></p>
      </form>
EOD;
  }

  // Now generate the form or POST response page
  if ($_POST) {
    $errors = array();
    foreach ($form_variables as $name => $properties) {
      $value = isset($_POST[$name]) ? $_POST[$name] : '';
      if (!preg_match($properties['regexp'], $value)) {
        $errors[$name] = $properties['error'];
      }
    }
    if ($errors) {
      // Redisplay the form
      echo build_form($form_variables, $errors, $_POST);
    } else {
      // Process contents
      echo 'Processing...';
      echo '<pre>'; print_r($_POST); echo '</pre>';
    }
  } else {
    echo build_form($form_variables);
  }

?>
