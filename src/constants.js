var kCHARSET_RULE_MISSING_SEMICOLON = "Missing semicolon at the end of @charset rule";
var kCHARSET_RULE_CHARSET_IS_STRING = "The charset in the @charset rule should be a string";
var kCHARSET_RULE_MISSING_WS = "Missing mandatory whitespace after @charset";
var kIMPORT_RULE_MISSING_URL = "Missing URL in @import rule";
var kURL_EOF = "Unexpected end of stylesheet";
var kURL_WS_INSIDE = "Multiple tokens inside a url() notation";
var kVARIABLES_RULE_POSITION = "@variables rule invalid at this position in the stylesheet";
var kIMPORT_RULE_POSITION = "@import rule invalid at this position in the stylesheet";
var kNAMESPACE_RULE_POSITION = "@namespace rule invalid at this position in the stylesheet";
var kCHARSET_RULE_CHARSET_SOF = "@charset rule invalid at this position in the stylesheet";
var kUNKNOWN_AT_RULE = "Unknow @-rule";

/* FROM http://peter.sh/data/vendor-prefixed-css.php?js=1 */

var kCSS_VENDOR_VALUES = {
  "-moz-box":             {"webkit": "-webkit-box",        "presto": "", "trident": "", "generic": "box" },
  "-moz-inline-box":      {"webkit": "-webkit-inline-box", "presto": "", "trident": "", "generic": "inline-box" },
  "-moz-initial":         {"webkit": "",                   "presto": "", "trident": "", "generic": "initial" },
  "flex":                 {"webkit": "-webkit-flex",       "presto": "", "trident": "", "generic": "" },
  "inline-flex":          {"webkit": "-webkit-inline-flex", "presto": "", "trident": "", "generic": "" },

  "linear-gradient": {"webkit20110101":FilterLinearGradient,
                           "webkit": FilterLinearGradient,
                           "presto": FilterLinearGradient,
                           "trident": FilterLinearGradient,
                           "gecko1.9.2": FilterLinearGradient },
  "repeating-linear-gradient": {"webkit20110101":FilterLinearGradient,
                           "webkit": FilterLinearGradient,
                           "presto": FilterLinearGradient,
                           "trident": FilterLinearGradient,
                           "gecko1.9.2": FilterLinearGradient },

  "radial-gradient": {"webkit20110101":FilterRadialGradient,
                           "webkit": FilterRadialGradient,
                           "presto": FilterRadialGradient,
                           "trident": FilterRadialGradient,
                           "gecko1.9.2": FilterRadialGradient },
  "repeating-radial-gradient": {"webkit20110101":FilterRadialGradient,
                           "webkit": FilterRadialGradient,
                           "presto": FilterRadialGradient,
                           "trident": FilterRadialGradient,
                           "gecko1.9.2": FilterRadialGradient }
};

var kCSS_PREFIXED_VALUE = [
  {"gecko": "-moz-box", "webkit": "-moz-box", "presto": "", "trident": "", "generic": "box"}
];

