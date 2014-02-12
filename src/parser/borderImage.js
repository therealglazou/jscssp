CSSParser.prototype.parseBorderImage = function()
{
  var borderImage = {url: "", offsets: [], widths: [], sizes: []};
  var token = this.getToken(true, true);
  if (token.isFunction("url(")) {
    token = this.getToken(true, true);
    var urlContent = this.parseURL(token);
    if (urlContent) {
      borderImage.url = urlContent.substr(0, urlContent.length - 1).trim();
      if ((borderImage.url[0] == '"' && borderImage.url[borderImage.url.length - 1] == '"')
          || (borderImage.url[0] == "'" && borderImage.url[borderImage.url.length - 1] == "'"))
        borderImage.url = borderImage.url.substr(1, borderImage.url.length - 2);
    }
    else
      return null;
  }
  else
    return null; 
  
  token = this.getToken(true, true);
  if (token.isNumber()
      || token.isPercentage())
    borderImage.offsets.push(token.value);
  else
    return null;
  var i;
  for (i= 0; i < 3; i++) {
    token = this.getToken(true, true);
    if (token.isNumber()
        || token.isPercentage())
      borderImage.offsets.push(token.value);
    else
      break;
  }
  if (i == 3)
    token = this.getToken(true, true);
  
  if (token.isSymbol("/")) {
    token = this.getToken(true, true);
    if (token.isDimension()
        || token.isNumber("0")
        || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES))
      borderImage.widths.push(token.value);
    else
      return null;
    
    for (var i = 0; i < 3; i++) {
      token = this.getToken(true, true);
      if (token.isDimension()
          || token.isNumber("0")
          || (token.isIdent() && token.value in this.kBORDER_WIDTH_NAMES))
        borderImage.widths.push(token.value);
      else
        break;
    }
    if (i == 3)
      token = this.getToken(true, true);
  }
  
  for (var i = 0; i < 2; i++) {
    if (token.isIdent("stretch")
        || token.isIdent("repeat")
        || token.isIdent("round"))
      borderImage.sizes.push(token.value);
    else if (!token.isNotNull())
      return borderImage;
    else
      return null;
    token = this.getToken(true, true);
  }
  if (!token.isNotNull())
    return borderImage;
  
  return null;
};

