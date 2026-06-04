import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",bgHover:"#334155",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",bgHover:"#f8fafc",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626"};}

function HeaderSelect({value,onChange,options,placeholder,t,multiline}){
    const [mode,setMode]=useState("select");
    const show=mode==="custom"||(value&&!options.includes(value));
    const w={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const f={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const b={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0,alignSelf:multiline?"flex-start":"auto"};
    if(show) return (<div style={w}>{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2} style={{...f,resize:"vertical",minHeight:38}} />:<input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...f,overflow:"hidden",textOverflow:"ellipsis"}} />}<button onClick={()=>{setMode("select");onChange("");}} style={b}>▼</button></div>);
    return (<div style={w}><select value={value} onChange={e=>onChange(e.target.value)} style={{...f,appearance:"auto"}}><option value="">— Select —</option>{options.map((o,i)=><option key={i} value={o}>{o}</option>)}</select><button onClick={()=>setMode("custom")} style={b}>✎</button></div>);
}
function YNToggle({value,onChange,t}){
    return (<div style={{display:"flex",gap:4}}>{["Yes","No"].map(opt=>(<button key={opt} onClick={()=>onChange(value===opt?"":opt)} style={{padding:"4px 12px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,backgroundColor:value===opt?(opt==="Yes"?t.statusY:t.statusN):t.bgInput,color:value===opt?"#fff":t.text}}>{opt}</button>))}</div>);
}

const MANAGER_LIST=["Peter Murphy","Fred Tebbenham","Mat Godwin","Marius Matei","Jacob McCalla"];
const CHECKLIST_ITEMS=[
    "Is it light work? Can three points of physical contact be maintained at all times?",
    "Is the work of short duration 5-10 minutes?",
    "Are there existing permanent physical features that prevent the use of a MEWP/Scaffold Tower etc.?",
    "Have the person(s) carrying out the work received adequate information, instructions to allow them to carry out the work safely?",
    "Will the step ladder be positioned on a level and stable surface e.g. concrete?",
    "Will the ladder be prevented from slipping, footed, tied, non-slip mat?",
    "Has the right stepladder been selected for the works?",
    "Has the right class of stepladder been selected (Class 2: BS EN 131 minimum standard)?",
    "Does the work require use of percussive tools?"
];

const defaultPermit={
    projectName:"",projectNo:"",siteManager:"",date:new Date().toISOString().split("T")[0],
    location:"",description:"",
    timescaleDate:new Date().toISOString().split("T")[0],timeFrom:"",timeTo:"",
    ramsReceived:"",ramsChecked:"",ramsName:"",ramsPosition:"",ramsCompany:"",ramsDate:"",
    checklist:CHECKLIST_ITEMS.map((q,i)=>({id:i,question:q,value:""})),
    issuerName:"",issuerPosition:"Construction Manager",issuerTime:"",issuerDate:"",issuerSig:"",
    receiverName:"",receiverPosition:"Supervisor",receiverTime:"",receiverDate:"",receiverSig:"",
    cancelName:"",cancelPosition:"",cancelTime:"",cancelDate:"",cancelSig:""
};

// ─── Print ───
function PrintPermit({data,logoSrc}){
    const c={border:"1px solid #999",padding:"5px 8px",fontSize:"10px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    const lh={...c,fontWeight:700,backgroundColor:"#e8eef4",color:"#1a3a5c",width:"25%"};
    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"10px",lineHeight:1.5}}>
            {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
            <div style={{textAlign:"center",fontSize:"16px",fontWeight:800,color:"#1a3a5c",marginBottom:16}}>LADDER / STEP LADDER PERMIT</div>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                    <tr><td style={lh}>Project Name</td><td style={c}>{data.projectName}</td><td style={{...lh,width:"15%"}}>Project No</td><td style={c}>{data.projectNo}</td></tr>
                    <tr><td style={lh}>Site Manager</td><td style={c}>{data.siteManager}</td><td style={lh}>Date</td><td style={c}>{data.date}</td></tr>
                    <tr><td style={lh}>Location</td><td style={c} colSpan={3}>{data.location}</td></tr>
                    <tr><td style={lh}>Description of Works</td><td style={c} colSpan={3}>{data.description}</td></tr>
                </tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                    <tr><td style={{...h,fontSize:"11px"}} colSpan={4}>Time Scale for the Works — 12 hours maximum</td></tr>
                    <tr><td style={lh}>Date</td><td style={c}>{data.timescaleDate}</td><td style={{...lh,width:"12%"}}>From</td><td style={c}>{data.timeFrom}</td></tr>
                    <tr><td style={lh}></td><td style={c}></td><td style={lh}>To</td><td style={c}>{data.timeTo}</td></tr>
                </tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                    <tr><td style={{...h,fontSize:"11px"}} colSpan={4}>Risk Assessment and Method Statement</td></tr>
                    <tr><td style={lh}>Received</td><td style={{...c,fontWeight:600,color:data.ramsReceived==="Yes"?"#059669":"#dc2626"}}>{data.ramsReceived||"—"}</td><td style={lh}>Checked</td><td style={{...c,fontWeight:600,color:data.ramsChecked==="Yes"?"#059669":"#dc2626"}}>{data.ramsChecked||"—"}</td></tr>
                    <tr><td style={lh}>Name</td><td style={c}>{data.ramsName}</td><td style={lh}>Position</td><td style={c}>{data.ramsPosition}</td></tr>
                    <tr><td style={lh}>Company</td><td style={c}>{data.ramsCompany}</td><td style={lh}>Date</td><td style={c}>{data.ramsDate}</td></tr>
                </tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <thead><tr><th style={{...h,fontSize:"11px",textAlign:"left"}} colSpan={2}>Management Checklist</th><th style={{...h,width:35,textAlign:"center"}}>Yes</th><th style={{...h,width:35,textAlign:"center"}}>No</th></tr></thead>
                <tbody>{data.checklist.map((item,i)=>(
                    <tr key={i}><td style={{...c,width:20,textAlign:"center",fontWeight:600}}>{i+1}</td><td style={c}>{item.question}</td><td style={{...c,textAlign:"center"}}>{item.value==="Yes"?"☒":"☐"}</td><td style={{...c,textAlign:"center"}}>{item.value==="No"?"☒":"☐"}</td></tr>
                ))}</tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                    <tr><td style={{...h,fontSize:"11px"}} colSpan={6}>Authorisation</td></tr>
                    <tr><td style={lh}>Permit Issuer</td><td style={c}>{data.issuerName}</td><td style={{...lh,width:"10%"}}>Position</td><td style={c}>{data.issuerPosition}</td><td style={{...lh,width:"8%"}}>Time</td><td style={c}>{data.issuerTime}</td></tr>
                    <tr><td style={lh}>Signature</td><td style={{...c,padding:2}}>{data.issuerSig&&<img src={data.issuerSig} alt="" style={{height:30,maxWidth:"90%",objectFit:"contain"}} />}</td><td style={lh}>Date</td><td style={c} colSpan={3}>{data.issuerDate}</td></tr>
                    <tr><td style={lh}>Permit Receiver</td><td style={c}>{data.receiverName}</td><td style={lh}>Position</td><td style={c}>{data.receiverPosition}</td><td style={lh}>Time</td><td style={c}>{data.receiverTime}</td></tr>
                    <tr><td style={lh}>Signature</td><td style={{...c,padding:2}}>{data.receiverSig&&<img src={data.receiverSig} alt="" style={{height:30,maxWidth:"90%",objectFit:"contain"}} />}</td><td style={lh}>Date</td><td style={c} colSpan={3}>{data.receiverDate}</td></tr>
                </tbody>
            </table>

            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                    <tr><td style={{...h,fontSize:"11px"}} colSpan={6}>Permit Cancellation</td></tr>
                    <tr><td style={lh}>Name</td><td style={c}>{data.cancelName}</td><td style={{...lh,width:"10%"}}>Position</td><td style={c}>{data.cancelPosition}</td><td style={{...lh,width:"8%"}}>Time</td><td style={c}>{data.cancelTime}</td></tr>
                    <tr><td style={lh}>Signature</td><td style={{...c,padding:2}}>{data.cancelSig&&<img src={data.cancelSig} alt="" style={{height:30,maxWidth:"90%",objectFit:"contain"}} />}</td><td style={lh}>Date</td><td style={c} colSpan={3}>{data.cancelDate}</td></tr>
                </tbody>
            </table>

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",paddingTop:8,borderTop:"1px solid #ccc"}}>AtkinsRéalis - Baseline / Référence</div>
        </div>
    );
}

// ─── Signature Pad ───
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

// ─── Main ───
export default function LadderPermit({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form");
    const [data,setData]=useState(defaultPermit);
    const [showWarnings,setShowWarnings]=useState(false);
    const printRef=useRef();

    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const updCheck=(id,v)=>setData(p=>({...p,checklist:p.checklist.map(c=>c.id===id?{...c,value:v}:c)}));

    const getWarnings=()=>{
        const w=[];
        if(!data.projectName) w.push({type:"warn",msg:"Project Name is empty."});
        if(!data.location) w.push({type:"info",msg:"Location is empty."});
        if(!data.description) w.push({type:"info",msg:"Description of Works is empty."});
        if(!data.timeFrom||!data.timeTo) w.push({type:"info",msg:"Time from/to not set."});
        if(!data.ramsReceived) w.push({type:"warn",msg:"RAMS Received not selected."});
        if(!data.ramsChecked) w.push({type:"warn",msg:"RAMS Checked not selected."});
        data.checklist.filter(c=>!c.value).forEach(c=>w.push({type:"info",msg:`Checklist: "${c.question.slice(0,50)}..." not answered.`}));
        if(!data.issuerName) w.push({type:"info",msg:"Permit Issuer name empty."});
        if(!data.receiverName) w.push({type:"info",msg:"Permit Receiver name empty."});
        return w;
    };
    const tryPreview=()=>{setShowWarnings(true);};

    const handlePrint=()=>{const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>Ladder Permit - ${data.projectName||"Permit"}</title><style>@media print{body{margin:0}@page{size:A4;margin:8mm}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${printRef.current.innerHTML}</body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`LadderPermit_${data.date}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoad=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{setData(JSON.parse(ev.target.result));}catch{alert("Invalid JSON");}};reader.readAsText(file);};input.click();};

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const lbl={fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"};

    if(view==="preview") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
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
                    <div><div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>Ladder Permit</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>Step Ladder — AtkinsRéalis</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <button onClick={handleLoad} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={tryPreview} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Project Details */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Project Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(0,1fr) minmax(0,1fr)",gap:12}}>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Project Name</label><HeaderSelect value={data.projectName} onChange={v=>upd("projectName",v)} options={["T2A Security Phase 6 Works","T2 Baggage Programme","T4 Security Project","T5 Refurbishment"]} placeholder="Project" t={t} /></div>
                        <div style={{minWidth:0}}><label style={lbl}>Project No</label><input value={data.projectNo} onChange={e=>upd("projectNo",e.target.value)} style={inp} placeholder="SN0xxxxxx" /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={lbl}>Site Manager</label><HeaderSelect value={data.siteManager} onChange={v=>upd("siteManager",v)} options={MANAGER_LIST} placeholder="Site Manager" t={t} /></div>
                        <div style={{minWidth:0}}><label style={lbl}>Date</label><input type="date" value={data.date} onChange={e=>upd("date",e.target.value)} style={inp} /></div>
                        <div style={{gridColumn:mobile?"1":"1 / -1",minWidth:0,overflow:"hidden"}}><label style={lbl}>Specific Location</label><input value={data.location} onChange={e=>upd("location",e.target.value)} style={inp} placeholder="e.g. T2A Back of House, Level 2" /></div>
                        <div style={{gridColumn:mobile?"1":"1 / -1",minWidth:0,overflow:"hidden"}}><label style={lbl}>Description of Works</label><textarea value={data.description} onChange={e=>upd("description",e.target.value)} rows={2} style={{...inp,resize:"vertical"}} placeholder="Describe the works..." /></div>
                    </div>
                </div>

                {/* Timescale */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Time Scale — 12 hours maximum</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:12}}>
                        <div><label style={lbl}>Date</label><input type="date" value={data.timescaleDate} onChange={e=>upd("timescaleDate",e.target.value)} style={inp} /></div>
                        <div><label style={lbl}>Time From</label><input type="time" value={data.timeFrom} onChange={e=>upd("timeFrom",e.target.value)} style={inp} /></div>
                        <div><label style={lbl}>Time To</label><input type="time" value={data.timeTo} onChange={e=>upd("timeTo",e.target.value)} style={inp} /></div>
                    </div>
                </div>

                {/* RAMS */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Risk Assessment & Method Statement</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>Received?</span><YNToggle value={data.ramsReceived} onChange={v=>upd("ramsReceived",v)} t={t} /></div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>Checked?</span><YNToggle value={data.ramsChecked} onChange={v=>upd("ramsChecked",v)} t={t} /></div>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:t.textMuted,marginBottom:8}}>Received and checked by:</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={{...lbl,fontSize:10}}>Name</label><input value={data.ramsName} onChange={e=>upd("ramsName",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={{...lbl,fontSize:10}}>Position</label><input value={data.ramsPosition} onChange={e=>upd("ramsPosition",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0,overflow:"hidden"}}><label style={{...lbl,fontSize:10}}>Company</label><HeaderSelect value={data.ramsCompany} onChange={v=>upd("ramsCompany",v)} options={["AtkinsRéalis","Computacenter","Sword Services","Maber Construction Ltd"]} placeholder="Company" t={t} /></div>
                        <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Date</label><input type="date" value={data.ramsDate} onChange={e=>upd("ramsDate",e.target.value)} style={inp} /></div>
                    </div>
                </div>

                {/* Management Checklist */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Management Checklist</div>
                    {data.checklist.map((item,idx)=>(
                        <div key={item.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:idx<data.checklist.length-1?`1px solid ${t.borderLight}`:"none"}}>
                            <span style={{fontSize:12,fontWeight:700,color:t.textMuted,minWidth:24,flexShrink:0,marginTop:2}}>{idx+1}.</span>
                            <span style={{fontSize:13,flex:1,minWidth:0}}>{item.question}</span>
                            <YNToggle value={item.value} onChange={v=>updCheck(item.id,v)} t={t} />
                        </div>
                    ))}
                </div>

                {/* Authorisation */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Authorisation</div>
                    {[["Permit Issuer","issuer","Construction Manager"],["Permit Receiver","receiver","Supervisor"]].map(([title,prefix,defaultPos])=>(
                        <div key={prefix} style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,backgroundColor:t.bgCardAlt,marginBottom:10}}>
                            <div style={{fontSize:12,fontWeight:700,color:t.textMuted,marginBottom:10,textTransform:"uppercase"}}>{title}</div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                                <div style={{minWidth:0,overflow:"hidden"}}><label style={{...lbl,fontSize:10}}>Name</label><HeaderSelect value={data[prefix+"Name"]} onChange={v=>upd(prefix+"Name",v)} options={MANAGER_LIST} placeholder="Name" t={t} /></div>
                                <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Position</label><input value={data[prefix+"Position"]} onChange={e=>upd(prefix+"Position",e.target.value)} style={inp} placeholder={defaultPos} /></div>
                                <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Time</label><input type="time" value={data[prefix+"Time"]} onChange={e=>upd(prefix+"Time",e.target.value)} style={inp} /></div>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10}}>
                                <div><label style={{...lbl,fontSize:10}}>Date</label><input type="date" value={data[prefix+"Date"]} onChange={e=>upd(prefix+"Date",e.target.value)} style={inp} /></div>
                                <div><label style={{...lbl,fontSize:10}}>Signature</label><SigPad value={data[prefix+"Sig"]} onChange={v=>upd(prefix+"Sig",v)} t={t} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Permit Cancellation */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Permit Cancellation</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                        <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Name</label><input value={data.cancelName} onChange={e=>upd("cancelName",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Position</label><input value={data.cancelPosition} onChange={e=>upd("cancelPosition",e.target.value)} style={inp} /></div>
                        <div style={{minWidth:0}}><label style={{...lbl,fontSize:10}}>Time</label><input type="time" value={data.cancelTime} onChange={e=>upd("cancelTime",e.target.value)} style={inp} /></div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:10}}>
                        <div><label style={{...lbl,fontSize:10}}>Date</label><input type="date" value={data.cancelDate} onChange={e=>upd("cancelDate",e.target.value)} style={inp} /></div>
                        <div><label style={{...lbl,fontSize:10}}>Signature</label><SigPad value={data.cancelSig} onChange={v=>upd("cancelSig",v)} t={t} /></div>
                    </div>
                </div>

                {/* Validation Modal */}
                {showWarnings&&(()=>{
                    const w=getWarnings();const warns=w.filter(x=>x.type==="warn");const infos=w.filter(x=>x.type==="info");const has=w.length>0;
                    return (
                        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                            <div onClick={()=>setShowWarnings(false)} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.6)"}} />
                            <div style={{position:"relative",maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",backgroundColor:t.bgCard,borderRadius:16,border:`2px solid ${has?(warns.length>0?"#dc2626":"#fbbf24"):"#10b981"}`,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",padding:24}}>
                                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                                    <span style={{fontSize:20}}>{has?(warns.length>0?"⚠️":"ℹ️"):"✅"}</span>
                                    <div><div style={{fontSize:15,fontWeight:700,color:t.text}}>{has?"Review before generating":"No issues found"}</div><div style={{fontSize:12,color:t.textMuted}}>{has?`${w.length} notice${w.length!==1?"s":""}`:"Ready to generate."}</div></div>
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
