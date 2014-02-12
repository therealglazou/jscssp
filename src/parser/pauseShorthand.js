CSSParser.prototype.parsePauseShorthand = function(token, declarations, aAcceptPriority)
{
  var before = "";
  var after = "";
  
  var values = [];
  var values = [];
  while (true) {
    
    if (!token.isNotNull())
      break;
    
    if (token.isSymbol(";")
        || (aAcceptPriority && token.isSymbol("!"))
        || token.isSymbol("}")) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    else if (!values.length && token.isIdent(this.kINHERIT)) {
      values.push(token.value);
    }
    
    else if (token.isDimensionOfUnit("ms")
             || token.isDimensionOfUnit("s")
             || token.isPercentage()
             || token.isNumber("0"))
      values.push(token.value);
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      before = values[0];
      after = before;
      break;
    case 2:
      before = values[0];
      after = values[1];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("pause-before", before));
  aDecl.push(this._createJscsspDeclarationFromValue("pause-after", after));
  return before + " " + after;
};

