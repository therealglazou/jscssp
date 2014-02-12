CSSParser.prototype.parseBorderStyleShorthand = function(token, aDecl, aAcceptPriority)
{
  var top = null;
  var bottom = null;
  var left = null;
  var right = null;
  
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
    
    else if (token.isIdent() && token.value in this.kBORDER_STYLE_NAMES) {
      values.push(token.value);
    }
    else
      return "";
    
    token = this.getToken(true, true);
  }
  
  var count = values.length;
  switch (count) {
    case 1:
      top = values[0];
      bottom = top;
      left = top;
      right = top;
      break;
    case 2:
      top = values[0];
      bottom = top;
      left = values[1];
      right = left;
      break;
    case 3:
      top = values[0];
      left = values[1];
      right = left;
      bottom = values[2];
      break;
    case 4:
      top = values[0];
      right = values[1];
      bottom = values[2];
      left = values[3];
      break;
    default:
      return "";
  }
  this.forgetState();
  aDecl.push(this._createJscsspDeclarationFromValue("border-top-style", top));
  aDecl.push(this._createJscsspDeclarationFromValue("border-right-style", right));
  aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-style", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue("border-left-style", left));
  return top + " " + right + " " + bottom + " " + left;
};

