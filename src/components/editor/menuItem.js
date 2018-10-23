import { undo, redo } from 'prosemirror-history';
import { toggleMark } from 'prosemirror-commands';
import { schema }from './schema';

// 我设计menuItem的初衷是为了能让图标变得相应式的,在view层调用dispatchtransaction
// 同时可以为每个MenuItem更新它的值, 然后通过vue的单项绑定, 更新按钮的状态, 
// 而我在设计这个editor的时候,只希望vue只充当整个editor的menubar-view层,他不应该干涉,
// 和破坏整个editor的运作, 而事实上, 我也是这么做了, 我通过menuitem暴露出commands接口,
// 和相应的状态, 只让vue来进行单行绑定, 更新menubar, 但同时也出现了很多问题:
// 第一, vue虽然有method层, 但是它不适应进行任何侵入式任务,例如更改editor-view, 计算inputRule, 
// method层只是为了更好的更新view而存在的, 
// 第二, vue的method层没有很好的工厂方法(或者是我不会), 如何为大量的按钮绑定method,是一个难题
// 第三, 由于porsemirror需要挂载在一个$el上, 导致createEditor是hook在mounted上的,
// 当然这个不是重点, 也不是问题, 重要的是, vue不能也不建议在@click上绑定自有函数(其实是可以的,但会被
// 警告), 例如我想在button redo@click上绑定MenuItem.redoItem.run, 这样就不行,因为menuItem是
// 跟随在mounted hook中createEditor return的变量, 而render template则是在之前完成的,
// 意味着在render时, menuItem is undefined, 自然失败.
// 第四, vue的响应式设计让人抓狂. 例如我想在button redo中的:actived="menuItem.redoItem.actived",
// 于是我想将整个menuItem放进Data中,让他变成组件中的响应式部分, 这是很自然的想法,
// 虽然官方不是很赞同这种做法, (官方认为data应该有data的样子,它应该只包含数据).但是它很方便.
// 为此我需要在data中添加一个MenuItem以便return时付给他. 但是因为vue的缺陷, vue不允许通过形如MenuItem.balabala
// 为MenuItem添加响应式属性, 所以在class MenuItem中, 必须要早于MenuItem赋值给data->MenuItem
// 前, 定义它所有的属性. 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  为此必须要在class constructor中声明selected, actived, enabled并赋予初值, 否则,他们
//  将成为一个非响应式属性!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// classMenuItem
//  selected -> bool : 返回该item是否可见 对应 dispaly : ?? || none
//  enabled -> bool : 返回该item是否可选  对应 diabled || ??
//  actived -> bool : 返回该item是否激活 对应 class= ??||"actived"

//  MenuItemSpec:: interface
//  spec参数传递给MenuItem constructor
//
//  run:: (EditorState, (Transaction), ?EditorView, ?dom.Event)
//  执行函数当menuitem actived
//
//  select:: ?(EditorState) -> bool
//  optional 决定是否可select的函数
//
//  enable:: ?(EditorState) -> bool
//  optional 决定时候enable的函数
//
//  active:: ?(EditorState) -> bool
//  optional 决定是否active的函数
//

export class MenuItem {
  constructor(spec) {
    this.spec = spec;
    this.selected = true;
    this.actived = false;
    this.enabled = true;
    this.run = spec.run;
  }
  update(state) {
    this.selected = this.isSelected(state);
    this.enabled = this.isEnabled(state);
    this.actived = this.isActived(state);
  }

  isSelected(state) {
    if (!this.spec.select) return true;
    let selected = this.spec.select(state);
    return !!selected;
  }
  isEnabled(state) {
    if (!this.spec.enable) return true;
    let enabled = this.spec.enable(state) || false;
    return !!enabled;
  }
  isActived(state) {
    if (!this.spec.active) return false;
    let actived = this.enabled && this.spec.active(state) || false;
    return !!actived;
  }
}

function markActive(state, type) {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function markItem(markType) {
  let cmd = toggleMark(markType);
  return new MenuItem({
    run: cmd,
    active: state => markActive(state, markType),
    enable: state => cmd(state),
  });
}

/*  */
export let undoItem = new MenuItem({
  run: undo,
  enable: state => undo(state),
});

export let redoItem = new MenuItem({
  run: redo,
  enable: state => redo(state),
});

export let boldItem = markItem(schema.marks.strong);
export let italicItem = markItem(schema.marks.em);
export let codeItem = markItem(schema.marks.code);
export let underlineItem = markItem(schema.marks.underline);
export let strikeItem = markItem(schema.marks.strike);