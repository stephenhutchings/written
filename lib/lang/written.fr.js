/* written - v0.1.7 - MIT */
/* Written provides a set of utilities for manipulating text, with a focus on providing typographic tools rather than pure string manipulation. */
/* https://github.com/stephenhutchings/written.git */
(function() {
  var code, dico;

  code = "FR";

  dico = {
    cardinals: {
      written: [
        {
          m: "un",
          f: "une"
        }, "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"
      ]
    },
    ordinals: {
      written: [
        {
          m: "premier",
          f: "première"
        }, "deuxième", "troisième", "quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième"
      ],
      rule: /(\d)\b/,
      suffixes: {
        "1": {
          m: "er",
          f: "re"
        },
        "n": "e"
      }
    }
  };

  if (typeof define === "function" && define.amd) {
    define([], dico);
  } else if (typeof exports === "object") {
    module.exports = dico;
  } else if (typeof written === "object") {
    written.setLanguage(dico, code);
  }

}).call(this);
