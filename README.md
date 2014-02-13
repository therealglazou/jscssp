# JSCSSP

JSCSSP is a CSS parser in JavaScript.

## Installation

### Manually

Download [cssParser.js](cssParser.js) and include the file in your project.

### With [npm](https://npmjs.org/)

```sh
npm install jscssp
```

## Usage

```javascript
var CSSParser = require('jscssp'); // If installed via npm

var source = 'body { font: 2em sans-serif; }';

var parser = new CSSParser();
var sheet = parser.parse(source, false, true);

var textResult = sheet.cssText()
console.log(textResult);
```

## FAQ

### Why a CSS parser in JavaScript?

Because my (x)html editor based on Gecko is unable to edit CSS rules or
declarations that are not implemented - and then dropped - by Gecko's Style
Engine. Since a content editor for the Web does not target one browser only, I
needed a way to parse and preserve all the contents of a stylesheet, including
unrecognized rules or properties, comments and even whitespaces.

### What's the license attached to JSCCSP?

The code is distributed under the tri-license MPL/GPL/LGPL.

### What's the ETA for v1.0?

No idea, really.

### Wow 3000+ lines of code, that's a lot…

Nope it is not for a real parser, not based on RegExps and with a CSS Object Model output. You can still minify the code if you need a smaller footprint but don't forget to preserve the license block.

### does it work in Internet Explorer?

Yeah, unfortunately… I had to downgrade the quality of my code to support that
hum well hum "browser". Nuf said.

### How can I submit a bug or a suggestion?

daniel at glazman dot org

## License

[Mozilla Public License, version 2.0](LICENSE)
