import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import schema from './schema';

export function createEditor(root, dom) { 
  let state = EditorState.create({ 
    schema,
    doc: DOMParser.fromSchema(schema).parse(dom),
    plugins: createPlugins({ schema }),
  });
  let view = new EditorView(root, { 
    state,
  });

  return { state, schema, view };
}

import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import {baseKeymap} from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';

import {buildKeymap} from "./keymap";
import {buildInputRules} from "./inputrules";
/**
 *组装插件
 *
 */
function createPlugins({schema, mapKeys}) {
  let plugins = [
    buildInputRules(schema),
    keymap(buildKeymap(schema, mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history(),
  ];
  return plugins;

}