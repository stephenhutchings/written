# Italian language support for Written

code = "IT"
dico =
  cardinals:
    written: [{m: "uno", f: "una"}, "due", "tre", "quattro", "cinque",
              "sei", "sette", "otto", "nove", "dieci", "undici", "dodic"]

if typeof define is "function" and define.amd
  define [], dico
else if typeof exports is "object"
  module.exports = dico
else if typeof written is "object"
  written.setLanguage(dico, code)
