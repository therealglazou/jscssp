CSSParser.prototype.parseMediaQuery = function()
{
  var kCONSTRAINTS = {
    "width": true,
    "min-width": true,
    "max-width": true,
    "height": true,
    "min-height": true,
    "max-height": true,
    "device-width": true,
    "min-device-width": true,
    "max-device-width": true,
    "device-height": true,
    "min-device-height": true,
    "max-device-height": true,
    "orientation": true,
    "aspect-ratio": true,
    "min-aspect-ratio": true,
    "max-aspect-ratio": true,
    "device-aspect-ratio": true,
    "min-device-aspect-ratio": true,
    "max-device-aspect-ratio": true,
    "color": true,
    "min-color": true,
    "max-color": true,
    "color-index": true,
    "min-color-index": true,
    "max-color-index": true,
    "monochrome": true,
    "min-monochrome": true,
    "max-monochrome": true,
    "resolution": true,
    "min-resolution": true,
    "max-resolution": true,
    "scan": true,
    "grid": true
  };
  
  var m = {cssText: "", amplifier: "", medium: "", constraints: []};
  var token = this.getToken(true, true);
  
  if (token.isIdent("all") ||
      token.isIdent("aural") ||
      token.isIdent("braille") ||
      token.isIdent("handheld") ||
      token.isIdent("print") ||
      token.isIdent("projection") ||
      token.isIdent("screen") ||
      token.isIdent("tty") ||
      token.isIdent("tv")) {
    m.medium = token.value;
    m.cssText += token.value;
    token = this.getToken(true, true);
  }
  else if (token.isIdent("not") || token.isIdent("only")) {
    m.amplifier = token.value.toLowerCase();
    m.cssText += token.value.toLowerCase();
    token = this.getToken(true, true);
    if (token.isIdent("all") ||
        token.isIdent("aural") ||
        token.isIdent("braille") ||
        token.isIdent("handheld") ||
        token.isIdent("print") ||
        token.isIdent("projection") ||
        token.isIdent("screen") ||
        token.isIdent("tty") ||
        token.isIdent("tv")) {
      m.cssText += " " + token.value;
      m.medium = token.value;
      token = this.getToken(true, true);
    }
    else
      return null;
  }
  
  if (m.medium) {
    if (!token.isNotNull())
      return m;
    if (token.isIdent("and")) {
      m.cssText += " and";
      token = this.getToken(true, true);
    }
    else if (!token.isSymbol("{"))
      return null;
  }
  
  while (token.isSymbol("(")) {
    token = this.getToken(true, true);
    if (token.isIdent() && (token.value in kCONSTRAINTS)) {
      var constraint = token.value;
      token = this.getToken(true, true);
      if (token.isSymbol(":")) {
        token = this.getToken(true, true);
        var values = [];
        while (!token.isSymbol(")")) {
          values.push(token.value);
          token = this.getToken(true, true);
        }
        if (token.isSymbol(")")) {
          m.constraints.push({constraint: constraint, value: values});
          m.cssText += " (" + constraint + ": " + values.join(" ") + ")";
          token = this.getToken(true, true);
          if (token.isNotNull()) {
            if (token.isIdent("and")) {
              m.cssText += " and";
              token = this.getToken(true, true);
            }
            else if (!token.isSymbol("{"))
              return null;
          }
          else
            return m;
        }
        else
          return null;
      }
      else if (token.isSymbol(")")) {
        m.constraints.push({constraint: constraint, value: null});
        m.cssText += " (" + constraint + ")";
        token = this.getToken(true, true);
        if (token.isNotNull()) {
          if (token.isIdent("and")) {
            m.cssText += " and";
            token = this.getToken(true, true);
          }
          else
            return null;
        }
        else
          return m;
      }
      else
        return null;
    }
    else
      return null;
  }
  return m;
};

