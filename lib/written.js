/* written - v0.0.4 - MIT */
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
  var caseSplitter, w;
  caseSplitter = /[-_\s]+|(!?[A-Z][a-z]*)/g;
  w = {
    numbers: {
      "EN": ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"],
      "FR": [
        {
          m: "un",
          f: "une"
        }, "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"
      ],
      "DE": ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"],
      "IT": [
        {
          m: "uno",
          f: "una"
        }, "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodic"
      ],
      "ES": [
        {
          m: "uno",
          f: "una"
        }, "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"
      ],
      "SE": [
        {
          m: "ett",
          n: "en"
        }, "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"
      ]
    },
    noncaps: {
      "EN": /^(an|and|as|at|be|but|by|has|in|if|nor|of|off|on|or|out|per|the|to|up|was)$/
    },
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    capitalizeAll: function(str, regEx) {
      var i, s;
      if (regEx == null) {
        regEx = w.noncaps["EN"];
      }
      if (toString.call(regEx) !== "[object RegExp]") {
        regEx = w.noncaps[regEx];
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
            results.push(w.capitalize(s));
          }
        }
        return results;
      })()).join(" ");
    },
    cleanJoin: function(arr, glue) {
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
    },
    collapse: function(str) {
      return str.replace(/\s+/g, " ");
    },
    camelCase: function(str) {
      var i, s;
      w.cleanJoin((function() {
        var j, len1, ref, results;
        ref = str.split(caseSplitter);
        results = [];
        for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
          s = ref[i];
          if (s) {
            if (i === 0) {
              results.push(s);
            } else {
              results.push(w.capitalize(s));
            }
          }
        }
        return results;
      })());
      return str.replace(/[\s_-]+(\w)/g, function(a, w) {
        return w.toUpperCase();
      });
    },
    hyphenCase: function(str, leading) {
      return (leading ? "-" : "") + w.cleanJoin(str.split(caseSplitter), "-").toLowerCase();
    },
    snakeCase: function(str) {
      return w.cleanJoin(str.split(caseSplitter), "_").toLowerCase();
    },
    humanCase: function(str) {
      return w.cleanJoin(str.split(caseSplitter), " ");
    },
    wrapInTag: function(str, tag) {
      if (tag == null) {
        tag = "span";
      }
      return "<" + tag + ">" + str + "</" + tag + ">";
    },
    prettyList: function(arr, max, opts) {
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
            results.push(w.wrapInTag(s, opts.wrap));
          }
          return results;
        })();
      }
      if (max < (len = arr.length)) {
        diff = len - max;
        if (opts.quantify) {
          more = w.quantify(more, diff, {
            numberless: true
          });
        }
        if (opts.written) {
          diff = w.writtenNumber(diff, opts.lang);
        }
        arr = arr.slice(0, max);
        arr = arr.concat(diff + " " + more);
      }
      return arr.slice(0, -1).join(", ").concat((arr.length === 1 ? "" : " " + amp + " "), arr.slice(-1));
    },
    hyphenate: function(str, n, softHyphen) {
      if (str == null) {
        str = "";
      }
      if (n == null) {
        n = 10;
      }
      if (softHyphen == null) {
        softHyphen = "\u00AD";
      }
      return str.replace(new RegExp("\\w{" + n + "}", "g"), function(w) {
        return w + softHyphen;
      });
    },
    quantify: function(str, n, arg) {
      var lang, numberless, plural, ref, ref1, s, written;
      ref = arg != null ? arg : {}, numberless = ref.numberless, written = ref.written, lang = ref.lang, plural = ref.plural;
      if (typeof str !== "string") {
        ref1 = {
          str: n,
          n: str
        }, n = ref1.n, str = ref1.str;
      }
      s = n === 1 ? "" : "s";
      if (written) {
        n = w.writtenNumber(n, lang);
      }
      n = numberless ? "" : n + " ";
      return n + (plural || str + s);
    },
    writtenNumber: function(n, lang, gender) {
      var num;
      if (lang == null) {
        lang = "EN";
      }
      if (gender == null) {
        gender = "m";
      }
      if ((n - 1) < this.numbers[lang].length) {
        num = this.numbers[lang][n - 1];
        return num[gender] && num[gender] || num;
      } else {
        return n;
      }
    },
    setNumbers: function(arr, lang) {
      return this.numbers[lang] = arr;
    },
    setNonCaps: function(regEx, lang) {
      return this.noncaps[lang] = regEx;
    }
  };
  w.dasherize = w.dashify = w.hyphenCase;
  w.slugify = w.underscore = w.snakeCase;
  w.numerate = w.count = w.quantify;
  w.titleCase = w.capitalizeAll;
  return w;
});
