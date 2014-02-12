CSSParser.prototype.parseNamespaceRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  this.preserveState();
  var token = this.getToken(true, true);
  if (token.isNotNull()) {
    var prefix = "";
    var url = "";
    if (token.isIdent()) {
      prefix = token.value;
      s += " " + prefix;
      token = this.getToken(true, true);
    }
    if (token) {
      var foundURL = false;
      if (token.isString()) {
        foundURL = true;
        url = token.value;
        s += " " + url;
      } else if (token.isFunction("url(")) {
        // get a url here...
        token = this.getToken(true, true);
        var urlContent = this.parseURL(token);
        if (urlContent) {
          url += "url(" + urlContent;
          foundURL = true;
          s += " " + urlContent;
        }
      }
    }
    if (foundURL) {
      token = this.getToken(true, true);
      if (token.isSymbol(";")) {
        s += ";";
        this.forgetState();
        var rule = new jscsspNamespaceRule();
        rule.currentLine = currentLine;
        rule.parsedCssText = s;
        rule.prefix = prefix;
        rule.url = url;
        rule.parentStyleSheet = aSheet;
        aSheet.cssRules.push(rule);
        return true;
      }
    }
    
  }
  this.restoreState();
  this.addUnknownAtRule(aSheet, "@namespace");
  return false;
};

