CSSParser.prototype.currentToken = function() {
  return this.mToken;
};

CSSParser.prototype.getHexValue = function() {
  this.mToken = this.mScanner.nextHexValue();
  return this.mToken;
};

CSSParser.prototype.getToken = function(aSkipWS, aSkipComment) {
  if (this.mLookAhead) {
    this.mToken = this.mLookAhead;
    this.mLookAhead = null;
    return this.mToken;
  }
  
  this.mToken = this.mScanner.nextToken();
  while (this.mToken &&
         ((aSkipWS && this.mToken.isWhiteSpace()) ||
          (aSkipComment && this.mToken.isComment())))
    this.mToken = this.mScanner.nextToken();
  return this.mToken;
};

CSSParser.prototype.lookAhead = function(aSkipWS, aSkipComment) {
  var preservedToken = this.mToken;
  this.mScanner.preserveState();
  var token = this.getToken(aSkipWS, aSkipComment);
  this.mScanner.restoreState();
  this.mToken = preservedToken;
  
  return token;
};

CSSParser.prototype.ungetToken = function() {
  this.mLookAhead = this.mToken;
};

CSSParser.prototype.addWhitespace = function(aSheet, aString) {
  var rule = new jscsspWhitespace();
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

CSSParser.prototype.addComment = function(aSheet, aString) {
  var rule = new jscsspComment();
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

CSSParser.prototype._createJscsspDeclaration = function(property, value)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  decl.value = this.trim11(value);
  decl.parsedCssText = property + ": " + value + ";";
  return decl;
};

CSSParser.prototype._createJscsspDeclarationFromValue = function(property, valueText)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
  value.value = valueText;
  decl.values = [value];
  decl.valueText = valueText;
  decl.parsedCssText = property + ": " + valueText + ";";
  return decl;
};

CSSParser.prototype._createJscsspDeclarationFromValuesArray = function(property, values, valueText)
{
  var decl = new jscsspDeclaration();
  decl.property = property;
  decl.values = values;
  decl.valueText = valueText;
  decl.parsedCssText = property + ": " + valueText + ";";
  return decl;
};

CSSParser.prototype.preserveState = function() {
  this.mPreservedTokens.push(this.currentToken());
  this.mScanner.preserveState();
};

CSSParser.prototype.restoreState = function() {
  if (this.mPreservedTokens.length) {
    this.mScanner.restoreState();
    this.mToken = this.mPreservedTokens.pop();
  }
};

CSSParser.prototype.forgetState = function() {
  if (this.mPreservedTokens.length) {
    this.mScanner.forgetState();
    this.mPreservedTokens.pop();
  }
};

