CSSParser.prototype.parsePageRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var declarations = [];
  this.preserveState();
  var token = this.getToken(true, true);
  var pageSelector = "";
  if (token.isSymbol(":") || token.isIdent()) {
    if (token.isSymbol(":")) {
      pageSelector = ":";
      token = this.getToken(false, false);
    }
    if (token.isIdent()) {
      pageSelector += token.value;
      s += " " + pageSelector;
      token = this.getToken(true, true);
    }
  }
  if (token.isNotNull()) {
    // expecting block start
    if (token.isSymbol("{")) {
      s += " " + token.value;
      var token = this.getToken(true, false);
      while (true) {
        if (token.isSymbol("}")) {
          s += "}";
          valid = true;
          break;
        } else {
          var d = this.parseDeclaration(token, declarations, true, true, aSheet);
          s += ((d && declarations.length) ? " " : "") + d;
        }
        token = this.getToken(true, false);
      }
    }
  }
  if (valid) {
    this.forgetState();
    var rule = new jscsspPageRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.pageSelector = pageSelector;
    rule.declarations = declarations;
    rule.parentStyleSheet = aSheet;
    aSheet.cssRules.push(rule)
    return true;
  }
  this.restoreState();
  return false;
};

