CSSParser.prototype.trim11 = function(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test( str.charAt(i) )) { // XXX charat
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
};

CSSParser.prototype.parseStyleRule = function(aToken, aOwner, aIsInsideMediaRule)
{
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  this.preserveState();
  // first let's see if we have a selector here...
  var selector = this.parseSelector(aToken, false);
  var valid = false;
  var declarations = [];
  if (selector) {
    selector = this.trim11(selector.selector);
    var s = selector;
    var token = this.getToken(true, true);
    if (token.isSymbol("{")) {
      s += " { ";
      var token = this.getToken(true, false);
      while (true) {
        if (!token.isNotNull()) {
          valid = true;
          break;
        }
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, declarations, true, true, aOwner);
          s += ((d && declarations.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  else {
    // selector is invalid so the whole rule is invalid with it
  }
  
  if (valid) {
    var rule = new jscsspStyleRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.mSelectorText = selector;
    if (aIsInsideMediaRule)
      rule.parentRule = aOwner;
    else
      rule.parentStyleSheet = aOwner;
    aOwner.cssRules.push(rule);
    return s;
  }
  this.restoreState();
  s = this.currentToken().value;
  this.addUnknownAtRule(aOwner, s);
  return "";
};

