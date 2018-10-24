<template>
  <div id="app">
    <div class="container">
      <editor class="editor">
        <div slot="content">
          <h2>This is heading</h2>
          <p><u>this is under line.</u></p>          
          <p><strong>this is bold.</strong></p>
          <p><em>this is italic</em></p>
          <p><a href="www.baidu.com">this is a link</a></p>
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
    & img {
      max-width: 100%;
    }
  }
  & blockquote {
    margin: 1em 0;
    padding-left: 1em;
    color: #646464;
    border-left: 3px solid #d3d3d3;
  }
}


</style>
