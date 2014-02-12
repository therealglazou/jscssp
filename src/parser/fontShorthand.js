CSSParser.prototype.parseFontShorthand = function(token, aDecl, aAcceptPriority)
{
  var kStyle = {"italic": true, "oblique": true };
  var kVariant = {"small-caps": true };
  var kWeight = { "bold": true, "bolder": true, "lighter": true,
    "100": true, "200": true, "300": true, "400": true,
    "500": true, "600": true, "700": true, "800": true,
    "900": true };
  var kSize = { "xx-small": true, "x-small": true, "small": true, "medium": true,
    "large": true, "x-large": true, "xx-large": true,
    "larger": true, "smaller": true };
  var kValues = { "caption": true, "icon": true, "menu": true, "message-box": true, "small-caption": true, "status-bar": true };
  var kFamily = { "serif": true, "sans-serif": true, "cursive": true, "fantasy": true, "monospace": true };
  
  var fStyle = null;
  var fVariant = null;
  var fWeight = null;
  var fSize = null;
  var fLineHeight = null;
  var fFamily = "";
  var fSystem = null;
  var fFamilyValues = [];
  
  var normalCount = 0;
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
    
    else if (!fStyle && !fVariant && !fWeight
             && !fSize && !fLineHeight && !fFamily
             && !fSystem
             && token.isIdent(this.kINHERIT)) {
      fStyle = this.kINHERIT;
      fVariant = this.kINHERIT;
      fWeight = this.kINHERIT;
      fSize = this.kINHERIT;
      fLineHeight = this.kINHERIT;
      fFamily = this.kINHERIT;
      fSystem = this.kINHERIT;
    }
    
    else {
      if (!fSystem && (token.isIdent() && token.value in kValues)) {
        fSystem = token.value;
        break;
      }
      
      else {
        if (!fStyle
            && token.isIdent()
            && (token.value in kStyle)) {
          fStyle = token.value;
        }
        
        else if (!fVariant
                 && token.isIdent()
                 && (token.value in kVariant)) {
          fVariant = token.value;
        }
        
        else if (!fWeight
                 && (token.isIdent() || token.isNumber())
                 && (token.value in kWeight)) {
          fWeight = token.value;
        }
        
        else if (!fSize
                 && ((token.isIdent() && (token.value in kSize))
                     || token.isDimension()
                     || token.isPercentage())) {
                   fSize = token.value;
                   token = this.getToken(false, false);
                   if (token.isSymbol("/")) {
                     token = this.getToken(false, false);
                     if (!fLineHeight &&
                         (token.isDimension() || token.isNumber() || token.isPercentage())) {
                       fLineHeight = token.value;
                     }
                     else
                       return "";
                   }
                   else if (!token.isWhiteSpace())
                     continue;
                 }
        
        else if (token.isIdent("normal")) {
          normalCount++;
          if (normalCount > 3)
            return "";
        }
        
        else if (!fFamily && // *MUST* be last to be tested here
                 (token.isString()
                  || token.isIdent())) {
                   var lastWasComma = false;
                   while (true) {
                     if (!token.isNotNull())
                       break;
                     else if (token.isSymbol(";")
                              || (aAcceptPriority && token.isSymbol("!"))
                              || token.isSymbol("}")) {
                       this.ungetToken();
                       break;
                     }
                     else if (token.isIdent() && token.value in kFamily) {
                       var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                       value.value = token.value;
                       fFamilyValues.push(value);
                       fFamily += token.value;
                       break;
                     }
                     else if (token.isString() || token.isIdent()) {
                       var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, null);
                       value.value = token.value;
                       fFamilyValues.push(value);
                       fFamily += token.value;
                       lastWasComma = false;
                     }
                     else if (!lastWasComma && token.isSymbol(",")) {
                       fFamily += ", ";
                       lastWasComma = true;
                     }
                     else
                       return "";
                     token = this.getToken(true, true);
                   }
                 }
        
        else {
          return "";
        }
      }
      
    }
    
    token = this.getToken(true, true);
  }
  
  // create the declarations
  this.forgetState();
  if (fSystem) {
    aDecl.push(this._createJscsspDeclarationFromValue("font", fSystem));
    return fSystem;
  }
  fStyle = fStyle ? fStyle : "normal";
  fVariant = fVariant ? fVariant : "normal";
  fWeight = fWeight ? fWeight : "normal";
  fSize = fSize ? fSize : "medium";
  fLineHeight = fLineHeight ? fLineHeight : "normal";
  fFamily = fFamily ? fFamily : "-moz-initial";
  
  aDecl.push(this._createJscsspDeclarationFromValue("font-style", fStyle));
  aDecl.push(this._createJscsspDeclarationFromValue("font-variant", fVariant));
  aDecl.push(this._createJscsspDeclarationFromValue("font-weight", fWeight));
  aDecl.push(this._createJscsspDeclarationFromValue("font-size", fSize));
  aDecl.push(this._createJscsspDeclarationFromValue("line-height", fLineHeight));
  aDecl.push(this._createJscsspDeclarationFromValuesArray("font-family", fFamilyValues, fFamily));
  return fStyle + " " + fVariant + " " + fWeight + " " + fSize + "/" + fLineHeight + " " + fFamily;
};

