<template>
  <div id="app">
    <div class="container">
      <editor class="editor">
        <div slot="content">
          <h1>This is h1</h1>
          <h2>This is h2</h2>
          <h3>This is h3</h3>
          <h4>This is h4</h4>
          <h5>This is h5</h5>
          <h6>This is h6</h6>
          <p><u>this is under line.</u></p>          
          <p><strong>this is bold.</strong></p>
          <p><em>this is italic</em></p>
          <p><code>this is code.</code></p>
          <p>example paragraph, Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
          <blockquote><p><strong> strong in block quote. Nullam quis risus eget urna mollis ornare vel eu leo.</strong> Nullam id dolor id nibh ultricies vehicula ut id elit.</p></blockquote>
          <pre><code>code Block</code></pre>
          <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
          <ol>
            <li>Vestibulum id ligula porta felis euismod semper.</li>
            <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</li>
            <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
          </ol>
          <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
          <ul>
            <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
            <li>Donec id elit non mi porta gravida at eget metus.</li>
            <li>Nulla vitae elit libero, a pharetra augue.</li>
          </ul>
        </div>
      </editor>
    </div>
  </div>
</template>

<script>
import Editor from './components/Editor.vue';

export default {
  name: 'app',
  components: {
    Editor,
  }
}
</script>

<style lang="scss">
.editor {
  margin: 20px auto;
  max-width: 720px;
  & .ProseMirror {
  outline: none;
}
}

</style>
