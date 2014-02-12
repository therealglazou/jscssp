CSSParser.prototype.reportError = function(aMsg) {
  this.mError = aMsg;
};

CSSParser.prototype.consumeError = function() {
  var e = this.mError;
  this.mError = null;
  return e;
};

