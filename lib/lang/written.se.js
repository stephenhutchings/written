/* written - v0.1.2 - MIT */
/* Written provides a set of utilities for manipulating text, with a focus on providing typographic tools rather than pure string manipulation. */
/* https://github.com/stephenhutchings/written.git */
(function() {
  var code, dico;

  code = "SE";

  dico = {
    cardinals: {
      written: [
        {
          m: "ett",
          n: "en"
        }, "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"
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
