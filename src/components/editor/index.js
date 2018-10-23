import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import schema from './schema';
import { createToggle } from './commands';
import { undoItem, redoItem } from './menuItem';
import { createMenuBarPlugin } from './menubar';

export function createEditor(root, dom) { 
  
  // // 创建一堆commands
  // let commands = {};
  // let marks = [schema.marks.strong, schema.marks.code, schema.marks.em];
  // commands = marks.reduce((commands, mark) => ({
  //   ...commands,
  //   [`toggle${mark.name.replace(/^./, _=>_.toUpperCase())}`]: createToggle({ mark, view }),
  // }),{});
  // 创建一堆menuItem
  let menuItems = { undoItem, redoItem };
  let menuBarPlugins = createMenuBarPlugin(menuItems);
  // 创建Editor state and view
  let plugins = createPlugins({ schema });
  plugins.push(menuBarPlugins);
  let state = EditorState.create({ 
    schema,
    plugins,
    doc: DOMParser.fromSchema(schema).parse(dom),
  });
  let view = new EditorView(root, { 
    state,
  });
  return { schema, view, menuItems };
}

class editor {
  constructor(root, dom) {
    
  }
}