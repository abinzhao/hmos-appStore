import{R as v,e as F,I as z,_ as J,k as X,af as S,l as Y,H as ee,ao as ae,m as a,n as se,Q as N,ai as _,aj as w,ap as re,aq as U,ar as q,aa as D,as as le,a3 as te,q as m,t as C,L as O,N as I,at as oe}from"./index-FD1T5Q2O.js";function L(i,c){var t=Object.keys(i);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(i);c&&(n=n.filter(function(f){return Object.getOwnPropertyDescriptor(i,f).enumerable})),t.push.apply(t,n)}return t}function M(i){for(var c=1;c<arguments.length;c++){var t=arguments[c]!=null?arguments[c]:{};c%2?L(Object(t),!0).forEach(function(n){X(i,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(t)):L(Object(t)).forEach(function(n){Object.defineProperty(i,n,Object.getOwnPropertyDescriptor(t,n))})}return i}function ne(i,c){var t=F.useContext(z),n=t.prefixCls,f=n===void 0?"arco":n,p=i.spin,y=i.className,g=M(M({"aria-hidden":!0,focusable:!1,ref:c},i),{},{className:"".concat(y?y+" ":"").concat(f,"-icon ").concat(f,"-icon-face-frown-fill")});return p&&(g.className="".concat(g.className," ").concat(f,"-icon-loading")),delete g.spin,delete g.isIcon,v.createElement("svg",J({fill:"none",stroke:"currentColor",strokeWidth:"4",viewBox:"0 0 48 48"},g),v.createElement("path",{fill:"currentColor",fillRule:"evenodd",stroke:"none",d:"M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm7.322-26.873a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25Zm-14.646 0a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25ZM31.68 32.88a1.91 1.91 0 0 1-2.694-.176 6.66 6.66 0 0 0-5.026-2.28c-1.918 0-3.701.81-4.962 2.207a1.91 1.91 0 0 1-2.834-2.559 10.476 10.476 0 0 1 7.796-3.465c3.063 0 5.916 1.321 7.896 3.58a1.909 1.909 0 0 1-.176 2.693Z",clipRule:"evenodd"}))}var T=v.forwardRef(ne);T.defaultProps={isIcon:!0};T.displayName="IconFaceFrownFill";const u=S.Item;function ce(){var R,E;const[i,c]=F.useState("其他"),[t,n]=v.useState(),f=`arco-upload-list-item${t&&t.status==="error"?" is-error":""}`,[p,y]=v.useState(),g=`arco-upload-list-item${p&&p.status==="error"?" is-error":""}`,[x,b]=v.useState();x&&x.status;const{t:K}=Y(),V=ee(),[d]=S.useForm(),o=ae(window.location.href),[P,$]=F.useState("0"),W=async()=>{if(o!=null&&o.id)try{const e=await C.getAppDetail({id:o==null?void 0:o.id}),l=e.data.app_category;d.setFieldsValue({...e.data,app_category:l}),c(l),$(e.data.publish_type),n({uid:"-1",name:e.data.app_icon.split("/").pop(),url:`${m}/${e.data.app_icon}`,status:"done"}),y({uid:"-2",name:e.data.app_screenshot.split("/").pop(),url:`${m}/${e.data.app_screenshot}`,status:"done"}),b({uid:"-3",name:e.data.app_file_url.split("/").pop(),url:`${m}/${e.data.app_file_url}`,status:"done"})}catch(e){I.error((e==null?void 0:e.message)||K("APIerror"))}},Z=async()=>{try{const e=d.getFieldsValue(),l={...e,app_category:e.app_category,publish_type:P,app_icon:t==null?void 0:t.originUrlInfo,app_screenshot:p==null?void 0:p.originUrlInfo,app_file_url:x==null?void 0:x.originUrlInfo};if(!(o!=null&&o.id)){const r=await C.setApp(l);console.log("🚀 ~ onSubmit ~ res:",r),I.success("创建成功"),V("/appMarket");return}l.id=o==null?void 0:o.id;const s=await C.updateApp(l);console.log("🚀 ~ onSubmit ~ res:",s),I.success("更新成功")}catch(e){console.log(e)}},B=async(e,l)=>{try{const s=new FormData;return s.append("packageName",d.getFieldValue("app_package_name")),s.append("type",l),s.append("file",e),(await oe.post("/api/upload",s,{headers:{"Content-Type":"multipart/form-data"}})).link}catch(s){throw console.error("File upload failed:",s),s}},k=async(e,l,s)=>{try{if(!e||e.length===0){d.setFieldValue(s==="icon"?"appIcon":s==="screenshot"?"appScreenshot":"file","");return}const r=await Promise.all(e.map(async h=>h.status==="done"?h:h.status==="uploading"?await B(h.originFile,s):null)),j=r.filter(h=>h);d.setFieldValue(s==="icon"?"appIcon":s==="screenshot"?"appScreenshot":"appFileUrl",s==="screenshot"?j[0]:r[0]||""),s==="screenshot"?y({...l,url:`${m}/${r[0]}`,originUrlInfo:r[0]}):s==="icon"?n({...l,url:`${m}/${r[0]}`,originUrlInfo:r[0]}):s==="file"&&b({...l,url:`${m}/${r[0]}`,originUrlInfo:r[0]})}catch(r){console.error(r)}},G=(e,l=1,s=!1)=>({name:"file",accept:e==="file"?".apk,.hap":"image/*",multiple:s,beforeUpload:r=>e==="file"&&!(r.type==="application/vnd.android.package-archive"||r.name.endsWith(".hap"))?(I.error("只能上传APK或HAP文件!"),!1):!0,onProgress:r=>{e==="screenshot"?y(r):e==="icon"?n(r):e==="file"&&b(r)},onChange:async(r,j)=>{await k(r,j,e)},listType:e!=="file"?"picture-card":"text",limit:l}),H=e=>{c(e),d.setFieldValue("app_category",e)},Q=e=>{$(e),d.setFieldValue("public_type",e)};return F.useEffect(()=>{W()},[]),a.jsx(se,{className:"edit-app-page",hoverable:!0,style:{width:"100%",height:"calc(100vh - 155px)",overflow:"auto",borderRadius:"12px"},children:a.jsxs(S,{form:d,style:{width:600},disabled:(o==null?void 0:o.type)==="detail",initialValues:{appCategory:(E=N[((R=N)==null?void 0:R.length)-1])==null?void 0:E.value,appVersion:"1.0.0"},autoComplete:"off",children:[a.jsx(u,{label:"包名",field:"app_package_name",rules:[{required:!0}],children:a.jsx(_,{placeholder:"请输入包名称"})}),a.jsx(u,{label:"App名称",field:"app_name",rules:[{required:!0}],children:a.jsx(_,{placeholder:"请输入App名称"})}),a.jsx(u,{label:"App介绍",field:"app_description",rules:[{required:!0}],children:a.jsx(_,{placeholder:"请输入App详情信息"})}),a.jsx(u,{label:"App分类",field:"app_category",rules:[{required:!0}],children:a.jsx(w.Group,{value:i,onChange:H,children:N.map((e,l)=>a.jsx(w,{value:e==null?void 0:e.value,children:e==null?void 0:e.label},e==null?void 0:e.value))})}),a.jsxs(u,{label:"发布类型",field:"publish_type",rules:[{required:!0}],children:[P&&"",a.jsx(w.Group,{value:P,onChange:Q,children:re.map((e,l)=>a.jsx(w,{value:e==null?void 0:e.value,children:e==null?void 0:e.label},e==null?void 0:e.value))})]}),a.jsx(u,{label:"App版本号",field:"app_version",children:a.jsx(_,{placeholder:"请输入App版本号"})}),a.jsx(u,{label:"App图标",field:"app_icon",children:a.jsx(U,{fileList:t?[t]:[],showUploadList:!1,onChange:async(e,l)=>{await k(e,l,"icon")},listType:"picture-card",children:a.jsx("div",{className:f,children:t&&t.url?a.jsxs("div",{className:"arco-upload-list-item-picture custom-upload-avatar",children:[a.jsx("img",{src:t.url}),a.jsx("div",{className:"arco-upload-list-item-picture-mask",children:a.jsx(q,{})})]}):a.jsx("div",{className:"arco-upload-trigger-picture",children:a.jsxs("div",{className:"arco-upload-trigger-picture-text",children:[a.jsx(D,{}),a.jsx("div",{style:{marginTop:10,fontWeight:600},children:"Upload"})]})})})})}),a.jsx(u,{label:"App截图",field:"app_screenshot",children:a.jsx(U,{onChange:async(e,l)=>{await k(e,l,"screenshot")},listType:"picture-card",showUploadList:!1,fileList:p?[p]:[],children:a.jsx("div",{className:g,children:p&&p.url?a.jsxs("div",{className:"arco-upload-list-item-picture custom-upload-avatar",children:[a.jsx("img",{src:p.url}),a.jsx("div",{className:"arco-upload-list-item-picture-mask",children:a.jsx(q,{})})]}):a.jsx("div",{className:"arco-upload-trigger-picture",children:a.jsxs("div",{className:"arco-upload-trigger-picture-text",children:[a.jsx(D,{}),a.jsx("div",{style:{marginTop:10,fontWeight:600},children:"Upload"})]})})})})}),a.jsx(u,{label:"应用包",field:"app_file_url",children:a.jsx(U,{...G("file"),listType:"text",multiple:!0,fileList:x?[x]:[],showUploadList:{fileIcon:a.jsx(le,{}),removeIcon:a.jsx(te,{onClick:()=>b(null)}),previewIcon:null,errorIcon:a.jsx(T,{}),fileName:e=>a.jsx("a",{onClick:()=>{var A;const l=(A=e.url)==null?void 0:A.split(m)[1],s=(l==null?void 0:l.split("/"))||[],r=s[2]||"",j=s[3]||"",h=s[4]||"";console.log("tempUrlArr",s),r&&j&&h?C.downloadFile(r,j,h,o==null?void 0:o.id):console.error("Invalid URL structure:",e.url)},children:e.name})},children:a.jsx(O,{type:"primary",children:d.getFieldValue("appPackage")?"更改APK":"点击上传APK"})})}),a.jsxs(u,{wrapperCol:{offset:5},children:[a.jsx(O,{type:"primary",htmlType:"submit",style:{marginRight:24},onClick:Z,onSubmit:d.submit,children:(o==null?void 0:o.type)==="edit"?"更新":"提交"}),a.jsx(O,{style:{marginRight:24},onClick:()=>{V("/appMarket")},children:"返回"})]})]})})}export{ce as default};
