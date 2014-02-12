/* kJscsspMEDIA_RULE */

function jscsspMediaRule()
{
  this.type = kJscsspMEDIA_RULE;
  this.parsedCssText = null;
  this.cssRules = [];
  this.media = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspMediaRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@media " + this.media.join(", ") + " {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.cssRules.length; i++)
      rv += this.cssRules[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@media")) {
      if (parser.parseMediaRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.cssRules = newRule.cssRules;
        this.media = newRule.media;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

