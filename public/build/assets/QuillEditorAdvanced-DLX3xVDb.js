import{r as a,j as d}from"./app-xDN1b4JA.js";import{Q as x}from"./quill.snow-CHb-U5GE.js";const E=({value:l,onChange:m,placeholder:p="Start writing...",height:u="400px",className:b=""})=>{const c=a.useRef(null),e=a.useRef(null);a.useEffect(()=>{if(c.current&&!e.current){e.current=new x(c.current,{theme:"snow",placeholder:p,modules:{toolbar:[[{header:[1,2,3,4,5,6,!1]}],[{font:[]}],[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"sub"},{script:"super"}],[{align:[]}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{list:"ordered"},{list:"bullet"}],["link","image","video"],["blockquote","code-block"],["clean"]],history:{delay:2e3,maxStack:500,userOnly:!0},clipboard:{matchVisual:!1},keyboard:{bindings:{bold:{key:"B",ctrlKey:!0,handler:function(n,t){this.quill.format("bold",!t.format.bold)}},italic:{key:"I",ctrlKey:!0,handler:function(n,t){this.quill.format("italic",!t.format.italic)}},underline:{key:"U",ctrlKey:!0,handler:function(n,t){this.quill.format("underline",!t.format.underline)}},save:{key:"S",ctrlKey:!0,handler:function(){return console.log("Save triggered"),!1}}}}},formats:["bold","italic","underline","strike","color","background","font","size","script","link","code","header","blockquote","code-block","list","bullet","indent","align","direction","image","video"]}),l&&e.current.clipboard.dangerouslyPasteHTML(l),e.current.on("text-change",(n,t,r)=>{if(r==="user"){const i=e.current?.root.innerHTML||"";m(i==="<p><br></p>"?"":i)}});const o=e.current.getModule("toolbar");o.addHandler("image",()=>{const n=prompt(`Choose an option:
1. Type "upload" to upload an image file
2. Type "url" to insert an image URL
3. Or paste/type the image URL directly`);if(!n)return;const t=n.toLowerCase().trim();if(t==="upload"){const r=document.createElement("input");r.setAttribute("type","file"),r.setAttribute("accept","image/*"),r.click(),r.onchange=()=>{const i=r.files?.[0];if(i){const s=new FileReader;s.onload=h=>{const g=e.current?.getSelection(!0);g&&e.current?.insertEmbed(g.index,"image",h.target?.result)},s.readAsDataURL(i)}}}else if(t==="url"){const r=prompt("Enter the image URL:");if(r&&f(r)){const i=e.current?.getSelection(!0);i&&e.current?.insertEmbed(i.index,"image",r)}else r&&alert("Please enter a valid image URL (must end with .jpg, .jpeg, .png, .gif, .webp, or .svg)")}else if(f(t)){const r=e.current?.getSelection(!0);r&&e.current?.insertEmbed(r.index,"image",t)}else alert('Please enter a valid image URL or use "upload" for file upload')}),o.addHandler("video",()=>{const n=prompt("Enter video URL:");if(n){const t=e.current?.getSelection(!0);t&&e.current?.insertEmbed(t.index,"video",n)}}),o.addHandler("link",n=>{if(n){const t=prompt("Enter the URL:");t&&e.current?.format("link",t)}else e.current?.format("link",!1)})}return()=>{e.current&&(e.current.off("text-change"),e.current.off("selection-change"))}},[]),a.useEffect(()=>{if(e.current&&l!==e.current.root.innerHTML&&document.activeElement!==e.current.root){const o=e.current.getSelection();e.current.clipboard.dangerouslyPasteHTML(l),o&&e.current.setSelection(o)}},[l]);const f=o=>{try{const n=new URL(o),t=n.pathname.toLowerCase();return/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(t)||o.includes("data:image/")||o.includes("blob:")||/\.(githubusercontent|imgur|cloudinary|unsplash|pexels)\./.test(n.hostname)}catch{return!1}};return d.jsxs("div",{className:b,children:[d.jsx("div",{ref:c,style:{height:u}}),d.jsx("style",{jsx:!0,children:`
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

        /* Image styling within editor */
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }
      `})]})};export{E as Q};
