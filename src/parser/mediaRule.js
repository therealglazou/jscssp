CSSParser.prototype.parseMediaRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var mediaRule = new jscsspMediaRule();
  mediaRule.currentLine = currentLine;
  this.preserveState();
  var token = this.getToken(true, true);
  var foundMedia = false;
  while (token.isNotNull()) {
    this.ungetToken();
    var mediaQuery = this.parseMediaQuery();
    token = this.currentToken();
    if (mediaQuery) {
      foundMedia = true;
      s += " " + mediaQuery.cssText;
      mediaRule.media.push(mediaQuery.cssText);
      if (token.isSymbol(",")) {
        s += ",";
      } else {
        if (token.isSymbol("{"))
          break;
        else {
          // error...
          token.type = jscsspToken.NULL_TYPE;
          break;
        }
      }
    }
    else if (token.isSymbol("{"))
      break;
    else if (foundMedia) {
      token.type = jscsspToken.NULL_TYPE;
      // not a media list
      break;
    }
    
    token = this.getToken(true, true);
  }
  if (token.isSymbol("{") && mediaRule.media.length) {
    // ok let's parse style rules now...
    s += " { ";
    token = this.getToken(true, false);
    while (token.isNotNull()) {
      if (token.isComment()) {
        if (this.mPreserveComments) {
          s += " " + token.value;
          var comment = new jscsspComment();
          comment.parsedCssText = token.value;
          mediaRule.cssRules.push(comment);
        }
      } else if (token.isSymbol("}")) {
        valid = true;
        break;
      } else {
        var r = this.parseStyleRule(token, mediaRule, true);
        if (r)
          s += r;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    mediaRule.parsedCssText = s;
    aSheet.cssRules.push(mediaRule);
    return true;
  }
  this.restoreState();
  return false;
};

