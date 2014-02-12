CSSParser.prototype.parseVariablesRule = function(token, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = token.value;
  var declarations = [];
  var valid = false;
  this.preserveState();
  token = this.getToken(true, true);
  var media = [];
  var foundMedia = false;
  while (token.isNotNull()) {
    if (token.isIdent()) {
      foundMedia = true;
      s += " " + token.value;
      media.push(token.value);
      token = this.getToken(true, true);
      if (token.isSymbol(",")) {
        s += ",";
      } else {
        if (token.isSymbol("{"))
          this.ungetToken();
        else {
          // error...
          token.type = jscsspToken.NULL_TYPE;
          break;
        }
      }
    } else if (token.isSymbol("{"))
      break;
    else if (foundMedia) {
      token.type = jscsspToken.NULL_TYPE;
      // not a media list
      break;
    }
    token = this.getToken(true, true);
  }
  
  if (token.isSymbol("{")) {
    s += " {";
    token = this.getToken(true, true);
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
        var d = this.parseDeclaration(token, declarations, true, false, aSheet);
        s += ((d && declarations.length) ? " " : "") + d;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    var rule = new jscsspVariablesRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.media = media;
    rule.parentStyleSheet = aSheet;
    aSheet.cssRules.push(rule)
    return true;
  }
  this.restoreState();
  return false;
};

