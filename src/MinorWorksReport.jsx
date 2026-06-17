import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",bgHover:"#334155",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",bgHover:"#f8fafc",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"};}

function HeaderSelect({value,onChange,options,placeholder,t}){
    const [mode,setMode]=useState("select");
    const show=mode==="custom"||(value&&!options.includes(value));
    const w={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const f={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const b={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0};
    if(show) return (<div style={w}><input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...f,overflow:"hidden",textOverflow:"ellipsis"}} /><button onClick={()=>{setMode("select");onChange("");}} style={b}>▼</button></div>);
    return (<div style={w}><select value={value} onChange={e=>onChange(e.target.value)} style={{...f,appearance:"auto"}}><option value="">— Select —</option>{options.map((o,i)=><option key={i} value={o}>{o}</option>)}</select><button onClick={()=>setMode("custom")} style={b}>✎</button></div>);
}
function YNToggle({value,onChange,t}){
    return (<div style={{display:"flex",gap:4}}>{["Yes","No"].map(opt=>(<button key={opt} onClick={()=>onChange(value===opt?"":opt)} style={{padding:"4px 12px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,backgroundColor:value===opt?(opt==="Yes"?t.statusY:t.statusN):t.bgInput,color:value===opt?"#fff":t.text}}>{opt}</button>))}</div>);
}

const SUPPLIER_LIST=["Computacenter","Sword Services","Maber Construction Ltd","Contour","STS","Mitie"];
const AUTHOR_LIST=["Peter Murphy","Mat Godwin","Fred Tebbenham","Marius Matei","Jacob McCalla"];
const LOCATION_LIST=["T2A","T2B","T3","T4","T5","Campus"];
const DEFAULT_CHECKS=[
    {label:"NABS Attended?"},{label:"Access Equipment Used?"},{label:"LSS Activated?"},
    {label:"WAN Activated?"},{label:"Step Back"},{label:"Step Back Photo?"}
];

const makeSupplier=(name="")=>({
    id:Date.now()+Math.random(),name,
    siteChecks:DEFAULT_CHECKS.map((c,i)=>({id:Date.now()+i+Math.random(),label:c.label,value:""})),
    operatives:[{id:Date.now()+100+Math.random(),role:"Supervisor",name:""},{id:Date.now()+101+Math.random(),role:"Operative",name:""}],
    areaOfWorks:"",activityDescription:""
});

const defaultReport={
    woNumber:"",imName:"",date:new Date().toISOString().split("T")[0],location:"",author:"",
    suppliers:[makeSupplier("Computacenter")],
    hsIssues:"",
    issuesResolution:[]
};

// ─── Print ───
function PrintReport({data,logoSrc,images}){
    const c={border:"1px solid #c0c0c0",padding:"6px 10px",fontSize:"10px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    const lh={...c,fontWeight:700,backgroundColor:"#e8eef4",color:"#1a3a5c",width:"22%"};
    const sh={...c,fontWeight:700,backgroundColor:"#2e5984",color:"#fff",fontSize:"11px"};

    // const supplierNames=data.suppliers.map(s=>s.name).filter(Boolean);
    const photosBySupplier={};images.forEach(img=>{const g=img.group||"General";if(!photosBySupplier[g])photosBySupplier[g]=[];photosBySupplier[g].push(img);});

    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"10px",lineHeight:1.5}}>
            {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                <tr><td style={{...h,fontSize:"13px",textAlign:"center"}} colSpan={4}>Minor Works Report</td></tr>
                <tr><td style={lh}>WO Number</td><td style={{...c,fontWeight:700,fontSize:"12px"}}>{data.woNumber}</td><td style={lh}>IM</td><td style={c}>{data.imName}</td></tr>
                <tr><td style={lh}>Date</td><td style={c}>{data.date}</td><td style={lh}>Author</td><td style={c}>{data.author}</td></tr>
                <tr><td style={lh}>Location</td><td style={c} colSpan={3}>{data.location}</td></tr>
                </tbody>
            </table>

            {/* Per-supplier sections */}
            {data.suppliers.map((sup,si)=>{
                const photos=photosBySupplier[sup.name]||[];
                const photoPages=[];for(let i=0;i<photos.length;i+=4)photoPages.push(photos.slice(i,i+4));
                return (
                    <div key={si} style={{marginBottom:16}}>
                        <div style={{fontSize:"12px",fontWeight:700,color:"#fff",backgroundColor:"#1a3a5c",padding:"6px 10px",borderRadius:"4px 4px 0 0"}}>{sup.name||`Supplier ${si+1}`}</div>

                        {/* Operatives */}
                        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                            <thead><tr><th style={sh}>Role</th><th style={sh}>Name</th></tr></thead>
                            <tbody>{sup.operatives.filter(o=>o.name).map((o,i)=>(<tr key={i}><td style={{...c,width:"25%",fontWeight:600}}>{o.role}</td><td style={c}>{o.name}</td></tr>))}</tbody>
                        </table>

                        {/* Site Checks */}
                        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                            <tbody>{(()=>{const checks=sup.siteChecks.filter(x=>x.label);const rows=[];for(let i=0;i<checks.length;i+=2){const a=checks[i],b=checks[i+1];rows.push(<tr key={i}><td style={lh}>{a.label}</td><td style={{...c,fontWeight:600,color:a.value==="Yes"?"#059669":a.value==="No"?"#dc2626":"#6b7280"}}>{a.value||"—"}</td>{b?<><td style={lh}>{b.label}</td><td style={{...c,fontWeight:600,color:b.value==="Yes"?"#059669":b.value==="No"?"#dc2626":"#6b7280"}}>{b.value||"—"}</td></>:<><td style={lh}/><td style={c}/></>}</tr>);}return rows;})()}</tbody>
                        </table>

                        {/* Area + Activity */}
                        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                            <thead><tr><th style={sh}>Area of Works</th><th style={sh}>Activity Description</th></tr></thead>
                            <tbody><tr><td style={{...c,whiteSpace:"pre-wrap",width:"35%"}}>{sup.areaOfWorks||"—"}</td><td style={{...c,whiteSpace:"pre-wrap"}}>{sup.activityDescription||"—"}</td></tr></tbody>
                        </table>

                        {/* Supplier photos */}
                        {photoPages.map((page,pi)=>(
                            <div key={pi} style={{...(pi>0?{pageBreakBefore:"always",paddingTop:12}:{}),marginBottom:8}}>
                                {pi>0&&logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                    {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}><div style={{aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"3px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}

            {/* Shared: H&S + Issues */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <thead><tr><th style={h}>Health & Safety Issues / Concerns</th></tr></thead>
                <tbody><tr><td style={{...c,whiteSpace:"pre-wrap"}}>{data.hsIssues||"N/A"}</td></tr></tbody>
            </table>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <thead><tr><th style={h}>Issues</th><th style={h}>Resolution</th></tr></thead>
                <tbody>{data.issuesResolution.filter(x=>x.issue).length===0?<tr><td style={c}>N/A</td><td style={c}>N/A</td></tr>:data.issuesResolution.map((ir,i)=>(<tr key={i}><td style={{...c,whiteSpace:"pre-wrap",width:"50%"}}>{ir.issue}</td><td style={{...c,whiteSpace:"pre-wrap"}}>{ir.resolution}</td></tr>))}</tbody>
            </table>

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",paddingTop:8,borderTop:"1px solid #ccc"}}>AtkinsRéalis - Baseline / Référence</div>

            {/* General photos */}
            {(photosBySupplier["General"]||[]).length>0&&(()=>{const gen=photosBySupplier["General"];const pages=[];for(let i=0;i<gen.length;i+=4)pages.push(gen.slice(i,i+4));return pages.map((page,pi)=>(
                <div key={`g${pi}`} style={{pageBreakBefore:"always",paddingTop:12}}>
                    {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                    <div style={{fontSize:"12px",fontWeight:700,color:"#1a3a5c",marginBottom:8,borderBottom:"2px solid #1a3a5c",paddingBottom:4}}>Photos — General</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:"calc(297mm - 80mm)"}}>
                        {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"}}><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"4px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                    </div>
                </div>
            ));})()}
        </div>
    );
}

// ─── Main ───
export default function MinorWorksReport({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form");
    const [data,setData]=useState(defaultReport);
    const [images,setImages]=useState([]);
    const [showWarnings,setShowWarnings]=useState(false);
    const [activeSupplier,setActiveSupplier]=useState(0);
    const printRef=useRef();

    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const addSupplier=()=>setData(p=>({...p,suppliers:[...p.suppliers,makeSupplier()]}));
    const removeSupplier=id=>setData(p=>({...p,suppliers:p.suppliers.filter(s=>s.id!==id)}));
    const updSup=(id,k,v)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===id?{...s,[k]:v}:s)}));
    const updSupCheck=(supId,checkId,v)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,siteChecks:s.siteChecks.map(c=>c.id===checkId?{...c,value:v}:c)}:s)}));
    const updSupCheckLabel=(supId,checkId,label)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,siteChecks:s.siteChecks.map(c=>c.id===checkId?{...c,label}:c)}:s)}));
    const addSupCheck=(supId)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,siteChecks:[...s.siteChecks,{id:Date.now()+Math.random(),label:"",value:""}]}:s)}));
    const removeSupCheck=(supId,checkId)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,siteChecks:s.siteChecks.filter(c=>c.id!==checkId)}:s)}));
    const updSupOp=(supId,opId,k,v)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,operatives:s.operatives.map(o=>o.id===opId?{...o,[k]:v}:o)}:s)}));
    const addSupOp=(supId)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,operatives:[...s.operatives,{id:Date.now()+Math.random(),role:"Operative",name:""}]}:s)}));
    const removeSupOp=(supId,opId)=>setData(p=>({...p,suppliers:p.suppliers.map(s=>s.id===supId?{...s,operatives:s.operatives.filter(o=>o.id!==opId)}:s)}));
    const addIssue=()=>setData(p=>({...p,issuesResolution:[...p.issuesResolution,{id:Date.now(),issue:"",resolution:""}]}));
    const removeIssue=id=>setData(p=>({...p,issuesResolution:p.issuesResolution.filter(x=>x.id!==id)}));
    const updIssue=(id,k,v)=>setData(p=>({...p,issuesResolution:p.issuesResolution.map(x=>x.id===id?{...x,[k]:v}:x)}));

    const handleImageUpload=e=>{Array.from(e.target.files).forEach(file=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{const MAX=1200;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}}const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,0,0,w,h);const compressed=canvas.toDataURL("image/jpeg",0.7);URL.revokeObjectURL(url);setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:compressed,caption:"",fileName:file.name,group:""}]);};img.onerror=()=>{URL.revokeObjectURL(url);const reader=new FileReader();reader.onload=ev=>setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:ev.target.result,caption:"",fileName:file.name,group:""}]);reader.readAsDataURL(file);};img.src=url;});e.target.value="";};
    const removeImage=id=>setImages(p=>p.filter(x=>x.id!==id));
    const updateImageCaption=(id,v)=>setImages(p=>p.map(x=>x.id===id?{...x,caption:v}:x));
    const updateImageGroup=(id,v)=>setImages(p=>p.map(x=>x.id===id?{...x,group:v}:x));
    const moveImage=(idx,dir)=>setImages(p=>{const a=[...p];const n=idx+dir;if(n<0||n>=a.length)return a;[a[idx],a[n]]=[a[n],a[idx]];return a;});

    const supplierNames=data.suppliers.map(s=>s.name).filter(Boolean);

    const getWarnings=()=>{
        const w=[];
        if(!data.woNumber) w.push({type:"warn",msg:"WO Number is empty."});
        if(!data.author) w.push({type:"info",msg:"Author is empty."});
        if(!data.location) w.push({type:"info",msg:"Location is empty."});
        data.suppliers.forEach((s,i)=>{
            if(!s.name) w.push({type:"warn",msg:`Supplier #${i+1} has no name.`});
            if(s.operatives.filter(o=>o.name).length===0) w.push({type:"warn",msg:`${s.name||`Supplier #${i+1}`}: no operatives listed.`});
            s.siteChecks.filter(c=>c.label&&!c.value).forEach(c=>w.push({type:"info",msg:`${s.name||`Supplier #${i+1}`}: "${c.label}" not answered.`}));
            if(!s.activityDescription) w.push({type:"info",msg:`${s.name||`Supplier #${i+1}`}: no activity description.`});
        });
        if(images.length===0) w.push({type:"info",msg:"No photos uploaded."});
        return w;
    };
    const tryPreview=()=>{setShowWarnings(true);};

    const handlePrint=()=>{const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>Minor Works - ${data.woNumber||"Report"}</title><style>@media print{body{margin:0}@page{size:A4;margin:8mm}thead{display:table-header-group}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${printRef.current.innerHTML}</body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify({...data,images},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`MinorWorks_${data.woNumber||"draft"}_${data.date}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoad=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.images){setImages(d.images);delete d.images;}setData(d);}catch{alert("Invalid JSON");}};reader.readAsText(file);};input.click();};

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const lbl={fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"};

    if(view==="preview") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
            </div>
            <div ref={printRef} style={{margin:"20px auto",maxWidth:900,backgroundColor:"#fff",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderRadius:4,overflow:"hidden"}}>
                <PrintReport data={data} logoSrc={logoSrc} images={images} />
            </div>
        </div>
    );

    const curSup=data.suppliers[activeSupplier]||data.suppliers[0];

    return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg,fontFamily:"'Inter','Segoe UI',-apple-system,sans-serif",color:t.text}}>
            <div style={{background:t.topBar,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {onBack&&<button onClick={onBack} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>← Menu</button>}
                    <div><div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>Minor Works Report</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>Heathrow — AtkinsRéalis</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <button onClick={handleLoad} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={tryPreview} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Job Details */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Job Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(0,1fr) minmax(0,1fr)",gap:12}}>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>WO Number</label><input value={data.woNumber} onChange={e=>upd("woNumber",e.target.value)} style={inp} placeholder="WO06000828" /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>IM Name</label><HeaderSelect value={data.imName} onChange={v=>upd("imName",v)} options={["Tim Rye","Luke Kelly","Mihai Dranca", "Jake Clark"]} placeholder="IM" t={t} /></div>
                        <div style={{minWidth:0}}><label style={lbl}>Date</label><input type="date" value={data.date} onChange={e=>upd("date",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Location</label><HeaderSelect value={data.location} onChange={v=>upd("location",v)} options={LOCATION_LIST} placeholder="Location" t={t} /></div>
                        <div style={{minWidth:0,overflow:"hidden",gridColumn:mobile?"1":"1 / -1"}}><label style={lbl}>Author</label><HeaderSelect value={data.author} onChange={v=>upd("author",v)} options={AUTHOR_LIST} placeholder="Author" t={t} /></div>
                    </div>
                </div>

                {/* Supplier Tabs */}
                <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap",alignItems:"center"}}>
                    {data.suppliers.map((s,idx)=>(
                        <button key={s.id} onClick={()=>setActiveSupplier(idx)}
                                style={{padding:"8px 16px",borderRadius:"10px 10px 0 0",border:`1px solid ${t.border}`,borderBottom:activeSupplier===idx?"3px solid #3b82f6":`1px solid ${t.border}`,backgroundColor:activeSupplier===idx?t.bgCard:t.bgCardAlt,color:activeSupplier===idx?t.text:t.textMuted,cursor:"pointer",fontSize:13,fontWeight:activeSupplier===idx?700:400,fontFamily:"inherit"}}>{s.name||`Supplier ${idx+1}`}</button>
                    ))}
                    <button onClick={()=>{addSupplier();setActiveSupplier(data.suppliers.length);}} style={{padding:"8px 14px",borderRadius:"10px 10px 0 0",border:`1px dashed ${t.border}`,backgroundColor:"transparent",color:t.accent,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add Supplier</button>
                </div>

                {/* Active Supplier Panel */}
                {curSup&&<div style={{backgroundColor:t.bgCard,borderRadius:"0 12px 12px 12px",padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{flex:1,minWidth:0,overflow:"hidden"}}><label style={lbl}>Supplier Name</label><HeaderSelect value={curSup.name} onChange={v=>updSup(curSup.id,"name",v)} options={SUPPLIER_LIST} placeholder="Supplier" t={t} /></div>
                        {data.suppliers.length>1&&<button onClick={()=>{removeSupplier(curSup.id);setActiveSupplier(Math.max(0,activeSupplier-1));}} style={{padding:"8px 14px",borderRadius:8,border:"none",backgroundColor:t.accentRed,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",marginLeft:12,flexShrink:0}}>Remove Supplier</button>}
                    </div>

                    {/* Operatives */}
                    <div style={{marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <div style={{fontSize:13,fontWeight:700}}>Operatives on Site</div>
                            <button onClick={()=>addSupOp(curSup.id)} style={{padding:"5px 12px",borderRadius:6,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                        </div>
                        {curSup.operatives.map((op,idx)=>(
                            <div key={op.id} style={{display:"flex",gap:8,marginBottom:4,alignItems:"flex-end"}}>
                                <div style={{width:110,flexShrink:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Role</label>}<select value={op.role} onChange={e=>updSupOp(curSup.id,op.id,"role",e.target.value)} style={{...inp,appearance:"auto"}}><option>Supervisor</option><option>Operative</option><option>Engineer</option></select></div>
                                <div style={{flex:1,minWidth:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Name</label>}<input value={op.name} onChange={e=>updSupOp(curSup.id,op.id,"name",e.target.value)} style={inp} placeholder="Full name" /></div>
                                {curSup.operatives.length>1&&<button onClick={()=>removeSupOp(curSup.id,op.id)} style={{padding:"8px",border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:14}}>✕</button>}
                            </div>
                        ))}
                    </div>

                    {/* Site Checks */}
                    <div style={{marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <div style={{fontSize:13,fontWeight:700}}>Site Checks</div>
                            <button onClick={()=>addSupCheck(curSup.id)} style={{padding:"5px 12px",borderRadius:6,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:6}}>
                            {curSup.siteChecks.map(ck=>(
                                <div key={ck.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:6,border:`1px solid ${t.borderLight}`,backgroundColor:t.bgCardAlt,flexWrap:"wrap"}}>
                                    <input value={ck.label} onChange={e=>updSupCheckLabel(curSup.id,ck.id,e.target.value)} style={{flex:"1 1 80px",minWidth:0,padding:"4px 8px",borderRadius:6,border:`1px solid ${t.border}`,fontSize:11,fontWeight:600,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"}} placeholder="Check..." />
                                    <YNToggle value={ck.value} onChange={v=>updSupCheck(curSup.id,ck.id,v)} t={t} />
                                    <button onClick={()=>removeSupCheck(curSup.id,ck.id)} style={{padding:"2px 4px",border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:12}}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Area + Activity */}
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div><label style={lbl}>Area of Works</label><textarea value={curSup.areaOfWorks} onChange={e=>updSup(curSup.id,"areaOfWorks",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Level, area..." /></div>
                        <div><label style={lbl}>Activity Description</label><textarea value={curSup.activityDescription} onChange={e=>updSup(curSup.id,"activityDescription",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Describe works carried out..." /></div>
                    </div>
                </div>}

                {/* H&S */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Health & Safety Issues / Concerns</div>
                    <textarea value={data.hsIssues} onChange={e=>upd("hsIssues",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="N/A or describe..." />
                </div>

                {/* Issues */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Issues / Resolution</div>
                        <button onClick={addIssue} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                    </div>
                    {data.issuesResolution.length===0&&<div style={{textAlign:"center",padding:16,color:t.textDim,fontSize:13}}>No issues.</div>}
                    {data.issuesResolution.map((ir,idx)=>(
                        <div key={ir.id} style={{padding:12,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:8,backgroundColor:t.bgCardAlt}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:t.textMuted}}>#{idx+1}</span><button onClick={()=>removeIssue(ir.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕</button></div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:8}}>
                                <div><label style={{...lbl,fontSize:10}}>Issue</label><textarea value={ir.issue} onChange={e=>updIssue(ir.id,"issue",e.target.value)} rows={2} style={{...inp,resize:"vertical"}} /></div>
                                <div><label style={{...lbl,fontSize:10}}>Resolution</label><textarea value={ir.resolution} onChange={e=>updIssue(ir.id,"resolution",e.target.value)} rows={2} style={{...inp,resize:"vertical"}} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Photos */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Photos</div>
                        <label style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>+ Upload<input type="file" accept="image/*,.heic,.heif" multiple onChange={handleImageUpload} style={{display:"none"}} /></label>
                    </div>
                    {images.length===0&&<div style={{textAlign:"center",padding:16,color:t.textDim,fontSize:13}}>No photos.</div>}
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
                                    {supplierNames.map(n=><option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Validation */}
                {showWarnings&&(()=>{
                    const w=getWarnings();const warns=w.filter(x=>x.type==="warn");const infos=w.filter(x=>x.type==="info");const has=w.length>0;
                    return (
                        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                            <div onClick={()=>setShowWarnings(false)} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.6)"}} />
                            <div style={{position:"relative",maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",backgroundColor:t.bgCard,borderRadius:16,border:`2px solid ${has?(warns.length>0?"#dc2626":"#fbbf24"):"#10b981"}`,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",padding:24}}>
                                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                                    <span style={{fontSize:20}}>{has?(warns.length>0?"⚠️":"ℹ️"):"✅"}</span>
                                    <div><div style={{fontSize:15,fontWeight:700,color:t.text}}>{has?"Review before generating":"No issues found"}</div><div style={{fontSize:12,color:t.textMuted}}>{has?`${w.length} notice${w.length!==1?"s":""}`:"Ready."}</div></div>
                                </div>
                                {has&&<div style={{marginBottom:20}}>{warns.map((x,i)=><div key={`w${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#fff",backgroundColor:"#dc2626",borderRadius:6,fontWeight:600}}>⚠ {x.msg}</div>)}{infos.map((x,i)=><div key={`i${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#1e293b",backgroundColor:"#fbbf24",borderRadius:6}}>• {x.msg}</div>)}</div>}
                                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                                    <button onClick={()=>setShowWarnings(false)} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.text,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Go Back</button>
                                    <button onClick={()=>{setShowWarnings(false);setView("preview");}} style={{padding:"10px 20px",borderRadius:8,border:"none",backgroundColor:has?(warns.length>0?"#dc2626":"#f59e0b"):"#10b981",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{has?"Continue Anyway":"Continue"}</button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px"}}>
                    <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft</button>
                    <button onClick={tryPreview} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Preview & Print</button>
                </div>
            </div>
        </div>
    );
}