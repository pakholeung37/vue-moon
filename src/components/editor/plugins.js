import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

import { buildKeymap } from "./keymap";
import { buildInputRules } from "./inputrules";
/**
 *组装插件
 *
 */
export function createBasePlugins({schema, mapKeys}) {
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
