/* written - v0.1.1 - MIT */
/* Written provides a set of utilities for manipulating text, with a focus on providing typographic tools rather than pure string manipulation. */
/* https://github.com/stephenhutchings/written.git */
(function() {
  var code, dico;

  code = "DE";

  dico = {
    cardinals: {
      written: ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"]
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
