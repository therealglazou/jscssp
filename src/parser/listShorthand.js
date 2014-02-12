CSSParser.prototype.parseListStyleShorthand = function(token, aDecl, aAcceptPriority)
{
  var kPosition = { "inside": true, "outside": true };
  
  var lType = null;
  var lPosition = null;
  var lImage = null;
  
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
    
    else if (!lType && !lPosition && ! lImage
             && token.isIdent(this.kINHERIT)) {
      lType = this.kINHERIT;
      lPosition = this.kINHERIT;
      lImage = this.kINHERIT;
    }
    
    else if (!lType &&
             (token.isIdent() && token.value in this.kLIST_STYLE_TYPE_NAMES)) {
      lType = token.value;
    }
    
    else if (!lPosition &&
             (token.isIdent() && token.value in kPosition)) {
      lPosition = token.value;
    }
    
    else if (!lImage && token.isFunction("url")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      if (urlContent) {
        lImage = "url(" + urlContent;
      }
      else
        return "";
    }
    else if (!token.isIdent("none"))
      return "";
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  lType = lType ? lType : "none";
  lImage = lImage ? lImage : "none";
  lPosition = lPosition ? lPosition : "outside";
  
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-type", lType));
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-position", lPosition));
  aDecl.push(this._createJscsspDeclarationFromValue("list-style-image", lImage));
  return lType + " " + lPosition + " " + lImage;
};

