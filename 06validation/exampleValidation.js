var validationSet = {
  'email': {
    'regexp': /^.+?@.+?\..+$/,
    'error': 'This email address is invalid. ' +
        'It should be of the form someone@example.com.'
  },
  'phone': {
    'regexp': /^[- ()0-9]+$/,
    'error': 'A phone number must be digits only.'
  },
  'country': {
    'regexp': /^[a-zA-Z][a-zA-Z]$/,
    'error': 'Country codes are two letters only. ' +
        'Examples are US, UK or FR.'
  }
};
