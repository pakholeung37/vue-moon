import { Plugin } from 'prosemirror-state';
// 将menubar的行为和state构造成一个plugin, 提供一个view->boject update方法,
// 可以在每次更新state时调用这个update()
export function createMenuBarPlugin(menuItems) {
  return new Plugin({
    view(editorView) {
      return new MenuBarView(editorView, menuItems);
    }
  })
}

class MenuBarView {
  constructor(editorView, menuItems) {
    this.menuItems = menuItems;
    this.editorView = editorView;
  }

  update(){
    // 永远使用新的state来更新!!
    Object.values(this.menuItems).map(item => item.update(this.editorView.state));
  }
  destroy() {
    
  }
}