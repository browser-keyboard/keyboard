var keyboardOption;
var languageList;

	/*[
		`, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =,
		q, w, e, r, t, y, u, i, o, p, [, ],
		a, s, d, f, g, h, j, k, l, ;, ', ",
		z, x, c, v, b, n, m, ',', '.', /
	];*/
	var keyCodes = [
		"Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal",
		"KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "KeyA",
		"KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote",
		"KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"
	];

  var keyBackspace = {
  	func: 'keyBackspace',
  	title: 'A',
  	code: 'Backspace'
  }
  var keyCaps = {
		func: 'keyCaps',
		title: 'D'
  }
  var keyNextLanguage = {
		func: 'keyNextLanguage',
		title: 'Shift + \' \''
  }
  var keySpace = {
		func: 'keySpace',
		title: '',
  	code: 'Space'
  }
  var keyAddit = {
		func: 'keyAddit',
		title: '!@#$'
  }
  var keyShift = {
		func: 'keyShift',
		title: 'C'
	}
  var keyEnter = {
		func: 'keyEnter',
		title: 'F',
  	code: 'Enter'
  }
  var keyDelete = {
		func: 'keyDelete',
		title: 'B',
  	code: 'Delete'
  };

  var comboNextLanguage = {
  	when: 'down',
  	shift: true,
  	code: 'Space',
  	keyFunction: 'keyNextLanguage',
  	func: 'keyNextLanguage'
  };

  var comboCaps = {
  	when: 'down',
  	code: 'CapsLock',
  	keyFunction: 'keyCaps',
  	func: 'keyCaps'
  };
  var comboShift = {
  	when: 'while',
  	shift: true,
  	keyFunction: 'keyShift',
  	func: 'keyShift'
  };
  var comboAddit = {
  	when: 'while',
  	ctrl: true,
  	alt: true,
  	keyFunction: 'keyAddit',
  	func: 'keyAddit'
  };


keyboardOption = {
  keySet : [
    ['layout', keyBackspace],
    ['layout', keyDelete],
    [keyCaps, 'layout', keyEnter ],
    [keyShift, 'layout', keyShift],
    [keyNextLanguage, keySpace, keyAddit]
  ],
  keyCodes: keyCodes,
  combos: [comboNextLanguage, comboCaps, comboShift, comboAddit]
}
