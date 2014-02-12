/* kJscsspNAMESPACE_RULE */

function jscsspNamespaceRule()
{
  this.type = kJscsspNAMESPACE_RULE;
  this.parsedCssText = null;
  this.prefix = null;
  this.url = null;
  this.parentStyleSheet = null;
  this.parentRule = null;
}

jscsspNamespaceRule.prototype = {
  cssText: function() {
    return "@namespace " + (this.prefix ? this.prefix + " ": "")
                        + this.url
                        + ";";
  },

  setCssText: function(val) {
    var sheet = {cssRules: []};
    var parser = new CSSParser(val);
    var token = parser.getToken(true, true);
    if (token.isAtRule("@namespace")) {
      if (parser.parseNamespaceRule(token, sheet)) {
        var newRule = sheet.cssRules[0];
        this.url = newRule.url;
        this.prefix = newRule.prefix;
        this.parsedCssText = newRule.parsedCssText;
        return;
      }
    }
    throw DOMException.SYNTAX_ERR;
  }
};

