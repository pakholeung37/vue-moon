import {
  wrapIn,
  setBlockType,
  chainCommands,
  toggleMark,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode
} from "prosemirror-commands"
import {
  wrapInList,
  splitListItem,
  liftListItem,
  sinkListItem
} from "prosemirror-schema-list"
import {
  undo,
  redo
} from "prosemirror-history"
import {
  undoInputRule
} from "prosemirror-inputrules"

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false

export function buildKeymap(schema, mapKeys) {
  let keys = {},
    type;

  function bind(key, cmd) {
    if (mapKeys) {
      let mapped = mapKeys[key];
      if (mapped === false) return;
      if (mapped) key = mapped;
    }
    keys[key] = cmd;
  }

  bind('Mod-z', undo);
  bind('Shift-Mod-z', undo);
  bind('Backspace', undoInputRule);
  if (!mac) bind('Mod-y', redo);

  bind("Alt-ArrowUp", joinUp);
  bind("Alt-ArrowDown", joinDown);
  bind("Mod-BracketLeft", lift);
  bind("Escape", selectParentNode);

  type = schema.marks.strong;
  if (type)
    bind("Mod-b", toggleMark(type));
  
  type = schema.marks.em;
  if (type)
    bind("Mod-i", toggleMark(type));
  
  type = schema.marks.code;
  if (type)
    bind("Mod-`", toggleMark(type));

  type = schema.nodes.bullet_list;
  if (type)
    bind("Shift-Ctrl-8", wrapInList(type));
  
  type = schema.nodes.ordered_list;
  if (type)
    bind("Shift-Ctrl-9", wrapInList(type));
  
  type = schema.nodes.blockquote;
  if (type)
    bind("Ctrl->", wrapIn(type));
  
  type = schema.nodes.hard_break;
  if (type) {
    let br = type,
      cmd = chainCommands(exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
        return true;
      })
    bind("Mod-Enter", cmd);
    bind("Shift-Enter", cmd);
    if (mac) bind("Ctrl-Enter", cmd);
  }
  
  type = schema.nodes.list_item; 
  if (type) {
    bind("Enter", splitListItem(type));
    bind("Mod-[", liftListItem(type));
    bind("Mod-]", sinkListItem(type));
  }
  
  type = schema.nodes.paragraph;
  if (type)
    bind("Shift-Ctrl-0", setBlockType(type));
  
  type = schema.nodes.code_block;
  if (type)
    bind("Shift-Ctrl-/", setBlockType(type));
  
  type = schema.nodes.heading;
  if (type)
    for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(type, {
      level: i
    }))
  
  type = schema.nodes.horizontal_rule;
  if (type) {
    let hr = type
    bind("Mod-_", (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView())
      return true
    })
  }

  return keys;
}