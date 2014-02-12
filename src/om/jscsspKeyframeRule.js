/* kJscsspKEYFRAME_RULE */
function jscsspKeyframeRule()
{
  this.type = kJscsspKEYFRAME_RULE;
  this.parsedCssText = null;
  this.declarations = []
  this.keyText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspKeyframeRule.prototype = {
  cssText: function() {
    var rv = this.keyText + " {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++) {
      var declText = this.declarations[i].cssText();
      if (declText)
        rv += gTABS + this.declarations[i].cssText() + "\n";
    }
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      if (parser.parseKeyframeRule(token, sheet, false)) {
        var newRule = sheet.cssRules[0];
        this.keyText = newRule.keyText;
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

