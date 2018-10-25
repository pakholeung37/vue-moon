import { undo, redo } from 'prosemirror-history';
import { toggleMark, setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';
import { findParentNode } from 'prosemirror-utils';
import {NodeSelection} from 'prosemirror-state';
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
// 处理markItem, 决定markItem是否可用
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


// 处理node决定node是否可用
function nodeActive(state, type, attrs) {
	const predicate = node => node.type === type;
	const parent = findParentNode(predicate)(state.selection);
	if (attrs === {} || !parent) {
    return !!parent;
  }
	return parent.node.hasMarkup(type, attrs);
}

function toggleList(nodeType, itemType) {
  return (state, dispatch, view) => {
    const isActive = nodeActive(state, nodeType);
    if (isActive) {
      return liftListItem(itemType)(state, dispatch, view);
    }
    return wrapInList(nodeType)(state, dispatch, view);
  }
}

function listItem(nodeType, itemType) {
  let cmd = toggleList(nodeType, itemType);
  return new MenuItem({
    run: cmd,
    active: state => nodeActive(state, nodeType, {}),
    enable: state => cmd(state),
  });
}
// 处理如何生成blockItem
function toggleBlockType(type, toggletype, attrs = {}) {
	return (state, dispatch, view) => {
		const isActive = nodeActive(state, type, attrs)
		if (isActive) {
			return setBlockType(toggletype)(state, dispatch, view)
		}
		return setBlockType(type, attrs)(state, dispatch, view)
	}
}
// FIXME: 尽管一个BlockTypeItem已经在内部拥有一个决定active的函数了,toggleBlockType
// 仍然使用了自己的active函数, 可能会引起不一致的行为
function blockTypeItem(nodeType, toggleType, options) {
  let cmd = toggleBlockType(nodeType, toggleType, options.attrs);
  return new MenuItem({
    run: cmd,
    enable: state => cmd(state),
    active: state => nodeActive(state, nodeType, options.attrs),
    // active solution comes from prosemirror-menu,

    // active(state) {
    //   let {$from, to, node} = state.selection
    //   if (node) return node.hasMarkup(nodeType, options.attrs)
    //   return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs)
    // }
  });
}
// wrap item
function toggleWrap(type) {
	return (state, dispatch, view) => {
		const isActive = nodeActive(state, type)

		if (isActive) {
			return lift(state, dispatch)
		}

		return wrapIn(type)(state, dispatch, view)
	}
}

function wrapItem(type) {
  let cmd = toggleWrap(type);
  return new MenuItem({
    run: cmd,
    active: state => nodeActive(state, type),
    enable: state => cmd(state)
  })
}
// linkItem
function updateMark(type, attrs) {
  return (state, dispatch) => {
		const { from, to } = state.selection;
		return dispatch(state.tr.addMark(from, to, type.create(attrs)));
	}
}
function removeMark(type) {
  return (state, dispatch) => {
		const { from, to } = state.selection
		return dispatch(state.tr.removeMark(from, to, type))
	}
}

function insertLinkItem(markType) {
  return new MenuItem({
    active: state => markActive(state, markType),
    enable: state => !state.selection.empty,
    run: (state, dispatch, attrs) => {
      if (attrs.href) {
        return updateMark(markType, attrs)(state, dispatch);
      }  
      return removeMark(markType)(state, dispatch);
    }
  });
}
// deal with insertImageItem
function canInsert(state, nodeType) {
  let $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
  }
  return false;
}

function insertImageItem(nodeType) {
  return new MenuItem({
    enable: state => canInsert(state, nodeType),
    run: (state, _, view, attrs) => {
      if (state.selection instanceof NodeSelection && state.selection.node.type == nodeType)
        attrs = state.selection.node.attrs;
      view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
    },
  })
}
/******************export item*********************************************  */
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
// export let codeItem = markItem(schema.marks.code);
export let underlineItem = markItem(schema.marks.underline);
export let strikeItem = markItem(schema.marks.strike);
export let bulletListItem = listItem(schema.nodes.bullet_list, schema.nodes.list_item);
// FIXME:: there is a bug with orderlist, when click an order list, it doesn't toggle actived,
// it's supposed to relate to toggleMark and markActive
export let orderListItem = listItem(schema.nodes.order_list, schema.nodes.list_item);
export let headingItem = blockTypeItem(schema.nodes.heading, schema.nodes.paragraph, {attrs:{level: 2}});
export let codeItem = blockTypeItem(schema.nodes.code_block, schema.nodes.paragraph, {});
export let blockQuoteItem = wrapItem(schema.nodes.blockquote, schema.nodes.paragraph);
export let linkItem = insertLinkItem(schema.marks.link);
export let imageItem = insertImageItem(schema.nodes.image);