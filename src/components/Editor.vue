<template>
  <div class="editor">
    <div class="menubar">
      <button
        class="menubar-btn">
        <icon name="bold"></icon>
      </button>
      <button
        class="menubar-btn">
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
        class="menubar-btn">
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
    </div>
   <slot name="content"></slot>
  </div>
</template>

<script>
import { createEditor } from './editor';

import Icon from './icon/index.vue';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      doc: null,
      schema: null,
      state: null,
      view: null,
      plugins: {},
      keymaps: {},

    }
  },
  
  mounted() {
    createEditor(this.$el, this.getDocFromSlot());
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
    }
  },
  
}
</script>
<style lang="scss" scoped>
.menubar {

  display: flex;
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

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
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba(black, 0.05);
    }

    &.is-active {
      background-color: rgba(black, 0.1);
    }
  }
}
</style>