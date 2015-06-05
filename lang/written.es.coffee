# Spanish language support for Written

code = "ES"
dico =
  cardinals:
    written: [{m: "uno", f: "una"}, "dos", "tres", "cuatro", "cinco",
              "seis", "siete", "ocho", "nueve", "diez", "once", "doce"]

if typeof define is "function" and define.amd
  define [], dico
else if typeof exports is "object"
  module.exports = dico
else if typeof written is "object"
  written.setLanguage(dico, code)
