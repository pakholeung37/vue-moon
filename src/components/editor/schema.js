import { Schema } from 'prosemirror-model';

// 为了能更方便修改schema, 我把prosemirror-schema复制到这里了

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "block+"
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{tag: "p"}],
    toDOM() { return ["p", 0] }
  },

  // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{tag: "blockquote"}],
    toDOM() { return ["blockquote", 0] }
  },

  // :: NodeSpec A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{tag: "hr"}],
    toDOM() { return ["hr"] }
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  // `<h6>` elements.
  heading: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h1", attrs: {level: 1}},
               {tag: "h2", attrs: {level: 2}},
               {tag: "h3", attrs: {level: 3}},
               {tag: "h4", attrs: {level: 4}},
               {tag: "h5", attrs: {level: 5}},
               {tag: "h6", attrs: {level: 6}}],
    toDOM(node) { return ["h" + node.attrs.level, 0] }
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{tag: "pre", preserveWhitespace: "full"}],
    toDOM() { return ["pre", ["code", 0]] }
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline"
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: {default: null},
      title: {default: null}
    },
    group: "inline",
    draggable: true,
    parseDOM: [{tag: "img[src]", getAttrs(dom) {
      return {
        src: dom.getAttribute("src"),
        title: dom.getAttribute("title"),
        alt: dom.getAttribute("alt")
      }
    }}],
    toDOM(node) { return ["img", node.attrs] }
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{tag: "br"}],
    toDOM() { return ["br"] }
  },
  // :: NodeSpec
  // An ordered list [node spec](#model.NodeSpec). Has a single
  // attribute, `order`, which determines the number at which the list
  // starts counting, and defaults to 1. Represented as an `<ol>`
  // element.
  order_list: {
    attrs: {order: {default: 1}},
    content: 'list_item+',
    group: 'block',
    parseDOM: [{tag: "ol", getAttrs(dom) {
      return {order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1}
    }}],
    toDOM(node) {
      return node.attrs.order == 1 ? ["ol", 0] : ["ol", {start: node.attrs.order}, 0]
    }
  },
  bullet_list: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{tag: "ul"}],
    toDOM() { return ["ul", 0] }
  },
  list_item: {
    content: 'paragraph block*',
    group: 'block',
    parseDOM: [{tag: "li"}],
    toDOM() { return ["li", 0] },
    defining: true
  },
}

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: {default: null}
    },
    inclusive: false,
    parseDOM: [{tag: "a[href]", getAttrs(dom) {
      return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
    }}],
    toDOM(node) { return ["a", node.attrs] }
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
    toDOM() { return ["em"] }
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [{tag: "strong"},
               // This works around a Google Docs misbehavior where
               // pasted content will be inexplicably wrapped in `<b>`
               // tags with a font-weight normal.
               {tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null},
               {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
    toDOM() { return ["strong"] }
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{tag: "code"}],
    toDOM() { return ["code"] }
  },
  // :: MarkSpec underline. Represented as a '<u>' element.
  underline: {
    parseDOM: [
      {
        tag: 'u',
      },
      {
        style: 'text-decoration',
        getAttrs: value => value === 'underline',
      },
    ],
    toDOM: () => ['u', 0],
  },

  // :: MarkSpec underline. Represented as a '<s>' element.
  strike: {
    parseDOM: [
      {
        tag: 's',
      },
      {
        tag: 'del',
      },
      {
        tag: 'strike',
      },
      {
        style: 'text-decoration',
        getAttrs: value => value === 'line-through',
      },
    ],
    toDOM: () => ['s', 0],
  }
  
  
}

export const schema = new Schema({
  nodes: nodes,
  marks: marks,
});