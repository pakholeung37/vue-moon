import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis,
} from 'prosemirror-inputrules';


/**
 *给予一个blockquote node type返回一个处理形如以`> `开头的textblock
 *变成blockquote的input Rule
 *
 * @export
 * @param {*} nodeType
 * @returns
 */
export function blockQuoteRule(nodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

/**
 *orderedList转换规则
 *
 * @export
 * @param {*} nodeType
 * @returns
 */
export function orderedListRule(nodeType) {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType, match => ({order: +match[1]}),
    (match, node) => node.childCount + node.attrs.order == +match[1]
    );
}

/**
 *bulletList转换规则
 *
 * @export
 * @param {*} nodeType
 * @returns
 */
export function bulletListRule(nodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

/**
 *代码块转换规则
 *
 * @export
 * @param {*} nodeType
 * @returns
 */
export function codeBlockRule(nodeType) {
  return textblockTypeInputRule(/^```$/, nodeType);
}

/**
 *heading转换规则
 *
 * @export
 * @param {*} nodeType
 * @param {*} maxLevel
 * @returns
 */
export function headingRule(nodeType, maxLevel) {
  return textblockTypeInputRule(
    new RegExp("^(#{1," + maxLevel + "})\\s$"),
    nodeType,
    match => ({level: match[1].length})
  );
}

/**
 *语义太差, 待更改
 *
 * @export
 * @param {*} schema
 * @returns
 */
export function buildInputRules(schema) {
  let rules = smartQuotes.concat(ellipsis, emDash), type;
  (type = schema.nodes.blockquote) && rules.push(blockQuoteRule(type));
  (type = schema.nodes.ordered_list) && rules.push(orderedListRule(type));
  (type = schema.nodes.bullet_list) && rules.push(bulletListRule(type));
  (type = schema.nodes.code_block) && rules.push(codeBlockRule(type));
  (type = schema.nodes.heading) && rules.push(headingRule(type, 6));
  return inputRules({rules});
}
