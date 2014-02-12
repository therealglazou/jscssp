CSSParser.prototype.parseSelector = function(aToken, aParseSelectorOnly) {
  var s = "";
  var specificity = {a: 0, b: 0, c: 0, d: 0}; // CSS 2.1 section 6.4.3
  var isFirstInChain = true;
  var token = aToken;
  var valid = false;
  var combinatorFound = false;
  while (true) {
    if (!token.isNotNull()) {
      if (aParseSelectorOnly)
        return {selector: s, specificity: specificity };
      return "";
    }
    
    if (!aParseSelectorOnly && token.isSymbol("{")) {
      // end of selector
      valid = !combinatorFound;
      // don't unget if invalid since addUnknownRule is going to restore state anyway
      if (valid)
        this.ungetToken();
      break;
    }
    
    if (token.isSymbol(",")) { // group of selectors
      s += token.value;
      isFirstInChain = true;
      combinatorFound = false;
      token = this.getToken(false, true);
      continue;
    }
    // now combinators and grouping...
    else if (!combinatorFound
             && (token.isWhiteSpace()
                 || token.isSymbol(">")
                 || token.isSymbol("+")
                 || token.isSymbol("~"))) {
               if (token.isWhiteSpace()) {
                 s += " ";
                 var nextToken = this.lookAhead(true, true);
                 if (!nextToken.isNotNull()) {
                   if (aParseSelectorOnly)
                     return {selector: s, specificity: specificity };
                   return "";
                 }
                 if (nextToken.isSymbol(">")
                     || nextToken.isSymbol("+")
                     || nextToken.isSymbol("~")) {
                   token = this.getToken(true, true);
                   s += token.value + " ";
                   combinatorFound = true;
                 }
               }
               else {
                 s += token.value;
                 combinatorFound = true;
               }
               isFirstInChain = true;
               token = this.getToken(true, true);
               continue;
             }
    else {
      var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, true);
      if (!simpleSelector)
        break; // error
      s += simpleSelector.selector;
      specificity.b += simpleSelector.specificity.b;
      specificity.c += simpleSelector.specificity.c;
      specificity.d += simpleSelector.specificity.d;
      isFirstInChain = false;
      combinatorFound = false;
    }
    
    token = this.getToken(false, true);
  }
  
  if (valid) {
    return {selector: s, specificity: specificity };
  }
  return "";
};

CSSParser.prototype.isPseudoElement = function(aIdent)
{
  switch (aIdent) {
    case "first-letter":
    case "first-line":
    case "before":
    case "after":
    case "marker":
      return true;
      break;
    default: 
      break;
  }
  return false;
};

CSSParser.prototype.parseSimpleSelector = function(token, isFirstInChain, canNegate)
{
  var s = "";
  var specificity = {a: 0, b: 0, c: 0, d: 0}; // CSS 2.1 section 6.4.3
  
  if (isFirstInChain
      && (token.isSymbol("*") || token.isSymbol("|") || token.isIdent())) {
    // type or universal selector
    if (token.isSymbol("*") || token.isIdent()) {
      // we don't know yet if it's a prefix or a universal
      // selector
      s += token.value;
      var isIdent = token.isIdent();
      token = this.getToken(false, true);
      if (token.isSymbol("|")) {
        // it's a prefix
        s += token.value;
        token = this.getToken(false, true);
        if (token.isIdent() || token.isSymbol("*")) {
          // ok we now have a type element or universal
          // selector
          s += token.value;
          if (token.isIdent())
            specificity.d++;
        } else
          // oops that's an error...
          return null;
      } else {
        this.ungetToken();
        if (isIdent)
          specificity.d++;
      }
    } else if (token.isSymbol("|")) {
      s += token.value;
      token = this.getToken(false, true);
      if (token.isIdent() || token.isSymbol("*")) {
        s += token.value;
        if (token.isIdent())
          specificity.d++;
      } else
        // oops that's an error
        return null;
    }
  }
  
  else if (token.isSymbol(".") || token.isSymbol("#")) {
    var isClass = token.isSymbol(".");
    s += token.value;
    token = this.getToken(false, true);
    if (token.isIdent()) {
      s += token.value;
      if (isClass)
        specificity.c++;
      else
        specificity.b++;
    }
    else
      return null;
  }
  
  else if (token.isSymbol(":")) {
    s += token.value;
    token = this.getToken(false, true);
    if (token.isSymbol(":")) {
      s += token.value;
      token = this.getToken(false, true);
    }
    if (token.isIdent()) {
      s += token.value;
      if (this.isPseudoElement(token.value))
        specificity.d++;
      else
        specificity.c++;
    }
    else if (token.isFunction()) {
      s += token.value;
      if (token.isFunction(":not(")) {
        if (!canNegate)
          return null;
        token = this.getToken(true, true);
        var simpleSelector = this.parseSimpleSelector(token, isFirstInChain, false);
        if (!simpleSelector)
          return null;
        else {
          s += simpleSelector.selector;
          token = this.getToken(true, true);
          if (token.isSymbol(")"))
            s += ")";
          else
            return null;
        }
        specificity.c++;
      }
      else {
        while (true) {
          token = this.getToken(false, true);
          if (token.isSymbol(")")) {
            s += ")";
            break;
          } else
            s += token.value;
        }
        specificity.c++;
      }
    } else
      return null;
    
  } else if (token.isSymbol("[")) {
    s += "[";
    token = this.getToken(true, true);
    if (token.isIdent() || token.isSymbol("*")) {
      s += token.value;
      var nextToken = this.getToken(true, true);
      if (nextToken.isSymbol("|")) {
        s += "|";
        token = this.getToken(true, true);
        if (token.isIdent())
          s += token.value;
        else
          return null;
      } else
        this.ungetToken();
    } else if (token.isSymbol("|")) {
      s += "|";
      token = this.getToken(true, true);
      if (token.isIdent())
        s += token.value;
      else
        return null;
    }
    else
      return null;
    
    // nothing, =, *=, $=, ^=, |=
    token = this.getToken(true, true);
    if (token.isIncludes()
        || token.isDashmatch()
        || token.isBeginsmatch()
        || token.isEndsmatch()
        || token.isContainsmatch()
        || token.isSymbol("=")) {
      s += token.value;
      token = this.getToken(true, true);
      if (token.isString() || token.isIdent()) {
        s += token.value;
        token = this.getToken(true, true);
      }
      else
        return null;
      
      if (token.isSymbol("]")) {
        s += token.value;
        specificity.c++;
      }
      else
        return null;
    }
    else if (token.isSymbol("]")) {
      s += token.value;
      specificity.c++;
    }
    else
      return null;
    
  }
  else if (token.isWhiteSpace()) {
    var t = this.lookAhead(true, true);
    if (t.isSymbol('{'))
      return ""
      }
  if (s)
    return {selector: s, specificity: specificity };
  return null;
};

