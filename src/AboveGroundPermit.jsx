import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"};}

function HeaderSelect({value,onChange,options,placeholder,t}){
    const [mode,setMode]=useState("select");
    const show=mode==="custom"||(value&&!options.includes(value));
    const w={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const f={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const b={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0};
    if(show) return (<div style={w}><input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...f,overflow:"hidden",textOverflow:"ellipsis"}} /><button onClick={()=>{setMode("select");onChange("");}} style={b}>▼</button></div>);
    return (<div style={w}><select value={value} onChange={e=>onChange(e.target.value)} style={{...f,appearance:"auto"}}><option value="">— Select —</option>{options.map((o,i)=><option key={i} value={o}>{o}</option>)}</select><button onClick={()=>setMode("custom")} style={b}>✎</button></div>);
}

function YNA({value,onChange,t}){
    return (<div style={{display:"flex",gap:3}}>{["Yes","No","N/A"].map(opt=>(<button key={opt} onClick={()=>onChange(value===opt?"":opt)} style={{padding:"3px 8px",borderRadius:5,fontSize:10,cursor:"pointer",fontFamily:"inherit",border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,backgroundColor:value===opt?(opt==="Yes"?t.statusY:opt==="No"?t.statusN:"#6b7280"):t.bgInput,color:value===opt?"#fff":t.text}}>{opt}</button>))}</div>);
}

function SigPad({value,onChange,t}){
    const ref=useRef(null);const [drawing,setDrawing]=useState(false);const [mode,setMode]=useState(value?"preview":"idle");const last=useRef(null);
    const pos=e=>{const r=ref.current.getBoundingClientRect();const cx=e.touches?e.touches[0].clientX:e.clientX;const cy=e.touches?e.touches[0].clientY:e.clientY;return{x:(cx-r.left)*(ref.current.width/r.width),y:(cy-r.top)*(ref.current.height/r.height)};};
    const start=e=>{e.preventDefault();setDrawing(true);last.current=pos(e);};
    const draw=e=>{if(!drawing)return;e.preventDefault();const ctx=ref.current.getContext("2d");const p=pos(e);ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle="#1a1a1a";ctx.lineWidth=2;ctx.lineCap="round";ctx.stroke();last.current=p;};
    const end=()=>{setDrawing(false);last.current=null;};
    if(mode==="preview"&&value) return (<div style={{border:`1.5px solid ${t.border}`,borderRadius:8,padding:4,backgroundColor:t.bgInput,position:"relative",display:"inline-block"}}><img src={value} alt="Sig" style={{height:50,maxWidth:180,objectFit:"contain",display:"block"}} /><button onClick={()=>{onChange("");setMode("idle");}} style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:4,border:"none",backgroundColor:"rgba(220,38,38,0.85)",color:"#fff",cursor:"pointer",fontSize:9}}>✕</button></div>);
    if(mode==="draw") return (<div><div style={{border:`2px solid ${t.accent}`,borderRadius:8,overflow:"hidden",backgroundColor:"#fff",touchAction:"none"}}><canvas ref={ref} width={300} height={80} style={{width:"100%",height:80,display:"block",cursor:"crosshair"}} onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={draw} onTouchEnd={end} /></div><div style={{display:"flex",gap:6,marginTop:4}}><button onClick={()=>{if(ref.current){onChange(ref.current.toDataURL("image/png"));setMode("preview");}}} style={{padding:"4px 12px",borderRadius:6,border:"none",backgroundColor:t.accentGreen,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>Done</button><button onClick={()=>{if(ref.current)ref.current.getContext("2d").clearRect(0,0,300,80);}} style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.text,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Clear</button><button onClick={()=>setMode("idle")} style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Cancel</button></div></div>);
    return (<div style={{display:"flex",gap:6}}><button onClick={()=>setMode("draw")} style={{padding:"6px 14px",borderRadius:8,border:`1.5px dashed ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✍ Draw</button><label style={{padding:"6px 14px",borderRadius:8,border:`1.5px dashed ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>📷 Upload<input type="file" accept="image/*,.heic,.heif" onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{onChange(ev.target.result);setMode("preview");};r.readAsDataURL(f);e.target.value="";}} style={{display:"none"}} /></label></div>);
}

const CHECKLIST={
    part1:{title:"Part 1 — Drilling & cutting, depth up to 150 mm · work-area survey & identification of services",items:[
        {id:"P1_1",text:"Desk-top review of record drawings done and attached."},
        {id:"P1_2",text:"Visual survey by a competent person; sketch and photos produced and attached."},
        {id:"P1_3",text:"High-level checks above the ceiling for conduits/pipes made."},
        {id:"P1_4",text:"Competent person used a scanner (Bosch D-Tect 200 / Hilti PS50 / PS1000); written into RAMS."},
        {id:"P1_5",text:"Drawing of concealed services found attached to the method statement."},
        {id:"P1_6",text:"Services marked on the surface in coloured tape before the shift."}
    ]},
    part2:{title:"Part 2 — Light demolition · isolation of services (walls, ceilings, chasing floor screeds)",items:[
        {id:"P2_1",text:"Desk-top review of record drawings done and attached."},
        {id:"P2_2",text:"Visual survey by a competent person; sketch and photos attached."},
        {id:"P2_3",text:"Valid isolation certificate (correct date) provided to the DI site manager."},
        {id:"P2_4",text:"Final check scan (Bosch D-Tect 200 / Hilti PS50 / PS1000) completed."},
        {id:"P2_5",text:"Pre-demolition scan (Bosch D-Tect 150 SV / Hilti) completed."},
        {id:"P2_6",text:"Any additional services discovered investigated before demolition."}
    ]},
    part3:{title:"Part 3 — Floor demolition · removal of floor screeds & finishes to larger areas",items:[
        {id:"P3_1",text:"Desk-top review of record drawings done and attached."},
        {id:"P3_2",text:"Visual survey by a competent person; sketch and photos attached."},
        {id:"P3_3",text:"Valid isolation certificate (correct date) provided to the DI site manager."},
        {id:"P3_4",text:"Terminal engineering attended where a service could not be isolated."},
        {id:"P3_5",text:"Radar (Hilti PS1000) and EML scan completed before demolition."},
        {id:"P3_6",text:"Any additional services discovered investigated before demolition."}
    ]},
    part4:{title:"Part 4 — Briefing & management of the works",items:[
        {id:"P4_1",text:"Pre-start briefing given to operatives (services, residual risks, safe breaking-out techniques, emergency actions)."},
        {id:"P4_2",text:"Operatives will sign Section 6 to confirm the briefing."},
        {id:"P4_3",text:"A competent and inducted person will supervise the work at all times."}
    ]}
};

const MANAGER_LIST=["Peter Murphy","Fred Tebbenham","Mat Godwin","Marius Matei","Jacob McCalla"];
const COMPANY_LIST=["AtkinsRéalis","Computacenter","Sword Services","Maber Construction Ltd","Contour","STS","Mitie","Costain"];
const WORK_TYPES=["Drilling","Cutting","Light Demolition","Floor Demolition","Chasing","Cable Routing"];

let WEBHOOK_URL = "";
let SHAREPOINT_UPLOAD_URL = "";
try {
    WEBHOOK_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_PERMIT_WEBHOOK) || "";
    SHAREPOINT_UPLOAD_URL = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SHAREPOINT_UPLOAD_URL) || "";
} catch (e) { /* running outside Vite — env vars unavailable, fall back to empty */ }

const defaultPermit={
    permitNo:"",project:"",company:"",supervisor:"",permitDate:new Date().toISOString().split("T")[0],
    locationOfWorks:"",workType:"",description:"",
    checklist:Object.values(CHECKLIST).flatMap(p=>p.items.map(i=>({id:i.id,value:""}))),
    declaredBy:"",declaredDate:new Date().toISOString().split("T")[0],
    authorityName:"",authoritySig:"",authorityDate:"",authorityTime:"",
    clearanceName:"",clearanceSig:"",clearanceDate:"",clearanceTime:"",
    cancelName:"",cancelSig:"",cancelDate:"",cancelTime:"",
    comments:"",
    personnel:[{id:Date.now(),name:"",sig:"",date:"",time:""}],
    scannerPhoto:"",photo1:"",photo2:"",photo3:""
};

// ─── Print ───
function PrintPermit({data,logoSrc}){
    const c={border:"1px solid #999",padding:"5px 8px",fontSize:"9px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a5c5c",color:"#fff",fontWeight:700,fontSize:"10px"};
    const lh={...c,fontWeight:700,backgroundColor:"#e8eef4",color:"#1a3a5c",width:"22%"};
    const getCheck=id=>(data.checklist.find(x=>x.id===id)||{}).value||"";
    const ck=v=>v==="Yes"?"☒":v==="No"?"☒":"☐";
    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"9px",lineHeight:1.4}}>
            {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
            <div style={{fontSize:"14px",fontWeight:800,color:"#1a3a5c",textAlign:"center",marginBottom:4}}>Permit for Breaking Surfaces above Apron / Ground Floor Level</div>
            <div style={{fontSize:"8px",color:"#666",textAlign:"center",marginBottom:2}}>Not for use for works to Ground / Apron level slabs</div>
            <div style={{fontSize:"8px",color:"#666",textAlign:"center",marginBottom:12}}>Any work loading or penetrating the Ground or Apron level slab must be authorised using a different permit.</div>
            {data.permitNo&&<div style={{fontSize:"10px",fontWeight:700,textAlign:"center",marginBottom:10}}>Permit No: {data.permitNo}</div>}

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <thead><tr><th style={{...h,textAlign:"left"}} colSpan={4}>Section 1 — Application</th></tr></thead>
                <tbody>
                    <tr><td style={lh}>Project</td><td style={c}>{data.project}</td><td style={lh}>Company</td><td style={c}>{data.company}</td></tr>
                    <tr><td style={lh}>Supervisor</td><td style={c}>{data.supervisor}</td><td style={lh}>Date</td><td style={c}>{data.permitDate}</td></tr>
                    <tr><td style={lh}>Location</td><td style={c}>{data.locationOfWorks}</td><td style={lh}>Work Type</td><td style={c}>{data.workType}</td></tr>
                    <tr><td style={lh}>Description</td><td style={c} colSpan={3}>{data.description}</td></tr>
                </tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                <thead><tr><th style={{...h,textAlign:"left"}}>Pre-commencement Checklist</th><th style={{...h,width:60,textAlign:"center"}}>Result</th></tr></thead>
                <tbody>
                    {Object.entries(CHECKLIST).map(([key,part])=>(
                        <>{<tr key={`h-${key}`}><td style={{...c,fontWeight:700,backgroundColor:"#dfe6ee",fontSize:"9px"}} colSpan={2}>{part.title}</td></tr>}
                        {part.items.map(item=>{const v=getCheck(item.id);return(
                            <tr key={item.id}><td style={{...c,paddingLeft:16}}>{item.text}</td><td style={{...c,textAlign:"center",fontWeight:700,color:v==="Yes"?"#059669":v==="No"?"#dc2626":"#6b7280"}}>{v||"—"}</td></tr>
                        );})}</>
                    ))}
                </tbody>
            </table>

            <div style={{border:"1px solid #999",padding:"6px 10px",marginBottom:10,fontSize:"9px"}}><strong>Declaration:</strong> I hereby declare on behalf of my company that all of the above has been undertaken. Declared by <strong>{data.declaredBy||"___"}</strong> on <strong>{data.declaredDate||"___"}</strong></div>

            {[["Section 2 — Authority to Proceed","authority","(Principal Contractor / DI's Manager) — optional"],
              ["Section 3 — Clearance","clearance","(supervisor, returned to DI) — optional"],
              ["Section 4 — Cancellation","cancel","(Principal Contractor / DI) — optional"]].map(([title,prefix,sub])=>(
                <table key={prefix} style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                    <thead><tr><th style={{...h,textAlign:"left",fontSize:"9px"}} colSpan={4}>{title} <span style={{fontWeight:400,fontSize:"8px"}}>{sub}</span></th></tr></thead>
                    <tbody><tr><td style={{...lh,width:"20%"}}>Name</td><td style={c}>{data[prefix+"Name"]}</td><td style={{...lh,width:"12%"}}>Date</td><td style={c}>{data[prefix+"Date"]}</td></tr>
                    <tr><td style={lh}>Signature</td><td style={{...c,padding:2}}>{data[prefix+"Sig"]&&<img src={data[prefix+"Sig"]} alt="" style={{height:28,maxWidth:"90%",objectFit:"contain"}} />}</td><td style={lh}>Time</td><td style={c}>{data[prefix+"Time"]}</td></tr></tbody>
                </table>
            ))}

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                <thead><tr><th style={{...h,textAlign:"left"}} colSpan={4}>Section 5 — Comments</th></tr></thead>
                <tbody><tr><td style={{...c,whiteSpace:"pre-wrap",minHeight:30}}>{data.comments||"—"}</td></tr></tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                <thead><tr><th style={{...h,textAlign:"left"}} colSpan={4}>Section 6 — Six-point check list · personnel briefed & signed</th></tr>
                <tr><th style={{...c,fontWeight:700,backgroundColor:"#f0f4f8"}}>Name</th><th style={{...c,fontWeight:700,backgroundColor:"#f0f4f8"}}>Signature</th><th style={{...c,fontWeight:700,backgroundColor:"#f0f4f8",width:"15%"}}>Date</th><th style={{...c,fontWeight:700,backgroundColor:"#f0f4f8",width:"12%"}}>Time</th></tr></thead>
                <tbody>{data.personnel.filter(p=>p.name).map((p,i)=>(
                    <tr key={i}><td style={c}>{p.name}</td><td style={{...c,padding:2}}>{p.sig&&<img src={p.sig} alt="" style={{height:24,maxWidth:"90%",objectFit:"contain"}} />}</td><td style={c}>{p.date}</td><td style={c}>{p.time}</td></tr>
                ))}</tbody>
            </table>

            {(data.scannerPhoto||data.photo1||data.photo2||data.photo3)&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:8}}>
                <thead><tr><th style={{...h,textAlign:"left"}} colSpan={2}>Work-area Photos</th></tr></thead>
                <tbody><tr>{[["Scanner",data.scannerPhoto],["Photo 1",data.photo1]].map(([label,src])=>(<td key={label} style={{...c,width:"50%",textAlign:"center"}}>{src?<><img src={src} alt="" style={{maxWidth:"95%",maxHeight:200,objectFit:"contain"}} /><div style={{fontSize:"7px",color:"#666",marginTop:2}}>{label}</div></>:<span style={{color:"#999"}}>{label}: —</span>}</td>))}</tr>
                <tr>{[["Photo 2",data.photo2],["Photo 3",data.photo3]].map(([label,src])=>(<td key={label} style={{...c,width:"50%",textAlign:"center"}}>{src?<><img src={src} alt="" style={{maxWidth:"95%",maxHeight:200,objectFit:"contain"}} /><div style={{fontSize:"7px",color:"#666",marginTop:2}}>{label}</div></>:<span style={{color:"#999"}}>{label}: —</span>}</td>))}</tr></tbody>
            </table>}

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",paddingTop:6,borderTop:"1px solid #ccc"}}>AtkinsRéalis - Baseline / Référence</div>
        </div>
    );
}

// ─── Main ───
export default function AboveGroundPermit({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form");
    const [data,setData]=useState(defaultPermit);
    const [showWarnings,setShowWarnings]=useState(false);
    const [submitting,setSubmitting]=useState(false);
    const [submitResult,setSubmitResult]=useState(null);
    const printRef=useRef();

    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const updCheck=(id,v)=>setData(p=>({...p,checklist:p.checklist.map(c=>c.id===id?{...c,value:v}:c)}));
    const addPerson=()=>setData(p=>({...p,personnel:[...p.personnel,{id:Date.now(),name:"",sig:"",date:"",time:""}]}));
    const removePerson=id=>setData(p=>({...p,personnel:p.personnel.filter(x=>x.id!==id)}));
    const updPerson=(id,k,v)=>setData(p=>({...p,personnel:p.personnel.map(x=>x.id===id?{...x,[k]:v}:x)}));

    const handlePhoto=(key)=>(e)=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{const MAX=1200;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}}const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,0,0,w,h);upd(key,canvas.toDataURL("image/jpeg",0.7));URL.revokeObjectURL(url);};img.onerror=()=>{URL.revokeObjectURL(url);const r=new FileReader();r.onload=ev=>upd(key,ev.target.result);r.readAsDataURL(file);};img.src=url;e.target.value="";};

    const getWarnings=()=>{
        const w=[];
        if(!data.project) w.push({type:"warn",msg:"Project is empty."});
        if(!data.supervisor) w.push({type:"warn",msg:"Supervisor name is empty."});
        if(!data.company) w.push({type:"info",msg:"Company is empty."});
        if(!data.locationOfWorks) w.push({type:"info",msg:"Location is empty."});
        if(!data.description) w.push({type:"info",msg:"Description is empty."});
        const unanswered=data.checklist.filter(c=>!c.value);
        if(unanswered.length>0) w.push({type:"warn",msg:`${unanswered.length} checklist item(s) not answered.`});
        if(!data.declaredBy) w.push({type:"warn",msg:"Declaration: name is empty."});
        if(data.personnel.filter(p=>p.name).length===0) w.push({type:"info",msg:"No personnel signed in Section 6."});
        return w;
    };

    const handlePrint=()=>{const title=`Above Ground Permit - ${data.permitNo||data.project||"Permit"}`;const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>@page{size:A4;margin:0}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}*{overflow-wrap:break-word;word-break:break-word}thead{display:table-header-group}tfoot{display:table-footer-group}.pw{width:100%}.pw>thead td{height:8mm}.pw>tfoot td{height:8mm}.pc{padding:0 10mm}</style></head><body><table class="pw"><thead><tr><td></td></tr></thead><tfoot><tr><td style="padding:0 10mm"><div style="border-top:1px solid #b0b8c4"></div></td></tr></tfoot><tbody><tr><td class="pc">${printRef.current.innerHTML}</td></tr></tbody></table></body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`AboveGroundPermit_${data.permitNo||"draft"}_${data.permitDate}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoad=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{setData(JSON.parse(ev.target.result));}catch{alert("Invalid JSON");}};reader.readAsText(file);};input.click();};

    // ── Power Automate Submit ──
    const handleSubmit=async()=>{
        if(!WEBHOOK_URL){alert("VITE_PERMIT_WEBHOOK not configured in .env");return;}
        setSubmitting(true);setSubmitResult(null);
        try{
            const payload={...data};
            const photos={scannerPhoto:data.scannerPhoto,photo1:data.photo1,photo2:data.photo2,photo3:data.photo3};
            const listData={...payload,scannerPhoto:"[attached]",photo1:"[attached]",photo2:"[attached]",photo3:"[attached]"};
            const res=await fetch(WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({formData:listData,photos,personnel:data.personnel.filter(p=>p.name)})});
            if(res.ok){setSubmitResult({ok:true,msg:"Submitted to SharePoint successfully."});}
            else{setSubmitResult({ok:false,msg:`Error: ${res.status} ${res.statusText}`});}
        }catch(err){setSubmitResult({ok:false,msg:`Network error: ${err.message}`});}
        setSubmitting(false);
    };

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const lbl={fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"};

    if(view==="preview") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)",flexWrap:"wrap"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
                {WEBHOOK_URL&&<button onClick={handleSubmit} disabled={submitting} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",opacity:submitting?0.5:1}}>{submitting?"Submitting...":"Submit to SharePoint"}</button>}
                {SHAREPOINT_UPLOAD_URL&&<a href={SHAREPOINT_UPLOAD_URL} target="_blank" rel="noopener noreferrer" style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0d9488,#14b8a6)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",textDecoration:"none",display:"inline-flex",alignItems:"center"}}>Upload to SharePoint ↗</a>}
                {submitResult&&<span style={{fontSize:12,color:submitResult.ok?"#10b981":"#ef4444",fontWeight:600}}>{submitResult.msg}</span>}
            </div>
            <div ref={printRef} style={{margin:"20px auto",maxWidth:900,backgroundColor:"#fff",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderRadius:4,overflow:"hidden"}}>
                <PrintPermit data={data} logoSrc={logoSrc} />
            </div>
        </div>
    );

    return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg,fontFamily:"'Inter','Segoe UI',-apple-system,sans-serif",color:t.text}}>
            <div style={{background:t.topBar,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {onBack&&<button onClick={onBack} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>← Menu</button>}
                    <div><div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>Above Ground Permit</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>Breaking Surfaces — Above Apron / Ground Floor Level — AtkinsRéalis</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <button onClick={handleLoad} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={()=>setShowWarnings(true)} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Section 1 */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Section 1 — Application</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(0,1fr) minmax(0,1fr)",gap:12}}>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Permit No</label><input value={data.permitNo} onChange={e=>upd("permitNo",e.target.value)} style={inp} placeholder="Auto or manual" /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Project</label><HeaderSelect value={data.project} onChange={v=>upd("project",v)} options={["T2A Security Phase 6","T2 Baggage Programme","MAID Readers Replacement"]} placeholder="Project" t={t} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Company</label><HeaderSelect value={data.company} onChange={v=>upd("company",v)} options={COMPANY_LIST} placeholder="Company" t={t} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Supervisor</label><HeaderSelect value={data.supervisor} onChange={v=>upd("supervisor",v)} options={MANAGER_LIST} placeholder="Supervisor" t={t} /></div>
                        <div style={{minWidth:0}}><label style={lbl}>Date</label><input type="date" value={data.permitDate} onChange={e=>upd("permitDate",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Work Type</label><HeaderSelect value={data.workType} onChange={v=>upd("workType",v)} options={WORK_TYPES} placeholder="Work type" t={t} /></div>
                        <div style={{gridColumn:mobile?"1":"1 / -1",minWidth:0,overflow:"hidden"}}><label style={lbl}>Location of Works</label><input value={data.locationOfWorks} onChange={e=>upd("locationOfWorks",e.target.value)} style={inp} placeholder="Specific location" /></div>
                        <div style={{gridColumn:mobile?"1":"1 / -1",minWidth:0,overflow:"hidden"}}><label style={lbl}>Description of Proposed Works</label><textarea value={data.description} onChange={e=>upd("description",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} /></div>
                    </div>
                </div>

                {/* Checklist */}
                {Object.entries(CHECKLIST).map(([key,part])=>(
                    <div key={key} style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{part.title}</div>
                        {part.items.map((item,idx)=>{const val=(data.checklist.find(c=>c.id===item.id)||{}).value||"";return(
                            <div key={item.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:idx<part.items.length-1?`1px solid ${t.borderLight}`:"none"}}>
                                <span style={{fontSize:12,fontWeight:700,color:t.textMuted,minWidth:20,flexShrink:0,marginTop:2}}>{idx+1}.</span>
                                <span style={{fontSize:12,flex:1,minWidth:0}}>{item.text}</span>
                                <YNA value={val} onChange={v=>updCheck(item.id,v)} t={t} />
                            </div>
                        );})}
                    </div>
                ))}

                {/* Declaration */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Declaration</div>
                    <p style={{fontSize:12,color:t.textMuted,marginBottom:12}}>I hereby declare on behalf of my company that all of the above has been undertaken.</p>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div><label style={lbl}>Declared by</label><input value={data.declaredBy} onChange={e=>upd("declaredBy",e.target.value)} style={inp} /></div>
                        <div><label style={lbl}>Date</label><input type="date" value={data.declaredDate} onChange={e=>upd("declaredDate",e.target.value)} style={inp} /></div>
                    </div>
                </div>

                {/* Sections 2-4 */}
                {[["Section 2 — Authority to Proceed","authority","(Principal Contractor / DI's Manager) — optional"],
                  ["Section 3 — Clearance","clearance","(Supervisor, returned to DI) — optional"],
                  ["Section 4 — Cancellation","cancel","(Principal Contractor / DI) — optional"]].map(([title,prefix,sub])=>(
                    <div key={prefix} style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{title}</div>
                        <div style={{fontSize:11,color:t.textDim,marginBottom:12}}>{sub}</div>
                        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                            <div style={{minWidth:0,overflow:"hidden"}}><label style={{...lbl,fontSize:10}}>Name</label><HeaderSelect value={data[prefix+"Name"]} onChange={v=>upd(prefix+"Name",v)} options={MANAGER_LIST} placeholder="Name" t={t} /></div>
                            <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Date</label><input type="date" value={data[prefix+"Date"]} onChange={e=>upd(prefix+"Date",e.target.value)} style={inp} /></div>
                            <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Time</label><input type="time" value={data[prefix+"Time"]} onChange={e=>upd(prefix+"Time",e.target.value)} style={inp} /></div>
                        </div>
                        <label style={{...lbl,fontSize:10}}>Signature</label>
                        <SigPad value={data[prefix+"Sig"]} onChange={v=>upd(prefix+"Sig",v)} t={t} />
                    </div>
                ))}

                {/* Section 5 */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Section 5 — Comments</div>
                    <textarea value={data.comments} onChange={e=>upd("comments",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Comments, further action, or reason for rejection..." />
                </div>

                {/* Section 6 */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div><div style={{fontSize:14,fontWeight:700}}>Section 6 — Personnel Briefed & Signed</div><div style={{fontSize:11,color:t.textDim,marginTop:2}}>All personnel must read the six statements and sign after supervisor briefing.</div></div>
                        <button onClick={addPerson} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",flexShrink:0}}>+ Add</button>
                    </div>
                    {data.personnel.map((p,idx)=>(
                        <div key={p.id} style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,backgroundColor:t.bgCardAlt,marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:t.textMuted}}>Person #{idx+1}</span>{data.personnel.length>1&&<button onClick={()=>removePerson(p.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕</button>}</div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"2fr 1fr 1fr",gap:8,marginBottom:8}}>
                                <div><label style={{...lbl,fontSize:9}}>Name</label><input value={p.name} onChange={e=>updPerson(p.id,"name",e.target.value)} style={inp} /></div>
                                <div><label style={{...lbl,fontSize:9}}>Date</label><input type="date" value={p.date} onChange={e=>updPerson(p.id,"date",e.target.value)} style={inp} /></div>
                                <div><label style={{...lbl,fontSize:9}}>Time</label><input type="time" value={p.time} onChange={e=>updPerson(p.id,"time",e.target.value)} style={inp} /></div>
                            </div>
                            <label style={{...lbl,fontSize:9}}>Signature</label>
                            <SigPad value={p.sig} onChange={v=>updPerson(p.id,"sig",v)} t={t} />
                        </div>
                    ))}
                </div>

                {/* Photos */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Work-area Photos</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:10}}>
                        {[["scannerPhoto","Scanner Photo"],["photo1","Photo 1"],["photo2","Photo 2"],["photo3","Photo 3"]].map(([key,label])=>(
                            <div key={key} style={{border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden",backgroundColor:t.bgCardAlt}}>
                                <div style={{aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:t.bg,overflow:"hidden",position:"relative"}}>
                                    {data[key]?<><img src={data[key]} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /><button onClick={()=>upd(key,"")} style={{position:"absolute",top:3,right:3,width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(220,38,38,0.85)",color:"#fff",cursor:"pointer",fontSize:9}}>✕</button></>:<label style={{cursor:"pointer",textAlign:"center",padding:12,color:t.textDim,fontSize:11}}>📷 Tap to upload<input type="file" accept="image/*,.heic,.heif" onChange={handlePhoto(key)} style={{display:"none"}} /></label>}
                                </div>
                                <div style={{padding:"4px 8px",fontSize:10,color:t.textMuted,textAlign:"center",borderTop:`1px solid ${t.border}`}}>{label}</div>
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
                                    <div><div style={{fontSize:15,fontWeight:700,color:t.text}}>{has?"Review before generating":"Ready"}</div><div style={{fontSize:12,color:t.textMuted}}>{has?`${w.length} notice${w.length!==1?"s":""}`:"All good."}</div></div>
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

                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px",flexWrap:"wrap"}}>
                    <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft</button>
                    <button onClick={()=>setShowWarnings(true)} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Preview & Print</button>
                    {SHAREPOINT_UPLOAD_URL&&<a href={SHAREPOINT_UPLOAD_URL} target="_blank" rel="noopener noreferrer" style={{padding:"12px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#0d9488,#14b8a6)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)",textDecoration:"none",display:"inline-flex",alignItems:"center"}}>Upload to SharePoint ↗</a>}
                </div>
            </div>
        </div>
    );
}
