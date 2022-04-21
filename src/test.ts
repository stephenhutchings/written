import { assertEquals as equals, assertInstanceOf } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import * as w from "./written.ts";
import * as german from "./lang/written.de.ts";

w.setLanguage(german.dico, german.code);

const test = Deno.test;

test("capitalize", () => {
  equals(w.capitalize("obviously"), "Obviously");
});

test("capitalize all", () => {
  equals(w.capitalizeAll("this and that"), "This and That");
  equals(w.capitalizeAll("the cat in the hat"), "The Cat in the Hat");
});

// utilities

test("enclose", () => {
  equals(w.enclose("'", "string"), "'string'");
});

test("clean join", () => {
  equals(w.cleanJoin(["this", null, "that"], " and "), "this and that");
});

// collapse

test("collapse", () => {
  equals(w.collapse("this   \t\t and \n    that"), "this and that");
});

// cases

test("camel case", () => {
  equals(w.camelCase("some-thing"), "someThing");
});

test("hyphen case", () => {
  equals(w.hyphenCase("some_thing"), "some-thing");
});

test("snake case", () => {
  equals(w.snakeCase("someThing"), "some_thing");
});

test("human case", () => {
  equals(w.humanCase("fromA_to-Z"), "from A to Z");
});

// tags

test("wrap in tag (span)", () => {
  equals(w.wrapInTag("Hello world!"), "<span>Hello world!</span>");
});

test("wrap in tag (em)", () => {
  equals(w.wrapInTag("Hello world!", "em"), "<em>Hello world!</em>");
});

test("wrap in tag (with options)", () => {
  equals(w.wrapInTag(
    "Link",
    "a",
    {
      href: "/url",
      class: ["b"],
      disabled: true
    }
  ), `<a href="/url" class="b" disabled="disabled">Link</a>`);
});

// lists

test("pretty list", () => {
  equals(w.prettyList(["Ben", "Bob"]), "Ben and Bob");
});

test("pretty list (3 items)", () => {
  equals(w.prettyList(["Ben", "Bob", "Bill"]), "Ben, Bob and Bill");
});

test("pretty list with 2 max items", () => {
  equals(w.prettyList(["Ben", "Bob", "Bill", "Max"], 2), "Ben, Bob and 2 more");
});

test("pretty list with custom more", () => {
  equals(w.prettyList(["Ben", "Bob"], 1, { more: "other" }), "Ben and 1 other");
});

test("pretty list with options", () => {
  equals(w.prettyList([
    { file: "Document 1" },
    { file: "Document 2" },
    { file: "Document 3" }
  ], 1, {
    amp: "&",
    written: true,
    more: "other file",
    quantify: true,
    key: "file"
  }), "Document 1 & two other files");
});

// hyphenation

test("hyphenation", () => {
  // TAKE CARE: THE FOLLOWING LINES CONTAIN INVISIBLE CHARACTERS
  equals(w.hyphenate("antidisestablishmentarianism"), "antidises­tablishmen­tarianism");
});

test("hyphenation with the wbr tag", () => {
  // TAKE CARE: THE FOLLOWING LINES CONTAIN INVISIBLE CHARACTERS
  equals(w.hyphenate("antidisestablishmentarianism", 10, "<wbr>"), "antidises<wbr>tablishmen<wbr>tarianism");
});

// quantify

test("quantify", () => {
  equals(w.quantify("monkey", 1), "1 monkey");
});

test("quantify with reversed arguments", () => {
  equals(w.quantify(1, "monkey"), "1 monkey");
});

test("quantify in words", () => {
  equals(w.quantify("monkey", 9, { written: true }), "nine monkeys");
});

test("quantify with custom plurals", () => {
  equals(w.quantify("person", 9, { plural: "people" }), "9 people");
});

test("quantify with array", () => {
  equals(w.quantify([1, 2, 3], "number"), "3 numbers");
});

// written numbers

test("written numbers", () => {
  equals(w.writtenNumber(1), "one");
});

test("written numbers in german", () => {
  equals(w.writtenNumber(2, "DE"), "zwei");
});

// quotes

test("single quote", () => {
  equals(w.quote("pastry chef", "s"), "‘pastry chef’");
});

test("normal quotes", () => {
  equals(w.quote("cats cradle"), "“cats cradle”");
});

test("angled quotes", () => {
  equals(w.quote("tres chic", "a"), "«tres chic»");
});

test("inverted exclamation mark", () => {
  equals(w.quote("Gol", "!"), "¡Gol!");
});

test("inverted question mark", () => {
  equals(w.quote("Cómo estás", "?"), "¿Cómo estás?");
});

// ordinals

test("ordinal", () => {
  equals(w.ordinal(1), "1st");
});

test("written ordinal", () => {
  equals(w.ordinal(2, { written: true }), "second");
});

test("wrapped ordinal", () => {
  equals(w.ordinal(3, { wrap: true }), "3<sup>rd</sup>");
});

test("ordinal wrapped in <em>", () => {
  equals(w.ordinal(4, { wrap: "em" }), "4<em>th</em>");
});

// numbers

test("numbers", () => {
  equals(w.prettyNumber(1000), "1,000");
});

test("numbers with decimal points", () => {
  equals(w.prettyNumber(10.5, 2), "10.50");
});

test("number with delimiter", () => {
  equals(w.prettyNumber(9999, " ", 2, ","), "9 999,00");
});


test("prices", () => {
  equals(w.prettyPrice(4), "$4.00");
});

test("prices with custom currency sign", () => {
  equals(w.prettyPrice(1200, "£"), "£1,200.00");
});

test("prices with custom options", () => {
  equals(
    w.prettyPrice(4,
      {
        currency: "€",
        wrap: "sup"
      })
    , "€4<sup>00</sup>");
});


test("percentages", () => {
  equals(w.prettyPercent(0.5), "50%");
});

test("percentages with custom denominator", () => {
  equals(w.prettyPercent(1, 4), "25%");
});

test("percentages with fixed points", () => {
  equals(w.prettyPercent(1, 3, 2), "33.33%");
});


test("parse number", () => {
  equals(w.parseNumber(1000), 1000);
});

test("parse number with delimiter", () => {
  equals(w.parseNumber("1,000.00"), 1000);
});

test("parse percentage", () => {
  equals(w.parseNumber("99%"), 0.99);
});

test("parse number within string", () => {
  equals(w.parseNumber("some 44,000 participants"), 44000);
});

// glyphs

test("glyphs", () => {
  assertInstanceOf(w.glyphs(), Object);
});

test("glyph", () => {
  equals(w.glyph("!"), "&#33;");
});

// yay!