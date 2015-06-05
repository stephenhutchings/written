# German language support for Written

code = "DE"
dico =
  cardinals:
    written: ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben",
              "acht", "neun", "zehn", "elf", "zwölf"]

if typeof define is "function" and define.amd
  define [], dico
else if typeof exports is "object"
  module.exports = dico
else if typeof written is "object"
  written.setLanguage(dico, code)
