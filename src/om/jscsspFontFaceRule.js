/* kJscsspFONT_FACE_RULE */

function jscsspFontFaceRule()
{
  this.type = kJscsspFONT_FACE_RULE;
  this.parsedCssText = null;
  this.descriptors = [];
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspFontFaceRule.prototype = {
  cssText: function() {
    var rv = gTABS + "@font-face {\n";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.descriptors.length; i++)
      rv += gTABS + this.descriptors[i].cssText() + "\n";
    gTABS = preservedGTABS;
    return rv + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@font-face")) {
      if (parser.parseFontFaceRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.descriptors = newRule.descriptors;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

