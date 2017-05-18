/* written - v0.1.8 - MIT */
/* Written provides a set of utilities for manipulating text, with a focus on providing typographic tools rather than pure string manipulation. */
/* https://github.com/stephenhutchings/written.git */
(function() {
  var code, dico;

  code = "IT";

  dico = {
    cardinals: {
      written: [
        {
          m: "uno",
          f: "una"
        }, "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodic"
      ]
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
