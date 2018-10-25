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
      <button
        class="menubar-btn"
        :class="{active:isItalicActived}"
        :disabled="!isItalicEnabled"
        @click="exec(menuItems.italicItem)"
        >
        <icon name="italic"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isStrikeActived}"
        :disabled="!isStrikeEnabled"
        @click="exec(menuItems.strikeItem)"
        >
        <icon name="strike"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isUnderlineActived}"
        :disabled="!isUnderlineEnabled"
        @click="exec(menuItems.underlineItem)"
        >
        <icon name="underline"
        ></icon>
      </button>
      
      <button
        class="menubar-btn"
        :class="{active:isHeadingActived}"
        :disabled="!isHeadingEnabled"
        @click="exec(menuItems.headingItem)"
        >
        <icon name="heading"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isLinkActived}"
        :disabled="!isLinkEnabled"
        @click="showLinkPrompt(menuItems.linkItem)">
        <icon name="link"></icon>
      </button>
      <button
        class="menubar-btn"
        :disabled="!isImageEnabled"
        @click="showImagePrompt(menuItems.imageItem)">
        <icon name="photo"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isBlockQuoteActived}"
        :disabled="!isBlockQuoteEnabled"
        @click="exec(menuItems.blockQuoteItem)">
        <icon name="blockquote"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isCodeActived}"
        :disabled="!isCodeEnabled"
        @click="exec(menuItems.codeItem)"
        >
        <icon name="code"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isBulletListActived}"
        :disabled="!isBulletListEnabled"
        @click="exec(menuItems.bulletListItem)">
        <icon name="bulletlist"></icon>
      </button>
      <button
        class="menubar-btn"
        :class="{active:isOrderListActived}"
        :disabled="!isOrderListEnabled"
        @click="exec(menuItems.orderListItem)"
        >
        <icon name="orderlist"></icon>
      </button>
      <button
        class="menubar-btn"
        @click="exec(menuItems.undoItem)"
        :disabled="!isUndoEnabled">
        <icon name="undo"></icon>
      </button>
      <button
        class="menubar-btn"
        @click="exec(menuItems.redoItem)"
        :disabled="!isRedoEnabled">
        <icon name="redo"></icon>
      </button>
    </div>
   <slot name="content"></slot>
  </div>
</template>

<script>
import { createEditor } from './editor/index.js';

import Icon from './icon/index.vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      menuItems: {},
    }
  },
  computed: {
    // Bold
    isBoldActived: ASEfactory('bold', 'actived'),
    isBoldEnabled: ASEfactory('bold', 'enabled'),
    // Italic
    isItalicActived: ASEfactory('italic', 'actived'),
    isItalicEnabled: ASEfactory('italic', 'enabled'),
    // Strike
    isStrikeActived: ASEfactory('strike', 'actived'),
    isStrikeEnabled: ASEfactory('strike', 'enabled'),
    // Underline
    isUnderlineActived: ASEfactory('underline', 'actived'),
    isUnderlineEnabled: ASEfactory('underline', 'enabled'),
    // Heading
    isHeadingActived: ASEfactory('heading', 'actived'),
    isHeadingEnabled: ASEfactory('heading', 'enabled'),
    // BlockQuote
    isBlockQuoteActived: ASEfactory('blockQuote', 'actived'),
    isBlockQuoteEnabled: ASEfactory('blockQuote', 'enabled'),
    // Code
    isCodeActived: ASEfactory('code', 'actived'),
    isCodeEnabled: ASEfactory('code', 'enabled'),
    // Link
    isLinkActived: ASEfactory('link', 'actived'),
    isLinkEnabled: ASEfactory('link', 'enabled'),
    // ImageItem
    isImageEnabled: ASEfactory('image', 'enabled'),
    // bulletListItem
    isBulletListActived: ASEfactory('bulletList', 'actived'),
    isBulletListEnabled: ASEfactory('bulletList', 'enabled'),
    // orderListItem
    isOrderListActived: ASEfactory('orderList', 'actived'),
    isOrderListEnabled: ASEfactory('orderList', 'enabled'),
    // redo and undo
    isRedoEnabled: ASEfactory('redo', 'enabled'),
    isUndoEnabled: ASEfactory('undo', 'enabled'),
  },
  mounted() {
    let {
      view,
      schema,
      menuItems } = createEditor(this.$el, this.getDocFromSlot());
    this.view = view;
    this.schema = schema;
    this.menuItems = menuItems;
    this.clearContentSlot();
    this.view.focus();
  },
  beforeDestroyed() {
    if (this.view) {
			this.view.destroy()
		}
  },
  methods: {
    // 清除用于构造editor的content slot,只能算是一种hack,并没有真正清理Vnode
    clearContentSlot() {
      if(this.$slots.content[0].elm.innerHTML) this.$slots.content[0].elm.innerHTML = '';
      return true;
    },
    // 从content slot的Vnode中获取他的DOM
    getDocFromSlot() {
      return this.$slots.content[0].elm;
    },
    exec(item) {
      //excute function when it is ready;
      console.log(item);
      let view = this.view;
      view.focus();
      if(item && item.run) item.run(view.state, view.dispatch, view);
      return this;
    },
    showLinkPrompt(item) {
      console.log(item);
      if(item.actived) item.run(this.view.state, this.view.dispatch, { href: ''});
      else {
        const href = prompt('link to:');
        if (href !== null) {
          item.run(this.view.state, this.view.dispatch, { href });
        }
        this.view.focus();
      }
    },
    showImagePrompt(item) {
      console.log(item);
      if(item.actived) item.run(this.view.state, this.view.dispatch, { src: ''});
      else {
        const src = prompt('src:');
        if (src !== null) {
          item.run(this.view.state, this.view.dispatch, this.view, { src });
        }
        this.view.focus();
      }
		},
  },
}
// Actived, select, enable方法工厂
function ASEfactory(prefix, tag){
  return function() {
    // if(this.menuItems[`${prefix}Item`]) console.log(prefix, tag ,this.menuItems[`${prefix}Item`]);
    return !!this.menuItems[`${prefix}Item`] && !!this.menuItems[`${prefix}Item`][tag];
  }
}
</script>
<style lang="scss" scoped>
.menubar {

  display: flex;
  margin-bottom: 1em;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  border: solid rgba($color: #000000, $alpha: 0.1);
  border-width: 1px 0px;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  & .menubar-btn {
    font-weight: bold;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: black;
    line-height: 20px;
    padding: 0.3rem 0.3em;
    margin: 0.2em 0.2rem;
    border-radius: 3px;
    cursor: pointer;
    outline: none;

    &:disabled {
      opacity: 0.2;
      cursor: default;
    }

    &:hover {
      background-color: rgba(black, 0.05);
    }

    &.active .icon /deep/ .icon-svg {
      fill: rgba($color: #2169ee, $alpha: 1.0);
    }
  }
}

modal-content {
  padding: 30px auto;

}
</style>