CSSParser.prototype.parse = function(aString, aTryToPreserveWhitespaces, aTryToPreserveComments) {
  if (!aString)
    return null; // early way out if we can
  
  this.mPreserveWS       = aTryToPreserveWhitespaces;
  this.mPreserveComments = aTryToPreserveComments;
  this.mPreservedTokens = [];
  this.mScanner.init(aString);
  var sheet = new jscsspStylesheet();
  
  // @charset can only appear at first char of the stylesheet
  var token = this.getToken(false, false);
  if (!token.isNotNull())
    return sheet;
  if (token.isAtRule("@charset")) {
    this.ungetToken();
    this.parseCharsetRule(sheet);
    token = this.getToken(false, false);
  }
  
  var foundStyleRules = false;
  var foundImportRules = false;
  var foundNameSpaceRules = false;
  while (true) {
    if (!token.isNotNull())
      break;
    if (token.isWhiteSpace())
    {
      if (aTryToPreserveWhitespaces)
        this.addWhitespace(sheet, token.value);
    }
    
    else if (token.isComment())
    {
      if (this.mPreserveComments)
        this.addComment(sheet, token.value);
    }
    
    else if (token.isAtRule()) {
      if (token.isAtRule("@variables")) {
        if (!foundImportRules && !foundStyleRules)
          this.parseVariablesRule(token, sheet);
        else {
          this.reportError(kVARIABLES_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@import")) {
        // @import rules MUST occur before all style and namespace
        // rules
        if (!foundStyleRules && !foundNameSpaceRules)
          foundImportRules = this.parseImportRule(token, sheet);
        else {
          this.reportError(kIMPORT_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@namespace")) {
        // @namespace rules MUST occur before all style rule and
        // after all @import rules
        if (!foundStyleRules)
          foundNameSpaceRules = this.parseNamespaceRule(token, sheet);
        else {
          this.reportError(kNAMESPACE_RULE_POSITION);
          this.addUnknownAtRule(sheet, token.value);
        }
      }
      else if (token.isAtRule("@font-face")) {
        if (this.parseFontFaceRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@page")) {
        if (this.parsePageRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@media")) {
        if (this.parseMediaRule(token, sheet))
          foundStyleRules = true;
        else
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@keyframes")) {
        if (!this.parseKeyframesRule(token, sheet))
          this.addUnknownAtRule(sheet, token.value);
      }
      else if (token.isAtRule("@charset")) {
        this.reportError(kCHARSET_RULE_CHARSET_SOF);
        this.addUnknownAtRule(sheet, token.value);
      }
      else {
        this.reportError(kUNKNOWN_AT_RULE);
        this.addUnknownAtRule(sheet, token.value);
      }
    }
    
    else // plain style rules
    {
      var ruleText = this.parseStyleRule(token, sheet, false);
      if (ruleText)
        foundStyleRules = true;
    }
    token = this.getToken(false);
  }
  
  return sheet;
};
