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
    let isRun;
    childs.some(({select, func}) => {
      const arrSel = query.all(select);
      if (!arrSel.length) {
        return false;
      }
      if (FUNCTION !== typeof func) {
        func = defaultFunc;
      }
      arrSel.some(childEl => {
        if (t.isSameNode(childEl) || childEl.contains(t)) {
          callfunc(func, [{...e, currentTarget: childEl}]);
          isRun = true;
          return true;
        } else {
          return false;
        }
      });
      if (isRun) {
        return true;
      } else {
        return false;
      }
    });
  });
};
export default delegate;
