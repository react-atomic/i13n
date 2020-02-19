import query from 'css-query-selector';
import callfunc from 'call-func';
import {FUNCTION} from 'reshow-constant';

const isArray = Array.isArray;

const delegate = (el, type, childs, defaultFunc) => {
  if (!el || !childs || !childs.length) {
    return;
  }
  if (!isArray(childs)) {
    childs = [{select: childs}];
  }
  query.el(el).addEventListener(type, e => {
    const t = e.target;
    childs.some(({select, func}) => {
      if (FUNCTION !== typeof func) {
        func = defaultFunc;
      }
      if ('debug' === select) {
        return callfunc(func, [e]);
      } else {
        const doms = query.all(select);
        return (doms || []).some(childEl => {
          if (t.isSameNode(childEl) || childEl.contains(t)) {
            callfunc(func, [{...e, currentTarget: childEl, nativeEvent: e}]);
            return true;
          } else {
            return false;
          }
        });
      }
    });
  });
};
export default delegate;
