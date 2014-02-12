CSSParser.prototype.parseBorderEdgeOrOutlineShorthand = function(token, aDecl, aAcceptPriority, aProperty)
{
  var bWidth = null;
  var bStyle = null;
  var bColor = null;
  
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
    
    else if (!bWidth
             && !bStyle
             && !bColor
             && token.isIdent(this.kINHERIT)) {
      bWidth = this.kINHERIT;
      bStyle = this.kINHERIT;
      bColor = this.kINHERIT;
    }
    
    else if (!bWidth &&
             (token.isDimension()
              || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES)
              || token.isNumber("0"))) {
               bWidth = token.value;
             }
    
    else if (!bStyle &&
             (token.isIdent() && token.value in this.kBORDER_STYLE_NAMES)) {
      bStyle = token.value;
    }
    
    else {
      var color = (aProperty == "outline" && token.isIdent("invert"))
      ? "invert" : this.parseColor(token);
      if (!bColor && color)
        bColor = color;
      else
        return "";
    }
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  bWidth = bWidth ? bWidth : "medium";
  bStyle = bStyle ? bStyle : "none";
  bColor = bColor ? bColor : "-moz-initial";
  
  function addPropertyToDecl(aSelf, aDecl, property, w, s, c) {
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-width", w));
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-style", s));
    aDecl.push(aSelf._createJscsspDeclarationFromValue(property + "-color", c));
  }
  
  if (aProperty == "border") {
    addPropertyToDecl(this, aDecl, "border-top", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-right", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-bottom", bWidth, bStyle, bColor);
    addPropertyToDecl(this, aDecl, "border-left", bWidth, bStyle, bColor);
  }
  else
    addPropertyToDecl(this, aDecl, aProperty, bWidth, bStyle, bColor);
  return bWidth + " " + bStyle + " " + bColor;
};

