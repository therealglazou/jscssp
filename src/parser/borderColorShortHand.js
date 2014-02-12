CSSParser.prototype.parseBorderColorShorthand = function(token, aDecl, aAcceptPriority)
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
      token = this.getToken(true, true);
      break;
    }
    
    else {
      var color = this.parseColor(token);
      if (color)
        values.push(color);
      else
        return "";
    }
    
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
  aDecl.push(this._createJscsspDeclarationFromValue("border-top-color", top));
  aDecl.push(this._createJscsspDeclarationFromValue("border-right-color", right));
  aDecl.push(this._createJscsspDeclarationFromValue("border-bottom-color", bottom));
  aDecl.push(this._createJscsspDeclarationFromValue("border-left-color", left));
  return top + " " + right + " " + bottom + " " + left;
};

