CSSParser.prototype.parseCueShorthand = function(token, declarations, aAcceptPriority)
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
    
    else if (token.isIdent("none"))
      values.push(token.value);
    
    else if (token.isFunction("url(")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      if (urlContent)
        values.push("url(" + urlContent);
      else
        return "";
    }
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
  aDecl.push(this._createJscsspDeclarationFromValue("cue-before", before));
  aDecl.push(this._createJscsspDeclarationFromValue("cue-after", after));
  return before + " " + after;
};

