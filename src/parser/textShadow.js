CSSParser.prototype.parseTextShadows = function()
{
  var shadows = [];
  var token = this.getToken(true, true);
  var color = "", blurRadius = "0px", offsetX = "0px", offsetY = "0px"; 
  while (token.isNotNull()) {
    if (token.isIdent("none")) {
      shadows.push( { none: true } );
      token = this.getToken(true, true);
    }
    else {
      if (token.isFunction("rgb(") ||
          token.isFunction("rgba(") ||
          token.isFunction("hsl(") ||
          token.isFunction("hsla(") ||
          token.isSymbol("#") ||
          token.isIdent()) {
        var color = this.parseColor(token);
        token = this.getToken(true, true);
      }
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetX = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var offsetY = token.value;
        token = this.getToken(true, true);
      }
      else
        return [];
      if (token.isPercentage() ||
          token.isDimensionOfUnit("cm") ||
          token.isDimensionOfUnit("mm") ||
          token.isDimensionOfUnit("in") ||
          token.isDimensionOfUnit("pc") ||
          token.isDimensionOfUnit("px") ||
          token.isDimensionOfUnit("em") ||
          token.isDimensionOfUnit("ex") ||
          token.isDimensionOfUnit("pt")) {
        var blurRadius = token.value;
        token = this.getToken(true, true);
      }
      if (!color &&
          (token.isFunction("rgb(") ||
           token.isFunction("rgba(") ||
           token.isFunction("hsl(") ||
           token.isFunction("hsla(") ||
           token.isSymbol("#") ||
           token.isIdent())) {
            var color = this.parseColor(token);
            token = this.getToken(true, true);
          }
      
      shadows.push( { none: false,
                   color: color,
                   offsetX: offsetX, offsetY: offsetY,
                   blurRadius: blurRadius } );
      
      if (token.isSymbol(",")) {
        color = "";
        blurRadius = "0px";
        offsetX = "0px";
        offsetY = "0px"; 
        token = this.getToken(true, true);
      }
      else if (!token.isNotNull())
        return shadows;
      else
        return [];
    }
  }
  return shadows;
};

