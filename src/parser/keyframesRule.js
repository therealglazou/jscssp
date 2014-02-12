CSSParser.prototype.parseKeyframesRule = function(aToken, aSheet) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var s = aToken.value;
  var valid = false;
  var keyframesRule = new jscsspKeyframesRule();
  keyframesRule.currentLine = currentLine;
  this.preserveState();
  var token = this.getToken(true, true);
  var foundName = false;
  while (token.isNotNull()) {
    if (token.isIdent()) {
      // should be the keyframes' name
      foundName = true;
      s += " " + token.value;
      keyframesRule.name = token.value;
      token = this.getToken(true, true);
      if (token.isSymbol("{"))
        this.ungetToken();
      else {
        // error...
        token.type = jscsspToken.NULL_TYPE;
        break;
      }
    }
    else if (token.isSymbol("{")) {
      if (!foundName) {
        token.type = jscsspToken.NULL_TYPE;
        // not a valid keyframes at-rule
      }
      break;
    }
    else {
      token.type = jscsspToken.NULL_TYPE;
      // not a valid keyframes at-rule
      break;
    }
    token = this.getToken(true, true);
  }
  
  if (token.isSymbol("{") && keyframesRule.name) {
    // ok let's parse keyframe rules now...
    s += " { ";
    token = this.getToken(true, false);
    while (token.isNotNull()) {
      if (token.isComment() && this.mPreserveComments) {
        s += " " + token.value;
        var comment = new jscsspComment();
        comment.parsedCssText = token.value;
        keyframesRule.cssRules.push(comment);
      } else if (token.isSymbol("}")) {
        valid = true;
        break;
      } else {
        var r = this.parseKeyframeRule(token, keyframesRule, true);
        if (r)
          s += r;
      }
      token = this.getToken(true, false);
    }
  }
  if (valid) {
    this.forgetState();
    keyframesRule.currentLine = currentLine;
    keyframesRule.parsedCssText = s;
    aSheet.cssRules.push(keyframesRule);
    return true;
  }
  this.restoreState();
  return false;
};

CSSParser.prototype.parseKeyframeRule = function(aToken, aOwner) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  this.preserveState();
  var token = aToken;
  
  // find the keyframe keys
  var key = "";
  while (token.isNotNull()) {
    if (token.isIdent() || token.isPercentage()) {
      if (token.isIdent()
          && !token.isIdent("from")
          && !token.isIdent("to")) {
        key = "";
        break;
      }
      key += token.value;
      token = this.getToken(true, true);
      if (token.isSymbol("{")) {
        this.ungetToken();
        break;
      }
      else 
        if (token.isSymbol(",")) {
          key += ", ";
        }
        else {
          key = "";
          break;
        }
    }
    else {
      key = "";
      break;
    }
    token = this.getToken(true, true);
  }
  
  var valid = false;
  var declarations = [];
  if (key) {
    var s = key;
    token = this.getToken(true, true);
    if (token.isSymbol("{")) {
      s += " { ";
      token = this.getToken(true, false);
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
    // key is invalid so the whole rule is invalid with it
  }
  
  if (valid) {
    var rule = new jscsspKeyframeRule();
    rule.currentLine = currentLine;
    rule.parsedCssText = s;
    rule.declarations = declarations;
    rule.keyText = key;
    rule.parentRule = aOwner;
    aOwner.cssRules.push(rule);
    return s;
  }
  this.restoreState();
  s = this.currentToken().value;
  this.addUnknownAtRule(aOwner, s);
  return "";
};

