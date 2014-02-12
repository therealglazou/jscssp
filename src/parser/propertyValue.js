CSSParser.prototype.parseDefaultPropertyValue = function(token, aDecl, aAcceptPriority, descriptor, aSheet) {
  var valueText = "";
  var blocks = [];
  var foundPriority = false;
  var values = [];
  while (token.isNotNull()) {
    
    if ((token.isSymbol(";")
         || token.isSymbol("}")
         || token.isSymbol("!"))
        && !blocks.length) {
      if (token.isSymbol("}"))
        this.ungetToken();
      break;
    }
    
    if (token.isIdent(this.kINHERIT)) {
      if (values.length) {
        return "";
      }
      else {
        valueText = this.kINHERIT;
        var value = new jscsspVariable(kJscsspINHERIT_VALUE, aSheet);
        values.push(value);
        token = this.getToken(true, true);
        break;
      }
    }
    else if (token.isSymbol("{")
             || token.isSymbol("(")
             || token.isSymbol("[")) {
      blocks.push(token.value);
    }
    else if (token.isSymbol("}")
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
    // XXX must find a better way to store individual values
    // probably a |values: []| field holding dimensions, percentages
    // functions, idents, numbers and symbols, in that order.
    if (token.isFunction()) {
      if (token.isFunction("var(")) {
        token = this.getToken(true, true);
        if (token.isIdent()) {
          var name = token.value;
          token = this.getToken(true, true);
          if (token.isSymbol(")")) {
            var value = new jscsspVariable(kJscsspVARIABLE_VALUE, aSheet);
            valueText += "var(" + name + ")";
            value.name = name;
            values.push(value);
          }
          else
            return "";
        }
        else
          return "";
      }
      else {
        var fn = token.value;
        token = this.getToken(false, true);
        var arg = this.parseFunctionArgument(token);
        if (arg) {
          valueText += fn + arg;
          var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
          value.value = fn + arg;
          values.push(value);
        }
        else
          return "";
      }
    }
    else if (token.isSymbol("#")) {
      var color = this.parseColor(token);
      if (color) {
        valueText += color;
        var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
        value.value = color;
        values.push(value);
      }
      else
        return "";
    }
    else if (!token.isWhiteSpace() && !token.isSymbol(",")) {
      var value = new jscsspVariable(kJscsspPRIMITIVE_VALUE, aSheet);
      value.value = token.value;
      values.push(value);
      valueText += token.value;
    }
    else
      valueText += token.value;
    token = this.getToken(false, true);
  }
  if (values.length && valueText) {
    this.forgetState();
    aDecl.push(this._createJscsspDeclarationFromValuesArray(descriptor, values, valueText));
    return valueText;
  }
  return "";
};

