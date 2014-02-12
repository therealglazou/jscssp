/* kJscsspSTYLE_RULE */

function jscsspStyleRule()
{
  this.type = kJscsspSTYLE_RULE;
  this.parsedCssText = null;
  this.declarations = []
  this.mSelectorText = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspStyleRule.prototype = {
  cssText: function() {
    var rv = gTABS + this.mSelectorText + " {";
    var preservedGTABS = gTABS;
    gTABS += "  ";
    for (var i = 0; i < this.declarations.length; i++) {
      var declText = this.declarations[i].cssText();
      if (declText)
        rv += gTABS + this.declarations[i].cssText() ;
    }
    gTABS = preservedGTABS;
    return rv + "\n" + gTABS + "}";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      if (parser.parseStyleRule(token, sheet, false)) {
        var newRule = sheet.cssRules[0];
        this.mSelectorText = newRule.mSelectorText;
        this.declarations = newRule.declarations;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  },

  selectorText: function() {
    return this.mSelectorText;
  },

  setSelectorText: function(val) {
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (!token.isNotNull()) {
      var s = parser.parseSelector(token, true);
      if (s) {
        this.mSelectorText = s.selector;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

