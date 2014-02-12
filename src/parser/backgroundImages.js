CSSParser.prototype.parseBackgroundImages = function()
{
  var backgrounds = [];
  var token = this.getToken(true, true);
  while (token.isNotNull()) {
    if (token.isFunction("url(")) {
      token = this.getToken(true, true);
      var urlContent = this.parseURL(token);
      backgrounds.push( { type: "image", value: "url(" + urlContent });
      token = this.getToken(true, true);
    }
    else if (token.isFunction("linear-gradient(")
             || token.isFunction("radial-gradient(")
             || token.isFunction("repeating-linear-gradient(")
             || token.isFunction("repeating-radial-gradient(")) {
      this.ungetToken();
      var gradient = this.parseGradient();
      if (gradient) {
        backgrounds.push({
                         type: gradient.isRadial ? "radial-gradient" : "linear-gradient",
                         value: gradient
                         });
        token = this.getToken(true, true);
      }
      else
        return null;
    }
    else if (token.isIdent("none")
             || token.isIdent("inherit")
             || token.isIdent("initial")) {
      backgrounds.push( { type: token.value });
      token = this.getToken(true, true);
    }
    else
      return null;
    
    if (token.isSymbol(",")) {
      token = this.getToken(true, true);
      if (!token.isNotNull())
        return null;
    }
  }
  return backgrounds;
};

