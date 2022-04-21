/**
 * #### Rules
 */
type Written = string | Record<string, string>;
export interface Language {
  noncaps: RegExp;
  cardinals: {
    written: Written[];
  };
  ordinals: {
    written: Written[];
    rule: RegExp;
    suffixes: Record<string, Written>;
  };
}

const dictionary: Record<string, Language> = {
  EN: {
    noncaps:
      /^(an|and|as|at|be|but|by|has|in|if|nor|of|off|on|or|out|per|the|to|up|was)$/,
    cardinals: {
      written: [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
      ],
    },
    ordinals: {
      written: [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
        "eleventh",
        "twelfth",
      ],
      rule: /((1{0,1}[123])|(\d))\b/,
      suffixes: {
        "1": "st",
        "2": "nd",
        "3": "rd",
        "n": "th",
      },
    },
  },
};

/**
 * Capitalization
 */

/**
 * Capitalize the first letter of a string
 * @param str
 * @returns
 */
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Capitalize all words in a string apart from some common lower case words.
 * This can be tested with the internal noncaps regular expression, which are
 * stored by language code, or by passing a regular expression of your own.
 */
export const capitalizeAll = (
  str: string,
  init: RegExp | "EN" = dictionary["EN"].noncaps,
) => {
  let regEx: RegExp;
  if (!(init instanceof RegExp)) {
    regEx = dictionary[init].noncaps;
  } else {
    regEx = init;
  }

  return str.split(/\s/g)
    .map((value, index) => {
      if (index > 0 && regEx.test(value)) {
        return value;
      } else {
        return capitalize(value);
      }
    })
    .join(" ");
};

/**
 * #### Utilities
 */

export const enclose = (a: string, b: string, c?: string) =>
  `${a}${b}${c || a}`;

export const cleanJoin = function (arr: Array<string | null>, glue = "") {
  return arr
    .filter((string) => (string && typeof string === "string"))
    .join(glue);
};

export const collapse = (str: string) => str.replace(/\s+/g, " ");

const caseSplitter = /[-_\s]+|(!?[A-Z][a-z]*)/g;

export const camelCase = (str: string) => {
  // cleanJoin(
  //   str
  //     .split(caseSplitter)
  //     .filter((part) => !!part)
  //     .map((part, index) => {
  //       if (!part) return;
  //       if (index === 0) {
  //         return part;
  //       } else {
  //         return capitalize(part);
  //       }
  //     }),
  // );
  return str.replace(/[\s_-]+(\w)/g, (_a, w) => w.toUpperCase());
};

export const hyphenCase = (str: string, leading?: string) =>
  (leading ? "-" : "") +
  cleanJoin(str.split(caseSplitter), "-").toLowerCase();

export const snakeCase = (str: string) =>
  cleanJoin(str.split(caseSplitter), "_").toLowerCase();

export const humanCase = (str: string) =>
  cleanJoin(str.split(caseSplitter), " ");

/**
 * @example
 * wrapInTag(
  "Link",
  "a",
  {
    href: "/url",
    class: ["b"],
    disabled: true
  }
)
 * @param str
 * @param tag
 * @param attributes
 * @returns
 */
export const wrapInTag = (
  str: string,
  tag = "span",
  attributes: Record<string, string | boolean | Array<string>> = {},
) => {
  const attrs = Object.entries(attributes)
    .map(([key, val]) => {
      if (typeof val === "boolean") val = key;
      if (Array.isArray(val)) val = val.join(" ");
      return ` ${key}="${val}"`;
    });

  return enclose(`<${tag}${attrs.join("")}>`, str, `</${tag}>`);
};

/**
 * Lists
 */
interface PrettyListOptions {
  more?: string;
  amp?: string;
  key?: string;
  wrap?: string;
  quantify?: boolean;
  written?: boolean;
  lang?: string;
}

export const prettyList = (
  arr: unknown[],
  max?: number,
  opts: PrettyListOptions = {},
) => {
  let more = opts.more || "more";
  const amp = opts.amp || "and";

  if (opts.key) {
    const key = opts.key;
    arr = arr
      .filter((obj) => (typeof obj === "object"))
      .map((obj) => (obj as Record<string, string>)[key]);
  }

  if (opts.wrap) {
    arr = arr
      .map((s) => wrapInTag(s as string, opts.wrap));
  }

  const len = arr.length;
  if (max && max < len) {
    const diff = len - max;
    if (opts.quantify) {
      more = quantify(more, diff, { numberless: true });
    }
    let diffStr: string = diff.toString();
    if (opts.written) {
      diffStr = writtenNumber(diff, opts.lang);
    }
    arr = arr
      .slice(0, max)
      .concat(`${diffStr} ${more}`);
  }

  return arr
    .slice(0, -1)
    .join(", ")
    .concat(arr.length === 1 ? "" : ` ${amp} `, ...arr.slice(-1) as string[]);
};

/**
 * Hyphenation
 */

export const hyphenate = (str: string, n = 10, softHyphen = "\u00AD"): string =>
  str
    .replace(/(^|[^>])+(?=$|\<)/g, (sub) =>
      sub.replace(
        new RegExp(`(\\w{${n - 1}})(\\w)`, "g"),
        (_w, a, b) => a + softHyphen + b,
      ));

/**
 * Quantify
 */

interface QuantifyOptions {
  numberless?: boolean;
  written?: boolean;
  lang?: "EN";
  plural?: string;
}
export const quantify = (
  first: string | number | Array<unknown>,
  second: string | number | Array<unknown>,
  options: QuantifyOptions = {},
): string => {
  let str: string, n: number;
  if (typeof first === "string" && (typeof second === "number" || Array.isArray(second))) {
    str = first;
    n = Array.isArray(second) ? second.length : second;
  } else if ((typeof first === "number" || Array.isArray(first)) && typeof second === "string") {
    str = second;
    n = Array.isArray(first) ? first.length : first;
  } else {
    throw TypeError(
      "The first and second argument must be strings or numbers (or an array) exclusively",
    );
  }

  const { numberless, written, lang, plural } = options;

  // n = n.length ? n
  const s = (n === 1) ? str : (plural || `${str}s`);
  let num: string = n.toString();
  if (written) num = writtenNumber(n, lang);
  const strn = numberless ? "" : `${num} `;

  return strn + s;
};
export const count = quantify;

/**
 * Written numbers
 */
export const writtenNumber = (n: number, lang = "EN", gender = "m"): string => {
  const num = dictionary[lang]?.cardinals.written[n - 1];
  if (num) {
    if (typeof num === "object" && num[gender]) {
      return num[gender];
    } else if (typeof num === "object") {
      return Object.values(num)[0];
    } else {
      return num;
    }
  } else {
    return n.toString();
  }
};

/**
 * Quotes
 */
type Quotes =
  | "s"
  | "single"
  | "a"
  | "angle"
  | "g"
  | "guillemets"
  | "!"
  | "?"
  | "q"
  | string;
export const quote = (str: string, type?: Quotes) => {
  let a: string, z: string;
  switch (type) {
    case "s":
    case "single":
      [a, z] = ["‘", "’"];
      break;
    case "a":
    case "angle":
    case "g":
    case "guillemets":
      [a, z] = [a, z] = ["«", "»"];
      break;
    case "!":
      [a, z] = ["¡", "!"];
      break;
    case "?":
      [a, z] = ["¿", "?"];
      break;
    default:
      [a, z] = ["“", "”"];
      break;
  }
  return enclose(a, str, z);
};

/**
 * Ordinals
 */
interface OrdinalOptions {
  written?: boolean;
  wrap?: boolean | string;
  lang?: "EN";
}
export const ordinal = (
  n: number,
  opts: OrdinalOptions = {},
  gender = "m",
): string => {
  const { suffixes, rule, written } = dictionary[opts.lang || "EN"].ordinals;
  const base = (n.toString().match(rule) || [])[0];

  const w = written[+n - 1];
  if (opts.written) {
    if (typeof w === "object") {
      return w[gender];
    } else {
      return w;
    }
  } else {
    let suffix = suffixes[base] || suffixes.n;
    if (typeof suffix === "object") {
      suffix = suffix[gender];
    }

    if (opts.wrap) {
      if (typeof opts.wrap === "boolean") opts.wrap = "sup";
      suffix = wrapInTag(suffix, opts.wrap);
    }

    return n + suffix;
  }
};

/**
 * Numbers
 */
export const prettyNumber = (
  n: number,
  delimiter: string | number = ",",
  decimals = 0,
  dot = ".",
): string => {
  if (typeof delimiter === "number") {
    decimals = delimiter;
    delimiter = ",";
  }
  n = parseNumber(n);
  let num: string = n.toString();
  if (decimals > 0) num = n.toFixed(decimals);
  if (dot) num = num.replace(".", dot);
  const [int, frac] = num.toString().split(dot);
  return [int.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter), frac]
    .filter((e) => !!e)
    .join(dot);
};

interface Currency {
  currency: string;
  wrap?: string;
  decimals?: number;
  delimiter?: string;
  dot?: string;
  front?: boolean;
}
export const prettyPrice = (n: number, currency?: string | Currency) => {
  let wrap: string | undefined,
    decimals: number | undefined,
    delimiter: string | undefined,
    dot = '.',
    front = true;
  if (typeof currency === "object") {
    ({ currency = '$', wrap, decimals, delimiter, dot = '.', front = true } = currency);
  }

  if (!currency) currency = "$";
  if (!decimals) decimals = 2;
  if (!dot) dot = ".";

  let num = prettyNumber(n, delimiter, decimals, dot);

  if (wrap) {
    const [integer, fraction] = num.split(dot);
    num = integer + wrapInTag(fraction, wrap);
  }

  if (front) {
    return currency + num;
  } else {
    return num + currency;
  }
};

export const prettyPercent = (numerator = 0, denominator = 1, decimals = 0) => {
  const percent = (numerator / denominator * 100) || 0;
  return `${percent.toFixed(decimals)}%`;
};

export const parseNumber = (n: number | string) => {
  if (typeof n === "string") {
    n = parseFloat(n.replace(/[^\d\.]+/g, "")) /
      (n.slice(-1) === "%" ? 100 : 1);
  }
  if (n <= Infinity) {
    return n;
  } else {
    return -1;
  }
};

/**
 * Glyphs
 */
const fromTo = (x: number, y: number) =>
  new Array(y - x + 1).fill(0)
    // Array
    //   .apply(0, { length: y - x + 1 })
    .map((_e, i) => i + x);

export const glyphs = (): Record<string, string> =>
  Object.fromEntries(
    [
      fromTo(161, 255),
      fromTo(338, 402),
      fromTo(8211, 8230),
      [8240, 8364, 8482],
    ]
      .flat()
      .map((code) => [code, String.fromCharCode(code)]),
  );

export const glyph = (c: string) =>
  enclose("&#", c.charCodeAt(0).toString(), ";");

/**
 * Language support
 */
export const setLanguage = (object: Partial<Language>, lang: string) =>
  dictionary[lang] = { ...dictionary.EN, ...object };
