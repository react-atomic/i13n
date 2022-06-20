(()=>{"use strict";var aF,aG,aH,aI,aJ={},aK="default",m="function",e="number",n="object",f="string",aL="symbol",aM="script",o="undefined",aN="TypeError",p=void 0,g=null,aO=!0,aP=!1,aQ=Object.keys,aR=Array.isArray,aS=function(a){return a?aQ(a).length:0},aT=function(a,b){return!!(a&&Object.prototype.hasOwnProperty.call(a,b))},aU="--real-time-url--",aV="--real-time-data-key--",q=function(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a};let aW=q;var aX="|boolean|"+e+"|"+f+"|"+n+"|"+m+"|"+o+"|",aY=function(a,b){return -1===aX.indexOf("|"+a+"|")?(b||(b=a),b):a},aZ=function(a,b){var c=Object.prototype.toString.call(a).replace(/^\[object\s(.*)\]$/,"$1").toLowerCase();return aY(c,b)},r=function(a,b){if(null==a)return aZ(a,b);try{var c=Object.getPrototypeOf(a).constructor.name.toLowerCase();return aY(c,b)}catch(d){return aZ(a,b)}};let a$=r;function a_(c){for(var a=1,e=arguments.length;a<e;a++)if(a%2||!Object.getOwnPropertyDescriptors){var d=null!=arguments[a]?arguments[a]:{},b=aQ(d);a$(Object.getOwnPropertySymbols)===m&&(b=b.concat(Object.getOwnPropertySymbols(d).filter(function(a){return Object.getOwnPropertyDescriptor(d,a).enumerable}))),b.forEach(function(a){aW(c,a,d[a])})}else Object.defineProperties(c,Object.getOwnPropertyDescriptors(arguments[a]));return c}var s=function(a,c,d,b){return m===typeof a?a.apply(d,c):o!==typeof b?b:a};let a0=s;var a1=function(b,a,c){a=null!==(d=a)&& void 0!==d?d:250;var d,e=!1,f=!1,g=function(c){var a=c||{},d=a.args,e=a.scope;f=!1,callfunc(b,d,e)};return function(b){f=!0,e||(e=!0,g(b),setTimeout(function(){e=!1,c&&f&&g(b)},a))}},a2=function(a,b){var c;return function(f){var d=f||{},e=d.delay,g=d.args,h=d.scope;clearTimeout(c),c=setTimeout(function(){return callfunc(a,g,h)},b||(void 0===e?250:e))}},a3=function(a,b,c){return function(){for(var e=arguments.length,f=new Array(e),d=0;d<e;d++)f[d]=arguments[d];return callfunc(b||a,f,c)}},t=function(a){if(!Array.isArray(a)&&Array.from)return Array.from(a);for(var b=0,c=Array(a.length),d=a.length;b<d;b++)c[b]=a[b];return c};let a4=t;var a5={__null:!0},u=function(a,b){return a=a||v(),o!==typeof a.document?a.document:b||a5},a6=function(a){return!v()[a||"__null"]},v=function(a){return"undefined"!=typeof window?window:a||a5},a7=function(a){return a?a4(a):[]},a8=function(a,c){var b;return a.some(function(a){var d;return!!a.contains(c)&&!a.isSameNode(c)&&(b=d=a)}),b},h=function(b){if(!b)return!1;var e=m===typeof b?b:function(){return a.el(b)},c=function(b){var a;return null===(a=e())|| void 0===a?void 0:a.querySelector(b)},g=function(b){var a;return a7(null===(a=e())|| void 0===a?void 0:a.querySelectorAll(b))},d=function(a){return f===typeof a?c(a):a},h=function(c,d){var e,a,b=g(d);for(b&&(a=a8(b,c));a;)if(e=a,b=a.querySelectorAll(d))a=a8(a7(b),c);else break;return e};return{all:function(a){return a&&(a.reduce?a.reduce(function(a,b){return a.concat(g(b))},[]):g(a))},ancestor:function(a,b){return(a=d(a))?a.closest?a.closest(b):h(a,b):(console.warn("Element is empty."),!1)},el:d,one:c}},a=h(u);let w=h;a.from=w;var a9=a.all,ba=a.ancestor,bb=a.el,bc=a.one,bd={el:0,opt:0},be={},bf="data-event-wrap-id",bg=function(a){var b=a.getAttribute?a.getAttribute(bf):a[bf];b||(b=++bd.el,a.setAttribute?a.setAttribute(bf,b):a[bf]=b);var c=be[b];return c||(c=new bh(b,a),be[b]=c),c},bh=null,bi=function(a){return bg(a)},bj=function(a){KEYS(be).forEach(function(b){be[b].cleanAll(a)})},bk=function(b,c,a,d){b&&a&&a.length&&(IS_ARRAY(a)||(a=[{select:a}]),register(query.el(b)).addEventListener(c,function(c){var e=c.target;a.some(function(f){var g=f.select,h=f.func,i=void 0===h?d:h;if("debug"===g)return callfunc(i,[c]);for(var j=query.from(b).all(g)||[],k=j.length;k--;){var a=j[k];if(e.isSameNode(a)||a.contains(e))return callfunc(i,[{type:c.type,target:c.target,currentTarget:a,nativeEvent:c}])}})}))},bl=function(a){return null!=a?new Date(a):new Date},x=function(a){return+bl(a)},bm=function(a,b,d,e){var f=x(),c=!0;return null==a||isNaN(a)||b&&!(f-a<=b)||(c=!1),c?a0(e):a0(d)},bn={},bo=function(a){var b;return bn[a]=null!==(b=bn[a])&& void 0!==b?b:0,(a||"")+"_"+bn[a]++},y=function(){return x()+""+Math.random()};let bp=y;var z=x();let bq=z;function A(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}let br=A;var bs=function(d,c){for(var b=0,e=c.length;b<e;b++){var a=c[b];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(d,a.key,a)}},B=function(a,b,c){return b&&bs(a.prototype,b),c&&bs(a,c),a};let bt=B;var bu=function(a){var b="|".concat(a.join("|"),"|");return["__proto__","constructor","prototype"].some(function(a){return -1!==b.indexOf("|".concat(a,"|"))})},C=function(f,d,c,e,g){if(!g&&bu(d))throw"Contain un-safe key.";var a=d.pop(),b=f;d.forEach(function(a){var c;b[a]=null!==(c=b[a])&& void 0!==c?c:Object.create(null),b=b[a]}),!e||b[a]&&b[a].push?e&&b[a].push?b[a].push(c):b[a]=c:b[a]?b[a]=[b[a],c]:b[a]=[c]},bv=function(a,b,c,d){return C(a,b,c,d,!0)};let bw=C;var D=function(a,b){return function(c,d){c.get("nextEmit")===b&&a0(a,[c,d])}};let bx=D;var E=function(a,b){return m===typeof a?a(b):null!=a?a:b};let by=E;var bz=function(a,c){var b;return null!==(b=a.size&&a0(a.get,[c],a))&& void 0!==b?b:a[c]},F=function(d,b,c){if(null==d)return by(c,d);var a=d;if(!b||!aR(b))return a;try{for(var f=b.length,g=b.length-1;f--;){var h=b[g-f];if(null!=a){var e=bz(a,h);if(o!==typeof e)a=e;else{a=by(c,e);break}}else{a=by(c);break}}}catch(i){console.warn({e:i}),a=by(c)}return a};let bA=F;var bB=function(a){return get(a,[DEFAULT,DEFAULT],function(){return get(a,[DEFAULT],function(){return a})})},G=function(a){return a&&a.toJS?a.toJS():a};let bC=G;var H=function(a,b){var c=bC(bA(a,b,{})),d={};return aQ(c).forEach(function(a){return d[a]=bC(c[a])}),d};let bD=H;var bE=function(a){return function(b,c){return a[b]||(a[b]=getDefaultValue(c))}},bF="params",I=function(a){return bA(a,[bF],{})};let bG=I;var bH="init",J=function(){function a(){br(this,a)}return bt(a,[{key:"sendBeacon",value:function(a,b){return a}},{key:"initDone",value:function(a,c){var f=this,b=c||{},g=b.triggerImpression,d=b.asyncInit,e=function(a){return a.set(bH,!0).set("nextEmit",bH)};return d?(setTimeout(function(){return f.dispatch("impression")}),e(a)):(setTimeout(function(){f.dispatch(e(a)),setTimeout(function(){g?g(function(){return f.dispatch("impression")}):f.dispatch("impression")})}),a)}},{key:"processImpression",value:function(a,b){return this.sendBeacon(a,b)}},{key:"processAction",value:function(a,b){var c=a.get("vpvid");return c&&bw(b,[PARAMS,"query","vpvid"],c),this.sendBeacon(a,b)}},{key:"handleInit",value:function(a,b){var c=a.get("initHandler"),d=this.initDone.bind(this);return c||(b.asyncInit=!0),a0(c||d,[a,b,d])}},{key:"handleImpression",value:function(a,c){var d,b;return a.get(bH)?a.get("disableHandleImpression")?a:(b=a0((d=a).get("impressionHandler")||this.processImpression.bind(this),[d,c]),bG(c).stop||(b=b.set("nextEmit","impression")),b):this.handleInit(a,c)}},{key:"handleAction",value:function(b,c){var a=a0(b.get("actionHandler")||this.processAction.bind(this),[b,c]),d=bG(c),e=d.wait,f=d.stop;return null!=e||f||(a=a.set("nextEmit","action")),a}},{key:"reduce",value:function(a,b){switch(a.get("nextEmit")&&(a=a.set("nextEmit",null)),b.type){case"impression":return this.handleImpression(a,b);case"action":return this.handleAction(a,b);case"config/set":return this.mergeMap(a,b.params);case"reset":return this.mergeMap(this.store.reset(),b.params);default:return aQ(b).length?this.mergeMap(a,b):a}}}]),a}();let K=J;var L=Object.assign||function(d){for(var a=1,e=arguments.length;a<e;a++){var b=arguments[a];for(var c in b)aT(b,c)&&(d[c]=b[c])}return d};let bI=L;function bJ(c,f){if(null==c)return{};var a,b,d={},e=aQ(c);for(b=0;b<e.length;b++)a=e[b],f.indexOf(a)>=0||(d[a]=c[a]);return d}function bK(a){throw new Error('"'+a+'" is read-only')}var bL=function(a){return parseInt(a,10)},bM=function(a){var b=a.indexOf(","),c=bL(a.substring(0,b)),d=a.substring(b+1);return[c,d]},bN=function(b){var c,a=JSON.stringify(bC(b));return a.length+","+a},bO=function(c){var a=bM(c),d=a[0],b=a[1];return d===b.length?JSON.parse(b):null},M=function(){function a(b,c){br(this,a),this._storage=b,this._de=c}return bt(a,[{key:"set",value:function(c,b){if(b===this.get(c))return this;var d=this._de?b:bN(b);return this._storage(c)(d),new a(this._storage,this._de)}},{key:"merge",value:function(a){var c,d=this;if(!a||n!==typeof a)return this;var b=aQ(a);return b&&b.length?(b.forEach(function(b){return c=d.set(b,a[b])}),c):this}},{key:"get",value:function(b){var a=this._storage(b)();if(a)return this._de?a:bO(a)}}]),a}();let bP=M;var bQ={},i=function(a){return function(b){return function(d){var e=v();if(e&&!bQ[a]){var c=bA(e,[a]);if(o===typeof c){console.warn("Not support. ["+a+"]"),bQ[a]=!0;return}if(o===typeof d)return c.getItem(b);try{if(null==d)return c.removeItem(b);return c.setItem(b,d)}catch(f){return c.clear(),c.setItem(b,d)}}}}},bR=i("localStorage"),bS=i("sessionStorage"),bT=function(a){return aQ(a||{}).map(function(b){return a[b]})},bU=function(a,e){var b={};if(IS_ARRAY(a))for(var c=a.length;c--;){var d=a[c];b[d[e]]=d}return b},bV=function(a){return aR(a)?a.length>1?a:a[0]:a},bW=function(a){return T_NULL==a||!isNaN(parseInt(a))||STRING===typeof a},bX=function(a){return bY(a,bW)},bY=function(a,b){return(b=b||function(a){return!IS_ARRAY(a)})(a)?a===T_UNDEFINED?[]:[a]:a},bZ=/[|\\{}()[\]^$+*?.]/g,b$=function(a){return a?a+"":""},N=function(a){return b$(a).replace(bZ,"\\$&")},b=function(a){return function(b,c){return function(d){if(!a[d]){var e=b?b(d):d;a[d]=new RegExp(e,c)}return a[d]}}},b_=function(a,b){return b$(a).match(b)};let b0=N;var j=function(a){return"(([#?&])"+b0(a)+"=)([^&#]*)"},b1=b({})(j),b2=b({})(j,"g"),b3=function(a){return b2(a)};let b4=function(a){return b1(a)};var b5=/^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,b6={},O=function(a){return b6[a]||(b6[a]=b5.exec(a)),b6[a]};let b7=O;var b8=p,b9=function(b){var a=b7(b);return{host:a[11],query:a[16],path:a[13]}},ca=function(a){return a||u().URL},cb=function(a,c){var b=b9(ca(c)).query,f=void 0===b?"":b,d=function(a){var b=a+"=";if(f.indexOf(b)===f.lastIndexOf(b)){var c=b4(a).exec(f);return c?decodeURIComponent(c[3]):b8}var d=cd(a,f);return bV(d)};if(!aR(a))return a?d(a):b8;var e={};return a.forEach(function(a){e[a]=d(a)}),e},cc=function(c,d){for(var a,e=b3(c),b=[];a=e.exec(d);)b.push(decodeURIComponent(a[3]));return b},cd=function(b,c){var a=b9(ca(c)).query;return cc(b,void 0===a?"":a)},ce=function(d,a){a=ca(a);for(var c,b=b4(d);c=b.exec(a);)a="?"===c[2]?a.replace(b,"?"):a.replace(b,"");return a},P=function(c,a,b,e){var d=aR(a);return b=ce(c,ca(b)),(d?a:[a]).forEach(function(a){e||(a=encodeURIComponent(a)),b=b+(-1===b.indexOf("?")?"?":"&")+c+"="+a}),b};let cf=P;var cg=function(a){return a<10?"0"+a:a},Q=function(b){var a=bl(b),c=[a.getUTCFullYear(),a.getUTCMonth()+1,a.getUTCDate(),a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds()].map(function(a){return cg(a)});return{toArray:function(){return c},toString:function(){return[c.slice(0,3).join("-"),"T",c.slice(3).join(":"),"Z"].join("")}}};let ch=Q;var ci=["stop","wait","lazeInfo","lazyKey"],cj="lazyAction",ck="params",cl="__hash",cm="__seq",cn=function(a,d){var e=function(b,c){var a=b[c],e=bG(a),f=e.wait,g=e.stop;return!f||f<=0?(!g&&(o!==typeof bA(a,["params","wait"])&&delete a.params.wait,d&&d(a)),delete b[c]):a.params.wait=bK("wait"),b[c]},b=bA(a,[cm]);aR(b)&&(a.__seq=b.filter(function(c,a){return e(b,a)}));var c=bA(a,[cl]);return c&&aQ(c).forEach(function(a){return e(c,a)}),a},co=function(){return new bP(bR)},R=function(a){a=a||co();var b=function(){return bD(a.get(cj))},c=function(b){return a.set(cj,b)},d=function(d){var a=b();bA(a,[cl,d])&&(delete a.__hash[d],c(a))},e=function(c,d){var e=b(),a=bA(e,[cl,d,ck],{}),f=(a.stop,a.wait,a.lazeInfo,a.lazyKey,bJ(a,ci));return aQ(f).forEach(function(a){var b=f[a],d=n===typeof b?a_(a_({},b),bA(c,[ck,a],{})):bA(c,[ck,a],b);bw(c,[ck,a],d)}),delete c.params.withLazy,c};return{process:function(a){return c(cn(b(),a))},handleAction:function(c,a){var b=bG(a).withLazy;b&&(a=e(a,b));var h=a0(c.get("lazyActionHandler"),[c,a])||c,f=bG(a),i=f.wait,j=f.stop,k=f.lazyKey;return g==i&&!j&&b&&b!==k&&d(b),h},getAll:b,getOne:function(a){return bD(b().__hash)[a]},push:function(e,f){var g=bG(e),a={params:bI({},g),type:e.type};bw(a,[ck,"lazeInfo"],{from:ca(),time:ch().toString()});var d=b();f?bw(d,[cl,f],a):bw(d,[cm],a,!0),c(d)}}};let S=R;var T=function(a){var b=a.oI13n,c=a.store,d=a.i13nDispatch,e=a.mergeMap;b.store=c,b.dispatch=d,b.mergeMap=e,c.i13n=b};let U=T;var cp=function(){var a=[];return{reset:function(){return a.splice(0,a.length)},add:function(b){return a.unshift(b)},remove:function(b){return a.splice(a.indexOf(b)>>>0,1)},emit:function(b,c,d){var e=a.slice(0);setTimeout(function(){for(var a=e.length;a--;)e[a](b,c,d)})}}},cq=function(a,b,c){return(a=a||{}).trim&&(a={type:a},b&&(a.params=b)),a0(a,[c])},V=function(c,b){var d={current:a0(b||{})},a=cp();return[{reset:function(){return a.reset()&&a0(b||{})},getState:function(){return d.current},addListener:a.add,removeListener:a.remove},function(b,g){var e=d.current;b=cq(b,g,e);var f=c(e,b);if(f===p)throw console.trace(),"reduce() return "+o+".";e!==f&&(d.current=f,a.emit(f,b,e))}]};let W=V;var X=function(){function a(b,c){br(this,a),aW(this,"_state",{}),aW(this,"_update",!1),b&&(this._state=b),c&&(this._update=c)}return bt(a,[{key:"renew",value:function(b){return this._update&&(this._state=b),new a(b)}},{key:"get",value:function(b){return n===typeof this._state[b]&&null!==this._state[b]?new a(this._state[b]):this._state[b]}},{key:"set",value:function(b,c){var a,d=a_(a_({},this._state),{},((a={})[b]=bC(c),a));return this.renew(d)}},{key:"delete",value:function(b){var a=a_({},this._state);return delete a[b],this.renew(a)}},{key:"merge",value:function(a){var b=a_(a_({},this._state),bC(a));return this.renew(b)}},{key:"toJS",value:function(){return this._state}}]),a}();let c=X;var cr=function(a,b){return function(c){if((a=callfunc(a))&&("BODY"===a.nodeName||"HEAD"===a.nodeName)){if(b&&a.firstChild){a.insertBefore(c,a.firstChild);return}a.appendChild(c);return}var d=doc();a||(a=d.currentScript?d.currentScript:d.body);var e=a.parentNode;if(e){if(b){e.insertBefore(c,a);return}if(a.nextSibling){e.insertBefore(c,a.nextSibling);return}e.appendChild(c);return}d.body.appendChild(c)}},cs=function(a){return function(b){return function(d){var e=doc();if(e.createElement){var f,c=e.createElement(a);return d&&KEYS(d).forEach(function(a){return c[a]=d[a]}),b&&(c.onreadystatechange=c.onload=function(){var a=c.readyState;a&& -1==="|loaded|complete|".indexOf("|"+a+"|")||f||(f=!0,setTimeout(b))}),c}}}},ct=function(a){if(a)try{a.parentNode.removeChild(a),a=null}catch(b){}},cu=function(a,b){return function(c){return function(e,f){var d=cs("script")(c)(f);return!1!==a&&cr(a,b)(d),d.src=e,d}}},cv=function(a,b){return function(c){return function(e,f){var d=cs("link")(c)(_objectSpread({rel:"stylesheet",type:"text/css"},f));return!1!==a&&cr(a,b)(d),d.href=e,d}}},cw=0,cx=function(){return aF},cy=function(a){var b=a.oWin,c=a.errCb,d=a.cb,e=a.inlineScripts,f=a.queueScripts,g=a.lastScripts,h=a.getScript;return function(a,j){e[a]&&e[a].length&&(e[a].forEach(function(a){try{aF=a,b.eval("("+FUNCTION+"(){"+a+"}.call(window))")}catch(d){if(FUNCTION!==typeof c)throw d;c(d,a)}}),delete e[a]);var i=callfunc(d,[{key:a,inlineScripts:e,queueScripts:f,lastScripts:g,origScript:j}]);if(!1===i)return i;f.length?h(f.shift()):g.length&&(g.forEach(function(a){return h(a)}),g=[])}},cz=function(e,c,g,m,n,t){c=c||win(),g=g||doc(c).body;for(var d={},h=[],i=[],u=!1,j=function(a){var b=a.attributes,c=b.key,j=b.asyncKey,e=null;if(c&&(e=function(){return o(c,a)}),!u){var f=js(g)(e)(a.src,{key:c||j});return callfunc(t,[{loadScript:f,origScript:a,inlineScripts:d,queueScripts:h,lastScripts:i}]),f}},o=cy({oWin:c,errCb:m,cb:n,inlineScripts:d,queueScripts:h,lastScripts:i,getScript:j}),k=(STRING===typeof e?create("div")()({innerHTML:e}):e).getElementsByTagName(SCRIPT),b=getSN("script"),p=b,f=0,q=k.length;f<q;f++){var a=k[f];if(a.src){var l=a.attributes||{},r=l.async,s=l.defer;r?(a.attributes.asyncKey=b,j(a)):s?(a.attributes.asyncKey=b,i.push(a)):(b=getSN("script"),a.attributes.key=b,h.push(a))}else d[b]||(d[b]=[]),d[b].push(a.innerHTML)}return o(p),function(){return u=!0}},cA=!1,cB=0,cC=5,cD="I13nScriptErr",cE="Error",Y=function(a,f,b){if(cB===cC)console.log("Max Errors exceed.",cC);else if(cB>cC)return;cB++;var c=a||{},g=c.message,d=c.stack;d=bA(a,["stack"],"").split(/\n/);var e=cx(),h={message:g,stack:d,url:ca(),lastExec:e};if(b&&(h.name=b),setTimeout(function(){var a=f&& -1!==f.indexOf(cD)?0:p;$("action",{wait:a,I13N:{action:f,category:cE,label:h}})}),cA)throw console.error({action:f,name:b},e),a},cF=function(a){return cA=a},cG=function(){return cA};let cH=Y;var cI=JSON,Z=function(a){try{return cI.parse(a)}catch(b){cH(b,cD)}},cJ=function(a){try{return cI.parse(cI.stringify(a))}catch(b){cH(b,cD)}};let cK=Z;var d=new K,k=W(d.reduce.bind(d),new c),l=k[0],$=k[1],_=function(a,b){return a.merge(b)};U({oI13n:d,store:l,i13nDispatch:$,mergeMap:_}),l.getClone=function(a){var b=bD(l.getState().get(a));return cJ(b)};var cL=function(){for(var d=arguments.length,c=new Array(d),a=0;a<d;a++)c[a]=arguments[a];var b=c.shift();return IS_ARRAY(b)||(b=[b]),c.forEach(function(a){null!=a&&(IS_ARRAY(a)?b=b.concat(a):b.push(a))}),b},cM=Object.keys,cN=function(c,d){var e=d?{}:[],a=get(c,null,{}),b=cM(a);if(!a[b[0]]||!a[b[0]].forEach){console.warn("Not array.",{thisArr:a,thisKeys:b},b[0]);return}return a[b[0]].forEach(function(h,f){var c={},g=f;b.forEach(function(b){c[b]=get(a,[b,f]),d&&d===b&&(g=c[b])}),d?e[g]=c:e.push(c)}),e},cO=function(a){var b=cM(a),c={};return b.forEach(function(b){c[b]=cN(a,b)}),c},cP=function(a,b,c,d){return a.forEach(function(a){var e=get(b,[a[c]]);a[c]=e?cN(e,d):null}),a},cQ=Object.keys,cR=Array.isArray,aa=function(a,b,d){if(!a)return a;b&&m!==typeof b&&(b=function(a){return o!==typeof a});var c={};return(cQ(a).forEach(function(e){var f=a[e];(!d||!d.length|| -1===d.indexOf(e))&&(f||b&&b(f))&&(c[e]=f)}),cR(a))?cQ(c).map(function(a){return c[a]}):c};let cS=aa;var cT=new c(g,!0),ab=new c(g,!0),cU=function(a){return cT=a},cV=function(a){return ab=a};function cW(a){return(cW="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a})(a)}var cX="i13nLazyAttr",cY="i13nLazyExpire",ac=function(a,b){return function(e){var c=bD(cT.get(cX));if(o===cW(a))return c;var g,d=bD(cT.get(cY)),f=x();return o!==cW(e)&&(c[a]=e,d[a]=f,cT.set(cX,c),cT.set(cY,d)),bm(d[a]||0,b?1e3*b:null,function(){return c[a]})}};let ad=ac;var cZ=ad("__prods"),c$=function(a,b){a.forEach(function(c,d){c&&c.id&&(b[c.id]=a_(a_({},b[c.id]),cS(c)),delete b[c.id].quantity,delete b[c.id].variant,delete b[c.id].position,a[d]=a_(a_({},c),b[c.id]))})},c_=function(){return bD(cZ())},c0=function(a){var b=c_();return["impressions","detailProducts","products"].forEach(function(c){var d=aR(a[c])?a[c]:bT(a[c]);d.length?c$(d,b):delete a[c]}),cZ(b),a},ae=function(a){var b=c0(bD(a.get("I13N"))),c=c0(bD(a.get("i13nPage")));return a.set("I13N",b).set("i13nPage",c)};let c1=ae;var af=function(){return{dispatch:$}};let c2=af;function c3(a){return(c3="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a})(a)}var c4=function(c,b){var a=c;return aQ(b||{}).length&&(a=n!==c3(a)?a_({label:c},b):a_(a_({},a),b)),n===c3(a)&&(a=JSON.stringify(a)),a},c5=function(){return"https://www.google-analytics.com/"+(cG()?"debug/":"")+"collect"},c6=[{},[]],c7=function(b,a){c6[0]=b||{},c6[1]=a?[a,get(a,["currentTarget"])]:[]},c8=function(){return c6},c9="oneTimeAction",ag=function(b,e){var c=e&&e.get(c9),a=b&&b.action;if(a&&c&&c.length){var f=ad(c9),d=f()||{};if(d[a])return!1;-1!==c.indexOf(a)&&(d[a]=!0,f(d))}return b};let da=ag;function db(a){return(db="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a})(a)}var dc=S(ab),dd="params",de=function(a,b){return function(){a.get("init")||bw(b,[dd,"wait"],0);var f,g,i=c8(),e=i[0],j=i[1],q=j[0],r=j[1],d=bG(b);isNaN(d.delay)||delete b.params.delay;var k=d.i13nCb,l=d.lazeInfo,n=d.i13nPageCb,s=d.wait,t=d.lazyKey,c=d.I13N;if(l&&(c.lazeInfo=l),m===db(k)&&(e.currentTarget=null!==(f=e.currentTarget)&& void 0!==f?f:r,c=k(q,null!==(g=c)&& void 0!==g?g:{},e,a),delete b.params.i13nCb),c=da(c,a),a=a.set("I13N",c),c?o!==db(s)&&(bw(b,[dd,"I13N"],c0(c)),dc.push(b,t)):bw(b,[dd,"stop"],!0),m===db(n)){var h=n(b,c,e);if(h){var p=a.get("i13nPage");a=a.set("i13nPage",p?p.merge(h):h)}}return c1(a)}},ah=function(a,b){var c=bG(b),d=c.delay,f=c.wait,e=de(a,b);return isNaN(d)?a=e():(setTimeout(function(){var a=e();a&&$(a);var b=a.get("I13N");o===db(f)&&aQ(b.toJS()).length&&$("action",{I13N:b})},d),bw(b,[dd,"stop"],!0)),a};let df=ah;var ai=function(a){return function(b){var c=b.init,d=b.action,e=b.impression;c&&a.addListener(bx(c,"init")),d&&a.addListener(bx(d,"action")),e&&a.addListener(bx(e,"impression"))}};let dg=ai;var dh,aj="Shopify",di="__st",dj=[aj,"Checkout"],dk="thank_you",ak=function(){return bA(v(),[].concat(dj,["step"]))},al=function(){return bA(v(),[aj,"shop"],function(){return bA(v(),[].concat(dj,["apiHost"]))})},am=function(){return bA(v(),[].concat(dj,["currency"]),function(){return bA(v(),[aj,"currency","active"])})},an=function(){var a=bA(v(),[di,"pageurl"]);if(a)return"https://"+a},ao=function(){return bA(v(),[di,"cid"])},ap=function(){if(dk===ak())return dk;var a=v();return bA(a,[di,"t"],function(){return bA(a,[di,"p"])})},aq=function(){var a=an(),b=cb("_ga",a)||"";return bA(b.split("-"),[1])},ar=function(){var a=bA(v(),[].concat(dj,["token"]));if(a)return"shopify-checkout-"+a},as={getStepNo:function(){var a=ak();switch(a){default:break;case"contact_information":return 1;case"shipping_method":return 2;case"payment_method":return 3}},getStepName:ak,getShopId:al,getPage:ap,getUid:ao,getGaId:aq,getDocUrl:an,getCurrency:am,getClientId:ar};let dl=as;function dm(a){return(dm="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a})(a)}var dn="currencyCode",dp=function(a,b,c){var d=bA(a,[dn])||c;bw(b,[dn],d)},dq={},dr=function(b,c,i){var e=b.stepNo,f=b.stepOption,d=b.products,a=null!=e?e:dl.getStepNo(),g=null!=f?f:dl.getStepName();if(a){var h={step:a,option:g};!dq[a]||d&&d.length||!g?(dq[a]={actionField:h,products:d},dp(b,c,i),bw(c,["checkout"],dq[a])):bw(c,["checkout_option"],{actionField:h})}},ds=function(b,c){var a=b.promotions;a&&bw(c,["promoView","promotions"],a)},dt=function(a,b,e){var c=a.fromP,d=a.detailProducts;d&&(c&&bw(b,["detail","actionField","list"],c),dp(a,b,e),bw(b,["detail","products"],d))},du=function(a,c,d){var e=a.p,b=a.impressions;b&&(dp(a,c,d),e&&b.forEach(function(a,c){return b[c].list=a.list||e}),bw(c,["impressions"],b))},dv=function(a,b,d,l){var e=a.purchaseId,f=a.refundId,c=a.products,g=bA(a,["affiliation"],""),h=bA(a,["coupon"],""),i=bA(a,["revenue"],0),j=bA(a,["tax"],0),k=bA(a,["shipping"],0);e&&(dp(a,b,d),bw(b,["purchase","actionField"],{id:e,affiliation:g,revenue:i,tax:j,shipping:k,coupon:h}),bw(b,["purchase","products"],c)),f&&(bw(b,["refund","actionField","id"],f),c&&(dp(a,b,d),bw(b,["refund","products"],c)))},dw=function(b,i){var d,f,c=i.defaultCurrencyCode,g=b.p,j=b.action,h=b.products,k=b.promotions,a={};g&&(f={list:g});var e={actionField:f,products:h};switch(j){case"ClickPromotion":a.promoClick={promotions:k};break;case"ClickProduct":a.click=e,d=bA(h,[0,"price"]),dp(b,a,c);break;case"BuyNow":case"AddToCart":a.add=e,dp(b,a,c);break;case"RemoveFromCart":a.remove=e,dp(b,a,c);break;case"ViewContent":ds(b,a),dt(b,a,c),du(b,a,c)}return dr(b,a,c),dv(b,a,c,d),{ecommerce:a,value:d}},dx=function(b,d){var c=d.defaultCurrencyCode,a={};return ds(b,a),dt(b,a,c),du(b,a,c),dv(b,a,c),dr(b,a,c),{ecommerce:a}},at=function(a,e,f){var g=f.getState(),b=a0("action"===a.trigger?dw:dx,[e,{defaultCurrencyCode:g.get("currencyCode")}]),c=b.ecommerce,d=b.value;return aQ(c).length&&(a.ecommerce=c,"action"!==a.trigger||(a.category="Ecommerce",o!==dm(a.value)||isNaN(d)||(a.value=d))),a};let dy=at;var au=function(){var a,b;return null!==(a=null==l?void 0:null===(b=l.getState())|| void 0===b?void 0:b.get("uid"))&& void 0!==a?a:dl.getUid()};let dz=au;var dA="|"+e+"|"+f+"|",dB=function(a){return dC(a)+"%"},dC=function(a){return dD(100*dF(a))},dD=function(b,a){return dF(b).toFixed(null!=a?a:2)},dE="Get number fail.",dF=function(a){if(o===typeof a)return 0;if(-1!==dA.indexOf("|"+typeof a+"|")&&a){var b=a&&a.trim?a.trim():a+"",c=parseFloat(b),d=parseInt(b,10);if(c===d&&(d+""===b||0===d))return d;if(b===c+"")return c;var e=0;return -1!==b.indexOf(".")?c:(isNaN(b)||(e=b),console.warn(dE,{willNum:e,maybeString:b,num:a}),e)}var f=Number(a);return isNaN(f)?0:f},dG=function(a){return dF(dD(a,0))},dH=/(\-)?(\d+)(\.)?(\d+)?/g,dI=function(a){if(f!==typeof a)return dF(a);var b=a.replace(",","").match(dH);return b?dF(b[0]):(console.warn(dE,a),0)},dJ=!0,av=function(a){return"(?:^|;)\\s?"+b0(a)+"=([^;]+)"},dK=b({})(av),dL=function(a){return dK(a)},dM=function(a){if(a)return a;if(!dJ)return"";try{return u().cookie}catch(b){return dN(b),""}},dN=function(a){console.warn("cookie not support",{e:a}),dJ=!1},aw=function(c,a){a=dM(a);var b=dL(c).exec(a);return null!==b?decodeURIComponent(b[1]):null},dO=function(e,f,b,a){a=a||"";var d="";if(b=b||0){var c=new Date;c.setTime(c.getTime()+864e5*b),d="expires="+c.toUTCString()+";"}return a&&(a="domain="+a+";"),e+"="+f+";"+d+a+"path=/"},dP=function(a,b,c,d){if(dJ)try{u().cookie=dO(a,b,c,d)}catch(e){dN(e)}};let dQ=aw;var ax=function(a){return bA(a,["location"],function(){return dl.getDocUrl()||ca()})},dR=function(a){return b9(ax(a)).host};let dS=ax;var dT="_ga",dU=function(b){var a=(dQ(b||"")||"").split(".");if(a[2]&&a[3])return a[2]+"."+a[3]},dV=function(){var a=dU(dT);return a||(a=bp(),dP(dT,"GA1.3."+a,730)),a},ay=function(){return dl.getClientId()||dV()};let dW=ay;function dX(a){return(dX="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a})(a)}var dY,dZ=["id","name","category","brand","variant","position","price","quantity","coupon","image","sku"],d$=["list"],d_="dimension",d0="metric",d1="x",d2=function(a){return a&&Array.isArray(a)&&a.length},d3=function(a){return o!==dX(a)?dI(a):a},az=function(){function a(){var b=this;br(this,a),aW(this,"isSameHost",function(a){return function(d){var e="//"+a,c=d.indexOf(e);if(5===c||6===c){var b=d.charAt(c+e.length);if("/"===b||"?"===b||""===b||":"===b)return!0}return!1}}),aW(this,"getPromotionsData",function(a){return b.getItemsData(a,"promo",b.setOnePromotion)}),aW(this,"setOnePromotion",function(a,b,c,h){var d=c.id,e=c.name,f=c.creative,g=c.position;b[a+"id"]=d,b[a+"nm"]=e,b[a+"cr"]=f,b[a+"ps"]=d3(g)}),aW(this,"getProductsData",function(a,c){return b.getItemsData(a,"pr",b.setOneProduct,c)})}return bt(a,[{key:"getReferrer",value:function(a){a||(a=u());var c=dR(),b=bA(a,["referrer"]);if(b&&!this.isSameHost(c)(b))return{dr:b}}},{key:"getActionData",value:function(b){var a=b||{},c=a.action,d=a.category,e=a.label,f=a.value,g={ec:d,ea:c,el:e,ev:d3(f)};return g}},{key:"getItemsData",value:function(a,c,d,e){if(d2(a)){var f=1,b={};return a.forEach(function(a){if(a){var g=c+f;f++,a0(d,[g,b,a,e])}}),b}}},{key:"getEcPromotionData",value:function(a,b){if(a||b){var c,d=(a||b).promotions;c=a?"view":"click";var e=a_({promoa:c},this.getPromotionsData(d));return e}}},{key:"setOneProduct",value:function(a,b,c,d){var e=c.id,f=c.name,h=c.category,i=c.brand,j=c.variant,k=c.position,l=c.price,m=c.quantity,n=c.coupon,g=c.image,o=c.sku,p=bJ(c,dZ);(null!=e||null!=f)&&(b[a+"id"]=e,b[a+"nm"]=f,b[a+"br"]=i,b[a+"ca"]=h,b[a+"va"]=j,b[a+"pr"]=d3(l),b[a+"qt"]=m,b[a+"cc"]=n,b[a+"ps"]=d3(k),b[a+"img"]=g,b[a+"sku"]=o,aQ(p).forEach(function(c){var d;if(0===c.indexOf(d_)&&(d="cd"),0===c.indexOf(d0)&&(d="cm"),d){var e=dI(c);b[a+d+e]=p[c]}}),(d||{}).imageIndex&&(b[a+"cd"+d.imageIndex]=g))}},{key:"getEcPurchaseData",value:function(c,d,h){if(c||d){var b,e=c||d,i=e.actionField,f=e.products,a=i||{},g=a.id,j=a.affiliation,k=a.revenue,l=a.tax,m=a.shipping,n=a.coupon;return b=c?{pa:"purchase",ti:g,ta:j,tr:d3(k),tt:d3(l),ts:d3(m),tcc:n}:{pa:"refund",ti:g},f&&(b=a_(a_({},b),this.getProductsData(f,h))),b}}},{key:"getEcStepData",value:function(b,a,e){if(b||a){var c=b||a,f=c.actionField,g=c.products,d=f||{},h=d.step,i=d.option,j=a_({cos:h,col:i,pa:a?"checkout_option":"checkout"},this.getProductsData(g,e));return j}}},{key:"getEcActionData",value:function(a,b,c){if(a){var d=a.actionField,e=a.products,f=d||{},g=f.list,h=a_(a_({},this.getProductsData(e,c)),{},{pa:b,pal:g});return cS(h,!0)}}},{key:"getEcImpressionsData",value:function(a,c){var d=this;if(d2(a)){var e=1,f={},b={};return a.forEach(function(g){var a=g.list,h=bJ(g,d$);f[a]||(f[a]={key:"il"+e,n:1},e++,b[f[a].key+"nm"]=a);var i=f[a].key+"pi"+f[a].n;f[a].n++,d.setOneProduct(i,b,h,c)}),b}}},{key:"getEcData",value:function(b){var a=(b||{}).ecommerce;if(a){var d=a.impressions,e=a.detail,f=a.click,g=a.add,h=a.remove,i=a.checkout,j=a.checkout_option,k=a.purchase,l=a.refund,m=a.promoView,n=a.promoClick,c=a.currencyCode,o=a_(a_(a_(a_(a_(a_(a_(a_(a_({},this.getEcImpressionsData(d,b)),this.getEcActionData(e,"detail",b)),this.getEcActionData(f,"click",b)),this.getEcActionData(g,"add",b)),this.getEcActionData(h,"remove",b)),this.getEcStepData(i,j,b)),this.getEcPurchaseData(k,l,b)),this.getEcPromotionData(m,n)),{},{cu:null!=c?c:dl.getCurrency()});return o}}},{key:"getMp",value:function(r,f){var c=u(),d=v(),e=d.navigator||{},g=d.screen||{},k=c.documentElement||{},s=Math.max(k.clientWidth||0,d.innerWidth||0),t=Math.max(k.clientHeight||0,d.innerHeight||0),h=r||{},l=h.trackingId,w=h.needTrackingId,y=h.version;if(w&&null==l)return!1;var a=f||{},z=a.trigger,m=(a.trackingType,a.bCookieIndex),i=a.bCookie,n=a.lazeInfoIndex,j=a.lazeInfo,A=a.expId,B=a.expVar,C=a.siteId,D=a.email,E=a.p,F=a.p2,G=a.p3,H=a.p4,I=a.p5,b=a_(a_(a_(a_({},this.getActionData(f)),this.getEcData(f)),this.getReferrer()),{},{siteid:C,em:D,xid:A,xvar:B,fbp:dQ("_fbp")||p,fbc:dQ("_fbc")||p,cg1:E,cg2:F,cg3:G,cg4:H,cg5:I,_s:aG,dl:dS(),ul:(e.language||e.browserLanguage||"").toLowerCase(),de:c.characterSet||c.charset,dt:c.title,sd:g.colorDepth+"-bit",sr:g.width+d1+g.height,vp:s+d1+t,je:dF(a0(e.javaEnabled,null,e)),tid:l,cid:dW(),scid:dl.getGaId(),dh:dl.getShopId(),_gid:dU("_gid"),v:y||1,z:aH,t:"impression"===z?"pageview":"event"});if(aG++,cE===b.ec&&(b.t="exception",b.exd=b.ea),i&&(m&&(b["cd"+m]=i),b.uid=i),j){n&&(b["cd"+n]=j);var o=cK(j);if(o.time){var q=x(o.time);isNaN(q)||(b.qt=x()-q)}}return bq&&(b.plt=x()-bq),cS(b,!0)}}]),a}();!function(a){aG=null!=a?a:1,aH=bp()}();let d4=az;var d5="GET",d6="POST",d7=3e4,d8=function(b,d){var c=v()||self;b=b||d5;var a=null!=c.XMLHttpRequest?new c.XMLHttpRequest:null;return a&&"withCredentials"in a?a.open(b,d,!0):null!=c.XDomainRequest?(a=new c.XDomainRequest).open(b,d):a=null,a},d9=function(b,f,c,d){var a=d8(c,b);if(!a)return!1;a.timeout=d7,a.onload=function(){aI=!0,a0(a0(f,[a]))};try{return a.send(d),!0}catch(e){return console.warn("req failed.",{url:b,e:e}),!1}},ea=function(a){if(!a6())return d9(a);var c,b=new Image;b.onload=function(){c&&clearTimeout(c),aI=!0},b.src=a,c=setTimeout(function(){b.src=""},d7+6e4)},eb=function(b,c){var a=bA(v(),["navigator","sendBeacon"]);return!!a&&!!aI&&(a.call(v().navigator,b,c),!0)},ec=function(a){var b="?";return a?(aQ(a).forEach(function(c){b=cf(c,a[c],b)}),b.substring(2)):b},ed=function(b,f,c,a){c=c||d9,a=a||ea;var d=ec(f),e=b+"?"+d;2036>=e.length?a(e):eb(b,d)||c(b,null,d6,d)||a(e)},ee=function(a){return aI=a},aA=function(a){var b=a.store,c=a.gaId,d=a.bCookieIndex,e=a.lazeInfoIndex,f=a.mpHost,g=new d4,h=function(d,c){c=c||ed;var a=b.getState(),i=a0(f)||a.get("mpHost"),j=a.get("defaultMpHost"),e=i||j;if(e){var h=g.getMp({trackingId:d.gaId,needTrackingId:a.get("needTrackingId"),version:a.get("version")},d);h&&c(e,h)}else console.warn("mp host not found")},i=function(a){var g,f=b.getState(),i=dz();i&&(a.bCookie=i,d&&(a.bCookieIndex=d)),a.lazeInfo&&e&&(a.lazeInfoIndex=e),"action"===a.trigger&&(a.label=c4(a.label,a.ecommerce?{ecommerce:a.ecommerce}:null)),a.p=null!==(g=a.p)&& void 0!==g?g:dl.getPage(),a.expId=f.get("expId"),a.expVar=f.get("expVar"),a.siteId=f.get("siteId"),a.email=f.get("email"),a.gaId=c||f.get("trackingId"),h(cS(a))};dg(b)({action:function(){var a=b.getClone("I13N"),e=a.lazeInfo,c=a.action,d=a.category,f=a.label,g=a.value,h=a.p,j=a.p2,k=a.p3,l=a.p4,m=a.p5,n={trigger:"action",lazeInfo:JSON.stringify(e),action:c,category:null!=d?d:c,label:f,value:g,p:h,p2:j,p3:k,p4:l,p5:m};i(dy(n,a,b))},impression:function(){var a=b.getClone("i13nPage"),c=a.p,d=a.p2,e=a.p3,f=a.p4,g=a.p5;i(dy({trigger:"impression",p:c,p2:d,p3:e,p4:f,p5:g},a,b))}})};let ef=aA;var aB=function(a){a.store=l,a.type,ef(a)};let eg=aB;var eh=function(c){for(var a=bA(c,["tags"],[]),b=a.length;b--;)eg(a[b])},ei=function(b,a,d){var c=bG(a);return eh(a_(a_({},bA(b)),c)),a.asyncInit=!0,d(_(b,c),a)},ej=function(a,b){return c1(a)},aC=function(f,g){var a=g||{},b=a.global,h=void 0===b?{}:b,c=a.globalKey,i=void 0===c?"i13n":c,d=a.utils,j=void 0===d?c2:d,e=!1;e||(h[i]=a0(j),e=!0,$("reset",{initHandler:ei,actionHandler:df,impressionHandler:ej}),$("impression",{trackingId:f,tags:[{mpHost:c5}]}))};let aD=aC;var ek,aE=function(){var a=u().currentScript;if(a)return cb("id",a.src)}();aD(aE,{global:v()})})()