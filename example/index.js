var fs = require('fs');
var CSSParser = require('../');

var source = fs.readFileSync(__dirname + '/source.css', 'utf8');

var parser = new CSSParser();
var sheet = parser.parse(source, false, true);

console.log(sheet.cssText());
