
var PrefixHelper = {

  mVENDOR_PREFIXES: null,

  kEXPORTS_FOR_GECKO:   true,
  kEXPORTS_FOR_WEBKIT:  true,
  kEXPORTS_FOR_PRESTO:  true,
  kEXPORTS_FOR_TRIDENT: true,

  cleanPrefixes: function()
  {
    this.mVENDOR_PREFIXES = null;
  },

  prefixesForProperty: function(aProperty)
  {
    if (!this.mVENDOR_PREFIXES) {

      this.mVENDOR_PREFIXES = {};
      for (var i = 0; i < kCSS_VENDOR_PREFIXES.properties.length; i++) {
        var p = kCSS_VENDOR_PREFIXES.properties[i];
        if (p.gecko && (p.webkit || p.presto || p.trident)) {
          var o = {};
          if (this.kEXPORTS_FOR_GECKO) o[p.gecko] = true;
          if (this.kEXPORTS_FOR_WEBKIT && p.webkit)  o[p.webkit] = true;
          if (this.kEXPORTS_FOR_PRESTO && p.presto)  o[p.presto] = true;
          if (this.kEXPORTS_FOR_TRIDENT && p.trident) o[p.trident] = true;
          this.mVENDOR_PREFIXES[p.gecko] = [];
          for (var j in o)
            this.mVENDOR_PREFIXES[p.gecko].push(j)
        }
      }
    }
    if (aProperty in this.mVENDOR_PREFIXES)
      return this.mVENDOR_PREFIXES[aProperty].sort();
    return null;
  }
};

function ParseURL(buffer) {
  var result = { };
  result.protocol = "";
  result.user = "";
  result.password = "";
  result.host = "";
  result.port = "";
  result.path = "";
  result.query = "";

  var section = "PROTOCOL";
  var start = 0;
  var wasSlash = false;

  while(start < buffer.length) {
    if(section == "PROTOCOL") {
      if(buffer.charAt(start) == ':') {
        section = "AFTER_PROTOCOL";
        start++;
      } else if(buffer.charAt(start) == '/' && result.protocol.length() == 0) { 
        section = PATH;
      } else {
        result.protocol += buffer.charAt(start++);
      }
    } else if(section == "AFTER_PROTOCOL") {
      if(buffer.charAt(start) == '/') {
    if(!wasSlash) {
          wasSlash = true;
    } else {
          wasSlash = false;
          section = "USER";
    }
        start ++;
      } else {
        throw new ParseException("Protocol shell be separated with 2 slashes");
      }       
    } else if(section == "USER") {
      if(buffer.charAt(start) == '/') {
        result.host = result.user;
        result.user = "";
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        result.host = result.user;
        result.user = "";
        section = "QUERY";
        start++;
      } else if(buffer.charAt(start) == ':') {
        section = "PASSWORD";
        start++;
      } else if(buffer.charAt(start) == '@') {
        section = "HOST";
        start++;
      } else {
        result.user += buffer.charAt(start++);
      }
    } else if(section == "PASSWORD") {
      if(buffer.charAt(start) == '/') {
        result.host = result.user;
        result.port = result.password;
        result.user = "";
        result.password = "";
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        result.host = result.user;
        result.port = result.password;
        result.user = "";
        result.password = "";
        section = "QUERY";
        start ++;
      } else if(buffer.charAt(start) == '@') {
        section = "HOST";
        start++;
      } else {
        result.password += buffer.charAt(start++);
      }
    } else if(section == "HOST") {
      if(buffer.charAt(start) == '/') {
        section = "PATH";
      } else if(buffer.charAt(start) == ':') {
        section = "PORT";
        start++;
      } else if(buffer.charAt(start) == '?') {
        section = "QUERY";
        start++;
      } else {
        result.host += buffer.charAt(start++);
      }
    } else if(section == "PORT") {
      if(buffer.charAt(start) == '/') {
        section = "PATH";
      } else if(buffer.charAt(start) == '?') {
        section = "QUERY";
        start++;
      } else {
        result.port += buffer.charAt(start++);
      }
    } else if(section == "PATH") {
      if(buffer.charAt(start) == '?') {
    section = "QUERY";
    start ++;
      } else {
    result.path += buffer.charAt(start++);
      }
    } else if(section == "QUERY") {
      result.query += buffer.charAt(start++);
    }
  }

  if(section == "PROTOCOL") {
    result.host = result.protocol;
    result.protocol = "http";
  } else if(section == "AFTER_PROTOCOL") {
    throw new ParseException("Invalid url");
  } else if(section == "USER") {
    result.host = result.user;
    result.user = "";
  } else if(section == "PASSWORD") {
    result.host = result.user;
    result.port = result.password;
    result.user = "";
    result.password = "";
  }

  return result;
}

function ParseException(description) {
    this.description = description;
}

function CountLF(s)
{
  var nCR = s.match( /\n/g );
  return nCR ? nCR.length + 1 : 1;
}

function DisposablePartialParsing(aStringToParse, aMethodName)
{
  var parser = new CSSParser();
  parser._init();
  parser.mPreserveWS       = false;
  parser.mPreserveComments = false;
  parser.mPreservedTokens = [];
  parser.mScanner.init(aStringToParse);

  return parser[aMethodName]();    
}

function FilterLinearGradient(aValue, aEngine)
{
  var d = DisposablePartialParsing(aValue, "parseBackgroundImages");
  if (!d)
    return null;
  var g = d[0];
  if (!g.value)
    return null;

  var str = "";
  var position = ("position" in g.value) ? g.value.position.toLowerCase() : "";
  var angle    = ("angle" in g.value) ? g.value.angle.toLowerCase() : "";

  if ("webkit20110101" == aEngine) {
    var cancelled = false;
    str = "-webkit-gradient(linear, ";
    // normalize angle
    if (angle) {
      var match = angle.match(/^([0-9\-\.\\+]+)([a-z]*)/);
      var angle = parseFloat(match[1]);
      var unit  = match[2];
      switch (unit) {
        case "grad": angle = angle * 90 / 100; break;
        case "rad":  angle = angle * 180 / Math.PI; break;
        default: break;
      }
      while (angle < 0)
        angle += 360;
      while (angle >= 360)
        angle -= 360;
    }
    // get startpoint w/o keywords
    var startpoint = [];
    var endpoint = [];
    if (position != "") {
      if (position == "center")
        position = "center center";
      startpoint = position.split(" ");
      if (angle == "" && angle != 0) {
        // no angle, then we just turn the point 180 degrees around center
        switch (startpoint[0]) {
          case "left":   endpoint.push("right"); break;
          case "center": endpoint.push("center"); break;
          case "right":  endpoint.push("left"); break;
          default: {
              var match = startpoint[0].match(/^([0-9\-\.\\+]+)([a-z]*)/);
              var v     = parseFloat(match[0]);
              var unit  = match[1];
              if (unit == "%") {
                endpoint.push((100-v) + "%");
              }
              else
                cancelled = true;
            }
            break;
        }
        if (!cancelled)
          switch (startpoint[1]) {
            case "top":    endpoint.push("bottom"); break;
            case "center": endpoint.push("center"); break;
            case "bottom": endpoint.push("top"); break;
            default: {
                var match = startpoint[1].match(/^([0-9\-\.\\+]+)([a-z]*)/);
                var v     = parseFloat(match[0]);
                var unit  = match[1];
                if (unit == "%") {
                  endpoint.push((100-v) + "%");
                }
                else
                  cancelled = true;
              }
              break;
          }
      }
      else {
        switch (angle) {
          case 0:    endpoint.push("right"); endpoint.push(startpoint[1]); break;
          case 90:   endpoint.push(startpoint[0]); endpoint.push("top"); break;
          case 180:  endpoint.push("left"); endpoint.push(startpoint[1]); break;
          case 270:  endpoint.push(startpoint[0]); endpoint.push("bottom"); break;
          default:     cancelled = true; break;
        }
      }
    }
    else {
      // no position defined, we accept only vertical and horizontal
      if (angle == "")
        angle = 270;
      switch (angle) {
        case 0:    startpoint= ["left", "center"];   endpoint = ["right", "center"]; break;
        case 90:   startpoint= ["center", "bottom"]; endpoint = ["center", "top"]; break;
        case 180:  startpoint= ["right", "center"];  endpoint = ["left", "center"]; break;
        case 270:  startpoint= ["center", "top"];    endpoint = ["center", "bottom"]; break;
        default:     cancelled = true; break;
      }
    }
  
    if (cancelled)
      return "";
  
    str += startpoint.join(" ") + ", " + endpoint.join(" ");
    if (!g.value.stops[0].position)
      g.value.stops[0].position = "0%";
    if (!g.value.stops[g.value.stops.length-1].position)
      g.value.stops[g.value.stops.length-1].position = "100%";
    var current = 0;
    for (var i = 0; i < g.value.stops.length && !cancelled; i++) {
      var s = g.value.stops[i];
      if (s.position) {
        if (s.position.indexOf("%") == -1) {
          cancelled = true;
          break;
        }
      }
      else {
        var j = i + 1;
        while (j < g.value.stops.length && !g.value.stops[j].position)
          j++;
        var inc = parseFloat(g.value.stops[j].position) - current;
        for (var k = i; k < j; k++) {
          g.value.stops[k].position = (current + inc * (k - i + 1) / (j - i + 1)) + "%";
        }
      }
      current = parseFloat(s.position);
      str += ", color-stop(" + (parseFloat(current) / 100) + ", " + s.color + ")";
    }
  
    if (cancelled)
      return "";
  }
  else {
    str = (g.value.isRepeating ? "repeating-" : "") + "linear-gradient(";
    if (angle || position)
      str += (angle ? angle : position) + ", ";
  
    for (var i = 0; i < g.value.stops.length; i++) {
      var s = g.value.stops[i];
      str += s.color
             + (s.position ? " " + s.position : "")
             + ((i != g.value.stops.length -1) ? ", " : "");
    }
  }
  str += ")";

  switch (aEngine) {
    case "webkit":     str = "-webkit-"  + str; break;
    case "gecko1.9.2": str = "-moz-"  + str; break;
    case "presto":     str = "-o-"  + str; break;
    case "trident":    str = "-ms-"  + str; break;
    default:           break;
  }
  return str;
}

function FilterRadialGradient(aValue, aEngine)
{
  var d = DisposablePartialParsing(aValue, "parseBackgroundImages");
  if (!d)
    return null;
  var g = d[0];
  if (!g.value)
    return null;

  // oh come on, this is now so painful to deal with ; no way I'm going to implement this
  if ("webkit20110101" == aEngine)
    return null;
  
  var str = (g.value.isRepeating ? "repeating-" : "") + "radial-gradient(";
  var shape = ("shape" in g.value) ? g.value.shape : "";
  var extent  = ("extent"  in g.value) ? g.value.extent : "";
  var lengths = "";
  switch (g.value.positions.length) {
    case 1:
      lengths = g.value.positions[0] + " " + g.value.positions[0];
      break;
    case 2:
      lengths = g.value.positions[0] + " " + g.value.positions[1];
      break;
    default:
      break;
  }
  var at = g.value.at;

  str += (at ? at + ", " : "")
         + ((shape || extent || at)
            ? (shape ? shape + " " : "")
              + (extent ? extent + " " : "")
              + (lengths ? lengths + " " : "")
              + ", "
            : "");
  for (var i = 0; i < g.value.stops.length; i++) {
    var s = g.value.stops[i];
    str += s.color
           + (s.position ? " " + s.position : "")
           + ((i != g.value.stops.length -1) ? ", " : "");
  }
  str += ")";

  switch (aEngine) {
    case "webkit":     str = "-webkit-"  + str; break;
    case "gecko1.9.2": str = "-moz-"  + str; break;
    case "presto":     str = "-o-"  + str; break;
    case "trident":    str = "-ms-"  + str; break;
    default:           break;
  }
  return str;
}

