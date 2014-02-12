CSSParser.prototype.parseBackgroundShorthand = function(token, aDecl, aAcceptPriority)
{
  var kHPos = {
    "left" : true,
    "right" : true
  };
  var kVPos = {
    "top" : true,
    "bottom" : true
  };
  var kPos = {
    "left" : true,
    "right" : true,
    "top" : true,
    "bottom" : true,
    "center" : true
  };
  
  var bgColor = null;
  var bgRepeat = null;
  var bgAttachment = null;
  var bgImage = null;
  var bgPosition = null;
  
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
    
    else if (!bgColor
             && !bgRepeat
             && !bgAttachment
             && !bgImage
             && !bgPosition
             && token.isIdent(this.kINHERIT)) {
      bgColor = this.kINHERIT;
      bgRepeat = this.kINHERIT;
      bgAttachment = this.kINHERIT;
      bgImage = this.kINHERIT;
      bgPosition = this.kINHERIT;
    }
    
    else {
      if (!bgAttachment
          && (token.isIdent("scroll") || token.isIdent("fixed"))) {
        bgAttachment = token.value;
      }
      
      else if (!bgPosition
               && ((token.isIdent() && token.value in kPos)
                   || token.isDimension()
                   || token.isNumber("0")
                   || token.isPercentage())) {
                 bgPosition = token.value;
                 token = this.getToken(true, true);
                 if (token.isDimension()
                     || token.isNumber("0")
                     || token.isPercentage()) {
                   bgPosition += " " + token.value;
                 } else if (token.isIdent() && token.value in kPos) {
                   if ((bgPosition in kHPos && token.value in kHPos)
                       || (bgPosition in kVPos && token.value in kVPos))
                     return "";
                   bgPosition += " " + token.value;
                 } else {
                   this.ungetToken();
                   bgPosition += " center";
                 }
               }
      
      else if (!bgRepeat
               && (token.isIdent("repeat")
                   || token.isIdent("repeat-x")
                   || token.isIdent("repeat-y")
                   || token.isIdent("no-repeat"))) {
                 bgRepeat = token.value;
               }
      
      else if (!bgImage
               && (token.isFunction("url(") || token.isIdent("none"))) {
        bgImage = token.value;
        if (token.isFunction("url(")) {
          token = this.getToken(true, true);
          var url = this.parseURL(token); // TODO
          if (url)
            bgImage += url;
          else
            return "";
        }
      }
      
      else if (!bgImage
               && (token.isFunction("linear-gradient(")
                   || token.isFunction("radial-gradient(")
                   || token.isFunction("repeating-linear-gradient(") || token.isFunction("repeating-radial-gradient("))) {
                 this.ungetToken();
                 var gradient = this.parseGradient();
                 if (gradient)
                   bgImage = this.serializeGradient(gradient);
                 else
                   return "";
               }
      
      else {
        var color = this.parseColor(token);
        if (!bgColor && color)
          bgColor = color;
        else
          return "";
      }
      
    }
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  bgColor = bgColor ? bgColor : "transparent";
  bgImage = bgImage ? bgImage : "none";
  bgRepeat = bgRepeat ? bgRepeat : "repeat";
  bgAttachment = bgAttachment ? bgAttachment : "scroll";
  bgPosition = bgPosition ? bgPosition : "top left";
  
  aDecl.push(this._createJscsspDeclarationFromValue("background-color", bgColor));
  aDecl.push(this._createJscsspDeclarationFromValue("background-image", bgImage));
  aDecl.push(this._createJscsspDeclarationFromValue("background-repeat", bgRepeat));
  aDecl.push(this._createJscsspDeclarationFromValue("background-attachment", bgAttachment));
  aDecl.push(this._createJscsspDeclarationFromValue("background-position", bgPosition));
  
  return bgColor + " " + bgImage + " " + bgRepeat + " " + bgAttachment + " " + bgPosition;
};
