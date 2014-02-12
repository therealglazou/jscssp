/* kJscsspVARIABLES_RULE */

function jscsspVariablesRule()
{
  this.type = kJscsspVARIABLES_RULE;
  this.parsedCssText = null;
  this.declarations = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
  this.media = null;
}

jscsspVariablesRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@variables " +
                     (this.media.length ? this.media.join(", ") + " " : "") +
                     "{\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++)
      rv += gTABS + this.declarations[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@variables")) {
      if (parser.parseVariablesRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

