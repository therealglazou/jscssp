/* kJscsspCOMMENT */

function jscsspComment()
{
  this.type = kJscsspCOMMENT;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspComment.prototype = {
  cssText: function() {
    return this.parsedCssText;
  },

  setCssText: function(val) {
    var parser = new CSSParser(val);
    var token = parser.getToken(true, false);
    if (token.isComment())
      this.parsedCssText = token.value;
    else
      throw DOMException.SYNTAX_ERR;
  }
};

