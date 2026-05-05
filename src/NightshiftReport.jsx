import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",bgHover:"#334155",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",sectionOpen:"#172032",statusY:"#059669",statusN:"#dc2626",btnBg:"#334155",btnText:"#e2e8f0",btnBorder:"#475569",selectBg:"#1e293b",yBg:"#064e3b",naBg:"#1e293b",badgeBg:"#064e3b",badgeBorder:"#059669",badgeText:"#a7f3d0"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",bgHover:"#f8fafc",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",sectionOpen:"#f8fafc",statusY:"#059669",statusN:"#dc2626",btnBg:"#ffffff",btnText:"#374151",btnBorder:"#d1d5db",selectBg:"#ffffff",yBg:"#f0fdf4",naBg:"#f9fafb",badgeBg:"#f0fdf4",badgeBorder:"#bbf7d0",badgeText:"#166534"};}

const WORK_PACKAGES=["T2","T3","T4","T5","Fibre","Campus"];

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
const SUPPLIER_LIST=["AtkinsRéalis","Computacenter","Sword Services","Maber","Contour","Projective Consulting"];
const AUTHOR_LIST=["Peter Murphy","Tim Finch","Gracious Chukwu","Marius Sandu"];
const AREA_LIST=["T2A CSA – Phase 6","T2A Fast Track / ATP Gates","T2A Phase 6 / Staff Exit / Back of House","T2A QAS / Back of House / SCR L2-30","T2A CSA / FCC","T2A Departures","T2A Arrivals","T2A Back of House"];

const defaultReport={
    projectTitle:"",date:new Date().toISOString().split("T")[0],author:"",
    workPackages:[],
    suppliers:[{name:"AtkinsRéalis",engineers:""},{name:"Computacenter",engineers:""}],
    nabsAttended:"",nabsComments:"",
    generalIssues:"",generalComments:"",
    smokeIsolation:"",smokeComments:"",
    hsIssues:"",hsComments:"",
    allWorksAchieved:"",
    workEntries:[],
    distribution:""
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
    const imagePages=[];for(let i=0;i<images.length;i+=4)imagePages.push(images.slice(i,i+4));
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
                        <td style={{...c,width:"35%"}}>{data.workPackages.join(", ")}</td>
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
                        <tr><td style={{...c,width:"20%",fontWeight:600}}>{"Yes"===yn?"Yes ☒  No ☐":"Yes ☐  No ☒"}</td><td style={c}></td></tr>
                        <tr><td style={{...c,fontWeight:600}}>Comments</td><td style={c}>{comments||"—"}</td></tr>
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

            {/* Work Entries */}
            {data.workEntries.length>0&&(
                <div style={{marginBottom:14}}>
                    {Object.entries(data.workEntries.reduce((acc,e)=>{const k=e.supplier||"Other";if(!acc[k])acc[k]=[];acc[k].push(e);return acc;},{})).map(([supplier,entries])=>(
                        <div key={supplier} style={{marginBottom:10}}>
                            <div style={{fontWeight:700,fontSize:"12px",marginBottom:4,borderBottom:"1px solid #333",paddingBottom:2}}>{supplier}</div>
                            {entries.map((e,i)=>(
                                <div key={i} style={{marginBottom:6,paddingLeft:12}}>
                                    <span style={{fontWeight:700}}>{e.area}</span> – {e.details}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Distribution */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <tbody>
                    <tr><td style={h}>Distribution of report</td></tr>
                    <tr><td style={{...c,whiteSpace:"pre-wrap"}}>{data.distribution||"—"}</td></tr>
                </tbody>
            </table>

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",marginTop:16}}>AtkinsRéalis - Baseline / Référence</div>

            {/* Photo Evidence Pages */}
            {imagePages.map((page,pi)=>(
                <div key={pi} style={{pageBreakBefore:"always",paddingTop:12}}>
                    {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                    <div style={{fontSize:"12px",fontWeight:700,color:"#1a3a5c",marginBottom:8,borderBottom:"2px solid #1a3a5c",paddingBottom:4}}>Photo Evidence — Page {pi+1}</div>
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
            ))}
        </div>
    );
}

// ─── Main Component ───
export default function NightshiftReport({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form");
    const [data,setData]=useState(defaultReport);
    const [images,setImages]=useState([]);
    const printRef=useRef();

    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const updSupplier=(idx,k,v)=>setData(p=>{const s=[...p.suppliers];s[idx]={...s[idx],[k]:v};return{...p,suppliers:s};});
    const addSupplier=()=>setData(p=>({...p,suppliers:[...p.suppliers,{name:"",engineers:""}]}));
    const removeSupplier=idx=>setData(p=>({...p,suppliers:p.suppliers.filter((_,i)=>i!==idx)}));
    const addWork=()=>setData(p=>({...p,workEntries:[...p.workEntries,defaultWorkEntry()]}));
    const removeWork=id=>setData(p=>({...p,workEntries:p.workEntries.filter(w=>w.id!==id)}));
    const updWork=(id,k,v)=>setData(p=>({...p,workEntries:p.workEntries.map(w=>w.id===id?{...w,[k]:v}:w)}));
    const toggleWP=wp=>setData(p=>{const wps=p.workPackages.includes(wp)?p.workPackages.filter(w=>w!==wp):[...p.workPackages,wp];return{...p,workPackages:wps};});

    const handleImageUpload=e=>{Array.from(e.target.files).forEach(file=>{const reader=new FileReader();reader.onload=ev=>setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:ev.target.result,caption:"",fileName:file.name}]);reader.readAsDataURL(file);});e.target.value="";};
    const removeImage=id=>setImages(p=>p.filter(img=>img.id!==id));
    const updateImageCaption=(id,caption)=>setImages(p=>p.map(img=>img.id===id?{...img,caption}:img));
    const moveImage=(idx,dir)=>setImages(p=>{const a=[...p];const n=idx+dir;if(n<0||n>=a.length)return a;[a[idx],a[n]]=[a[n],a[idx]];return a;});

    const handlePrint=()=>{const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>Nightshift Report - ${data.date}</title><style>@media print{body{margin:0}@page{size:A4;margin:10mm}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${printRef.current.innerHTML}</body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify({...data,images},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`NightReport_${data.date||"draft"}.json`;a.click();URL.revokeObjectURL(url);};
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
                    <button onClick={()=>setView("preview")} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Report Details */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Report Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div style={{minWidth:0}}>
                            <label style={lbl}>Project Title</label>
                            <HeaderSelect value={data.projectTitle} onChange={v=>upd("projectTitle",v)} options={["T2A Security Phase 6 Works","T2A CSA","T2 Security Retrofit Deployment"]} placeholder="Project title" t={t} />
                        </div>
                        <div>
                            <label style={lbl}>Report Author</label>
                            <HeaderSelect value={data.author} onChange={v=>upd("author",v)} options={AUTHOR_LIST} placeholder="Author name" t={t} />
                        </div>
                        <div><label style={lbl}>Date</label><input type="date" value={data.date} onChange={e=>upd("date",e.target.value)} style={inp} /></div>
                        <div>
                            <label style={lbl}>Work Package</label>
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                                {WORK_PACKAGES.map(wp=>(
                                    <button key={wp} onClick={()=>toggleWP(wp)}
                                        style={{padding:"6px 14px",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:"inherit",
                                            border:data.workPackages.includes(wp)?"2px solid transparent":`1px solid ${t.border}`,
                                            fontWeight:data.workPackages.includes(wp)?700:400,
                                            backgroundColor:data.workPackages.includes(wp)?t.accent:t.bgInput,
                                            color:data.workPackages.includes(wp)?"#fff":t.text}}>{wp}</button>
                                ))}
                            </div>
                        </div>
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
                            + Upload Photos<input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:"none"}} />
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
                                    {idx%4===0&&<div style={{position:"absolute",bottom:3,left:3,fontSize:8,backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",padding:"1px 5px",borderRadius:3}}>Pg {Math.floor(idx/4)+1}</div>}
                                </div>
                                <input value={img.caption} onChange={e=>updateImageCaption(img.id,e.target.value)} placeholder="Caption..." style={{width:"100%",padding:"5px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:10,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.text}} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Distribution</div>
                    <textarea value={data.distribution} onChange={e=>upd("distribution",e.target.value)} rows={4} style={{...inp,resize:"vertical"}} placeholder="Email addresses for report distribution..." />
                </div>

                {/* Bottom */}
                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px"}}>
                    <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft (JSON)</button>
                    <button onClick={()=>setView("preview")} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Preview & Print</button>
                </div>
            </div>
        </div>
    );
}
