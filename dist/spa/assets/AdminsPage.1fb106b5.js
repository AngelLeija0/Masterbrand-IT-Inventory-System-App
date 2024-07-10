import{P as I,d as P,f as w}from"./PrimaryButton.ed2de242.js";import{b as y,a as R,Q as V}from"./QPage.90f527e3.js";import{api as _}from"./axios.d5763ff0.js";import{u as B}from"./data-api-store.96a98ce2.js";import{P as Q}from"./PageTitle.9a2d5f9a.js";import{F as S}from"./FilterBar.ccc1d6e5.js";import{D as M}from"./DetailsTable.162e0ec0.js";import{d as $,r as p,_ as N,G as f,y as b,z as k,C as s,f as t,Q as h,N as v,E as F,J as q}from"./index.d76d729d.js";import{u as z,Q as C}from"./use-quasar.8b1fb4cd.js";import{Q as D}from"./QInput.256b5391.js";import{Q as O}from"./QTooltip.e068c045.js";import"./use-dark.dd39b0a6.js";import"./uid.55d387d1.js";import"./QBtnDropdown.f3e529f4.js";import"./QTable.d3ac5408.js";import"./QSpinnerDots.a9a067c5.js";const T=$({name:"DialogNewAdministrator",setup(){z();const e=p(!1),a=p({}),r=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,m=p({username:[i=>!!i||"* Requerido",i=>i.length<30||"Porfavor usa un maximo de 30 caracteres",i=>!/[!@#$%^&*()_+={}|:\;',.<>?~`]/gi.test(i)||"No se permiten caracteres especiales"],email:[i=>!!i||"* Requerido",i=>i.length<30||"Porfavor usa un maximo de 30 caracteres",i=>r.test(i)||"Ingresa un correo electr\xF3nico v\xE1lido"],password:[i=>!!i||"* Requerido",i=>i.length<30||"Porfavor usa un maximo de 30 caracteres"]});return{dialogState:e,inputInfo:a,inputRulesDictionary:m}},methods:{openDialog(){this.dialogState=!0},closeDialog(){this.dialogState=!1,this.inputInfo={}},addAdministrator(){this.inputInfo.created_at=new Date,_.post("./administrators/create",this.inputInfo).then(e=>{e.data?(this.$q.notify({type:"positive",message:"Creado correctamente.",timeout:2e3}),this.dialogState=!1,this.$emit("administratorAdded")):this.$q.notify({type:"negative",message:"Ha ocurrido un error.",timeout:2e3})}).catch(e=>{console.log(e),this.$q.notify({type:"negative",message:"Ha ocurrido un error.",timeout:2e3})}),this.inputInfo={}},validateForm(){const e=[];if(Object.keys(this.inputInfo).length>0&&Object.keys(this.inputInfo).length==Object.keys(this.inputRulesDictionary).length)Object.keys(this.inputInfo).map(a=>{const r=this.inputInfo[a];if(r){const m=this.inputRulesDictionary[a];for(const i of m)i(r)!==!0?e.push(!1):e.push(!0)}else return e.push(!1)});else return!1;return!e.includes(!1)}}}),E=v("div",{class:"text-h5 text-weight-medium"},"Nuevo Administrador",-1),U={class:"q-mb-lg"},j={class:"q-mb-lg q-pt-md"};function G(e,a,r,m,i,u){const d=f("q-title");return b(),k(O,{modelValue:e.dialogState,"onUpdate:modelValue":a[3]||(a[3]=n=>e.dialogState=n),persistent:"",transparent:""},{default:s(()=>[t(R,{class:"q-pa-md",style:{width:"700px","max-width":"80vw","max-height":"80vh"}},{default:s(()=>[t(C,{align:"right",class:"q-py-none"},{default:s(()=>[t(h,{icon:"close",color:"black",flat:"",round:"",onClick:e.closeDialog,class:"q-py-none"},null,8,["onClick"])]),_:1}),t(y,{class:"q-pt-none q-pb-sm",style:{"border-bottom":"1px solid #e9e9e9"}},{default:s(()=>[E]),_:1}),t(y,null,{default:s(()=>[v("div",U,[t(d,{class:"text-subtitle2 text-weight-regular"},{default:s(()=>[F("Completa los siguientes campos para crear un nuevo administrador.")]),_:1}),v("div",j,[t(D,{clearable:"",dense:"",modelValue:e.inputInfo.username,"onUpdate:modelValue":a[0]||(a[0]=n=>e.inputInfo.username=n),label:"Nombre",class:"q-mb-md",hint:"requerido",rules:e.inputRulesDictionary.username},null,8,["modelValue","rules"]),t(D,{clearable:"",dense:"",modelValue:e.inputInfo.email,"onUpdate:modelValue":a[1]||(a[1]=n=>e.inputInfo.email=n),label:"Correo electronico",type:"email",class:"q-mb-md",hint:"requerido",rules:e.inputRulesDictionary.email},null,8,["modelValue","rules"]),t(D,{clearable:"",dense:"",modelValue:e.inputInfo.password,"onUpdate:modelValue":a[2]||(a[2]=n=>e.inputInfo.password=n),label:"Contrase\xF1a",type:"password",class:"q-mb-md",hint:"requerido",rules:e.inputRulesDictionary.password},null,8,["modelValue","rules"])])])]),_:1}),t(C,{align:"right"},{default:s(()=>[t(h,{label:"Agregar",size:"0.85rem",color:"primary",dense:"",padding:"sm lg",outline:"",style:{"border-radius":"10px","text-transform":"capitalize"},onClick:e.addAdministrator,disable:!e.validateForm()},null,8,["onClick","disable"]),t(h,{label:"Cancelar",size:"0.85rem",flat:"",dense:"",padding:"sm lg",outline:"",style:{"border-radius":"10px","text-transform":"capitalize"},onClick:e.closeDialog},null,8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}var H=N(T,[["render",G]]);const Y=$({name:"AdminsPage",components:{PageTitle:Q,PrimaryButton:I,FilterBar:S,DetailsTable:M,DialogNewAdministrator:H},setup(){const e=p(a());function a(){const o=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),l=window.innerWidth<768;return o||l}window.addEventListener("resize",()=>{e.value=a()});const r=p(!1),m=[{name:"index",label:"#",field:"index"},{name:"username",label:"Nombre",field:"username",align:"left"},{name:"email",label:"Correo electronico",field:"email",align:"left"},{name:"created_at",label:"Fecha de creaci\xF3n",field:"created_at",format:o=>c(o),sortable:!0,sort:(o,l)=>new Date(l)-new Date(o),align:"left"},{name:"updated_at",label:"Ultima fecha de modificaci\xF3n",field:"updated_at",format:o=>o==null?"Sin modificar":c(o),sortable:!0,sort:(o,l)=>new Date(l)-new Date(o),align:"left"},{name:"actions",label:"",align:"left"}],i=p([]),u=B(),d=p(!1);n();function n(){d.value=!0;try{_.get("./administrators").then(o=>{const l=o.data;l.length>0?g(l):l.length==0&&(u.clearDataApi(),d.value=!1)}).catch(o=>{console.log(o)})}catch(o){console.log(o)}}function g(o=null){o!==null&&u.setDataApi(o),i.value=u.getDataApi,d.value=!1}function c(o){return P.formatDate(o,"DD/MMMM/YYYY - HH:mm",{months:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]})}return{isMobile:e,administratorColumns:m,administratorRows:i,loadingState:d,stateDialogNewAdministrator:r,dataApiStore:u,getAllAdministrators:n,formatDate:c,setAdministrators:g}},methods:{activateDialogNewAdministrator(){this.$refs.dialogNewAdministratorRef.openDialog()}}}),x={key:0},J={key:1};function L(e,a,r,m,i,u){const d=f("PageTitle"),n=f("PrimaryButton"),g=f("DialogNewAdministrator"),c=f("q-section"),o=f("FilterBar"),l=f("DetailsTable");return b(),k(V,null,{default:s(()=>[t(c,{class:"flex justify-between q-pa-md"},{default:s(()=>[t(d,{label:"Administradores"}),e.isMobile?(b(),q("div",x,[t(w,{flat:""},{default:s(()=>[t(n,{flat:"",icon:"add",class:"q-mx-sm",onClick:e.activateDialogNewAdministrator},null,8,["onClick"]),t(g,{ref:"dialogNewAdministratorRef",onAdministratorAdded:a[0]||(a[0]=A=>e.getAllAdministrators())},null,512),t(n,{flat:"",icon:"more_vert",class:"q-mx-sm"})]),_:1})])):(b(),q("div",J,[t(w,{flat:""},{default:s(()=>[t(n,{label:"Agregar Nuevo",icon:"add",class:"q-mx-sm",onClick:e.activateDialogNewAdministrator},null,8,["onClick"]),t(g,{ref:"dialogNewAdministratorRef",onAdministratorAdded:a[1]||(a[1]=A=>e.getAllAdministrators())},null,512),t(n,{flat:"",icon:"more_vert",class:"q-mx-sm"})]),_:1})]))]),_:1}),t(c,null,{default:s(()=>[t(o,{onGetAllData:e.getAllAdministrators,onRealodData:e.setAdministrators},null,8,["onGetAllData","onRealodData"])]),_:1}),t(c,null,{default:s(()=>[t(l,{section:"administrators",label:"Administradores",columns:e.administratorColumns,rows:e.administratorRows,loading:e.loadingState,onElementDeleted:a[2]||(a[2]=A=>e.getAllAdministrators())},null,8,["columns","rows","loading"])]),_:1})]),_:1})}var ce=N(Y,[["render",L]]);export{ce as default};
