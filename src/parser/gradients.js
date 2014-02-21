CSSParser.prototype.parseColorStop = function(token)
{
  var color = this.parseColor(token);
  var position = "";
  if (!color)
    return null;
  token = this.getToken(true, true);
  if (token.isLength()) {
    position = token.value;
    token = this.getToken(true, true);
  }
  return { color: color, position: position }
};

CSSParser.prototype.parseGradient = function ()
{
  var kHPos = {"left": true, "right": true };
  var kVPos = {"top": true, "bottom": true };
  var kPos = {"left": true, "right": true, "top": true, "bottom": true, "center": true};
  
  var isRadial = false;
  var gradient = { isRepeating: false };
  var token = this.getToken(true, true);
  if (token.isNotNull()) {
    if (token.isFunction("linear-gradient(") ||
        token.isFunction("radial-gradient(") ||
        token.isFunction("repeating-linear-gradient(") ||
        token.isFunction("repeating-radial-gradient(")) {
      if (token.isFunction("radial-gradient(") ||
          token.isFunction("repeating-radial-gradient(")) {
        gradient.isRadial = true;
      }
      if (token.isFunction("repeating-linear-gradient(") ||
          token.isFunction("repeating-radial-gradient(")) {
        gradient.isRepeating = true;
      }
      
      
      token = this.getToken(true, true);
      var foundPosition = false;
      var haveAngle = false;
      
      /********** LINEAR **********/
      if (token.isAngle()) {
        gradient.angle = token.value;
        haveAngle = true;
        token = this.getToken(true, true);
        if (!token.isSymbol(","))
          return null;
        token = this.getToken(true, true);
      }
      
      else if (token.isIdent("to")) {
        foundPosition = true;
        token = this.getToken(true, true);
        if (token.isIdent("top")
            || token.isIdent("bottom")
            || token.isIdent("left")
            || token.isIdent("right")) {
          gradient.position = token.value;
          token = this.getToken(true, true);
          if (((gradient.position == "top" || gradient.position == "bottom") && (token.isIdent("left") || token.isIdent("right")))
              || ((gradient.position == "left" || gradient.position == "right") && (token.isIdent("top") || token.isIdent("bottom")))) {
            gradient.position += " " + token.value;
            token = this.getToken(true, true);
          }
        }
        else
          return null;
        
        if (!token.isSymbol(","))
          return null;
        token = this.getToken(true, true);
      }
      
      /********** RADIAL **********/
      else if (gradient.isRadial) {
        gradient.shape = "";
        gradient.extent = "";
        gradient.positions = [];
        gradient.at = "";
        
        while (!token.isIdent("at") && !token.isSymbol(",")) {
          if (!gradient.shape
              && (token.isIdent("circle") || token.isIdent("ellipse"))) {
            gradient.shape = token.value;
            token = this.getToken(true, true);
          }
          else if (!gradient.extent
                   && (token.isIdent("closest-corner")
                       || token.isIdent("closest-side")
                       || token.isIdent("farthest-corner")
                       || token.isIdent("farthest-corner"))) {
                     gradient.extent = token.value;
                     token = this.getToken(true, true);
                   }
          else if (gradient.positions.length < 2 && token.isLength()){
            gradient.positions.push(token.value);
            token = this.getToken(true, true);
          }
          else
            break;
        }
        
        // verify if the shape is null of well defined
        if ((gradient.positions.length == 1 && !gradient.extent && (gradient.shape == "circle" || !gradient.shape))
            || (gradient.positions.length == 2 && !gradient.extent && (gradient.shape == "ellipse" || !gradient.shape))
            || (!gradient.positions.length && gradient.extent)
            || (!gradient.positions.length && !gradient.extent)) {
          // shape ok
        }
        else  {
          return null;
        }
        
        if (token.isIdent("at")) {
          token = this.getToken(true, true);
          if (((token.isIdent() && token.value in kPos)
               || token.isDimension()
               || token.isNumber("0")
               || token.isPercentage())) {
            gradient.at = token.value;
            token = this.getToken(true, true);
            if (token.isDimension() || token.isNumber("0") || token.isPercentage()) {
              gradient.at += " " + token.value;
            }
            else if (token.isIdent() && token.value in kPos) {
              if ((gradient.at in kHPos && token.value in kHPos) ||
                  (gradient.at in kVPos && token.value in kVPos))
                return "";
              gradient.at += " " + token.value;
            }
            else {
              this.ungetToken();
              gradient.at += " center";
            }
          }
          else
            return null;
          
          token = this.getToken(true, true);
        }
        
        if (gradient.shape || gradient.extent || gradient.positions.length || gradient.at) {
          if (!token.isSymbol(","))
            return null;
          token = this.getToken(true, true);
        }
      }
      
      // now color stops...
      var stop1 = this.parseColorStop(token);
      if (!stop1)
        return null;
      token = this.currentToken();
      if (!token.isSymbol(","))
        return null;
      token = this.getToken(true, true);
      var stop2 = this.parseColorStop(token);
      if (!stop2)
        return null;
      token = this.currentToken();
      if (token.isSymbol(",")) {
        token = this.getToken(true, true);
      }
      // ok we have at least two color stops
      gradient.stops = [stop1, stop2];
      while (!token.isSymbol(")")) {
        var colorstop = this.parseColorStop(token);
        if (!colorstop)
          return null;
        token = this.currentToken();
        if (!token.isSymbol(")") && !token.isSymbol(","))
          return null;
        if (token.isSymbol(","))
          token = this.getToken(true, true);
        gradient.stops.push(colorstop);
      }
      return gradient;
    }
  }
  return null;
};

CSSParser.prototype.serializeGradient = function(gradient)
{
  var s = gradient.isRadial
  ? (gradient.isRepeating ? "repeating-radial-gradient(" : "radial-gradient(" )
  : (gradient.isRepeating ? "repeating-linear-gradient(" : "linear-gradient(" );
  if (gradient.angle || gradient.position)
    s += (gradient.angle ? gradient.angle: "") +
    (gradient.position ? "to " + gradient.position : "") +
    ", ";
  
  if (gradient.isRadial)
    s += (gradient.shape ? gradient.shape + " " : "") +
    (gradient.extent ? gradient.extent + " " : "") +
    (gradient.positions.length ? gradient.positions.join(" ") + " " : "") +
    (gradient.at ? "at " + gradient.at + " " : "") +
    (gradient.shape || gradient.extent || gradient.positions.length || gradient.at ? ", " : "");
  
  for (var i = 0; i < gradient.stops.length; i++) {
    var colorstop = gradient.stops[i];
    s += colorstop.color + (colorstop.position ? " " + colorstop.position : "");
    if (i != gradient.stops.length -1)
      s += ", ";
  }
  s += ")";
  return s;
};


