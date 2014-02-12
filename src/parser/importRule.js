CSSParser.prototype.parseImportRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  this.preserveState();
  var token = this.getToken(true, true);
  var media = [];
  var href = "";
  if (token.isString()) {
    href = token.value;
    s += " " + href;
  }
  else if (token.isFunction("url(")) {
    token = this.getToken(true, true);
    var urlContent = this.parseURL(token);
    if (urlContent) {
      href = "url(" + urlContent;
      s += " " + href;
    }
  }
  else
    this.reportError(kIMPORT_RULE_MISSING_URL);
  
  if (href) {
    token = this.getToken(true, true);
    while (token.isIdent()) {
      s += " " + token.value;
      media.push(token.value);
      token = this.getToken(true, true);
      if (!token)
        break;
      if (token.isSymbol(",")) {
        s += ",";
      } else if (token.isSymbol(";")) {
        break;
      } else
        break;
      token = this.getToken(true, true);
    }
    
    if (!media.length) {
      media.push("all");
    }
    
    if (token.isSymbol(";")) {
      s += ";"
      this.forgetState();
      var rule = new jscsspImportRule();
      rule.currentLine = currentLine;
      rule.parsedCssText = s;
      rule.href = href;
      rule.media = media;
      rule.parentStyleSheet = aSheet;
      aSheet.cssRules.push(rule);
      return true;
    }
  }
  
  this.restoreState();
  this.addUnknownAtRule(aSheet, "@import");
  return false;
};

