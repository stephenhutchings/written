# Swedish language support for Written
# For compatibility, Swedish uses "m" for co(m)mon, and "n" for (n)euter genders.

code = "SE"
dico =
  cardinals:
    written: [{m: "ett", n: "en"}, "två", "tre", "fyra", "fem", "sex"
              "sju", "åtta", "nio", "tio", "elva", "tolv"]

if typeof define is "function" and define.amd
  define [], dico
else if typeof exports is "object"
  module.exports = dico
else if typeof written is "object"
  written.setLanguage(dico, code)
