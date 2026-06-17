import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",bgHover:"#334155",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",sectionOpen:"#172032",statusY:"#059669",statusN:"#dc2626",btnBg:"#334155",btnText:"#e2e8f0",btnBorder:"#475569",selectBg:"#1e293b",yBg:"#064e3b",naBg:"#1e293b",badgeBg:"#064e3b",badgeBorder:"#059669",badgeText:"#a7f3d0"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",bgHover:"#f8fafc",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",sectionOpen:"#f8fafc",statusY:"#059669",statusN:"#dc2626",btnBg:"#ffffff",btnText:"#374151",btnBorder:"#d1d5db",selectBg:"#ffffff",yBg:"#f0fdf4",naBg:"#f9fafb",badgeBg:"#f0fdf4",badgeBorder:"#bbf7d0",badgeText:"#166534"};}

// ─── Select with custom option ───
function HeaderSelect({value,onChange,options,placeholder,t}){
    const [mode,setMode]=useState("select");
    const showCustom=mode==="custom"||(value&&!options.includes(value));
    const wrapStyle={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const fieldBase={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const btnStyle={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0};
    if(showCustom) return (
        <div style={wrapStyle}>
            <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...fieldBase,overflow:"hidden",textOverflow:"ellipsis"}} />
            <button onClick={()=>{setMode("select");onChange("");}} style={btnStyle}>▼</button>
        </div>
    );
    return (
        <div style={wrapStyle}>
            <select value={value} onChange={e=>onChange(e.target.value)} style={{...fieldBase,appearance:"auto",overflow:"hidden",textOverflow:"ellipsis"}}>
                <option value="">— Select —</option>
                {options.map((o,i)=><option key={i} value={o}>{o}</option>)}
            </select>
            <button onClick={()=>setMode("custom")} style={btnStyle}>✎</button>
        </div>
    );
}
const SUPPLIER_LIST=["AtkinsRéalis","Computacenter","Sword Services","Maber","Contour","Projective Consulting", "STS", "Mitie"];
const AUTHOR_LIST=["Peter Murphy","Mat Godwin","Fred Tebbenham","Marius Matei", "Jacob McCalla"];
const AREA_LIST=[];

const defaultReport={
    projectTitle:"",date:new Date().toISOString().split("T")[0],author:"",
    workPackage:"",
    suppliers:[{name:"AtkinsRéalis",engineers:""},{name:"Computacenter",engineers:""}],
    nabsAttended:"",nabsComments:"",
    generalIssues:"",generalComments:"",
    smokeIsolation:"",smokeComments:"",
    hsIssues:"",hsComments:"",
    allWorksAchieved:"",
    workEntries:[]
};
const defaultWorkEntry=()=>({id:Date.now(),area:"",supplier:"",details:""});

// ─── Yes/No Toggle ───
function YNToggle({value,onChange,t}){
    return (
        <div style={{display:"flex",gap:4}}>
            {["Yes","No"].map(opt=>(
                <button key={opt} onClick={()=>onChange(value===opt?"":opt)}
                        style={{padding:"6px 16px",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:"inherit",border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,backgroundColor:value===opt?(opt==="Yes"?t.statusY:t.statusN):t.bgInput,color:value===opt?"#fff":t.text}}>{opt}</button>
            ))}
        </div>
    );
}

// ─── Comment with presets ───
// ─── Print Document ───
function PrintReport({data,logoSrc,images}){
    const c={border:"1px solid #333",padding:"5px 8px",fontSize:"10px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    // Group images: by group label, then chunk into pages of 4
    const grouped={};images.forEach(img=>{const g=img.group||"General";if(!grouped[g])grouped[g]=[];grouped[g].push(img);});
    const photoSections=Object.entries(grouped).map(([label,imgs])=>{const pages=[];for(let i=0;i<imgs.length;i+=4)pages.push(imgs.slice(i,i+4));return{label,pages};});
    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"10px",lineHeight:1.5}}>
            {/* Logo */}
            {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}

            {/* Header table */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                <tr>
                    <td style={{...c,fontWeight:700,width:"20%"}}>Project Title:</td>
                    <td style={{...c,width:"30%"}}>{data.projectTitle}</td>
                    <td style={{...c,fontWeight:700,width:"15%"}}>Work Package</td>
                    <td style={{...c,width:"35%"}}>{data.workPackage}</td>
                </tr>
                <tr>
                    <td style={{...c,fontWeight:700}}>Report Author:</td>
                    <td style={c}>{data.author}</td>
                    <td style={{...c,fontWeight:700}}>Date:</td>
                    <td style={c}>{data.date}</td>
                </tr>
                <tr>
                    <td style={{...c,fontWeight:700}}>Number of suppliers on report</td>
                    <td colSpan={3} style={c}>{data.suppliers.filter(s=>s.engineers).length}</td>
                </tr>
                </tbody>
            </table>

            {/* Suppliers */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <thead><tr><th style={h}>Supplier</th><th style={h}>Number of engineers on site</th></tr></thead>
                <tbody>{data.suppliers.map((s,i)=>(<tr key={i}><td style={{...c,fontWeight:600}}>{s.name}</td><td style={c}>{s.engineers}</td></tr>))}</tbody>
            </table>

            {/* Y/N Sections */}
            {[
                ["DABS or NABS attended:",data.nabsAttended,data.nabsComments],
                ["General issues:",data.generalIssues,data.generalComments],
                ["Smoke Head isolation in place:",data.smokeIsolation,data.smokeComments],
                ["Any H&S issues:",data.hsIssues,data.hsComments]
            ].map(([label,yn,comments],i)=>(
                <table key={i} style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                    <tbody>
                    <tr><td colSpan={2} style={{...h,fontSize:"11px"}}>{label}</td></tr>
                    <tr>
                        <td style={{...c,width:"20%",fontWeight:600,verticalAlign:"top"}}>{"Yes"===yn?"Yes ☒  No ☐":"Yes ☐  No ☒"}</td>
                        <td style={{...c,verticalAlign:"top",whiteSpace:"pre-wrap"}}><span style={{fontWeight:600}}>Comments: </span>{comments||"—"}</td>
                    </tr>
                    </tbody>
                </table>
            ))}

            {/* Works Achieved */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <tbody>
                <tr><td colSpan={2} style={{...h,fontSize:"11px"}}>All Planned works achieved:</td></tr>
                <tr><td colSpan={2} style={c}>{"Yes"===data.allWorksAchieved?"Yes ☒  No ☐":"Yes ☐  No ☒"}</td></tr>
                </tbody>
            </table>

            {/* Work Entries as table — thead repeats on page breaks */}
            {data.workEntries.length>0&&(()=>{
                const grouped=Object.entries(data.workEntries.reduce((acc,e)=>{const k=e.supplier||"Other";if(!acc[k])acc[k]=[];acc[k].push(e);return acc;},{}));
                return (
                    <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14,border:"1px solid #333"}}>
                        <thead><tr><th style={{backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700,padding:"5px 8px",fontSize:"11px",textAlign:"left",border:"1px solid #333"}}>Works Summary</th></tr></thead>
                        <tbody>{grouped.map(([supplier,entries])=>(
                            entries.map((e,i)=>(
                                <tr key={`${supplier}-${i}`}>
                                    <td style={{borderBottom:i===entries.length-1?"2px solid #999":"1px solid #eee",padding:"6px 10px",fontSize:"10px",verticalAlign:"top",...(i===0?{borderTop:"1px solid #999"}:{})}}>
                                        {i===0&&<div style={{fontWeight:700,fontSize:"11px",marginBottom:4,paddingBottom:3,borderBottom:"1px solid #ccc"}}>{supplier}</div>}
                                        <div style={{paddingLeft:8}}><div style={{fontWeight:700,marginBottom:2}}>{e.area}</div>
                                            <div style={{whiteSpace:"pre-wrap",overflowWrap:"break-word",wordBreak:"break-word"}}>{e.details}</div></div>
                                    </td>
                                </tr>
                            ))
                        ))}</tbody>
                    </table>
                );
            })()}

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",marginTop:16}}>AtkinsRéalis - Baseline / Référence</div>

            {/* Photo Evidence Pages — grouped by association */}
            {photoSections.map((section,si)=>
                section.pages.map((page,pi)=>(
                    <div key={`${si}-${pi}`} style={{pageBreakBefore:"always",paddingTop:12}}>
                        {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                        <div style={{fontSize:"12px",fontWeight:700,color:"#1a3a5c",marginBottom:8,borderBottom:"2px solid #1a3a5c",paddingBottom:4}}>Photo Evidence — {section.label}{section.pages.length>1?` (Page ${pi+1})`:""}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:"calc(297mm - 80mm)"}}>
                            {page.map((img,i)=>(
                                <div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                                    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}>
                                        <img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} />
                                    </div>
                                    {img.caption&&<div style={{padding:"4px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// ─── Main Component ───
export default function NightshiftReport({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form");
    const [data,setData]=useState(defaultReport);
    const [images,setImages]=useState([]);
    const [showWarnings,setShowWarnings]=useState(false);
    const printRef=useRef();

    const getWarnings=()=>{
        const w=[];
        if(!data.projectTitle) w.push({type:"info",msg:"Project Title is empty."});
        if(!data.author) w.push({type:"info",msg:"Report Author is empty."});
        if(!data.workPackage) w.push({type:"info",msg:"Work Package is empty."});
        ["nabsAttended","generalIssues","smokeIsolation","hsIssues","allWorksAchieved"].forEach(k=>{
            if(!data[k]){const labels={nabsAttended:"DABS/NABS attended",generalIssues:"General Issues",smokeIsolation:"Smoke Head Isolation",hsIssues:"H&S Issues",allWorksAchieved:"All Planned Works Achieved"};w.push({type:"info",msg:`"${labels[k]}" — Yes/No not selected.`});}
        });
        data.suppliers.filter(s=>s.name&&(!s.engineers||s.engineers==="0"||Number(s.engineers)===0)).forEach(s=>w.push({type:"warn",msg:`Supplier "${s.name}" has 0 or no engineers on site.`}));
        const supplierNames=data.suppliers.filter(s=>s.name).map(s=>s.name);
        const entrySuppliers=[...new Set(data.workEntries.map(e=>e.supplier).filter(Boolean))];
        supplierNames.filter(s=>!entrySuppliers.includes(s)).forEach(s=>w.push({type:"warn",msg:`Supplier "${s}" is listed but has no work entries.`}));
        entrySuppliers.filter(s=>!supplierNames.includes(s)).forEach(s=>w.push({type:"warn",msg:`Work entry references "${s}" which is not in the suppliers list.`}));
        data.suppliers.filter(s=>s.name&&(!s.engineers||Number(s.engineers)===0)&&entrySuppliers.includes(s.name)).forEach(s=>w.push({type:"warn",msg:`Supplier "${s.name}" has 0 engineers but has work entries assigned.`}));
        data.workEntries.forEach((e,i)=>{if(!e.supplier)w.push({type:"info",msg:`Work entry #${i+1} has no supplier.`});if(!e.area)w.push({type:"info",msg:`Work entry #${i+1} has no work area.`});if(!e.details)w.push({type:"info",msg:`Work entry #${i+1} has no details.`});});
        const validGroups=data.workEntries.map(e=>`${e.supplier} — ${e.area}`);
        images.filter(img=>img.group&&!validGroups.includes(img.group)).forEach(img=>w.push({type:"warn",msg:`Photo "${img.caption||img.fileName}" is linked to "${img.group}" which doesn't match any work entry.`}));
        if(images.length===0) w.push({type:"info",msg:"No photos uploaded."});
        if(data.workEntries.length===0) w.push({type:"info",msg:"No work entries added."});
        return w;
    };
    const tryPreview=()=>{setShowWarnings(true);};


    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const updSupplier=(idx,k,v)=>setData(p=>{const s=[...p.suppliers];s[idx]={...s[idx],[k]:v};return{...p,suppliers:s};});
    const addSupplier=()=>setData(p=>({...p,suppliers:[...p.suppliers,{name:"",engineers:""}]}));
    const removeSupplier=idx=>setData(p=>({...p,suppliers:p.suppliers.filter((_,i)=>i!==idx)}));
    const addWork=()=>setData(p=>({...p,workEntries:[...p.workEntries,defaultWorkEntry()]}));
    const removeWork=id=>setData(p=>({...p,workEntries:p.workEntries.filter(w=>w.id!==id)}));
    const updWork=(id,k,v)=>setData(p=>({...p,workEntries:p.workEntries.map(w=>w.id===id?{...w,[k]:v}:w)}));
    const handleImageUpload=e=>{Array.from(e.target.files).forEach(file=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{const MAX=1200;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}}const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,0,0,w,h);const compressed=canvas.toDataURL("image/jpeg",0.7);URL.revokeObjectURL(url);setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:compressed,caption:"",fileName:file.name,group:""}]);};img.onerror=()=>{URL.revokeObjectURL(url);const reader=new FileReader();reader.onload=ev=>setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:ev.target.result,caption:"",fileName:file.name,group:""}]);reader.readAsDataURL(file);};img.src=url;});e.target.value="";};
    const removeImage=id=>setImages(p=>p.filter(img=>img.id!==id));
    const updateImageCaption=(id,caption)=>setImages(p=>p.map(img=>img.id===id?{...img,caption}:img));
    const updateImageGroup=(id,group)=>setImages(p=>p.map(img=>img.id===id?{...img,group}:img));
    const moveImage=(idx,dir)=>setImages(p=>{const a=[...p];const n=idx+dir;if(n<0||n>=a.length)return a;[a[idx],a[n]]=[a[n],a[idx]];return a;});

    const handlePrint=()=>{const title=`${data.projectTitle||"Nightshift Report"} - ${data.date}`;const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>@page{size:A4;margin:0}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}*{overflow-wrap:break-word;word-break:break-word}thead{display:table-header-group}tfoot{display:table-footer-group}.page-wrap{width:100%}.page-wrap>thead td{height:10mm}.page-wrap>tfoot td{height:10mm}.page-content{padding:0 10mm}</style></head><body><table class="page-wrap"><thead><tr><td></td></tr></thead><tfoot><tr><td style="padding:0 10mm"><div style="border-top:1px solid #b0b8c4"></div></td></tr></tfoot><tbody><tr><td class="page-content">${printRef.current.innerHTML}</td></tr></tbody></table></body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify({...data,images},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`NightReport_${(data.projectTitle||"").replace(/\s+/g,"_")}_${data.date||"draft"}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoad=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.images){setImages(d.images);delete d.images;}setData(d);}catch{alert("Invalid JSON file");}};reader.readAsText(file);};input.click();};

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const lbl={fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"};

    // ─── Preview ───
    if(view==="preview") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
                <span style={{color:"#94a3b8",fontSize:12}}>Report Preview{images.length>0?` — ${Math.ceil(images.length/4)} photo page(s)`:""}</span>
            </div>
            <div ref={printRef} style={{margin:"20px auto",maxWidth:900,backgroundColor:"#fff",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderRadius:4,overflow:"hidden"}}>
                <PrintReport data={data} logoSrc={logoSrc} images={images} />
            </div>
        </div>
    );

    // ─── Form ───
    return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg,fontFamily:"'Inter','Segoe UI',-apple-system,sans-serif",color:t.text}}>
            <div style={{background:t.topBar,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {onBack&&<button onClick={onBack} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>← Menu</button>}
                    <div>
                        <div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>Nightshift Report</div>
                        <div style={{fontSize:10,color:"#64748b",marginTop:2}}>T2 Security — AtkinsRéalis</div>
                    </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <button onClick={handleLoad} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={tryPreview} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Report Details */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Report Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div style={{minWidth:0}}>
                            <label style={lbl}>Project Title</label>
                            <HeaderSelect value={data.projectTitle} onChange={v=>upd("projectTitle",v)} options={["T4 Security Project", "T2A Security Phase 6 Works", "T5 Security Project", "T3 Security Project"]} placeholder="Project title" t={t} />
                        </div>
                        <div>
                            <label style={lbl}>Report Author</label>
                            <HeaderSelect value={data.author} onChange={v=>upd("author",v)} options={AUTHOR_LIST} placeholder="Author name" t={t} />
                        </div>
                        <div><label style={lbl}>Date</label><input type="date" value={data.date} onChange={e=>upd("date",e.target.value)} style={inp} /></div>
                        <div><label style={lbl}>Work Package</label><input type="text" value={data.workPackage} onChange={e=>upd("workPackage",e.target.value)} style={inp} placeholder="e.g. T2, T5, Fibre" /></div>
                    </div>
                </div>

                {/* Suppliers */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Suppliers on Site</div>
                        <button onClick={addSupplier} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add Supplier</button>
                    </div>
                    {data.suppliers.map((s,idx)=>(
                        <div key={idx} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-end"}}>
                            <div style={{flex:2,minWidth:0}}>
                                {idx===0&&<label style={lbl}>Supplier</label>}
                                <HeaderSelect value={s.name} onChange={v=>updSupplier(idx,"name",v)} options={SUPPLIER_LIST} placeholder="Supplier name" t={t} />
                            </div>
                            <div style={{flex:1}}>
                                {idx===0&&<label style={lbl}>Engineers</label>}
                                <input type="number" min="0" value={s.engineers} onChange={e=>updSupplier(idx,"engineers",e.target.value)} style={inp} placeholder="0" />
                            </div>
                            {data.suppliers.length>1&&<button onClick={()=>removeSupplier(idx)} style={{padding:"8px 10px",borderRadius:6,border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:14}}>✕</button>}
                        </div>
                    ))}
                </div>

                {/* Yes/No Sections */}
                {[
                    {key:"nabsAttended",ckey:"nabsComments",label:"DABS or NABS attended"},
                    {key:"generalIssues",ckey:"generalComments",label:"General Issues"},
                    {key:"smokeIsolation",ckey:"smokeComments",label:"Smoke Head Isolation in Place"},
                    {key:"hsIssues",ckey:"hsComments",label:"Any H&S Issues"}
                ].map(({key,ckey,label})=>(
                    <div key={key} style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                            <div style={{fontSize:14,fontWeight:700}}>{label}</div>
                            <YNToggle value={data[key]} onChange={v=>upd(key,v)} t={t} />
                        </div>
                        <textarea value={data[ckey]||""} onChange={e=>upd(ckey,e.target.value)} placeholder="Add comments..." rows={2} style={{...inp,resize:"vertical",minHeight:40}} />
                    </div>
                ))}

                {/* All Works Achieved */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>All Planned Works Achieved</div>
                        <YNToggle value={data.allWorksAchieved} onChange={v=>upd("allWorksAchieved",v)} t={t} />
                    </div>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                        <div style={{fontSize:13,fontWeight:600,color:t.textMuted}}>Work Details by Area</div>
                        <button onClick={addWork} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add Entry</button>
                    </div>

                    {data.workEntries.length===0&&<div style={{textAlign:"center",padding:20,color:t.textDim,fontSize:13}}>No work entries yet. Add entries to describe tonight's works.</div>}

                    {data.workEntries.map((entry,idx)=>(
                        <div key={entry.id} style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:8,backgroundColor:t.bgCardAlt}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                                <span style={{fontSize:12,fontWeight:700,color:t.textMuted}}>Entry #{idx+1}</span>
                                <button onClick={()=>removeWork(entry.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕ Remove</button>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:8,marginBottom:8}}>
                                <div style={{minWidth:0}}>
                                    <label style={{...lbl,fontSize:10}}>Work Area</label>
                                    <HeaderSelect value={entry.area} onChange={v=>updWork(entry.id,"area",v)} options={AREA_LIST} placeholder="Work area" t={t} />
                                </div>
                                <div style={{minWidth:0}}>
                                    <label style={{...lbl,fontSize:10}}>Supplier</label>
                                    <HeaderSelect value={entry.supplier} onChange={v=>updWork(entry.id,"supplier",v)} options={SUPPLIER_LIST} placeholder="Supplier" t={t} />
                                </div>
                            </div>
                            <label style={{...lbl,fontSize:10}}>Work Details</label>
                            <textarea value={entry.details} onChange={e=>updWork(entry.id,"details",e.target.value)} placeholder="Describe works carried out..." rows={3} style={{...inp,resize:"vertical",minHeight:60}} />
                        </div>
                    ))}
                </div>

                {/* Photo Evidence */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Photo Evidence</div>
                        <label style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
                            + Upload Photos<input type="file" accept="image/*,.heic,.heif" multiple onChange={handleImageUpload} style={{display:"none"}} />
                        </label>
                    </div>
                    {images.length===0&&<div style={{textAlign:"center",padding:20,color:t.textDim,fontSize:13}}>No photos uploaded. Images appear 4 per page in the report.</div>}
                    {images.length>0&&<div style={{fontSize:11,color:t.textMuted,marginBottom:10}}>{images.length} photo(s) — {Math.ceil(images.length/4)} page(s) in report</div>}
                    <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
                        {images.map((img,idx)=>(
                            <div key={img.id} style={{border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden",backgroundColor:t.bgCardAlt}}>
                                <div style={{position:"relative",aspectRatio:"4/3",backgroundColor:t.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                                    <img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} />
                                    <div style={{position:"absolute",top:3,right:3,display:"flex",gap:2}}>
                                        {idx>0&&<button onClick={()=>moveImage(idx,-1)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",fontSize:9}}>←</button>}
                                        {idx<images.length-1&&<button onClick={()=>moveImage(idx,1)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",fontSize:9}}>→</button>}
                                        <button onClick={()=>removeImage(img.id)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(220,38,38,0.85)",color:"#fff",cursor:"pointer",fontSize:9}}>✕</button>
                                    </div>
                                    {img.group&&<div style={{position:"absolute",bottom:3,left:3,fontSize:8,backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",padding:"1px 5px",borderRadius:3}}>{img.group}</div>}
                                </div>
                                <input value={img.caption} onChange={e=>updateImageCaption(img.id,e.target.value)} placeholder="Caption..." style={{width:"100%",padding:"5px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:10,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.text}} />
                                <select value={img.group||""} onChange={e=>updateImageGroup(img.id,e.target.value)} style={{width:"100%",padding:"4px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:9,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.textMuted,appearance:"auto"}}>
                                    <option value="">General</option>
                                    {data.workEntries.map(we=><option key={we.id} value={`${we.supplier} — ${we.area}`}>{we.supplier?we.supplier:"?"}{we.area?` — ${we.area}`:""}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Validation Modal */}
                {showWarnings&&(()=>{
                    const w=getWarnings();const warns=w.filter(x=>x.type==="warn");const infos=w.filter(x=>x.type==="info");const hasIssues=w.length>0;
                    return (
                        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                            <div onClick={()=>setShowWarnings(false)} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.6)"}} />
                            <div style={{position:"relative",maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",backgroundColor:t.bgCard,borderRadius:16,border:`2px solid ${hasIssues?(warns.length>0?"#dc2626":"#fbbf24"):"#10b981"}`,boxShadow:`0 20px 60px rgba(0,0,0,0.3)${hasIssues&&warns.length>0?",0 0 20px rgba(220,38,38,0.3)":""}`,padding:24}}>
                                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                                    <span style={{fontSize:20}}>{hasIssues?(warns.length>0?"⚠️":"ℹ️"):"✅"}</span>
                                    <div>
                                        <div style={{fontSize:15,fontWeight:700,color:t.text}}>{hasIssues?"Review before generating":"No issues found"}</div>
                                        <div style={{fontSize:12,color:t.textMuted}}>{hasIssues?`${w.length} notice${w.length!==1?"s":""} found`:"Report is ready to generate."}</div>
                                    </div>
                                </div>
                                {hasIssues&&<div style={{marginBottom:20}}>
                                    {warns.map((x,i)=><div key={`w${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#fff",backgroundColor:"#dc2626",borderRadius:6,fontWeight:600}}>⚠ {x.msg}</div>)}
                                    {infos.map((x,i)=><div key={`i${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#1e293b",backgroundColor:"#fbbf24",borderRadius:6}}>• {x.msg}</div>)}
                                </div>}
                                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                                    <button onClick={()=>setShowWarnings(false)} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.text,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Go Back</button>
                                    <button onClick={()=>{setShowWarnings(false);setView("preview");}} style={{padding:"10px 20px",borderRadius:8,border:"none",backgroundColor:hasIssues?(warns.length>0?"#dc2626":"#f59e0b"):"#10b981",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{hasIssues?"Continue Anyway":"Continue"}</button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Bottom */}
                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px"}}>
                    <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft (JSON)</button>
                    <button onClick={tryPreview} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Preview & Print</button>
                </div>
            </div>
        </div>
    );
}