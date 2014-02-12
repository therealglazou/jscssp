CSSParser.prototype.parseFunctionArgument = function(token)
{
  var value = "";
  if (token.isString())
  {
    value += token.value;
    token = this.getToken(true, true);
  }
  else {
    var parenthesis = 1;
    while (true)
    {
      if (!token.isNotNull())
        return "";
      if (token.isFunction() || token.isSymbol("("))
        parenthesis++;
      if (token.isSymbol(")")) {
        parenthesis--;
        if (!parenthesis)
          break;
      }
      value += token.value;
      token = this.getToken(false, false);
    }
  }
  
  if (token.isSymbol(")"))
    return value + ")";
  return "";
};

