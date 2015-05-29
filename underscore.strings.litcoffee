Do nothing without the presence of Underscore.

    return unless _?

This regular expression includes words we won't capitalize.

    noncapsWords = /^(a|an|and|as|be|of|the|to)$/

...and this helps to split "cased" words into their constituent parts...

    caseSplitter = /[-_\s]|(!?[A-Z][a-z]*)/g

...so we can join them together with some glue.

    cleanJoin    = (arr, glue) -> _.compact(arr).join(glue)

Assuming we are using the English language, we'll declare some numbers

    numbers =
      "EN": ["one", "two", "three", "four", "five", "six", "seven","eight", "nine", "ten", "eleven", "twelve"]
      "FR": [{m: "un", f: "une"}, "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze"]
      "DE": ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"]
      "IT": [{m: "uno", f: "una"}, "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodic"]

Declare the mixins we're adding...

    mixins =

Capitalize the first letter of a string.

      capitalize: (str) ->
        str.charAt(0).toUpperCase() + str.slice(1)

Capitalize all words in a string apart from some common lower case words.

```coffee
_.capitalizeAll("this and that") # "This and That"
```

      capitalizeAll: (str, regEx = noncapsWords) ->
        _.map(str.split(" "), (s, i) ->
          if i > 0 and regEx.test(s) then s else _.capitalize(s)
        ).join(" ")


Transform strings between common code cases:

```coffee
_.camelCase("some-thing")  # "someThing"
_.hyphenCase("some_thing") # "some-thing"
_.snakeCase("someThing")   # "some_thing"
_.humanCase("fromA_to-Z")  # "from A to Z"
```

      camelCase: (str) ->
        str.replace(/[\s_-](\w)/g, (a, w) -> w.toUpperCase())

      hyphenCase: (str) ->
        cleanJoin(str.split(caseSplitter), "-").toLowerCase()

      snakeCase: (str) ->
        cleanJoin(str.split(caseSplitter), "_").toLowerCase()

      humanCase: (str) ->
        cleanJoin(str.split(caseSplitter), " ")


Enclose a string inside an HTML tag.

```coffee
_.wrapInTag("Hello world!", "strong") # "<strong>Hello world!</strong>"
```

      wrapInTag: (str, tag = "span") ->
        "<#{tag}>#{str}</#{tag}>"

Group strings into a grammatically correct list with an arbitrary limit.

```coffee
_.prettyList(["Ben", "Bob"])                    # "Ben and Bob"
_.prettyList(["Ben", "Bob", "Bill"])            # "Ben, Bob and Bill"
_.prettyList(["Ben", "Bob", "Bill", "Max"], 2)  # "Ben, Bob and 2 more"
_.prettyList(["Ben", "Bob"], 1, "other")        # "Ben and 1 other"
```

      prettyList: (arr, max, opts = {}) ->
        more   = opts.more or "more"
        amp    = opts.amp or "and"

        if opts.wrap
          arr = _.map(arr, (s) -> _.wrapInTag(s, opts.wrap))

        if max < (len = arr.length)
          diff = len - max
          more = _.quantify(more, diff, false) if opts.quantify
          diff = _.writtenNumber(diff, opts.numbers) if opts.written
          arr  = arr.slice(0, max)
          arr  = arr.concat("#{diff} #{more}")

        arr
          .slice(0, -1)
          .join(", ")
          .concat((if arr.length is 1 then "" else " #{amp} "), arr.slice(-1))


Add soft hyphens every `n` characters so that the CSS attribute
`hyphens: manual` will allow for nice breaks in long strings of text.

```coffee
_.hyphenate("antidisestablishmentarianism") # "antidisest%C2%ADablishment%C2%ADarianism"
```

      hyphenate: (str = "", n = 10, softHyphen = "\u00AD") ->
        str.replace new RegExp("\\w{#{n}}", "g"), (w) -> w + softHyphen


Add an "s" to a string when an amount is non-singular, disregarding the
order of the arguments passsed.

```coffee
_.prettyList("monkey", 1)                   # "1 monkey"
_.prettyList(1, "monkey")                   # "1 monkey"
_.prettyList("monkey", 9, written: true)    # "nine monkeys"
```

      quantify: (str, n, {numberless, written, lang}) ->
        { n, str } = str: n, n: str unless _.isString(str)

        _n = _.writtenNumber(n, lang) if written?

        (if numberless? then "" else _n + " ") +
        str +
        (if n is 1 then "" else "s")

Convert numbers between one and twelve into their written counter-parts.

```coffee
_.writtenNumber(1)                          # "one"
_.writtenNumber(2, ["ein", "zwei", "drei"]) # "zwei"
```

      writtenNumber: (n, lang = "EN", gender ?= "m") ->
        if n < 13
          num = numbers[lang][n - 1]
          num[gender] and num[gender] or num
        else
          n

      setNumbers: (arr, lang) ->
        numbers[lang] = arr

Add the mixin object to Underscore.

    _.mixin(mixins)
