function jscsspToken(aType, aValue, aUnit)
{
  this.type = aType;
  this.value = aValue;
  this.unit = aUnit;
}

jscsspToken.NULL_TYPE = 0;

jscsspToken.WHITESPACE_TYPE = 1;
jscsspToken.STRING_TYPE = 2;
jscsspToken.COMMENT_TYPE = 3;
jscsspToken.NUMBER_TYPE = 4;
jscsspToken.IDENT_TYPE = 5;
jscsspToken.FUNCTION_TYPE = 6;
jscsspToken.ATRULE_TYPE = 7;
jscsspToken.INCLUDES_TYPE = 8;
jscsspToken.DASHMATCH_TYPE = 9;
jscsspToken.BEGINSMATCH_TYPE = 10;
jscsspToken.ENDSMATCH_TYPE = 11;
jscsspToken.CONTAINSMATCH_TYPE = 12;
jscsspToken.SYMBOL_TYPE = 13;
jscsspToken.DIMENSION_TYPE = 14;
jscsspToken.PERCENTAGE_TYPE = 15;
jscsspToken.HEX_TYPE = 16;

jscsspToken.prototype = {

  isNotNull: function ()
  {
    return this.type;
  },

  _isOfType: function (aType, aValue)
  {
    return (this.type == aType && (!aValue || this.value.toLowerCase() == aValue));
  },

  isWhiteSpace: function(w)
  {
    return this._isOfType(jscsspToken.WHITESPACE_TYPE, w);
  },

  isString: function()
  {
    return this._isOfType(jscsspToken.STRING_TYPE);
  },

  isComment: function()
  {
    return this._isOfType(jscsspToken.COMMENT_TYPE);
  },

  isNumber: function(n)
  {
    return this._isOfType(jscsspToken.NUMBER_TYPE, n);
  },

  isIdent: function(i)
  {
    return this._isOfType(jscsspToken.IDENT_TYPE, i);
  },

  isFunction: function(f)
  {
    return this._isOfType(jscsspToken.FUNCTION_TYPE, f);
  },

  isAtRule: function(a)
  {
    return this._isOfType(jscsspToken.ATRULE_TYPE, a);
  },

  isIncludes: function()
  {
    return this._isOfType(jscsspToken.INCLUDES_TYPE);
  },

  isDashmatch: function()
  {
    return this._isOfType(jscsspToken.DASHMATCH_TYPE);
  },

  isBeginsmatch: function()
  {
    return this._isOfType(jscsspToken.BEGINSMATCH_TYPE);
  },

  isEndsmatch: function()
  {
    return this._isOfType(jscsspToken.ENDSMATCH_TYPE);
  },

  isContainsmatch: function()
  {
    return this._isOfType(jscsspToken.CONTAINSMATCH_TYPE);
  },

  isSymbol: function(c)
  {
    return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
  },

  isDimension: function()
  {
    return this._isOfType(jscsspToken.DIMENSION_TYPE);
  },

  isPercentage: function()
  {
    return this._isOfType(jscsspToken.PERCENTAGE_TYPE);
  },

  isHex: function()
  {
    return this._isOfType(jscsspToken.HEX_TYPE);
  },

  isDimensionOfUnit: function(aUnit)
  {
    return (this.isDimension() && this.unit == aUnit);
  },

  isLength: function()
  {
    return (this.isPercentage() ||
            this.isDimensionOfUnit("cm") ||
            this.isDimensionOfUnit("mm") ||
            this.isDimensionOfUnit("in") ||
            this.isDimensionOfUnit("pc") ||
            this.isDimensionOfUnit("px") ||
            this.isDimensionOfUnit("em") ||
            this.isDimensionOfUnit("ex") ||
            this.isDimensionOfUnit("pt"));
  },

  isAngle: function()
  {
    return (this.isDimensionOfUnit("deg") ||
            this.isDimensionOfUnit("rad") ||
            this.isDimensionOfUnit("grad"));
  }
}

