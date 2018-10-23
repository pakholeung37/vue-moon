import { toggleMark } from 'prosemirror-commands';

export function createToggle({ mark, view }) {
  if (!mark) return null;
  if (!view) return null;
  return () => {
    view.focus();
    toggleMark(mark)(view.state, view.dispatch, view);
  }
}