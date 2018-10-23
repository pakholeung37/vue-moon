<template>
  <div class="editor">
    <div class="menubar">
      <button
        class="menubar-btn"
        disabled
        >
        <icon name="bold"></icon>
      </button>
      <button
        class="menubar-btn"
        >
        <icon name="italic"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="strike"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="underline"></icon>
      </button>
      <button
        class="menubar-btn"
        >
        <icon name="code"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="paragraph"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="ul"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="ol"></icon>
      </button>
      <button
        class="menubar-btn">
        <icon name="quote"></icon>
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

import Icon from './editor/icon/index.vue';

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
    isRedoEnabled: function() {
      console.log('compute it');
      return !!this.menuItems.redoItem && !!this.menuItems.redoItem.enabled;
    },
    isUndoEnabled: function() {
      return !!this.menuItems.undoItem && !!this.menuItems.undoItem.enabled;
    }
  },
  mounted() {
    let {
      view,
      schema,
      commands,
      menuItems } = createEditor(this.$el, this.getDocFromSlot());
    this.view = view;
    this.schema = schema;
    this.commands = commands;
    this.menuItems = menuItems;
    this.clearContentSlot();
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
      let view = this.view;
      view.focus();
      let state = this.state;
      if(item && item.run) console.log(item.run,state,view),item.run(view.state, view.dispatch, view);
      return this;
    }
  },
  
}
</script>
<style lang="scss" scoped>
.menubar {

  display: flex;
  margin-bottom: 1rem;
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
    padding: 0.8rem 0.5rem;
    margin-right: 0.2rem;
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

    &.is-active {
      background-color: rgba(black, 0.1);
      outline: none;
    }
  }
}


</style>