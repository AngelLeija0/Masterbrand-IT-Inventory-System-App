import{d as v,_ as g,J as $,C as f,D as h,G as x,I as _,aw as p,k as C,c as t,h as S,g as k,i as q,ax as b}from"./index.fc1c8868.js";import{u as y,b as B}from"./uid.94333c10.js";const z=v({name:"PageTitle",props:{label:{type:String}}});function D(e,o,c,s,n,l){const i=$("q-title");return f(),h(i,{class:"text-h5 text-weight-medium"},{default:x(()=>[_(p(e.label),1)]),_:1})}var T=g(z,[["render",D]]);const w={true:"inset",item:"item-inset","item-thumbnail":"item-thumbnail-inset"},r={xs:2,sm:4,md:8,lg:16,xl:24};var I=C({name:"QSeparator",props:{...y,spaced:[Boolean,String],inset:[Boolean,String],vertical:Boolean,color:String,size:String},setup(e){const o=k(),c=B(e,o.proxy.$q),s=t(()=>e.vertical===!0?"vertical":"horizontal"),n=t(()=>` q-separator--${s.value}`),l=t(()=>e.inset!==!1?`${n.value}-${w[e.inset]}`:""),i=t(()=>`q-separator${n.value}${l.value}`+(e.color!==void 0?` bg-${e.color}`:"")+(c.value===!0?" q-separator--dark":"")),m=t(()=>{const a={};if(e.size!==void 0&&(a[e.vertical===!0?"width":"height"]=e.size),e.spaced!==!1){const d=e.spaced===!0?`${r.md}px`:e.spaced in r?`${r[e.spaced]}px`:e.spaced,u=e.vertical===!0?["Left","Right"]:["Top","Bottom"];a[`margin${u[0]}`]=a[`margin${u[1]}`]=d}return a});return()=>S("hr",{class:i.value,style:m.value,"aria-orientation":s.value})}});function j(){return q(b)}export{T as P,I as Q,j as u};
