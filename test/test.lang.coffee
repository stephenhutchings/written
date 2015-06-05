assert         = require("assert")
{describe, it} = require("mocha")

w  = require("../lib/written")

for lang in ["DE", "ES", "FR", "IT", "SE"]
  w.setLanguage(require("../lib/lang/written.#{lang.toLowerCase()}"), lang)

describe "written.de", ->
  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal("zwei",              w.writtenNumber(2, "DE"))
      assert.equal("eins",              w.writtenNumber(1, "DE"))

describe "written.es", ->
  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal("dos",               w.writtenNumber(2, "ES"))
      assert.equal("una",               w.writtenNumber(1, "ES", "f"))

describe "written.fr", ->
  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal("deux",              w.writtenNumber(2, "FR"))
      assert.equal("une",               w.writtenNumber(1, "FR", "f"))
      assert.equal("10e",               w.ordinal(10, {lang: "FR"}))
      assert.equal("première",          w.ordinal(1,  {lang: "FR", written: true}, "f"))
      assert.equal("Doc1 et deux plus", w.prettyList(["Doc1", "Doc2", "Doc3"], 1, {written: true, amp: "et", lang: "FR", more: "plus"}))

describe "written.it", ->
  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal("due",               w.writtenNumber(2, "IT"))
      assert.equal("una",               w.writtenNumber(1, "IT", "f"))

describe "written.se", ->
  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal("två",              w.writtenNumber(2, "SE"))
      assert.equal("en",               w.writtenNumber(1, "SE", "n"))
