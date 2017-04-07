/* written - v0.1.7 - MIT */
/* Written provides a set of utilities for manipulating text, with a focus on providing typographic tools rather than pure string manipulation. */
/* https://github.com/stephenhutchings/written.git */
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.written = factory();
  }
})(this, function() {
  var camelCase, capitalize, capitalizeAll, caseSplitter, cleanJoin, collapse, dictionary, enclose, fromTo, glyph, glyphs, humanCase, hyphenCase, hyphenate, ordinal, parseNumber, prettyList, prettyNumber, prettyPercent, prettyPrice, quantify, quote, setLanguage, snakeCase, wrapInTag, written, writtenNumber;
  dictionary = {
    EN: {
      noncaps: /^(an|and|as|at|be|but|by|has|in|if|nor|of|off|on|or|out|per|the|to|up|was)$/,
      cardinals: {
        written: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
      },
      ordinals: {
        written: ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"],
        rule: /((1{0,1}[123])|(\d))\b/,
        suffixes: {
          "1": "st",
          "2": "nd",
          "3": "rd",
          "n": "th"
        }
      }
    }
  };
  capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  capitalizeAll = function(str, regEx) {
    var i, s;
    if (regEx == null) {
      regEx = dictionary["EN"].noncaps;
    }
    if (Object.prototype.toString.call(regEx) !== "[object RegExp]") {
      regEx = dictionary[regEx].noncaps;
    }
    return ((function() {
      var j, len1, ref, results;
      ref = str.split(/\s/g);
      results = [];
      for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
        s = ref[i];
        if (i > 0 && regEx.test(s)) {
          results.push(s);
        } else {
          results.push(capitalize(s));
        }
      }
      return results;
    })()).join(" ");
  };
  enclose = function(a, b, c) {
    return "" + a + b + (c || a);
  };
  cleanJoin = function(arr, glue) {
    var a;
    if (glue == null) {
      glue = "";
    }
    return ((function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = arr.length; j < len1; j++) {
        a = arr[j];
        if (a && typeof a === "string") {
          results.push(a);
        }
      }
      return results;
    })()).join(glue);
  };
  collapse = function(str) {
    return str.replace(/\s+/g, " ");
  };
  caseSplitter = /[-_\s]+|(!?[A-Z][a-z]*)/g;
  camelCase = function(str) {
    var i, s;
    cleanJoin((function() {
      var j, len1, ref, results;
      ref = str.split(caseSplitter);
      results = [];
      for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
        s = ref[i];
        if (s) {
          if (i === 0) {
            results.push(s);
          } else {
            results.push(capitalize(s));
          }
        }
      }
      return results;
    })());
    return str.replace(/[\s_-]+(\w)/g, function(a, w) {
      return w.toUpperCase();
    });
  };
  hyphenCase = function(str, leading) {
    return (leading ? "-" : "") + cleanJoin(str.split(caseSplitter), "-").toLowerCase();
  };
  snakeCase = function(str) {
    return cleanJoin(str.split(caseSplitter), "_").toLowerCase();
  };
  humanCase = function(str) {
    return cleanJoin(str.split(caseSplitter), " ");
  };
  wrapInTag = function(str, tag, attributes) {
    var attrs, key, val;
    if (tag == null) {
      tag = "span";
    }
    if (attributes == null) {
      attributes = {};
    }
    attrs = (function() {
      var results;
      results = [];
      for (key in attributes) {
        val = attributes[key];
        if (!(val)) {
          continue;
        }
        if (typeof val === "boolean") {
          val = key;
        }
        if (typeof val.join === "function") {
          val = val.join(" ");
        }
        results.push(" " + key + "=\"" + val + "\"");
      }
      return results;
    })();
    return enclose("<" + tag + (attrs.join("")) + ">", str, "</" + tag + ">");
  };
  prettyList = function(arr, max, opts) {
    var amp, diff, len, more, obj, s;
    if (opts == null) {
      opts = {};
    }
    more = opts.more || "more";
    amp = opts.amp || "and";
    if (opts.key) {
      arr = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = arr.length; j < len1; j++) {
          obj = arr[j];
          if (typeof obj === "object") {
            results.push(obj[opts.key]);
          }
        }
        return results;
      })();
    }
    if (opts.wrap) {
      arr = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = arr.length; j < len1; j++) {
          s = arr[j];
          results.push(wrapInTag(s, opts.wrap));
        }
        return results;
      })();
    }
    if (max < (len = arr.length)) {
      diff = len - max;
      if (opts.quantify) {
        more = quantify(more, diff, {
          numberless: true
        });
      }
      if (opts.written) {
        diff = writtenNumber(diff, opts.lang);
      }
      arr = arr.slice(0, max);
      arr = arr.concat(diff + " " + more);
    }
    return arr.slice(0, -1).join(", ").concat((arr.length === 1 ? "" : " " + amp + " "), arr.slice(-1));
  };
  hyphenate = function(str, n, softHyphen) {
    if (str == null) {
      str = "";
    }
    if (n == null) {
      n = 10;
    }
    if (softHyphen == null) {
      softHyphen = "\u00AD";
    }
    return str.replace(new RegExp("(\\w{" + (n - 1) + "})(\\w)", "g"), function(w, a, b) {
      return a + softHyphen + b;
    });
  };
  quantify = function(str, n, arg) {
    var lang, numberless, plural, ref, ref1, ref2, s, written;
    ref = arg != null ? arg : {}, numberless = ref.numberless, written = ref.written, lang = ref.lang, plural = ref.plural;
    if (typeof str !== "string") {
      ref1 = [str, n], n = ref1[0], str = ref1[1];
    }
    n = (ref2 = n.length) != null ? ref2 : n;
    s = n === 1 ? str : plural || (str + "s");
    if (written) {
      n = writtenNumber(n, lang);
    }
    n = numberless ? "" : n + " ";
    return n + s;
  };
  writtenNumber = function(n, lang, gender) {
    var num, ref;
    if (lang == null) {
      lang = "EN";
    }
    if (gender == null) {
      gender = "m";
    }
    if (num = (ref = dictionary[lang]) != null ? ref.cardinals.written[n - 1] : void 0) {
      return num[gender] && num[gender] || num;
    } else {
      return n;
    }
  };
  quote = function(str, type) {
    var a, ref, z;
    ref = (function() {
      switch (type) {
        case "s":
        case "single":
          return ["‘", "’"];
        case "a":
        case "angle":
        case "g":
        case "guillemets":
          return ["«", "»"];
        case "!":
          return ["¡", "!"];
        case "?":
          return ["¿", "?"];
        default:
          return ["“", "”"];
      }
    })(), a = ref[0], z = ref[1];
    return enclose(a, str, z);
  };
  ordinal = function(n, opts, gender) {
    var base, ref, rule, suffix, suffixes, w, written;
    if (opts == null) {
      opts = {};
    }
    if (gender == null) {
      gender = "m";
    }
    ref = dictionary[opts.lang || "EN"].ordinals, suffixes = ref.suffixes, rule = ref.rule, written = ref.written;
    base = n.toString().match(rule)[0];
    if ((opts.written != null) && (w = written[+n - 1])) {
      return w[gender] || w;
    } else {
      suffix = suffixes[base] || suffixes.n;
      suffix = suffix[gender] || suffix;
      if (opts.wrap && !w) {
        if (typeof opts.wrap === "boolean") {
          opts.wrap = "sup";
        }
        suffix = wrapInTag(suffix, opts.wrap);
      }
      return n + suffix;
    }
  };
  prettyNumber = function(n, delimiter, decimals, dot) {
    var frac, int, ref;
    if (delimiter == null) {
      delimiter = ",";
    }
    if (decimals == null) {
      decimals = 0;
    }
    if (dot == null) {
      dot = ".";
    }
    if (typeof delimiter === "number") {
      decimals = delimiter;
    }
    n = parseNumber(n);
    if (decimals > 0) {
      n = n.toFixed(decimals);
    }
    if (dot) {
      n = n.toString().replace(".", dot);
    }
    ref = n.toString().split(dot), int = ref[0], frac = ref[1];
    return [int.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter), frac].filter(function(e) {
      return e != null;
    }).join(dot);
  };
  prettyPrice = function(n, currency) {
    var decimals, delimiter, dot, fraction, integer, ref, ref1, wrap;
    if (typeof currency === "object") {
      ref = currency, currency = ref.currency, wrap = ref.wrap, decimals = ref.decimals, delimiter = ref.delimiter, dot = ref.dot;
    }
    if (currency == null) {
      currency = "$";
    }
    if (decimals == null) {
      decimals = 2;
    }
    if (dot == null) {
      dot = ".";
    }
    n = prettyNumber(n, delimiter, decimals, dot);
    if (wrap) {
      ref1 = n.split(dot), integer = ref1[0], fraction = ref1[1];
      n = integer + wrapInTag(fraction, wrap);
    }
    return currency + n;
  };
  prettyPercent = function(numerator, denominator, decimals) {
    var percent;
    if (numerator == null) {
      numerator = 0;
    }
    if (denominator == null) {
      denominator = 1;
    }
    if (decimals == null) {
      decimals = 0;
    }
    percent = (numerator / denominator * 100) || 0;
    return (percent.toFixed(decimals)) + "%";
  };
  parseNumber = function(n) {
    if (typeof n === "string") {
      n = n.replace(/[^\d\.]+/g, "") / (n.slice(-1) === "%" ? 100 : 1);
    }
    if (n <= Infinity) {
      return n;
    } else {
      return -1;
    }
  };
  fromTo = function(x, y) {
    return Array.apply(0, {
      length: y - x + 1
    }).map(function(e, i) {
      return i + x;
    });
  };
  glyphs = function(glyphs) {
    var code, j, len1, ref;
    if (glyphs == null) {
      glyphs = {};
    }
    ref = fromTo(161, 255).concat(fromTo(338, 402)).concat(fromTo(8211, 8230)).concat([8240, 8364, 8482]);
    for (j = 0, len1 = ref.length; j < len1; j++) {
      code = ref[j];
      glyphs[code] = String.fromCharCode(code);
    }
    return glyphs;
  };
  glyph = function(c) {
    return enclose("&#", c.charCodeAt(0), ";");
  };
  setLanguage = function(object, lang) {
    return dictionary[lang] = object;
  };
  return written = {
    camelCase: camelCase,
    capitalize: capitalize,
    capitalizeAll: capitalizeAll,
    cleanJoin: cleanJoin,
    collapse: collapse,
    count: quantify,
    dasherize: hyphenCase,
    dashify: hyphenCase,
    enclose: enclose,
    glyph: glyph,
    glyphs: glyphs,
    humanCase: humanCase,
    hyphenate: hyphenate,
    hyphenCase: hyphenCase,
    numerate: quantify,
    ordinal: ordinal,
    parseNumber: parseNumber,
    prettyList: prettyList,
    prettyNumber: prettyNumber,
    prettyPrice: prettyPrice,
    prettyPercent: prettyPercent,
    quantify: quantify,
    quote: quote,
    setLanguage: setLanguage,
    slugify: snakeCase,
    snakeCase: snakeCase,
    titleCase: capitalizeAll,
    underscore: snakeCase,
    wrapInTag: wrapInTag,
    writtenNumber: writtenNumber
  };
});
