/* kJscsspCHARSET_RULE */

function jscsspCharsetRule()
{
  this.type = kJscsspCHARSET_RULE;
  this.encoding = null;
  this.parsedCssText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspCharsetRule.prototype = {

  cssText: function() {
    return "@charset " + this.encoding + ";";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    if (parser.parseCharsetRule(sheet)) {
      var newRule = sheet.cssRules[0];
      this.encoding = newRule.encoding;
      this.parsedCssText = newRule.parsedCssText;
      return;
    }
    throw DOMException.SYNTAX_ERR;
  }
};

