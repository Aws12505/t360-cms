import{a as c,j as s}from"./app-DXUsmjoZ.js";import{Q as g}from"./quill.snow-BTA9ZSGD.js";const x=({value:o,onChange:f,placeholder:b="Start writing...",height:u="400px",className:m=""})=>{const a=c.useRef(null),e=c.useRef(null);return c.useEffect(()=>{if(a.current&&!e.current){e.current=new g(a.current,{theme:"snow",placeholder:b,modules:{toolbar:[[{header:[1,2,3,4,5,6,!1]}],[{font:[]}],[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"sub"},{script:"super"}],[{align:[]}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{list:"ordered"},{list:"bullet"}],["link","image","video"],["blockquote","code-block"],["clean"]],history:{delay:2e3,maxStack:500,userOnly:!0},clipboard:{matchVisual:!1},keyboard:{bindings:{bold:{key:"B",ctrlKey:!0,handler:function(r,t){this.quill.format("bold",!t.format.bold)}},italic:{key:"I",ctrlKey:!0,handler:function(r,t){this.quill.format("italic",!t.format.italic)}},underline:{key:"U",ctrlKey:!0,handler:function(r,t){this.quill.format("underline",!t.format.underline)}},save:{key:"S",ctrlKey:!0,handler:function(){return console.log("Save triggered"),!1}}}}},formats:["bold","italic","underline","strike","color","background","font","size","script","link","code","header","blockquote","code-block","list","bullet","indent","align","direction","image","video"]}),o&&e.current.clipboard.dangerouslyPasteHTML(o),e.current.on("text-change",(r,t,i)=>{if(i==="user"){const l=e.current?.root.innerHTML||"";f(l==="<p><br></p>"?"":l)}});const n=e.current.getModule("toolbar");n.addHandler("image",()=>{const r=document.createElement("input");r.setAttribute("type","file"),r.setAttribute("accept","image/*"),r.click(),r.onchange=()=>{const t=r.files?.[0];if(t){const i=new FileReader;i.onload=l=>{const d=e.current?.getSelection(!0);d&&e.current?.insertEmbed(d.index,"image",l.target?.result)},i.readAsDataURL(t)}}}),n.addHandler("video",()=>{const r=prompt("Enter video URL:");if(r){const t=e.current?.getSelection(!0);t&&e.current?.insertEmbed(t.index,"video",r)}}),n.addHandler("link",r=>{if(r){const t=prompt("Enter the URL:");t&&e.current?.format("link",t)}else e.current?.format("link",!1)})}return()=>{e.current&&(e.current.off("text-change"),e.current.off("selection-change"))}},[]),c.useEffect(()=>{if(e.current&&o!==e.current.root.innerHTML&&document.activeElement!==e.current.root){const n=e.current.getSelection();e.current.clipboard.dangerouslyPasteHTML(o),n&&e.current.setSelection(n)}},[o]),s.jsxs("div",{className:m,children:[s.jsx("div",{ref:a,style:{height:u}}),s.jsx("style",{jsx:!0,children:`
        /* Main Editor Container */
        .ql-toolbar {
          border: 1px solid #ccc;
          border-bottom: none;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        
        .ql-container {
          border: 1px solid #ccc;
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          font-family: inherit;
        }
        
        /* Editor Content Area */
        .ql-editor {
          min-height: ${u};
        }
        
        /* Toolbar Buttons */
        .ql-toolbar button {
          width: 28px;
          height: 28px;
        }
        
        /* Focus States */
        .ql-container.ql-snow {
          border-color: #ccc;
        }
        
        .ql-editor:focus {
          outline: none;
        }
      `})]})};export{x as Q};
