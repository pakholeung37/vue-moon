<template>
  <div class="editor">
    <div style="display: none" id="content">
      <h3>Hello ProseMirror</h3>
      <p>This is editable text. You can focus it and start typing.</p>
      <p>To apply styling, you can select a piece of text and manipulate
      its styling from the menu. The basic schema
      supports <em>emphasis</em>, <strong>strong
      text</strong>, <a href="http://marijnhaverbeke.nl/blog">links</a>, <code>code
      font</code>, and images.</p>
      <p>Block-level structure can be manipulated with key bindings (try
      ctrl-shift-2 to create a level 2 heading, or enter in an empty
      textblock to exit the parent block), or through the menu.</p>
      <p>Try using the “list” item in the menu to wrap this paragraph in
      a numbered list.</p>
    </div>
  </div>
</template>

<script>
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';

export default {
  mounted() {
    // const mySchema = new Schema({
    //   nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    //   marks: schema.spec.marks,
    // })

    // new EditorView(this.$el, {
    //   state: EditorState.create({
    //     doc: DOMParser.fromSchema(mySchema).parse(this.$el.firstChild),
    //     plugins: exampleSetup({ schema: mySchema }),
    //   })
    // })
    let state = EditorState.create({ 
      schema,
      doc: DOMParser.fromSchema(schema).parse(this.$el.firstChild),
    });
    let view = new EditorView(this.$el, { state });
  }
}
</script>
<style scoped>
.editor {
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
</style>
