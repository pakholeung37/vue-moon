import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { schema } from './schema';
import { 
  undoItem,
  redoItem,
  boldItem,
  italicItem,
  codeItem,
  strikeItem,
  underlineItem,
  bulletListItem,
  orderListItem,
  headingItem,
  blockQuoteItem,
  linkItem,
  imageItem,
} from './menuItem';
import { createMenuBarPlugin } from './menubar';
import { createBasePlugins } from './plugins';

export function createEditor(root, dom) { 
  let menuItems = { 
    undoItem,
    redoItem,
    boldItem,
    italicItem,
    codeItem,
    strikeItem,
    underlineItem,
    bulletListItem,
    orderListItem,
    headingItem,
    blockQuoteItem,
    linkItem,
    imageItem,
  }
  // menubarPlugins主要是负责menuItem状态更新的任务
  let menuBarPlugins = createMenuBarPlugin(menuItems);
  // 创建Editor state and view
  let plugins = createBasePlugins({ schema });
  plugins.push(menuBarPlugins);

  let editor = new Editor({
    menuItems,
    plugins,
    root,
    dom,
    schema,
  })

  return editor;
}

// spec interface
//  menuItems (required) menuItems用于初始化
//  Plugins 用于初始化的Plugins
//  root 用于初始化的跟元素, default: document.body
//  dom 用于初始化的doc文档 default: ''
//  schema (required) 用于初始化的schema,
class Editor {
  constructor(spec) {
    this.root = spec.root || document.body;
    this.dom = spec.dom || '';
    this.menuItems = spec.menuItems;
    this.schema = spec.schema;
    this.plugins = spec.plugins || [];

    this.state = EditorState.create({
      schema: this.schema,
      plugins: this.plugins,
      doc: DOMParser.fromSchema(this.schema).parse(this.dom),
    })

    this.view = new EditorView(this.root, { state: this.state })
  }
}