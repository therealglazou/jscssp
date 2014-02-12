CSSParser.prototype.addUnknownAtRule = function(aSheet, aString) {
  var currentLine = CountLF(this.mScanner.getAlreadyScanned());
  var blocks = [];
  var token = this.getToken(false, false);
  while (token.isNotNull()) {
    aString += token.value;
    if (token.isSymbol(";") && !blocks.length)
      break;
    else if (token.isSymbol("{")
             || token.isSymbol("(")
             || token.isSymbol("[")
             || token.type == "function") {
      blocks.push(token.isFunction() ? "(" : token.value);
    } else if (token.isSymbol("}")
               || token.isSymbol(")")
               || token.isSymbol("]")) {
      if (blocks.length) {
        var ontop = blocks[blocks.length - 1];
        if ((token.isSymbol("}") && ontop == "{")
            || (token.isSymbol(")") && ontop == "(")
            || (token.isSymbol("]") && ontop == "[")) {
          blocks.pop();
          if (!blocks.length && token.isSymbol("}"))
            break;
        }
      }
    }
    token = this.getToken(false, false);
  }
  
  this.addUnknownRule(aSheet, aString, currentLine);
};

CSSParser.prototype.addUnknownRule = function(aSheet, aString, aCurrentLine) {
  var errorMsg = this.consumeError();
  var rule = new jscsspErrorRule(errorMsg);
  rule.currentLine = aCurrentLine;
  rule.parsedCssText = aString;
  rule.parentStyleSheet = aSheet;
  aSheet.cssRules.push(rule);
};

