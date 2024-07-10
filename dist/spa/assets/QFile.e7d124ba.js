import{c as f,k as $,r as z,w as H,n as K,h as g,W as X,l as Y,ax as G,g as Q,ao as J,U,ae as Z,a8 as ee,a1 as te}from"./index.d76d729d.js";import{d as ie}from"./QTable.d3ac5408.js";import{b as le,u as ne,c as ae,e as ue,f as re,i as oe,d as se,g as E}from"./QInput.256b5391.js";import{h as ce}from"./PrimaryButton.ed2de242.js";const fe={ratio:[String,Number]};function de(e,c){return f(()=>{const y=Number(e.ratio||(c!==void 0?c.value:void 0));return isNaN(y)!==!0&&y>0?{paddingBottom:`${100/y}%`}:null})}const ge=16/9;var Ce=$({name:"QImg",props:{...fe,src:String,srcset:String,sizes:String,alt:String,crossorigin:String,decoding:String,referrerpolicy:String,draggable:Boolean,loading:{type:String,default:"lazy"},fetchpriority:{type:String,default:"auto"},width:String,height:String,initialRatio:{type:[Number,String],default:ge},placeholderSrc:String,fit:{type:String,default:"cover"},position:{type:String,default:"50% 50%"},imgClass:String,imgStyle:Object,noSpinner:Boolean,noNativeMenu:Boolean,noTransition:Boolean,spinnerColor:String,spinnerSize:String},emits:["load","error"],setup(e,{slots:c,emit:y}){const x=z(e.initialRatio),o=de(e,x);let a=null,b=!1;const d=[z(null),z(p())],h=z(0),F=z(!1),C=z(!1),q=f(()=>`q-img q-img--${e.noNativeMenu===!0?"no-":""}menu`),T=f(()=>({width:e.width,height:e.height})),I=f(()=>`q-img__image ${e.imgClass!==void 0?e.imgClass+" ":""}q-img__image--with${e.noTransition===!0?"out":""}-transition`),P=f(()=>({...e.imgStyle,objectFit:e.fit,objectPosition:e.position}));H(()=>r(),j);function r(){return e.src||e.srcset||e.sizes?{src:e.src,srcset:e.srcset,sizes:e.sizes}:null}function p(){return e.placeholderSrc!==void 0?{src:e.placeholderSrc}:null}function j(i){a!==null&&(clearTimeout(a),a=null),C.value=!1,i===null?(F.value=!1,d[h.value^1].value=p()):F.value=!0,d[h.value].value=i}function t({target:i}){b!==!0&&(a!==null&&(clearTimeout(a),a=null),x.value=i.naturalHeight===0?.5:i.naturalWidth/i.naturalHeight,m(i,1))}function m(i,u){b===!0||u===1e3||(i.complete===!0?N(i):a=setTimeout(()=>{a=null,m(i,u+1)},50))}function N(i){b!==!0&&(h.value=h.value^1,d[h.value].value=null,F.value=!1,C.value=!1,y("load",i.currentSrc||i.src))}function k(i){a!==null&&(clearTimeout(a),a=null),F.value=!1,C.value=!0,d[h.value].value=null,d[h.value^1].value=p(),y("error",i)}function n(i){const u=d[i].value,s={key:"img_"+i,class:I.value,style:P.value,crossorigin:e.crossorigin,decoding:e.decoding,referrerpolicy:e.referrerpolicy,height:e.height,width:e.width,loading:e.loading,fetchpriority:e.fetchpriority,"aria-hidden":"true",draggable:e.draggable,...u};return h.value===i?(s.class+=" q-img__image--waiting",Object.assign(s,{onLoad:t,onError:k})):s.class+=" q-img__image--loaded",g("div",{class:"q-img__container absolute-full",key:"img"+i},g("img",s))}function v(){return F.value!==!0?g("div",{key:"content",class:"q-img__content absolute-full q-anchor--skip"},Y(c[C.value===!0?"error":"default"])):g("div",{key:"loading",class:"q-img__loading absolute-full flex flex-center"},c.loading!==void 0?c.loading():e.noSpinner===!0?void 0:[g(G,{color:e.spinnerColor,size:e.spinnerSize})])}return j(r()),K(()=>{b=!0,a!==null&&(clearTimeout(a),a=null)}),()=>{const i=[];return o.value!==null&&i.push(g("div",{key:"filler",style:o.value})),C.value!==!0&&(d[0].value!==null&&i.push(n(0)),d[1].value!==null&&i.push(n(1))),i.push(g(X,{name:"q-transition--fade"},v)),g("div",{class:q.value,style:T.value,role:"img","aria-label":e.alt},i)}}});function V(e,c,y,x){const o=[];return e.forEach(a=>{x(a)===!0?o.push(a):c.push({failedPropValidation:y,file:a})}),o}function D(e){e&&e.dataTransfer&&(e.dataTransfer.dropEffect="copy"),U(e)}const me={multiple:Boolean,accept:String,capture:String,maxFileSize:[Number,String],maxTotalSize:[Number,String],maxFiles:[Number,String],filter:Function},ve=["rejected"];function he({editable:e,dnd:c,getFileInput:y,addFilesToQueue:x}){const{props:o,emit:a,proxy:b}=Q(),d=z(null),h=f(()=>o.accept!==void 0?o.accept.split(",").map(t=>(t=t.trim(),t==="*"?"*/":(t.endsWith("/*")&&(t=t.slice(0,t.length-1)),t.toUpperCase()))):null),F=f(()=>parseInt(o.maxFiles,10)),C=f(()=>parseInt(o.maxTotalSize,10));function q(t){if(e.value)if(t!==Object(t)&&(t={target:null}),t.target!==null&&t.target.matches('input[type="file"]')===!0)t.clientX===0&&t.clientY===0&&J(t);else{const m=y();m&&m!==t.target&&m.click(t)}}function T(t){e.value&&t&&x(null,t)}function I(t,m,N,k){let n=Array.from(m||t.target.files);const v=[],i=()=>{v.length!==0&&a("rejected",v)};if(o.accept!==void 0&&h.value.indexOf("*/")===-1&&(n=V(n,v,"accept",u=>h.value.some(s=>u.type.toUpperCase().startsWith(s)||u.name.toUpperCase().endsWith(s))),n.length===0))return i();if(o.maxFileSize!==void 0){const u=parseInt(o.maxFileSize,10);if(n=V(n,v,"max-file-size",s=>s.size<=u),n.length===0)return i()}if(o.multiple!==!0&&n.length!==0&&(n=[n[0]]),n.forEach(u=>{u.__key=u.webkitRelativePath+u.lastModified+u.name+u.size}),k===!0){const u=N.map(s=>s.__key);n=V(n,v,"duplicate",s=>u.includes(s.__key)===!1)}if(n.length===0)return i();if(o.maxTotalSize!==void 0){let u=k===!0?N.reduce((s,A)=>s+A.size,0):0;if(n=V(n,v,"max-total-size",s=>(u+=s.size,u<=C.value)),n.length===0)return i()}if(typeof o.filter=="function"){const u=o.filter(n);n=V(n,v,"filter",s=>u.includes(s))}if(o.maxFiles!==void 0){let u=k===!0?N.length:0;if(n=V(n,v,"max-files",()=>(u++,u<=F.value)),n.length===0)return i()}if(i(),n.length!==0)return n}function P(t){D(t),c.value!==!0&&(c.value=!0)}function r(t){U(t),(t.relatedTarget!==null||Z.is.safari!==!0?t.relatedTarget!==d.value:document.elementsFromPoint(t.clientX,t.clientY).includes(d.value)===!1)===!0&&(c.value=!1)}function p(t){D(t);const m=t.dataTransfer.files;m.length!==0&&x(null,m),c.value=!1}function j(t){if(c.value===!0)return g("div",{ref:d,class:`q-${t}__dnd absolute-full`,onDragenter:D,onDragover:D,onDragleave:r,onDrop:p})}return Object.assign(b,{pickFiles:q,addFiles:T}),{pickFiles:q,addFiles:T,onDragover:P,onDragleave:r,processFiles:I,getDndNode:j,maxFilesNumber:F,maxTotalSizeNumber:C}}var _e=$({name:"QFile",inheritAttrs:!1,props:{...le,...ne,...me,modelValue:[File,FileList,Array],append:Boolean,useChips:Boolean,displayValue:[String,Number],tabindex:{type:[String,Number],default:0},counterLabel:Function,inputClass:[Array,String,Object],inputStyle:[Array,String,Object]},emits:[...ae,...ve],setup(e,{slots:c,emit:y,attrs:x}){const{proxy:o}=Q(),a=ue(),b=z(null),d=z(!1),h=re(e),{pickFiles:F,onDragover:C,onDragleave:q,processFiles:T,getDndNode:I}=he({editable:a.editable,dnd:d,getFileInput:R,addFilesToQueue:B}),P=oe(e),r=f(()=>Object(e.modelValue)===e.modelValue?"length"in e.modelValue?Array.from(e.modelValue):[e.modelValue]:[]),p=f(()=>E(r.value)),j=f(()=>r.value.map(l=>l.name).join(", ")),t=f(()=>ce(r.value.reduce((l,S)=>l+S.size,0))),m=f(()=>({totalSize:t.value,filesNumber:r.value.length,maxFiles:e.maxFiles})),N=f(()=>({tabindex:-1,type:"file",title:"",accept:e.accept,capture:e.capture,name:h.value,...x,id:a.targetUid.value,disabled:a.editable.value!==!0})),k=f(()=>"q-file q-field--auto-height"+(d.value===!0?" q-file--dnd":"")),n=f(()=>e.multiple===!0&&e.append===!0);function v(l){const S=r.value.slice();S.splice(l,1),u(S)}function i(l){const S=r.value.indexOf(l);S>-1&&v(S)}function u(l){y("update:modelValue",e.multiple===!0?l:l[0])}function s(l){l.keyCode===13&&te(l)}function A(l){(l.keyCode===13||l.keyCode===32)&&F(l)}function R(){return b.value}function B(l,S){const _=T(l,S,r.value,n.value),O=R();O!=null&&(O.value=""),_!==void 0&&((e.multiple===!0?e.modelValue&&_.every(M=>r.value.includes(M)):e.modelValue===_[0])||u(n.value===!0?r.value.concat(_):_))}function w(){return[g("input",{class:[e.inputClass,"q-file__filler"],style:e.inputStyle})]}function L(){if(c.file!==void 0)return r.value.length===0?w():r.value.map((S,_)=>c.file({index:_,file:S,ref:this}));if(c.selected!==void 0)return r.value.length===0?w():c.selected({files:r.value,ref:this});if(e.useChips===!0)return r.value.length===0?w():r.value.map((S,_)=>g(ie,{key:"file-"+_,removable:a.editable.value,dense:!0,textColor:e.color,tabindex:e.tabindex,onRemove:()=>{v(_)}},()=>g("span",{class:"ellipsis",textContent:S.name})));const l=e.displayValue!==void 0?e.displayValue:j.value;return l.length!==0?[g("div",{class:e.inputClass,style:e.inputStyle,textContent:l})]:w()}function W(){const l={ref:b,...N.value,...P.value,class:"q-field__input fit absolute-full cursor-pointer",onChange:B};return e.multiple===!0&&(l.multiple=!0),g("input",l)}return Object.assign(a,{fieldClass:k,emitValue:u,hasValue:p,inputRef:b,innerValue:r,floatingLabel:f(()=>p.value===!0||E(e.displayValue)),computedCounter:f(()=>{if(e.counterLabel!==void 0)return e.counterLabel(m.value);const l=e.maxFiles;return`${r.value.length}${l!==void 0?" / "+l:""} (${t.value})`}),getControlChild:()=>I("file"),getControl:()=>{const l={ref:a.targetRef,class:"q-field__native row items-center cursor-pointer",tabindex:e.tabindex};return a.editable.value===!0&&Object.assign(l,{onDragover:C,onDragleave:q,onKeydown:s,onKeyup:A}),g("div",l,[W()].concat(L()))}}),Object.assign(o,{removeAtIndex:v,removeFile:i,getNativeElement:()=>b.value}),ee(o,"nativeEl",()=>b.value),se(a)}});export{Ce as Q,_e as a,de as b,fe as u};
