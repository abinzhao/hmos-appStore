import{af as r,e as l,m as e,n as T,L as h,aa as N,N as m,G as u,ai as x,au as K,ar as D,av as L}from"./index-FD1T5Q2O.js";import{s as p}from"./system-message-Did0skei.js";import{S as F,P as O}from"./index-DV0-gRm5.js";import{T as q}from"./index-BZ7AmgX9.js";import{T as G}from"./index-Bw-ri7r9.js";import{E as A}from"./modal-8NwfAtd_.js";import"./Combination-C62u9g4Y.js";import"./b-tween.es-BtQQsX34.js";const b=r.Item;function ee(){const[o]=r.useForm(),[w,f]=l.useState(!1),[I,M]=l.useState([]),[k,v]=l.useState([]),[V,i]=l.useState(!1),[a,j]=l.useState(null),[_,B]=l.useState(""),[g,J]=l.useState("all"),[c,y]=l.useState({current:1,pageSize:10,total:0});l.useState({keyword:"",role:"all"});const[S]=r.useForm(),d=async(s={})=>{try{f(!0);const{current:t,pageSize:n}=c,C=await p.getSystemMessages({page:t||1,pageSize:n,keyword:S.getFieldsValue(),role:g==="all"?void 0:g,...s});M(C.data.sysMessage||[]),y({...C.data.pagination})}catch(t){console.log(t)}finally{f(!1)}};l.useEffect(()=>{d()},[_,g]);const z=(s,t)=>{y({...c,current:s,pageSize:t}),d({page:s,pageSize:t})},R=async s=>{try{await p.deleteSystemMessage(s),m.success("删除成功"),d()}catch(t){console.log(t)}},E=async s=>{try{a?(await p.updateSystemMessage({id:a.id,...s}),m.success("更新成功")):(await p.createSystemMessage(s),m.success("创建成功")),i(!1),o.resetFields(),d()}catch{m.error(a?"更新失败":"创建失败")}},P=[{title:"序号",render:(s,t,n)=>n+1},{title:"id",dataIndex:"id"},{title:"消息发布者",dataIndex:"user_id"},{title:"发布者名称",dataIndex:"username"},{title:"消息发布昵称",dataIndex:"nickname"},{title:"消息",dataIndex:"message_text"},{title:"发布时间",dataIndex:"created_at",render:s=>K(s)},{title:"操作",render:(s,t)=>e.jsxs(F,{children:[e.jsx(h,{type:"text",size:"small",icon:e.jsx(D,{}),onClick:()=>{j(t),o.setFieldsValue(t),i(!0)},children:"编辑"}),e.jsx(O,{title:"确定要删除该公告吗？",onOk:()=>R(t.id),children:e.jsx(h,{type:"text",status:"danger",size:"small",icon:e.jsx(L,{}),children:"删除"})})]})}];return e.jsxs("div",{className:"sys-message-manage",children:[e.jsxs(T,{title:"系统公告管理",extra:e.jsxs(F,{children:[e.jsx(h,{type:"primary",icon:e.jsx(N,{}),onClick:()=>{j(null),o.resetFields(),i(!0)},children:"新增公告"}),e.jsx(h,{type:"primary",onClick:()=>d(),children:"刷新列表"})]}),children:[e.jsx("div",{className:"search-bar",children:e.jsxs(r.Provider,{onFormValuesChange:(s,t,n)=>{},onFormSubmit:(s,t,n)=>{s==="modalForm"&&(n.forms.searchForm.setFieldsValue({email:t.email}),i(!1)),m.info({icon:e.jsx("span",{}),content:e.jsxs("div",{style:{textAlign:"left"},children:[e.jsx("span",{children:"form values:"}),e.jsx("pre",{children:JSON.stringify({...n.forms.searchForm.getFieldsValue(),...n.forms.refreshForm.getFieldsValue()},null,2)})]})})},children:[e.jsx(r,{id:"searchForm",layout:"vertical",form:S,children:e.jsxs(u.Row,{gutter:24,children:[e.jsx(u.Col,{span:8,children:e.jsx(r.Item,{label:"名称",field:"username",children:e.jsx(x,{placeholder:"请输入名称"})})}),e.jsx(u.Col,{span:8,children:e.jsx(r.Item,{label:"昵称",field:"nickname",children:e.jsx(x,{placeholder:"请输入昵称"})})}),e.jsx(u.Col,{span:8,children:e.jsx(r.Item,{label:"消息",field:"message_text",children:e.jsx(x,{placeholder:"请输入消息"})})})]})}),e.jsx(u.Row,{justify:"space-between",align:"center",children:e.jsx(q.Text,{style:{fontSize:18},bold:!0,children:"Result"})})]})}),e.jsx(G,{className:"scrollable-table",rowKey:"id",loading:w,columns:P,data:I,rowSelection:{selectedRowKeys:k,onChange:s=>v(s)},pagination:{sizeCanChange:!0,current:c.current,pageSize:c.pageSize,total:c.total,showTotal:!0,pageSizeChangeResetCurrent:!0,onChange:z}})]}),e.jsx(A,{title:a?"编辑公告":"新增公告",visible:V,onOk:()=>o.submit(),onCancel:()=>{i(!1),o.resetFields()},autoFocus:!1,focusLock:!0,children:e.jsxs(r,{form:o,onSubmit:E,labelCol:{span:6},wrapperCol:{span:16},children:[a&&e.jsxs(b,{label:"id",field:"id",initialValue:a==null?void 0:a.id,children:["  ",e.jsx(x,{disabled:!0,value:a==null?void 0:a.id})]}),e.jsx(b,{label:"系统消息",field:"message_text",rules:[{required:!0,message:"请输入消息"}],children:e.jsx(x,{placeholder:"请输入消息"})})]})})]})}export{ee as default};
