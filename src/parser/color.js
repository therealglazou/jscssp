CSSParser.prototype.parseColor = function(token)
{
  var color = "";
  if (token.isFunction("rgb(")
      || token.isFunction("rgba(")) {
    color = token.value;
    var isRgba = token.isFunction("rgba(")
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isNumber() && !token.isPercentage())
      return "";
    color += token.value;
    
    if (isRgba) {
      token = this.getToken(true, true);
      if (!token.isSymbol(","))
        return "";
      color += ", ";
      
      token = this.getToken(true, true);
      if (!token.isNumber())
        return "";
      color += token.value;
    }
    
    token = this.getToken(true, true);
    if (!token.isSymbol(")"))
      return "";
    color += token.value;
  }
  
  else if (token.isFunction("hsl(")
           || token.isFunction("hsla(")) {
    color = token.value;
    var isHsla = token.isFunction("hsla(")
    token = this.getToken(true, true);
    if (!token.isNumber())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isPercentage())
      return "";
    color += token.value;
    token = this.getToken(true, true);
    if (!token.isSymbol(","))
      return "";
    color += ", ";
    
    token = this.getToken(true, true);
    if (!token.isPercentage())
      return "";
    color += token.value;
    
    if (isHsla) {
      token = this.getToken(true, true);
      if (!token.isSymbol(","))
        return "";
      color += ", ";
      
      token = this.getToken(true, true);
      if (!token.isNumber())
        return "";
      color += token.value;
    }
    
    token = this.getToken(true, true);
    if (!token.isSymbol(")"))
      return "";
    color += token.value;
  }
  
  else if (token.isIdent()
           && (token.value in this.kCOLOR_NAMES))
    color = token.value;
  
  else if (token.isSymbol("#")) {
    token = this.getHexValue();
    if (!token.isHex())
      return "";
    var length = token.value.length;
    if (length != 3 && length != 6)
      return "";
    if (token.value.match( /[a-fA-F0-9]/g ).length != length)
      return "";
    color = "#" + token.value;
  }
  return color;
};

