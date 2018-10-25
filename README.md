# vue-moon
A rich-text editor base on prosemirror and Vue
基于Prosemirror和Vue的富文本编辑器项目

### Demo
http://108.160.131.205/
### what it can do
+ 响应式更新menubar状态
+ 部分markdown输入适应
+ 可定制keymap
+ 图片拖入

### How to use
整个项目本身就是一个demo,你只需要在命令行
```
yarn install
```
和
```
yarn serve
```
然后在浏览器输入
```
http://localhost:8080
```
就可以看到本项目的效果
另外强调该项目只是一个启发性项目, 如果你意在寻找一款插拔式开箱即用的富文本编辑器, 你可以尝试同样为vue打造的基于prosemirror的tiptap.

### How to custom
理论上来说, 本项目的设计结构可以应用于任何前端框架. 你只需要抽离/src/Components/editor即可用于构建你自己的编辑器. 但是同样,这不是一款即插即用的编辑器, 你必须对prosemirror本身有一定了解才能开始定制.

项目结构
```
src/
| components/
  | icon/                 按钮图标文件夹
  | editor/
    | commands.js         与prosemirror的commands相关整合的文件
    | inputrules.js       与prosemirror的inputrules相关的整合文件
    | keymap.js           与prosemirror的keymap相关的整合文件
    | menubar.js          menubar plugins, 通过Plugins方法更新所有menuItem
    | menuItem.js         定义核心menuItem类和各种menuItem的文件
    | plugins.js          prosemirror的plugins整合文件
    | schema.js           定义本editor使用的schema
  | Editor.vue            本项目的视图层
| App.vue
| main.js
```
### Why build it
可定制性和开箱即用大抵是互相矛盾的事物, 我看了一圈现有的富文本编辑器, 开箱即用基本意味着非常难定制, 而我只是想要定制自己的menu而已, 不希望有乱七八糟的bubble menu, 乱七八糟的keymap, 和乱七八糟的markdown适应, 所以我基于prosemirror打造这个项目, 让他可以通过传递一个menuItem来隔离前端框架view更新,和editor本身的细节. 基本上, 本项目的view层只需要关注它在浏览器里的表现, 你可以在view层自定义自己的样式各种, 而不影响editor本身. 也就是说现在你也可以打造乱七八糟的menu了.

### How it work
不像draft和slate能基于immutable, 深度整合于react, 尽管prosemirror的model仍然是immutable, 但是我只需要一款可定制view层的编辑器. 最不济, 我要定制我的menubar. 遗憾的是, 这就是这个项目运作方式, 所有伟大的任务都是由prosemirror完成的, 而vue只是从中介入它的view层, 利用prosemirror自有的api, 更新每个menuItem的状态.

下面是prosemirror的data-flow

EditorView -> DOM event -> Transaction -> new EditorState

editorView依靠state生成DOM, DOM事件产生Transaction, 应用于当前state生成一个新的state, 如此循环, 本项目运行方式在editor每次更新view时, 通过一个plguin暴露的update()函数, 去更新自己的menuItems的state.


来看menuItem的class就知道这个menuItem是用来干嘛了
```
class menuItem {
  constructor() {
    this.actived = false //对应该menuItem是否被激活 class="?? || active"
    this.selected = false //对应该menuItem是否可选 display: ?? || none
    this.enable = true //对应该menuItem是否可用 disabled: ?? ||ture
  }
  run(state,dispatch,view){//对应该menuItem @click行为}
  ...
}

```
在```Editor.vue```中调用```createEditor```
```
import createEditor from './editor'

export default {
  data() {
    return {
      menuItems = {},
    }
  }
  mounted: {
    let {view, menuItems} = createEditor(root: this.$el)
    this.view = view;
    this.menuItems = Items;
  }
  ...
}
```

通过获取一组这样的menuItems, 最后赋给editor.vue的data, 现在你的menuItems的状态是响应式的了! 你可以通过一个computed属性和method,最终将menu状态和click事件应用到你的menubar上
```
<template>
  <div class="editor">
    <div class="menubar">
      <button
        class="menubar-btn"
        :class="{active:isBoldActived}"
        :disabled="!isBoldEnabled"
        @click="exec(menuItems.boldItem)"
        >
        <icon name="bold"></icon>
      </button>
      ...
    <div>
  <div>
<template>

<script>
export default {
  data() {
    return {
      menuItems: {},
    }
  }
  computed: {
    // Bold
    isBoldActived: function() {return !!this.menuItems.boldItem && !!this.menuItems.boldItem.actived},
    isBoldEnabled: function() {return !!this.menuItems.boldItem && !!this.menuItems.boldItem.enabled}
  }
  methods: {
    exec(item) {
      let view = this.view;
      view.focus();
      if(item && item.run) item.run(view.state, view.dispatch, view);
      return this;
    },
  }
}
</script>
...
```
### Why Prosemirror
prosemirror是一款扩展性很强的富文本编辑器, 和其他富文本编辑器例如Quill, Draft-js, slate, medium相比, prosemirror插件化, 组装化的思想让它拥有无与伦比的扩展性和可定制性. 但同时也导致Prosemirror项目非常庞大, 除了三个核心库model,state,view以外, 周边库还有诸如commands, history, inputrules, keymap, schema-*等. 尽管官方文档写得非常出色, 但是不能忽视它拥有非常多的api, 并且仿佛不同的api之间却完成重叠的功能. 它非常灵活, 但也同时导致它难以理解. 对编写插件有一定难度.

尽管prosemirror非常难上手, 但是仍然无法否认, 它是一个非常优秀的项目.

在react中已经有非常火热的draft和slate, 它们都和react深度整合在一起. 但是反观vue, 却好像没有什么非常火热的vue rich-text editor. 而我只是想要一款适用于vue的, 可定制的富文本编辑器. 所以我选择了Prosemirror作为我的base editor.
