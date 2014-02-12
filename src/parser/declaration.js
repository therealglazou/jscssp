CSSParser.prototype.parseDeclaration = function(aToken, aDecl, aAcceptPriority, aExpandShorthands, aSheet) {
  this.preserveState();
  var blocks = [];
  if (aToken.isIdent()) {
    var descriptor = aToken.value.toLowerCase();
    var token = this.getToken(true, true);
    if (token.isSymbol(":")) {
      var token = this.getToken(true, true);
      
      var value = "";
      var declarations = [];
      if (aExpandShorthands)
        switch (descriptor) {
          case "background":
            value = this.parseBackgroundShorthand(token, declarations, aAcceptPriority);
            break;
          case "margin":
          case "padding":
            value = this.parseMarginOrPaddingShorthand(token, declarations, aAcceptPriority, descriptor);
            break;
          case "border-color":
            value = this.parseBorderColorShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-style":
            value = this.parseBorderStyleShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-width":
            value = this.parseBorderWidthShorthand(token, declarations, aAcceptPriority);
            break;
          case "border-top":
          case "border-right":
          case "border-bottom":
          case "border-left":
          case "border":
          case "outline":
            value = this.parseBorderEdgeOrOutlineShorthand(token, declarations, aAcceptPriority, descriptor);
            break;
          case "cue":
            value = this.parseCueShorthand(token, declarations, aAcceptPriority);
            break;
          case "pause":
            value = this.parsePauseShorthand(token, declarations, aAcceptPriority);
            break;
          case "font":
            value = this.parseFontShorthand(token, declarations, aAcceptPriority);
            break;
          case "list-style":
            value = this.parseListStyleShorthand(token, declarations, aAcceptPriority);
            break;
          default:
            value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);
            break;
        }
      else
        value = this.parseDefaultPropertyValue(token, declarations, aAcceptPriority, descriptor, aSheet);
      token = this.currentToken();
      if (value) // no error above
      {
        var priority = false;
        if (token.isSymbol("!")) {
          token = this.getToken(true, true);
          if (token.isIdent("important")) {
            priority = true;
            token = this.getToken(true, true);
            if (token.isSymbol(";") || token.isSymbol("}")) {
              if (token.isSymbol("}"))
                this.ungetToken();
            }
            else return "";
          }
          else return "";
        }
        else if  (token.isNotNull() && !token.isSymbol(";") && !token.isSymbol("}"))
          return "";
        for (var i = 0; i < declarations.length; i++) {
          declarations[i].priority = priority;
          aDecl.push(declarations[i]);
        }
        return descriptor + ": " + value + ";";
      }
    }
  }
  else if (aToken.isComment()) {
    if (this.mPreserveComments) {
      this.forgetState();
      var comment = new jscsspComment();
      comment.parsedCssText = aToken.value;
      aDecl.push(comment);
    }
    return aToken.value;
  }
  
  // we have an error here, let's skip it
  this.restoreState();
  var s = aToken.value;
  blocks = [];
  var token = this.getToken(false, false);
  while (token.isNotNull()) {
    s += token.value;
    if ((token.isSymbol(";") || token.isSymbol("}")) && !blocks.length) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    } else if (token.isSymbol("{")
               || token.isSymbol("(")
               || token.isSymbol("[")
               || token.isFunction()) {
      blocks.push(token.isFunction() ? "(" : token.value);
    } else if (token.isSymbol("}")
               || token.isSymbol(")")
               || token.isSymbol("]")) {
      if (blocks.length) {
        var ontop = blocks[blocks.length - 1];
        if ((token.isSymbol("}") && ontop == "{")
            || (token.isSymbol(")") && ontop == "(")
            || (token.isSymbol("]") && ontop == "[")) {
          blocks.pop();
        }
      }
    }
    token = this.getToken(false, false);
  }
  return "";
};

