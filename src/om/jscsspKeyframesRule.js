/* kJscsspKEYFRAMES_RULE */
function jscsspKeyframesRule()
{
  this.type = kJscsspKEYFRAMES_RULE;
  this.parsedCssText = null;
  this.cssRules = [];
  this.name = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspKeyframesRule.prototype = {
  cssText: function() {
    var rv = "";
    var prefixes = ["moz", "webkit", "ms", "o", ""];
    for (var p = 0; p < prefixes.length; p++) {
      rv += gTABS
            + "@" + (prefixes[p] ? "-" + prefixes[p] + "-" : "") + "keyframes "
            + this.name + " {\n";
      var preservedGTABS = gTABS;
      gTABS += "  ";
      for (var i = 0; i < this.cssRules.length; i++)
        rv += gTABS + this.cssRules[i].cssText() + "\n";
      gTABS = preservedGTABS;
      rv += gTABS + "}\n\n";
    }
    return rv;
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@-mozkeyframes")) {
      if (parser.parseKeyframesRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.cssRules = newRule.cssRules;
        this.name = newRule.name;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

