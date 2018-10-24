import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { Plugin } from 'prosemirror-state';
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
    ImageDragger(),
  ];
  return plugins;
}

function ImageDragger() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        drop(view, event) {
          const hasFiles = event.dataTransfer
          && event.dataTransfer.files
          && event.dataTransfer.files.length

          if (!hasFiles) {
            return
          }

          const images = Array
            .from(event.dataTransfer.files)
            .filter(file => (/image/i).test(file.type))

          if (images.length === 0) {
            return
          }

          event.preventDefault()

          const { schema } = view.state
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

          images.forEach(image => {
            const reader = new FileReader()

            reader.onload = readerEvent => {
              const node = schema.nodes.image.create({
                src: readerEvent.target.result,
              })
              const transaction = view.state.tr.insert(coordinates.pos, node)
              view.dispatch(transaction)
            }
            reader.readAsDataURL(image)
          })
        },
      },
    },
  });
}
